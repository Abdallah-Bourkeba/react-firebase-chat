import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "chat-app-bourkeba.firebaseapp.com",
  projectId: "chat-app-bourkeba",
  storageBucket: "chat-app-bourkeba.firebasestorage.app",
  messagingSenderId: "813707154256",
  appId: "1:813707154256:web:53788bae9e6bbd7055d255",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore();
// export const storage = getStorage();
