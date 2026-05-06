# boot.py — Waveshare ESP32-S3-Touch-LCD-1.47
#
# Runs once at power-on, before code.py. It:
#   1. Aliases the AXS5106L touch pins as board.TP_SDA / TP_SCL / TP_RST
#   2. Builds the ST7789 panel and stashes it as board.DISPLAY
# so code.py can use board.DISPLAY and board.TP_* without caring about GPIOs.
#
# Required library in /lib:
#   adafruit_st7789.mpy   (from the matching CircuitPython library bundle)
#
# !! VERIFY the GPIO numbers below against your Waveshare wiki / schematic.
#    These match the public 2024 revision of the ESP32-S3-Touch-LCD-1.47.
#    If your board labels differ, edit the constants — nothing else needs to
#    change.

import board
import busio
import displayio
import fourwire
from adafruit_st7789 import ST7789

# ---------------------------------------------------------------------------
# Pin map
# ---------------------------------------------------------------------------
# ST7789 SPI display
LCD_MOSI = board.IO39      # silkscreen LCD_DIN
LCD_CLK  = board.IO38
LCD_CS   = board.IO21
LCD_DC   = board.IO45
LCD_RST  = board.IO40
LCD_BL   = board.IO46

# AXS5106L capacitive touch (I2C @ 0x15)
TP_SDA = board.IO42
TP_SCL = board.IO41
TP_RST = board.IO47
# TP_INT = board.IO48  # optional, not used by code.py

# ---------------------------------------------------------------------------
# Expose touch pins on the board module so code.py can do `board.TP_SCL` etc.
# ---------------------------------------------------------------------------
board.TP_SDA = TP_SDA
board.TP_SCL = TP_SCL
board.TP_RST = TP_RST

# ---------------------------------------------------------------------------
# Build the display
# ---------------------------------------------------------------------------
displayio.release_displays()

spi = busio.SPI(clock=LCD_CLK, MOSI=LCD_MOSI)

bus = fourwire.FourWire(
    spi,
    command=LCD_DC,
    chip_select=LCD_CS,
    reset=LCD_RST,
    baudrate=40_000_000,
)

display = ST7789(
    bus,
    width=172,
    height=320,
    rowstart=0,
    colstart=34,        # 1.47" panel sits offset inside the controller's 240x320 RAM
    rotation=0,
    backlight_pin=LCD_BL,
)

# Make the display reachable as board.DISPLAY for code.py
board.DISPLAY = display
