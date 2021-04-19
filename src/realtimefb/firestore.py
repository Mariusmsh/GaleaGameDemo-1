import firebase_admin
import google.cloud
from firebase_admin import credentials, firestore
import datetime
import time
from time import sleep
from flask import Flask

app = Flask(__name__)


@app.route("/")
def index():
    return '<h1>Test</h1>'
    #flask.render_template("homepage.jsx", token="Loaded python script")


app.run(debug=True)

cred = credentials.Certificate(
    "/GaleaDemo/GaleaGameDemo/src/realtimefb/service_key.json")
app = firebase_admin.initialize_app(cred)

store = firestore.client()

stockdata = ["512", "513", "514", "515", "515", "516", "517", "518",
             "519", "520", "521", "501", "502", "503", "504", "505", "506", "507"]

endTime = datetime.datetime.now() + datetime.timedelta(seconds=18)

doc_ref = store.collection(u'stock')


while True:
    if datetime.datetime.now() <= endTime:
        for stock in stockdata:
            time.sleep(1)
            doc_ref.add(
                {u'date': datetime.datetime.utcnow(), u'value': stock})
        if stock == stockdata[15]:
            # sleep(1)
            break
        elif (stock < stockdata[15]):
            continue
# /
