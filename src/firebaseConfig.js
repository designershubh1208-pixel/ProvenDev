import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAiya2AbwwbjURHOL1YlYt8_2QkiKH6uyY",
    authDomain: "skill-sho.firebaseapp.com",
    projectId: "skill-sho",
    storageBucket: "skill-sho.firebasestorage.app",
    messagingSenderId: "402906958680",
    appId: "1:402906958680:web:57321e1ab2402266d1b32d"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider(); // Ensure this export exists