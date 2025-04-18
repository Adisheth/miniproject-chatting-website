
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/analytics';


firebase.initializeApp({
  apiKey: "AIzaSyBEkAX6_FXf7s30N5kM_LK_M765D3_0kj8",
  authDomain: "online-chatting-website-20d7e.firebaseapp.com",
  projectId: "online-chatting-website-20d7e",
  storageBucket: "online-chatting-website-20d7e.firebasestorage.app",
  messagingSenderId: "387999410519",
  appId: "1:387999410519:web:56cb04d4960cb0e0ae7612",
  measurementId: "G-FT0WYG5LL1",
  
})
const auth = firebase.auth();
const firestore = firebase.firestore();
export  {auth,firestore};