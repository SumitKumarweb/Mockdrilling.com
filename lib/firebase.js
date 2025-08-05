import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth"
import { getFirestore, enableNetwork, disableNetwork, connectFirestoreEmulator, enableIndexedDbPersistence } from "firebase/firestore"
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

// Enable Firestore persistence
const enablePersistence = async () => {
  try {
    await enableIndexedDbPersistence(db)
    console.log('Firestore persistence enabled successfully')
  } catch (error) {
    if (error.code === 'failed-precondition') {
      console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.')
    } else if (error.code === 'unimplemented') {
      console.warn('The current browser does not support persistence')
    } else {
      console.error('Error enabling persistence:', error)
    }
  }
}

// Enable persistence on initialization
enablePersistence()

// Initialize auth providers
export const googleProvider = new GoogleAuthProvider()
export const githubProvider = new GithubAuthProvider()

// Network management functions
export const enableFirestoreNetwork = () => enableNetwork(db)
export const disableFirestoreNetwork = () => disableNetwork(db)

// Network status check
export const checkNetworkStatus = async () => {
  try {
    await enableNetwork(db)
    return { online: true }
  } catch (error) {
    console.log('Network check failed:', error)
    return { online: false, error: error.message }
  }
}

export default app 