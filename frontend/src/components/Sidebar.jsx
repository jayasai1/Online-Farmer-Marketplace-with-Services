import React from 'react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { currentUser, activeView, navigate, logout, t } = useAuth();

  const handleItemClick = (viewId) => {
    navigate(viewId);
  };

  const getActiveCls = (viewId) => {
    return activeView === viewId ? 'sidebar-item active' : 'sidebar-item';
  };

  const renderProfilePanel = () => {
    if (currentUser) {
      const avatarChar = currentUser.username.charAt(0).toUpperCase();
      return (
        <div className="sidebar-profile">
          <div className="d-flex align-items-center gap-3">
            <div
              className="rounded-circle bg-warning text-dark d-flex align-items-center justify-content-center fw-bold"
              style={{ width: '42px', height: '42px', fontSize: '1.2rem' }}
            >
              {avatarChar}
            </div>
            <div>
              <h6 className="mb-0 text-white font-heading fw-bold text-truncate" style={{ maxWidth: '140px' }}>
                {currentUser.username}
              </h6>
              <span className="badge bg-light text-success fw-bold" style={{ fontSize: '0.75rem' }}>
                {currentUser.role.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="sidebar-profile">
        <div className="text-center w-100">
          <button
            onClick={() => navigate('auth')}
            className="btn btn-sm btn-light w-100 text-success fw-bold py-2"
          >
            <i className="fa-solid fa-user-plus me-1"></i> {t('menu_login')}
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="sidebar-overlay" onClick={() => {
        document.querySelector('.sidebar').classList.remove('active');
        document.querySelector('.sidebar-overlay').classList.remove('active');
      }}></div>

      <aside className="sidebar">
        <div className="sidebar-logo cursor-pointer" onClick={() => navigate('landing')}>
          <i className="fa-solid fa-seedling text-warning fs-3"></i>
          <div className="sidebar-brand">
            {t('logo_brand')} <span>{t('logo_sub')}</span>
          </div>
        </div>

        <nav className="sidebar-menu">
          <div className="sidebar-section-title">{t('sidebar_explore')}</div>
          <a className={getActiveCls('landing')} onClick={() => handleItemClick('landing')}>
            <i className="fa-solid fa-house-chimney"></i> {t('menu_home')}
          </a>
          <a className={getActiveCls('crops')} onClick={() => handleItemClick('crops')}>
            <i className="fa-solid fa-wheat-awn"></i> {t('menu_crops')}
          </a>
          <a className={getActiveCls('tractors')} onClick={() => handleItemClick('tractors')}>
            <i className="fa-solid fa-tractor"></i> {t('menu_tractors')}
          </a>
          <a className={getActiveCls('labors')} onClick={() => handleItemClick('labors')}>
            <i className="fa-solid fa-people-group"></i> {t('menu_labors')}
          </a>
          
          {/* Brand New Agro Services Marketplace Sidebar Option! */}
          <a className={getActiveCls('agroservices')} onClick={() => handleItemClick('agroservices')}>
            <i className="fa-solid fa-wrench text-warning"></i> {t('menu_services')}
          </a>

          <a className={getActiveCls('prices')} onClick={() => handleItemClick('prices')}>
            <i className="fa-solid fa-chart-line"></i> {t('menu_prices')}
          </a>

          {/* Farmer Dashboard Portal (Farmer Role Only) */}
          {currentUser && currentUser.role === 'farmer' && (
            <div className="mt-4 animate__animated animate__fadeIn">
              <div className="sidebar-section-title">{t('sidebar_farmer')}</div>
              <a className={getActiveCls('farmer-dashboard')} onClick={() => handleItemClick('farmer-dashboard')}>
                <i className="fa-solid fa-chalkboard-user"></i> {t('menu_dashboard')}
              </a>
            </div>
          )}

          {/* Buyer Dashboard Portal (Buyer Role Only) */}
          {currentUser && currentUser.role === 'buyer' && (
            <div className="mt-4 animate__animated animate__fadeIn">
              <div className="sidebar-section-title">{t('sidebar_buyer')}</div>
              <a className={getActiveCls('buyer-dashboard')} onClick={() => handleItemClick('buyer-dashboard')}>
                <i className="fa-solid fa-chart-pie"></i> {t('menu_dashboard')}
              </a>
            </div>
          )}
        </nav>

        {renderProfilePanel()}
      </aside>
    </>
  );
};

export default Sidebar;
