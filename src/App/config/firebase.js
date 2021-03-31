import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/database";
import "firebase/auth";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDfSPvHThBryI4HWHDsdyJNoHvACYo4wDE",
  authDomain: "login-7cae3.firebaseapp.com",
  projectId: "login-7cae3",
  storageBucket: "login-7cae3.appspot.com",
  messagingSenderId: "174101026686",
  appId: "1:174101026686:web:f527c5705d2cdb33b3452f"
};

firebase.initializeApp(firebaseConfig);
firebase.firestore();




export default firebase;
