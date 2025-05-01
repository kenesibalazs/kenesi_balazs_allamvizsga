# src/nfc_sharing.py

import subprocess
import time
from src.config import NFC_APP_PATH

def share_nfc_text(nfc_text):
    process = subprocess.Popen(
        ["unbuffer", NFC_APP_PATH, "share", "-t", "Text", "-l", "en", "-r", nfc_text],
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        bufsize=1,
    )

    reader_found = False

    try:
        for line in process.stdout:
            line = line.strip()
            #print(f"[nfcDemoApp] {line}")

            if "NFC Reader Found" in line:
                reader_found = True

            if reader_found and "NFC Reader Lost" in line:
                print("📲 Tag was read!")
                return True  # Reader found + lost means tag was read
    finally:
        process.terminate()
        try:
            process.wait(timeout=2)
        except subprocess.TimeoutExpired:
            process.kill()

    return False  # Tag not read