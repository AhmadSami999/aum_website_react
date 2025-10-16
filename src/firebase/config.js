import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCSKK-Is6f9iUqBe6d_4PfyLYDFrZsF2x8",
  authDomain: "american-university-of-malta.firebaseapp.com",
  projectId: "american-university-of-malta",
  storageBucket: "american-university-of-malta.firebasestorage.app",
  messagingSenderId: "981722730795",
  appId: "1:981722730795:web:e09aeccb23e1cc6ca0356e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
export default app;