# Cyberpunk Runner - Touch Native
# Waveshare ESP32-S3-Touch-LCD-1.47 (172x320)
# AXS5106L Capacitive Touch via I2C @ 0x15
#
# Controls:
#   Tap LEFT half of screen  (< 86)  -> move left
#   Tap RIGHT half of screen (>= 86) -> move right
#   Tap anywhere (Game Over)         -> restart

import board
import displayio
import time
import random
import busio
import digitalio
import gc

# ============================================================================
# AXS5106L Minimal Touch Driver
# ============================================================================
AXS_ADDR = 0x15

class AXS5106L:
    def __init__(self, i2c_bus, rst_pin=None, mirror_x=True, swap_xy=False):
        self.i2c = i2c_bus
        self.rst = None
        self.mirror_x = mirror_x
        self.swap_xy = swap_xy

        if rst_pin is not None:
            self.rst = digitalio.DigitalInOut(rst_pin)
            self.rst.direction = digitalio.Direction.OUTPUT
            self._reset()

        self.last_tap_time = 0
        self.tap_debounce = 0.25

    def _reset(self):
        if self.rst:
            self.rst.value = False
            time.sleep(0.01)
            self.rst.value = True
            time.sleep(0.05)

    def read(self):
        """Return (x, y, is_tap) or (None, None, False)."""
        now = time.monotonic()
        try:
            buf = bytearray(6)
            self.i2c.writeto_then_readfrom(AXS_ADDR, bytes([0x01]), buf)
        except OSError:
            return None, None, False

        gesture = buf[0]
        points = buf[1] & 0x0F
        if points == 0:
            return None, None, False

        event = (buf[2] >> 6) & 0x03
        x = ((buf[2] & 0x0F) << 8) | buf[3]
        y = ((buf[4] & 0x0F) << 8) | buf[5]

        x = max(0, min(x, 171))
        y = max(0, min(y, 319))

        if self.mirror_x:
            x = 171 - x
        if self.swap_xy:
            x, y = y, x

        is_tap = (event == 0) or (gesture == 0x05)

        if is_tap and (now - self.last_tap_time > self.tap_debounce):
            self.last_tap_time = now
            return x, y, True

        return x, y, False


# ============================================================================
# Display Setup
# ============================================================================
display = board.DISPLAY
SCREEN_W, SCREEN_H = 172, 320
display.rotation = 0

root = displayio.Group()
display.root_group = root

# ============================================================================
# Touch Bus
# ============================================================================
i2c = busio.I2C(board.TP_SCL, board.TP_SDA, frequency=400000)
touch = AXS5106L(i2c, rst_pin=board.TP_RST, mirror_x=True, swap_xy=False)

# ============================================================================
# Color Palette
# ============================================================================
C_ASPHALT = 0x2a2a3a
C_WHITE   = 0xFFFFFF
C_CYAN    = 0x00FFFF
C_MAGENTA = 0xFF00FF
C_YELLOW  = 0xFFFF00
C_RED     = 0xFF1144
C_DGREY   = 0x1a1a2e
C_BLACK   = 0x000000

# ============================================================================
# Road (repeating 140x16 tile, infinite smooth scroll)
# ============================================================================
road_pal = displayio.Palette(4)
road_pal[0] = C_BLACK
road_pal[1] = C_ASPHALT
road_pal[2] = C_WHITE
road_pal[3] = C_CYAN

TILE_H = 16
ROAD_W = 140
road_tile = displayio.Bitmap(ROAD_W, TILE_H, 4)

for x in range(ROAD_W):
    for y in range(TILE_H):
        road_tile[x, y] = 1

for y in range(TILE_H):
    road_tile[2, y] = 2
    road_tile[3, y] = 2
    road_tile[136, y] = 2
    road_tile[137, y] = 2
for y in range(8):
    road_tile[47, y] = 2
    road_tile[48, y] = 2
    road_tile[93, y] = 2
    road_tile[94, y] = 2
for y in range(TILE_H):
    road_tile[0, y] = 3
    road_tile[139, y] = 3

road_grid = displayio.TileGrid(
    road_tile, pixel_shader=road_pal,
    width=1, height=20,
    tile_width=ROAD_W, tile_height=TILE_H
)
road_grid.x = 16
road_grp = displayio.Group()
road_grp.append(road_grid)
root.append(road_grp)

# ============================================================================
# Helper: draw filled rect into bitmap
# ============================================================================
def fill_rect(bmp, x0, y0, w, h, c):
    for xx in range(x0, x0 + w):
        for yy in range(y0, y0 + h):
            if 0 <= xx < bmp.width and 0 <= yy < bmp.height:
                bmp[xx, yy] = c

# ============================================================================
# Player: Cyberpunk Motorcycle (24x32)
# ============================================================================
bike_pal = displayio.Palette(5)
bike_pal[0] = 0x000000
bike_pal[1] = C_DGREY
bike_pal[2] = C_CYAN
bike_pal[3] = C_MAGENTA
bike_pal[4] = C_YELLOW
bike_pal.make_transparent(0)

bike_bmp = displayio.Bitmap(24, 32, 5)
fill_rect(bike_bmp, 10, 0, 4, 2, 4)
fill_rect(bike_bmp, 8, 2, 8, 4, 2)
fill_rect(bike_bmp, 9, 6, 6, 2, 1)
fill_rect(bike_bmp, 10, 8, 4, 16, 2)
fill_rect(bike_bmp, 11, 12, 2, 10, 3)
fill_rect(bike_bmp, 9, 24, 6, 4, 1)
fill_rect(bike_bmp, 8, 28, 2, 3, 3)
fill_rect(bike_bmp, 14, 28, 2, 3, 3)
fill_rect(bike_bmp, 8, 2, 1, 4, 3)
fill_rect(bike_bmp, 15, 2, 1, 4, 3)
bike_bmp[7, 3] = 3
bike_bmp[16, 3] = 3

bike = displayio.TileGrid(bike_bmp, pixel_shader=bike_pal)
bike.x = 74
bike.y = 280
root.append(bike)

# ============================================================================
# Collectible: Data Canister (16x16)
# ============================================================================
can_pal = displayio.Palette(4)
can_pal[0] = 0x000000
can_pal[1] = 0x556677
can_pal[2] = C_CYAN
can_pal[3] = C_YELLOW
can_pal.make_transparent(0)

can_bmp = displayio.Bitmap(16, 16, 4)
fill_rect(can_bmp, 2, 2, 12, 12, 1)
fill_rect(can_bmp, 4, 4, 8, 8, 2)
fill_rect(can_bmp, 6, 6, 4, 4, 3)
can_bmp[1, 0] = 2
can_bmp[14, 0] = 2
can_bmp[1, 15] = 2
can_bmp[14, 15] = 2

# ============================================================================
# Obstacle: Net Wraith (20x20)
# ============================================================================
wraith_pal = displayio.Palette(4)
wraith_pal[0] = 0x000000
wraith_pal[1] = 0x331122
wraith_pal[2] = C_RED
wraith_pal[3] = C_YELLOW
wraith_pal.make_transparent(0)

wraith_bmp = displayio.Bitmap(20, 20, 4)
fill_rect(wraith_bmp, 2, 2, 16, 16, 1)
fill_rect(wraith_bmp, 4, 4, 12, 4, 2)
fill_rect(wraith_bmp, 4, 10, 12, 2, 2)
fill_rect(wraith_bmp, 6, 6, 3, 3, 3)
fill_rect(wraith_bmp, 11, 6, 3, 3, 3)
fill_rect(wraith_bmp, 6, 14, 8, 2, 2)
wraith_bmp[9, 16] = 3

# ============================================================================
# Object Pool (reusable)
# ============================================================================
MAX_OBJ = 8
obj_sprites = []
obj_active = []
obj_lane = []
obj_y = []
obj_kind = []

for _ in range(MAX_OBJ):
    g = displayio.TileGrid(can_bmp, pixel_shader=can_pal)
    g.x = -50
    g.y = -50
    root.append(g)
    obj_sprites.append(g)
    obj_active.append(False)
    obj_lane.append(0)
    obj_y.append(-50)
    obj_kind.append('can')

# ============================================================================
# Score Display (3x5 digits, no external libs)
# Redraws only when the visible score string changes.
# ============================================================================
DIGITS = {
    '0':[0xE,0xA,0xA,0xA,0xE],'1':[0x4,0xC,0x4,0x4,0xE],'2':[0xE,0x2,0xE,0x8,0xE],
    '3':[0xE,0x2,0xE,0x2,0xE],'4':[0xA,0xA,0xE,0x2,0x2],'5':[0xE,0x8,0xE,0x2,0xE],
    '6':[0xE,0x8,0xE,0xA,0xE],'7':[0xE,0x2,0x4,0x4,0x4],'8':[0xE,0xA,0xE,0xA,0xE],
    '9':[0xE,0xA,0xE,0x2,0xE],'-':[0x2,0x2,0x2,0x2,0x2],' ':[0,0,0,0,0],
}
SCORE_W, SCORE_H = 80, 16
score_bmp = displayio.Bitmap(SCORE_W, SCORE_H, 2)
score_pal = displayio.Palette(2)
score_pal[0] = C_BLACK
score_pal[1] = C_CYAN
score_pal.make_transparent(0)
score_grid = displayio.TileGrid(score_bmp, pixel_shader=score_pal)
score_grid.x = 46
score_grid.y = 4
root.append(score_grid)

_last_score_str = None

def draw_score(val):
    """Only repaints the score bitmap when the rendered string actually changes."""
    global _last_score_str
    s = str(val)
    if s == _last_score_str:
        return
    _last_score_str = s

    for x in range(SCORE_W):
        for y in range(SCORE_H):
            score_bmp[x, y] = 0
    ox = SCORE_W - len(s) * 6
    for i, ch in enumerate(s):
        pat = DIGITS.get(ch, DIGITS[' '])
        for row, bits in enumerate(pat):
            for col in range(4):
                if bits & (1 << (3 - col)):
                    xx, yy = ox + i * 6 + col, row + 4
                    if 0 <= xx < SCORE_W and 0 <= yy < SCORE_H:
                        score_bmp[xx, yy] = 1

# ============================================================================
# HUD: Left / Right lane arrows (cyan)
# ============================================================================
arr_pal = displayio.Palette(2)
arr_pal[0] = C_BLACK
arr_pal[1] = C_CYAN
arr_pal.make_transparent(0)

la_bmp = displayio.Bitmap(24, 24, 2)
for i in range(10):
    for j in range(i + 1):
        la_bmp[16 - i + j, 12 - j] = 1
        la_bmp[16 - i + j, 12 + j] = 1
la = displayio.TileGrid(la_bmp, pixel_shader=arr_pal)
la.x, la.y = 4, 148
root.append(la)

ra_bmp = displayio.Bitmap(24, 24, 2)
for i in range(10):
    for j in range(i + 1):
        ra_bmp[7 + i - j, 12 - j] = 1
        ra_bmp[7 + i - j, 12 + j] = 1
ra = displayio.TileGrid(ra_bmp, pixel_shader=arr_pal)
ra.x, ra.y = 144, 148
root.append(ra)

# ============================================================================
# Game State
# ============================================================================
LANES = [40, 86, 133]
lane = 1
target_x = LANES[1] - 12
current_x = target_x
scroll = 0.0
speed = 2.0
score = 0
dist = 0
spawn_t = 0
game_over = False
best = 0
TARGET_FPS = 30
FRAME = 1.0 / TARGET_FPS
GC_INTERVAL = 33
frame_count = 0

def reset():
    global lane, target_x, current_x, scroll, speed, score, dist, spawn_t, game_over
    global _last_score_str
    lane = 1
    target_x = LANES[1] - 12
    current_x = target_x
    scroll = 0.0
    speed = 2.0
    score = 0
    dist = 0
    spawn_t = 0
    game_over = False
    _last_score_str = None
    for i in range(MAX_OBJ):
        obj_active[i] = False
        obj_sprites[i].x = -50
        obj_sprites[i].y = -50
    bike.y = 280
    la.hidden = False
    ra.hidden = False

def spawn():
    for i in range(MAX_OBJ):
        if not obj_active[i]:
            obj_active[i] = True
            obj_lane[i] = random.randint(0, 2)
            obj_y[i] = -32
            if random.random() < 0.7:
                obj_kind[i] = 'can'
                obj_sprites[i].bitmap = can_bmp
                obj_sprites[i].pixel_shader = can_pal
                obj_sprites[i].x = LANES[obj_lane[i]] - 8
            else:
                obj_kind[i] = 'wraith'
                obj_sprites[i].bitmap = wraith_bmp
                obj_sprites[i].pixel_shader = wraith_pal
                obj_sprites[i].x = LANES[obj_lane[i]] - 10
            return

def update_objects():
    global score, game_over, best, speed
    for i in range(MAX_OBJ):
        if not obj_active[i]:
            continue
        obj_y[i] += speed
        obj_sprites[i].y = int(obj_y[i])

        if 250 < obj_y[i] < 310 and obj_lane[i] == lane:
            if obj_kind[i] == 'can':
                score += 100
                speed = min(speed + 0.12, 8.0)
                obj_active[i] = False
                obj_sprites[i].x = -50
            else:
                game_over = True
                if score > best:
                    best = score

        if obj_y[i] > 340:
            obj_active[i] = False
            obj_sprites[i].x = -50

# ============================================================================
# Main Loop
# ============================================================================
reset()
last_time = time.monotonic()

while True:
    t0 = time.monotonic()
    frame_count += 1

    tx, ty, tapped = touch.read()

    if not game_over:
        if tapped:
            if tx < (SCREEN_W // 2):
                if lane > 0:
                    lane -= 1
                    target_x = LANES[lane] - 12
                    la.hidden = True
                    ra.hidden = False
            else:
                if lane < 2:
                    lane += 1
                    target_x = LANES[lane] - 12
                    ra.hidden = True
                    la.hidden = False

        dx = target_x - current_x
        current_x += dx * 0.3
        bike.x = int(current_x)

        scroll = (scroll + speed) % TILE_H
        road_grid.y = int(-scroll)

        spawn_t += 1
        rate = max(12, 55 - int(speed * 4))
        if spawn_t >= rate:
            spawn_t = 0
            spawn()

        update_objects()
        dist += speed
        score += int(speed)
        draw_score(score)

        if time.monotonic() - touch.last_tap_time > 1.2:
            la.hidden = False
            ra.hidden = False

    else:
        bike.y = 280 + (int(time.monotonic() * 3) % 2)
        draw_score(score)
        if tapped:
            reset()

    if frame_count % GC_INTERVAL == 0:
        gc.collect()

    elapsed = time.monotonic() - t0
    if FRAME - elapsed > 0:
        time.sleep(FRAME - elapsed)
