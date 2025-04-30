# src/config.py

#base_url
API_ENDPOINT = "http://192.168.1.180:3000"

#api_endpoints
LOGIN_URL = f"{API_ENDPOINT}/api/login"
NFC_GET_URL = f"{API_ENDPOINT}/api/attendance/nfc/{{readerId}}"
NFC_USED_URL = f"{API_ENDPOINT}/api/attendance/nfc/regenerate/{{readerId}}"
HEALTHCHECK_URL = f"{API_ENDPOINT}/api/health"


#login credentials
NEPTUN_CODE = "NMB"
PASSWORD = "abc"

#reader_info
READER_ID = "ReaderID001"
NFC_APP_PATH = "/home/kenesibalazs/linux_libnfc-nci/nfcDemoApp"