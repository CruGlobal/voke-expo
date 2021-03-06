import Constants from "expo-constants";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/storage";

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: Constants.manifest.extra.FIREBASE_API_KEY,
    appId: Constants.manifest.extra.FIREBASE_APP_ID,
    authDomain: Constants.manifest.extra.FIREBASE_AUTH_DOMAIN,
    projectId: Constants.manifest.extra.FIREBASE_PROJECT_ID,
    storageBucket: Constants.manifest.extra.FIREBASE_STORAGE_BUCKET,
  });
}

export const Auth = firebase.auth();
export const Storage = firebase.storage();

export default firebase;
