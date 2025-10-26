// src/config/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // ✅ Adicionar import do Auth

// SUAS CONFIGURAÇÕES DO FIREBASE - SUBSTITUA PELAS SUAS
const firebaseConfig = {
  apiKey: "AIzaSyDzJem7HXapepnhOCsPS20sZKRoiftuIEo",
  authDomain: "museu-cbmerj.firebaseapp.com",
  projectId: "museu-cbmerj",
  storageBucket: "museu-cbmerj.firebasestorage.app",
  messagingSenderId: "866925842903",
  appId: "1:866925842903:web:eb773f17a47c17cd53fb92",
  measurementId: "G-X45BM7NZHT"
};

// Inicializa Firebase
let app;
let db;
let auth; // ✅ Nova variável para auth

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app); // ✅ Inicializar autenticação
  console.log('✅ Firebase inicializado com sucesso');
} catch (error) {
  console.error('❌ Erro ao inicializar Firebase:', error);
  // Mesmo com erro, exporta para o sistema não quebrar
  db = null;
  auth = null; // ✅ Inicializar auth como null em caso de erro
}

export { db, auth }; // ✅ Exportar auth também

// ✅ Exportação padrão para compatibilidade
export default app;