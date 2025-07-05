import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await authService.login(email, password);
      localStorage.setItem('user', JSON.stringify(response.user));
      if (response.user.email === 'admin@admin.com') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Giriş yapılırken bir hata oluştu');
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div className="card p-4 shadow" style={{ maxWidth: 400, width: '100%' }}>
        <h2 className="text-center mb-4">Hesabınıza Giriş Yapın</h2>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">E-posta</label>
            <input
              type="email"
              className="form-control"
              id="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Şifre</label>
            <input
              type="password"
              className="form-control"
              id="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Giriş Yap</button>
        </form>
        <div className="mt-3 text-center">
          <button
            className="btn btn-link"
            onClick={() => navigate('/register')}
          >
            Kayıt Ol
          </button>
        </div>
        <div style={{ marginTop: '1rem', textAlign: 'right' }}>
          <a href="/forgot-password" style={{ color: '#2563eb', textDecoration: 'underline', cursor: 'pointer' }}>
            Şifremi Unuttum?
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login; 