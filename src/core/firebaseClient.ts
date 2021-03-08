import Constants from "expo-constants";
import firebase from "firebase/app";
import "firebase/auth";

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: Constants.manifest.extra.FIREBASE_API_KEY,
    appId: Constants.manifest.extra.FIREBASE_APP_ID,
    authDomain: Constants.manifest.extra.FIREBASE_AUTH_DOMAIN,
    projectId: Constants.manifest.extra.FIREBASE_PROJECT_ID,
  });
}

export default firebase;
