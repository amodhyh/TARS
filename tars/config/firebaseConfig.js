// Import the functions you need from the SDKs you need
//import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
// Your web app's Firebase configurat
const  firebaseConfig = {
  apiKey: "AIzaSyCYNClhZgsqVfwuQMamAfDXpH3x0ulQlqs",
  authDomain: "tars-90cbb.firebaseapp.com",
  databaseURL: "https://tars-90cbb-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "tars-90cbb",
  storageBucket: "tars-90cbb.firebasestorage.app",
  messagingSenderId: "165564318019",
  appId: "1:165564318019:web:ed40891e87ee8822672ff6"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
   const db=getDatabase();
export {db};