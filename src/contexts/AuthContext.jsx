// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth } from '../services/firebase'; // ✅ Caminho correto agora

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // 🔐 LOGIN ADMIN
  const login = async (email, password) => {
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Verificar se é admin (você pode criar uma collection de admins no Firestore)
      const isUserAdmin = await checkIfAdmin(user.uid);
      setIsAdmin(isUserAdmin);
      
      setUser(user);
      return { success: true, user };
    } catch (error) {
      console.error('Erro no login:', error);
      return { 
        success: false, 
        error: getAuthErrorMessage(error.code) 
      };
    } finally {
      setLoading(false);
    }
  };

  // 🚪 LOGOUT
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setIsAdmin(false);
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  // 📋 VERIFICAR SE USUÁRIO É ADMIN
  const checkIfAdmin = async (uid) => {
    // Lista de emails administradores (pode ser movido para Firestore depois)
    const adminEmails = [
      'victorcardoso213@gmail.com',
      'teste@cbmerj.gov.br'
      // Adicione outros emails de admin aqui
    ];
    
    const user = auth.currentUser;
    return user && adminEmails.includes(user.email);
  };

  // 👁️ OBSERVAR ESTADO DA AUTENTICAÇÃO
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const adminStatus = await checkIfAdmin(user.uid);
        setIsAdmin(adminStatus);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    isAdmin,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// 🎯 MENSAGENS DE ERRO AMIGÁVEIS
const getAuthErrorMessage = (errorCode) => {
  const errorMessages = {
    'auth/invalid-email': 'Email inválido',
    'auth/user-disabled': 'Esta conta foi desativada',
    'auth/user-not-found': 'Usuário não encontrado',
    'auth/wrong-password': 'Senha incorreta',
    'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde.',
    'auth/network-request-failed': 'Erro de conexão. Verifique sua internet.',
    'default': 'Erro ao fazer login. Tente novamente.'
  };

  return errorMessages[errorCode] || errorMessages['default'];
};