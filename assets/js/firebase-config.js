// CONFIGURAÇÃO DO FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyBvWeoezpK4JZma7aGMC7h0gLFmvdUORBQ",
  authDomain: "educabio-e4d02.firebaseapp.com",
  projectId: "educabio-e4d02",
  storageBucket: "educabio-e4d02.firebasestorage.app",
  messagingSenderId: "865824469396",
  appId: "1:865824469396:web:e82bb2b66c95fcf6bc5f81"
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);

// Serviços
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Provider Google
const googleProvider = new firebase.auth.GoogleAuthProvider();
