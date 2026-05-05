# Vertical-scrolling motorcycle game for Waveshare ESP32-S3-Touch-LCD-1.47
# Display: ST7789, 172x320 portrait, offset (34, 0). Touch: CST816S on I2C.
#
# Expected files on CIRCUITPY:
#   /sprites/road.bmp     172x320, indexed (the lane texture)
#   /sprites/bike0.bmp    bike frame A
#   /sprites/bike1.bmp    bike frame B
#   /sprites/crate0.bmp   obstacle frame A
#   /sprites/crate1.bmp   obstacle frame B
#   /sprites/turtle0.bmp  pickup/enemy frame A
#   /sprites/turtle1.bmp  pickup/enemy frame B
# Each BMP should have its background color at palette index 0 so we can
# mark it transparent with palette.make_transparent(0).

import gc
import time
import random

import board
import busio
import digitalio
import displayio
import fourwire
import terminalio
from adafruit_display_text import label
from adafruit_st7789 import ST7789
import adafruit_imageload

# ---------------------------------------------------------------------------
# Display init
# ---------------------------------------------------------------------------
WIDTH, HEIGHT = 172, 320

displayio.release_displays()

spi = busio.SPI(clock=board.LCD_CLK, MOSI=board.LCD_MOSI)
bus = fourwire.FourWire(
    spi,
    command=board.LCD_DC,
    chip_select=board.LCD_CS,
    reset=board.LCD_RST,
    baudrate=40_000_000,
)
display = ST7789(
    bus,
    width=WIDTH,
    height=HEIGHT,
    rowstart=0,
    colstart=34,          # 1.47" panel is offset inside the 240x320 controller RAM
    rotation=0,
    backlight_pin=board.LCD_BL,
    auto_refresh=False,
)

# ---------------------------------------------------------------------------
# Touch (CST816S) — left half steers left, right half steers right.
# Falls back to no-touch if the controller is missing.
# ---------------------------------------------------------------------------
touch = None
try:
    from adafruit_cst8xx import CST816S
    i2c = busio.I2C(board.TP_SCL, board.TP_SDA)
    rst = digitalio.DigitalInOut(board.TP_RST)
    rst.switch_to_output(value=True)
    touch = CST816S(i2c, reset=rst)
except Exception as e:
    print("Touch unavailable:", e)

# ---------------------------------------------------------------------------
# Asset loading helpers
# ---------------------------------------------------------------------------
def load_sprite(path, transparent_index=0):
    bmp, pal = adafruit_imageload.load(
        path, bitmap=displayio.Bitmap, palette=displayio.Palette
    )
    pal.make_transparent(transparent_index)
    return bmp, pal

def make_tile(bmp, pal, x=0, y=0):
    tg = displayio.TileGrid(bmp, pixel_shader=pal, x=x, y=y)
    return tg

bike_bmps  = [load_sprite("/sprites/bike0.bmp"),  load_sprite("/sprites/bike1.bmp")]
crate_bmps = [load_sprite("/sprites/crate0.bmp"), load_sprite("/sprites/crate1.bmp")]
turtle_bmps= [load_sprite("/sprites/turtle0.bmp"),load_sprite("/sprites/turtle1.bmp")]
road_bmp, road_pal = adafruit_imageload.load(
    "/sprites/road.bmp", bitmap=displayio.Bitmap, palette=displayio.Palette
)

BIKE_W, BIKE_H = bike_bmps[0][0].width, bike_bmps[0][0].height

# ---------------------------------------------------------------------------
# Scene graph
# ---------------------------------------------------------------------------
root = displayio.Group()
display.root_group = root

# Two stacked road tiles for seamless vertical scroll
road_a = make_tile(road_bmp, road_pal, 0, 0)
road_b = make_tile(road_bmp, road_pal, 0, -HEIGHT)
root.append(road_a)
root.append(road_b)

# Obstacle layer — recycled pool, no allocations during play
MAX_OBSTACLES = 4
obstacle_layer = displayio.Group()
root.append(obstacle_layer)

class Obstacle:
    __slots__ = ("tg", "kind", "active", "speed")
    def __init__(self):
        self.tg = displayio.TileGrid(
            crate_bmps[0][0], pixel_shader=crate_bmps[0][1], x=-100, y=-100
        )
        self.kind = "crate"
        self.active = False
        self.speed = 0
        obstacle_layer.append(self.tg)

    def spawn(self):
        self.kind = random.choice(("crate", "turtle"))
        bmp, pal = (crate_bmps if self.kind == "crate" else turtle_bmps)[0]
        self.tg.bitmap = bmp
        self.tg.pixel_shader = pal
        self.tg.x = random.randint(8, WIDTH - bmp.width - 8)
        self.tg.y = -bmp.height
        self.speed = random.randint(3, 6)
        self.active = True

    def step(self, frame):
        if not self.active:
            return
        self.tg.y += self.speed
        # Two-frame animation
        bmps = crate_bmps if self.kind == "crate" else turtle_bmps
        bmp, pal = bmps[(frame // 6) & 1]
        if self.tg.bitmap is not bmp:
            self.tg.bitmap = bmp
            self.tg.pixel_shader = pal
        if self.tg.y > HEIGHT:
            self.active = False
            self.tg.x = -100
            self.tg.y = -100

obstacles = [Obstacle() for _ in range(MAX_OBSTACLES)]

# Player
player = displayio.TileGrid(
    bike_bmps[0][0], pixel_shader=bike_bmps[0][1],
    x=(WIDTH - BIKE_W) // 2, y=HEIGHT - BIKE_H - 8,
)
root.append(player)

# HUD
hud = label.Label(terminalio.FONT, text="0", color=0xFFFFFF, x=4, y=8)
root.append(hud)

# ---------------------------------------------------------------------------
# Main loop
# ---------------------------------------------------------------------------
def aabb(a_tg, a_w, a_h, b_tg, b_w, b_h, pad=4):
    return (
        a_tg.x + pad < b_tg.x + b_w - pad
        and a_tg.x + a_w - pad > b_tg.x + pad
        and a_tg.y + pad < b_tg.y + b_h - pad
        and a_tg.y + a_h - pad > b_tg.y + pad
    )

def read_steer():
    # Returns -1, 0, or +1
    if touch is None:
        return 0
    pts = touch.touches
    if not pts:
        return 0
    x = pts[0]["x"]
    if x < WIDTH // 3:
        return -1
    if x > 2 * WIDTH // 3:
        return 1
    return 0

scroll = 0
frame = 0
score = 0
spawn_cooldown = 0
PLAYER_SPEED = 4
SCROLL_SPEED = 5

gc.collect()

while True:
    frame += 1

    # Scroll the two road tiles
    scroll = (scroll + SCROLL_SPEED) % HEIGHT
    road_a.y = scroll
    road_b.y = scroll - HEIGHT

    # Player movement
    steer = read_steer()
    if steer:
        nx = player.x + steer * PLAYER_SPEED
        if 0 <= nx <= WIDTH - BIKE_W:
            player.x = nx
    # Bike frame animation
    pb, pp = bike_bmps[(frame // 4) & 1]
    if player.bitmap is not pb:
        player.bitmap = pb
        player.pixel_shader = pp

    # Spawn obstacles
    if spawn_cooldown <= 0:
        for o in obstacles:
            if not o.active:
                o.spawn()
                spawn_cooldown = random.randint(18, 36)
                break
    else:
        spawn_cooldown -= 1

    # Update obstacles + collisions
    for o in obstacles:
        if not o.active:
            continue
        o.step(frame)
        if aabb(player, BIKE_W, BIKE_H, o.tg, o.tg.bitmap.width, o.tg.bitmap.height):
            # Crate = crash, turtle = bonus
            if o.kind == "crate":
                score = max(0, score - 50)
            else:
                score += 25
            o.active = False
            o.tg.x = -100
            o.tg.y = -100

    score += 1
    hud.text = str(score)

    display.refresh()
    # Soft cap ~30 fps; refresh() already paces us at the SPI bandwidth
    time.sleep(0.01)
