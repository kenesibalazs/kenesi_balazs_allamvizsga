import time
import threading
from board import SCL, SDA
import busio
from PIL import Image, ImageDraw, ImageFont, Image
import adafruit_ssd1306

class OLEDAnimator:
    def __init__(self, width=64, height=64, frame_size=(48, 48), i2c_bus=None):
        self.width = width
        self.height = height
        self.frame_width, self.frame_height = frame_size

        self._stop_event = threading.Event()

        # I2C setup
        if i2c_bus is None:
            i2c_bus = busio.I2C(SCL, SDA)
        self.disp = adafruit_ssd1306.SSD1306_I2C(self.width, self.height, i2c_bus)
        self.font = ImageFont.load_default()

    def show_frame_with_text(self, text, frame):
        image = Image.new("1", (self.width, self.height))
        draw = ImageDraw.Draw(image)

        bbox = draw.textbbox((0, 0), text, font=self.font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        text_x = (self.width - text_width) // 2
        text_y = (16 - text_height) // 2
        draw.text((text_x, text_y), text, font=self.font, fill=255)

        anim = Image.frombytes('1', (self.frame_width, self.frame_height), frame)
        image.paste(anim, ((self.width - self.frame_width) // 2, 16))

        self.disp.image(image)
        self.disp.show()

    def animate(self, text, frames, loop=None, delay=0.09):
        self._stop_event.clear()
        count = 0
        while loop is None or count < loop:
            for frame in frames:
                if self._stop_event.is_set():
                    return
                self.show_frame_with_text(text, frame)
                time.sleep(delay)
            count += 1

    def clear(self):
        self.disp.fill(0)
        self.disp.show()

    def stop(self):
        self._stop_event.set()

    def __del__(self):
        self.clear()