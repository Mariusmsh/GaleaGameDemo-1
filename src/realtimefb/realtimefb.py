import json
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db

# provide the full path to the service key, or else it wont locate the file


cred = credentials.Certificate(
    "/GaleaDemo/GaleaGameDemo/src/realtimefb/service_key.json")
firebase_admin.initialize_app(cred, {
    "databaseURL": "https://login-7cae3-default-rtdb.europe-west1.firebasedatabase.app/"
})


ref = db.reference('/')

with open("/GaleaDemo/GaleaGameDemo/files/books.json", "r") as f:
    file_contents = json.load(f)
ref.set(file_contents)
