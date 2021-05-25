import firebase from "../config/firebase";
import { setUserProfileData } from "./firestoreService";
import { addOneDataToUser } from "./firestoreService";


//Funksjon for email
export function signInWithEmail(creds) {
  return firebase
    .auth()
    .signInWithEmailAndPassword(creds.email, creds.password);
}

export function requestResetPassword(email) {
  return firebase.auth().sendPasswordResetEmail(email);
}

export function signOutFirebase() {
  return firebase.auth().signOut();
}

export async function registerInFirebase(creds) {
  try {
    const result = await firebase
      .auth()
      .createUserWithEmailAndPassword(creds.email, creds.password);

    await result.user.updateProfile({
      displayName: creds.displayName,
    });

    return await setUserProfileData(result.user);
  } catch (error) {
    throw error;
  }
}


//Funksjon for Facebook og Google
export async function socialLogin(selectedProvider) {
  let provider;
  if (selectedProvider === "facebook") {
    provider = new firebase.auth.FacebookAuthProvider();
  }
  if (selectedProvider === "google") {
    provider = new firebase.auth.GoogleAuthProvider();
  }

  try {
    const result = await firebase.auth().signInWithPopup(provider);
    // console.log(result);

    if (result.additionalUserInfo.isNewUser) {
      await setUserProfileData(result.user);
    }
  } catch (error) {
    throw error;
  }
}
