import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCgwIsRQCalJ2TInq0QgKd88ErZ28dWxJA",
    authDomain: "aira-614da.firebaseapp.com",
    projectId: "aira-614da",
    storageBucket: "aira-614da.firebasestorage.app",
    messagingSenderId: "553291867210",
    appId: "1:553291867210:web:644131fe758eff7a50b2b3",
    measurementId: "G-5S152JE4S0"
  };
  

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);