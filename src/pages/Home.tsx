import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold mb-3">Diş Sağlığınız İçin Yanınızdayız</h1>
        <p className="lead mb-4">Uzman kadromuzla sağlıklı gülüşler için hizmetinizdeyiz</p>
        <div className="d-flex justify-content-center gap-2">
          <button className="btn btn-primary btn-lg me-2" onClick={() => navigate('/doctors')}>Randevu Al</button>
          <button className="btn btn-outline-primary btn-lg" onClick={() => navigate('/doctors')}>Doktorlarımız</button>
        </div>
      </div>
      <div className="row g-4">
        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h3 className="card-title">Uzman Kadro</h3>
              <p className="card-text">Deneyimli ve uzman diş hekimlerimizle kaliteli hizmet</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h3 className="card-title">Modern Teknoloji</h3>
              <p className="card-text">En son teknolojik cihazlarla güvenli tedavi</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h3 className="card-title">Kolay Randevu</h3>
              <p className="card-text">Online randevu sistemi ile hızlı ve kolay randevu</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 