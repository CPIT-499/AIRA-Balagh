import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDhG4WsaT1tVf0O_iz65h5WovPfILGUNJU",
  authDomain: "aira-88b57.firebaseapp.com",
  projectId: "aira-88b57",
  storageBucket: "aira-88b57.firebasestorage.app",
  messagingSenderId: "560743507223",
  appId: "1:560743507223:web:27d9e2754c60f7d79f8352",
  measurementId: "G-30TSLSQKYY"
};
  

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);