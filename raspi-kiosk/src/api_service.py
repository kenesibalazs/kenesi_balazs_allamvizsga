# src/api_service.py

import requests
from src.config import LOGIN_URL, NFC_GET_URL, NFC_USED_URL, NEPTUN_CODE, PASSWORD

class APIService:
    def __init__(self):
        self.jwt_token = None
        self.headers = {}

    def login(self):
        try:
            response = requests.post(LOGIN_URL, json={
                "neptunCode": NEPTUN_CODE,
                "password": PASSWORD
            })
            response.raise_for_status()
            self.jwt_token = response.json()["token"]
            self.headers = {"Authorization": f"Bearer {self.jwt_token}"}
            print("✅ Logged in successfully.")
        except Exception as e:
            print(f"❌ Login error: {e}")
            exit(1)

    def fetch_nfc_text(self, reader_id):
        try:
            url = NFC_GET_URL.format(readerId=reader_id)
            response = requests.get(url, headers=self.headers)
            response.raise_for_status()
            return response.text.strip()
        except Exception as e:
            print(f"❌ Failed to fetch NFC text: {e}")
            return None

    def notify_tag_used(self, reader_id):
        try:
            url = NFC_USED_URL.format(readerId=reader_id)
            response = requests.post(url, headers=self.headers)
            print(f"🔁 Server response: {response.status_code}")
        except Exception as e:
            print(f"❌ Failed to notify backend: {e}")