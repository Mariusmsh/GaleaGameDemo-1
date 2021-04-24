import firebase from "../config/firebase";

const db = firebase.firestore();
//const admin = require("firebase-admin");
//const FieldValue = admin.firestore.FieldValue;
//var ref = database.ref('date');
//ref.on('date')


export function dataFromSnapshot(snapshot) {
  if (!snapshot.exists) return undefined;
  const data = snapshot.data();
 


  // convert to date time
  for (const prop in data) {
    if (data.hasOwnProperty(prop)) {
      if (data[prop] instanceof firebase.firestore.Timestamp) {
        data[prop] = data[prop].toDate();
        
      }
    }
  }

  return {
    ...data,
    id: snapshot.id,
  };
}

export function setUserProfileData(user) {
  return db
    .collection("users")
    .doc(user.uid)
    .set({
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL || null,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
}


export function addMatchResultsToFirestore(match, HIGH, LOW){
  const user = firebase.auth().currentUser;
  return db.collection('matches').add({
    ...match,
      matchID: firebase.firestore.FieldValue.arrayUnion(user.uid),
      matchStat: firebase.firestore.FieldValue.arrayUnion({
        id: user.uid,
        high: HIGH,
        low: LOW
      })
    
  })
}


/*export function setUserStockData(user){
  return db
    .collection("users")
    .doc(user.uid)
    .set({
      high: user.high,
      low: user.low
    });
} */






/*
//function that creates a random value for a stock, so it creates a random game
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
} 
  */


// Get stocks collection from firestore
export function listenToStocksFromFirestore() {
  //var time = 1;
  //var timer = setInterval(timeoutData, 1000);   //The refreshes the function timoutData every second. Might overflow the firebase/database.
  //clearInterval(timer); //Connected line of code above
  
 // timeoutData();
    return db.collection("stock").orderBy('date', 'asc');
}

/* Funksjon som loader random interger data, tatt ut i kommentar as per now
function loadData(){
  var x = getRndInteger(600, 900)
  //var y = 1000
  //var z = 0

  
  db.collection("stock").add({
    value: x,
    date: firebase.firestore.Timestamp.now().toMillis()
    
  })
} */

db.collection("stock").onSnapshot(snapshot => {
  let changes = snapshot.docChanges();
  console.log(changes);
})



// Get single stock document from firestore
export function listenToStockFromFirestore(stockId) {
  return db.collection("stock").doc(stockId).set();
  
}








//Update "live" data
//function 

/*export function fillStock (stockId, date){
  return db.collection("stock").doc(stockID).set();
} */
