import requests
from src.config import LOGIN_URL, NFC_GET_URL, NFC_USED_URL, NEPTUN_CODE, PASSWORD, HEALTHCHECK_URL

class APIService:
    def __init__(self):
        self.jwt_token = None
        self.headers = {}

    def login(self):
        response = requests.post(LOGIN_URL, json={
            "neptunCode": NEPTUN_CODE,
            "password": PASSWORD
        })
        response.raise_for_status()
        self.jwt_token = response.json()["token"]
        self.headers = {"Authorization": f"Bearer {self.jwt_token}"}
        print("✅ Logged in successfully.")

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

    @staticmethod
    def is_backend_online():
        try:
            response = requests.get(HEALTHCHECK_URL, timeout=3)
            return response.status_code == 200
        except requests.exceptions.RequestException:
            return False
