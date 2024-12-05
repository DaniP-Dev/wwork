// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDgl9-4oSSibgtTqdQ6hscpEYK0CRyUI4c",
    authDomain: "wwork-1dee0.firebaseapp.com",
    projectId: "wwork-1dee0",
    storageBucket: "wwork-1dee0.firebasestorage.app",
    messagingSenderId: "952948240653",
    appId: "1:952948240653:web:0f5c6e01cbe3fb0d200044",
    measurementId: "G-23TR96P4SX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
export { db, auth };