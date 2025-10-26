// src/components/auth/AdminLogin.jsx
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css'; // Vamos criar este CSS depois

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      navigate('/admin'); // Redireciona para o painel admin
    } else {
      alert(result.error); // Ou use um sistema de notificação mais sofisticado
    }
    
    setIsLoading(false);
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="login-header">
          <div className="logo">
            <h2>Quartel Central CBMERJ</h2>
            <p>Sistema Administrativo</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Administrativo</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@quartelcentral.com"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={isLoading}
            />
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="spinner"></div>
                Entrando...
              </>
            ) : (
              'Entrar no Sistema Admin'
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>Acesso restrito à equipe administrativa</p>
          <button 
            type="button" 
            className="back-button"
            onClick={() => navigate('/')}
          >
            ← Voltar ao Site Principal
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;