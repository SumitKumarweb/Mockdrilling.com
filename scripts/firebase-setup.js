// Firebase configuration and initialization
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getFunctions } from "firebase/functions"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyC2ZKdAHTgiSc4MPAnO2SAKlj4PhD0N_Hc",
  authDomain: "mockdrilling.firebaseapp.com",
  projectId: "mockdrilling",
  storageBucket: "mockdrilling.firebasestorage.app",
  messagingSenderId: "385126255015",
  appId: "1:385126255015:web:e5a0576174ef822f2b0e82",
  measurementId: "G-65EQBK4STS"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)
export const functions = getFunctions(app)
export const storage = getStorage(app)

export default app

console.log("Firebase initialized successfully!")
console.log("Services available: Auth, Firestore, Functions, Storage")
console.log("Ready to implement user authentication and data management")
