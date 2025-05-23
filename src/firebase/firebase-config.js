// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDOqVjp4pn6hhQfBhFSNriY2KTghsm92lE",
    authDomain: "kalkulori.firebaseapp.com",
    databaseURL: "https://kalkulori-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "kalkulori",
    storageBucket: "kalkulori.firebasestorage.app",
    messagingSenderId: "1054160286856",
    appId: "1:1054160286856:web:d2dd8c72c389509ff75b3d",
    measurementId: "G-PFF2RHZE0H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);