import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 

const firebaseConfig = {
  apiKey: "AIzaSyA_DHjuMmJ68P0pBmistrgC6fB27XvGKVY",
  authDomain: "login-bb6a3.firebaseapp.com",
  projectId: "login-bb6a3",
  storageBucket: "login-bb6a3.appspot.com",
  messagingSenderId: "107713535391",
  appId: "1:107713535391:web:e63588259cb85ff03b31aa"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); 

export { auth, db }; 
