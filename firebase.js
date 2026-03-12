// ==========================
//  Firebase Inicialización
// ==========================
const firebaseConfig = {
  apiKey: "AIzaSyBoCLNdcBjMSemNZwuJ6_RuHLhXNrXVA_E", // ← ESTA es la correcta
    authDomain: "vc-business-solutions.firebaseapp.com",
    projectId: "vc-business-solutions",
    storageBucket: "vc-business-solutions.firebasestorage.app",
    messagingSenderId: "231011289734",
    appId: "1:231011289734:web:705ab98fae2896fb7f5f07",
    measurementId: "G-0DFQJ6YZMC"
};

// Iniciar Firebase (modo compat)
firebase.initializeApp(firebaseConfig);

// App Check (reCAPTCHA v3)
firebase.appCheck().activate(
  "6LeaES4sAAAAAFs0tHijNBfwMQZwY3A60zcqWT0f", // SITE KEY
    true
);

// Firestore
const db = firebase.firestore();
