import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const user = localStorage.getItem('user');
  const isAdmin = user && JSON.parse(user).email === 'admin@admin.com';

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm mb-4">
      <div className="container">
        <Link className="navbar-brand fw-bold" to={isAdmin ? '/admin' : '/'}>DişRandevu</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {isAdmin ? (
              <li className="nav-item">
                <Link className="nav-link" to="/admin">Admin Paneli</Link>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/">Ana Sayfa</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/doctors">Doktorlar</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/appointments">Randevularım</Link>
                </li>
              </>
            )}
          </ul>
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {!user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Giriş Yap</Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-primary" to="/register">Kayıt Ol</Link>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <button className="btn btn-outline-danger" onClick={handleLogout}>Çıkış Yap</button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 