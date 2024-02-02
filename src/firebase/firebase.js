// Import the functions you need from the SDKs you need
import firebase from "firebase/app";
// よく分からないけど、下記追加でエラー消失
import 'firebase/firestore';
import "firebase/auth";
import 'firebase/storage';
import 'firebase/app';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDjvjPrR5vKlXY7biCSWRLogF1GZf1gvuw",
  authDomain: "vue-chat-7d858.firebaseapp.com",
  projectId: "vue-chat-7d858",
  storageBucket: "vue-chat-7d858.appspot.com",
  messagingSenderId: "270900080092",
  appId: "1:270900080092:web:c5bf8685739c9e947fb319"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;