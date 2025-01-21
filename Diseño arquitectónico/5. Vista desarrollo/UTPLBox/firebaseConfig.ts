// firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { initializeAuth, browserLocalPersistence } from 'firebase/auth';
//import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAGEF6FioLlTbEC5TRaViWlvp5VC5TtpNs",
  authDomain: "authinventario.firebaseapp.com",
  projectId: "authinventario",
  storageBucket: "authinventario.firebaseapp.com",
  messagingSenderId: "279835403078",
  appId: "1:279835403078:web:cf1f93f305326965c77b47"
};

// Inicializa Firebase
export const app = initializeApp(firebaseConfig);

// Configura Firebase Auth con persistencia en AsyncStorage
export const auth = initializeAuth(app, {
  persistence: browserLocalPersistence, // Usamos browserLocalPersistence, aunque es mejor usar AsyncStorage para persistencia en RN
});

// Inicializa Firestore
const db = getFirestore(app);

// Exporta la instancia de Firestore y los métodos necesarios
export { db, collection, getDocs, query, where };
