// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDnTKhTqlhwpM8wrBU9LjZ9hfI1LYlP7kQ",
    authDomain: "real-estate-web-app-01.firebaseapp.com",
    projectId: "real-estate-web-app-01",
    storageBucket: "real-estate-web-app-01.appspot.com",
    messagingSenderId: "952245816983",
    appId: "1:952245816983:web:58ce4a6d1930afcbcf63d2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore();