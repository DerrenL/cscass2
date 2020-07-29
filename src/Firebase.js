import * as firebase from 'firebase';
var firebaseConfig = {
    apiKey: "AIzaSyAL2s3dXACvm5pXrLV0P6EAvHcbTVG6wYM",
    authDomain: "csc-assignment2.firebaseapp.com",
    databaseURL: "https://csc-assignment2.firebaseio.com/",
    projectId: "csc-assignment2",
    storageBucket: "csc-assignment2.appspot.com",
    messagingSenderId: "65627261079",
    appId: "1:65627261079:web:88694038df1fe5602041d2"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export const auth = firebase.auth();

  export const db = firebase.firestore();