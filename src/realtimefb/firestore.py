import firebase_admin
import google.cloud
from firebase_admin import credentials, firestore
import datetime
import time
from time import sleep

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
            # time.sleep(1)


# doc_ref.add(
#    {u'date': datetime.datetime.utcnow(), u'value': u'555'})

# doc_ref = store.collection(u'stock').limit(2)


# read data in terminal
# try:
#    docs = doc_ref.get()
#    for doc in docs:
#        print(u'Doc Data:{}'.format(doc.to_dict()))
# except google.cloud.exceptions.NotFound:
#    print(u'Missing data')
