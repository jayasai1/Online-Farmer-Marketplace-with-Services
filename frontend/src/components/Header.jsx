import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { currentUser, theme, language, setLanguage, navigate, toggleTheme, logout } = useAuth();
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const opt = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setCurrentDate(new Date().toLocaleDateString('en-US', opt));
  }, []);

  const handleMenuToggle = () => {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    if (sidebar) {
      sidebar.classList.toggle('active');
      overlay.classList.toggle('active');
    }
  };

  const renderNavActions = () => {
    if (currentUser) {
      return (
        <>
          <span className="d-none d-md-inline fw-semibold text-main">Hello, {currentUser.username}</span>
          <button onClick={logout} className="btn btn-sm btn-outline-danger ms-2">
            <i className="fa-solid fa-arrow-right-from-bracket me-1"></i> Logout
          </button>
        </>
      );
    }

    return (
      <button
        onClick={() => navigate('auth')}
        className="btn btn-primary btn-sm px-4 rounded-pill"
      >
        <i className="fa-solid fa-right-to-bracket me-1"></i> Login / Register
      </button>
    );
  };

  return (
    <header className="top-navbar">
      <div className="d-flex align-items-center gap-3">
        <button onClick={handleMenuToggle} className="menu-toggle" aria-label="Toggle Sidebar Menu">
          <i className="fa-solid fa-bars"></i>
        </button>
        <div className="d-none d-lg-block text-muted small fw-semibold">
          <i className="fa-solid fa-calendar-day text-success me-1"></i> {currentDate}
        </div>
      </div>

      <div className="nav-actions">
        {/* Language Switcher */}
        <div className="me-1">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="form-select form-select-sm border-success bg-light text-success fw-bold py-1.5 px-3 rounded-pill"
            style={{ fontSize: '0.8rem', cursor: 'pointer', outline: 'none', minWidth: '120px' }}
          >
            <option value="en">English (EN)</option>
            <option value="hi">हिन्दी (HI)</option>
            <option value="te">తెలుగు (TE)</option>
          </select>
        </div>

        {/* Light/Dark Mode Switcher */}
        <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle light and dark theme">
          <i className={theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon'}></i>
        </button>

        <div id="nav-user-dropdown" className="d-flex align-items-center">
          {renderNavActions()}
        </div>
      </div>
    </header>
  );
};

export default Header;
