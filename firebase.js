import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getApps, getApp } from "firebase/app";
import "firebase/database"

const firebaseConfig = {
  apiKey: "AIzaSyBLHD9sCFV_WgfKdcNK8gJLeYU1dG79B0M",
  authDomain: "readn-8c472.firebaseapp.com",
  databaseURL: "https://readn-8c472-default-rtdb.firebaseio.com",
  projectId: "readn-8c472",
  storageBucket: "readn-8c472.appspot.com",
  messagingSenderId: "1049182835415",
  appId: "1:1049182835415:web:af75bbcaed84cdf24a1692",
  measurementId: "G-FMNQ26GYD9"
};


const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);