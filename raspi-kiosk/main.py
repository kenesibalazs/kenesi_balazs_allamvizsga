# main.py
import threading
from src.api_service import APIService
from src.nfc_sharing import share_nfc_text
from src.config import READER_ID
from src.animate import OLEDAnimator
from src.frame_manager import FrameManager
import sys

import time
import requests

def generate_dummy_frames(count=10):
    blank_frame = bytes([0x00] * (48 * 48 // 8))
    return [blank_frame for _ in range(count)]


def main():
    api = APIService()

    oled = OLEDAnimator()
    frame_mgr = FrameManager()
    frames = frame_mgr.get("default")
    success_frames = frame_mgr.get("success")

    animation_thread = threading.Thread(target=oled.animate, args=("Waiting", frames))
    animation_thread.start()

    while True:
        if not api.is_backend_online():
            print("🔌 Backend is offline. Retrying in 60s...")
            time.sleep(60)
            continue

        try:
            print("🔐 Attempting login...")
            api.login()
            break
        except requests.exceptions.RequestException as e:
            print(f"❌ Login failed: {e}")
            time.sleep(60)


    while True:
        try:
            nfc_text = api.fetch_nfc_text(READER_ID)

            if not nfc_text:
                time.sleep(0.5)
                continue
           
            
            print(f"📡 Sharing NFC text: {nfc_text}")
            tag_read = share_nfc_text(nfc_text)


            
            if tag_read:
                print("📲 Notifying backend...")
                api.notify_tag_used(READER_ID)


                oled.stop()
                animation_thread.join()

                

                success_thread = threading.Thread(
                    target=oled.animate,
                    args=("Success", success_frames),
                    kwargs={"loop": 1, "delay": 0.01}
                )
                success_thread.start()
                success_thread.join()

                oled.stop()
                animation_thread = threading.Thread(
                    target=oled.animate,
                    args=("Waiting", frames)
                )
                animation_thread.start()


            time.sleep(1)


          
        except KeyboardInterrupt:
            print("🛑 Exiting script.")
            oled.stop()
            oled.clear()
            animation_thread.join()
            sys.exit(0)
        except Exception as e:
            print(f"❌ Unexpected error: {e}")
            time.sleep(3)

if __name__ == "__main__":
    main()