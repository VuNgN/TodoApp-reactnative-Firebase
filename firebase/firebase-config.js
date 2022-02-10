// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore/lite';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  //apiKey: 'AIzaSyDA4dwXRc2FikzHNklY1HWmsW1GQ9s68m8',
  //authDomain: 'fir-demo-764c7.firebaseapp.com',
  //projectId: 'fir-demo-764c7',
  //storageBucket: 'fir-demo-764c7.appspot.com',
  //messagingSenderId: '609882157012',
  //appId: '1:609882157012:web:523e014ae4b0b77a60b041',
  apiKey: 'AIzaSyA_jmC_zK2wledyELP3-yvh9o5fkRmagS4',
  authDomain: 'todoapp-483a7.firebaseapp.com',
  projectId: 'todoapp-483a7',
  storageBucket: 'todoapp-483a7.appspot.com',
  messagingSenderId: '759933638383',
  appId: '1:759933638383:web:077a1d608f91201280ad1a',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
