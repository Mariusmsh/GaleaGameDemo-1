import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/database";
import "firebase/auth";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCimO84pWOUI2gIWMgyoZvXRbZ1GaU2cfY",
  authDomain: "galea-game.firebaseapp.com",
  databaseURL: "https://galea-game-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "galea-game",
  storageBucket: "galea-game.appspot.com",
  messagingSenderId: "255814321514",
  appId: "1:255814321514:web:846a89fd1a250b9b805113",
  measurementId: "G-T0CHY60SDJ"
};

firebase.initializeApp(firebaseConfig);
firebase.firestore();




export default firebase;
