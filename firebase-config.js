const firebaseConfig = {
    apiKey: "AIzaSyD1fkxq6USO5RX22TlsPQFEaVSZoTj_t2A",
    authDomain: "escalas-6e0f9.firebaseapp.com",
    projectId: "escalas-6e0f9",
    storageBucket: "escalas-6e0f9.firebasestorage.app",
    messagingSenderId: "19118998563",
    appId: "1:19118998563:web:5412be658ae34bd45add96"
};

// Inicializa o Firebase e torna a variável 'db' globalmente acessível para os outros scripts
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
