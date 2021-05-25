import firebase_admin
import google.cloud
from firebase_admin import credentials, firestore
import datetime
import time
import requests
from requests.exceptions import Timeout
from flask import request
from time import sleep
from flask import Flask
import subprocess
from subprocess import call

# Må bruke en annen 'deployment server'. Flask sin deployment server er svært begrenset og takler ikke multi-threaded requests/events.
# Dessuten, så må stoppe hele serveren (med flask sin server) og restarte den for å sende inn nye requests.


cred = credentials.Certificate(
    "service_key.json")
app = firebase_admin.initialize_app(cred)

store = firestore.client()

stockdata = ["512", "513", "514", "515", "515", "516", "517", "518",
             "519", "520", "521", "520", "519", "517", "518", "516",
             "514", "513", "512", "511", "510", "509", "508", "507",
             "506", "507", "508", "509", "510", "511"]

endTime = datetime.datetime.now() + datetime.timedelta(seconds=30)

doc_ref = store.collection(u'stock')


app = Flask(__name__)


def my_function():

    while True:
        if datetime.datetime.now() <= endTime:
            for stock in stockdata:
                time.sleep(1)
                doc_ref.add(
                    {u'date': datetime.datetime.utcnow(), u'value': stock})
            if stock == stockdata[29]:
                # sleep(1)
                break
                exit()
            elif (stock < stockdata[29]):
                continue
    # /
    return 'OK'


def shutdown_server():
    func = request.environ.get('werkzeug.server.shutdown')
    if func is None:
        raise RuntimeError('Not running with the Werkzeug Server')
    func()


@app.route('/delete', methods=['GET'])
def delete_document():

    docs = store.collection(u'stock').stream()
    batch = store.batch()
    counter = 0
    for doc in docs:
        counter = counter + 1
        if counter % 500 == 0:
            batch.commit()
        batch.delete(doc.reference)
    batch.commit()
    shutdown_server()

    return 'Deleting documents..'


@app.route('/shutdown', methods=['GET'])
def shutdown():
    shutdown_server()
    return 'Server shutting down...'


@app.route("/")
def index():
    return 'OK'
    #flask.render_template("homepage.jsx", token="Loaded python script")


@app.route("/test", methods=['GET'])
def test():

    return my_function()


app.run(debug=True, threaded=True)