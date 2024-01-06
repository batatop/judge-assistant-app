import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import 'firebase/compat/storage';

const firebaseConfig = {
    apiKey: "AIzaSyBx8WYFsWpMBfl-55Be4vojMw3CoYr2hi8",
    authDomain: "judge-assistant-3c8dd.firebaseapp.com",
    projectId: "judge-assistant-3c8dd",
    storageBucket: "judge-assistant-3c8dd.appspot.com",
    messagingSenderId: "543454033152",
    appId: "1:543454033152:web:4c6163b72b8d15ea58afe5",
    databaseURL: "https://judge-assistant-3c8dd-default-rtdb.europe-west1.firebasedatabase.app"
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const db = firebase.database();
export const storage = firebase.storage();