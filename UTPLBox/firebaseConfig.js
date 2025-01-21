// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAGEF6FioLlTbEC5TRaViWlvp5VC5TtpNs",
  authDomain: "authinventario.firebaseapp.com",
  projectId: "authinventario",
  storageBucket: "authinventario.firebasestorage.app",
  messagingSenderId: "279835403078",
  appId: "1:279835403078:web:cf1f93f305326965c77b47"
};

export const app = initializeApp(firebaseConfig);