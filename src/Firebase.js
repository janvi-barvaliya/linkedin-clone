import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

// const firebaseConfig = {
//     apiKey: import.meta.env['VITE_API_KEY'],
//     authDomain: import.meta.env['VITE_AUTH_DOMAIN'],
//     projectId: import.meta.env['VITE_PROJECT_ID'],
//     storageBucket: import.meta.env['VITE_STORAGE_BUCKET'],
//     messagingSenderId: import.meta.env['VITE_MESSAGING_SENDER_ID'],
//     appId: import.meta.env['VITE_APP_ID']
// };

// console.log(firebaseConfig);
const firebaseConfig = {
    apiKey: "AIzaSyCcQ_qS-rDxcJGCXkVbK_Kbq34QMeiT_Qw",
    authDomain: "linkdin-clone-d6481.firebaseapp.com",
    projectId: "linkdin-clone-d6481",
    storageBucket: "linkdin-clone-d6481.firebasestorage.app",
    messagingSenderId: "651335023605",
    appId: "1:651335023605:web:35ac212252cbd51fccfebc",
    measurementId: "G-B3DGX7VE37"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();


const provider = new firebase.auth.GoogleAuthProvider();
const storage = firebase.storage();


export { auth, provider, storage };
export default db;