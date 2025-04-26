# main.py

from src.api_service import APIService
from src.nfc_sharing import share_nfc_text
from src.config import READER_ID

import time

def main():
    api = APIService()
    api.login()

    while True:
        try:
            nfc_text = api.fetch_nfc_text(READER_ID)
            if not nfc_text:
                time.sleep(2)
                continue

            print(f"📡 Sharing NFC text: {nfc_text}")
            tag_read = share_nfc_text(nfc_text)

            if tag_read:
                print("📲 Notifying backend...")
                api.notify_tag_used(READER_ID)

            time.sleep(1)

        except KeyboardInterrupt:
            print("🛑 Exiting script.")
            break
        except Exception as e:
            print(f"❌ Unexpected error: {e}")
            time.sleep(3)

if __name__ == "__main__":
    main()