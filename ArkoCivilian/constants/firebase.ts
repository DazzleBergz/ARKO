import { FirebaseApp, initializeApp } from 'firebase/app';
import { Database, getDatabase, ref, get } from "firebase/database";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCYu-UXszUNBGqeCYb22KYOyMjCx-Mnsiw",
  authDomain: "arko-uno.firebaseapp.com",
  databaseURL: "https://arko-uno-default-rtdb.asia-southeast1.firebasedatabase.app/", 
  projectId: "arko-uno",
  storageBucket: "arko-uno.appspot.com",
  messagingSenderId: "823968137794",
  appId: "1:823968137794:web:6bab7510bbafad60b0a3db",
  measurementId: "G-EJ5JQ6J0TY"
};

const app: FirebaseApp = initializeApp(firebaseConfig);
const database: Database = getDatabase(app);

export { database };
