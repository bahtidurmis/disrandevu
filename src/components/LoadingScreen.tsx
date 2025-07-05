import React, { useEffect, useState } from 'react';
import './LoadingScreen.css';

const LoadingScreen: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="logo-container">
          <svg
            className="tooth-svg"
            width="100"
            height="120"
            viewBox="0 0 100 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Diş şekli */}
            <path
              d="M50 10
                 C70 10, 85 35, 75 75
                 C72 90, 65 105, 58 105
                 C55 105, 53 100, 50 95
                 C47 100, 45 105, 42 105
                 C35 105, 28 90, 25 75
                 C15 35, 30 10, 50 10
                 Z"
              fill="#ffffff"
              stroke="#2563eb"
              strokeWidth="3"
            />
            {/* Parlama efekti */}
            <ellipse cx="40" cy="40" rx="6" ry="12" fill="#fff" opacity="0.2" />
            <ellipse cx="60" cy="35" rx="4" ry="8" fill="#fff" opacity="0.1" />
          </svg>
          <div className="logo-text">Diş Randevu Sistemi</div>
        </div>
        <div className="loading-bar">
          <div className="loading-progress"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
