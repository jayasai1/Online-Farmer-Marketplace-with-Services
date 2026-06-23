import React from 'react';
import { useAuth } from '../context/AuthContext';

const LandingView = () => {
  const { currentUser, navigate, logout, language, t } = useAuth();

  const handleCtaClick = (tab) => {
    if (currentUser) {
      navigate(`${currentUser.role}-dashboard`);
    } else {
      navigate('auth');
    }
  };

  const renderCtas = () => {
    if (currentUser) {
      return (
        <div className="d-flex flex-wrap gap-2">
          <button
            onClick={() => navigate(`${currentUser.role}-dashboard`)}
            className="btn btn-primary btn-lg me-3"
          >
            <i className="fa-solid fa-chart-line me-2"></i> {t('menu_dashboard')}
          </button>
          <button onClick={logout} className="btn btn-outline-primary btn-lg">
            <i className="fa-solid fa-arrow-right-from-bracket me-2"></i> {t('menu_logout')}
          </button>
        </div>
      );
    }

    return (
      <div className="d-flex flex-wrap gap-2">
        <button
          onClick={() => navigate('auth')}
          className="btn btn-primary btn-lg me-3"
        >
          <i className="fa-solid fa-user-plus me-2"></i> {t('menu_login')}
        </button>
        <button
          onClick={() => navigate('auth')}
          className="btn btn-outline-primary btn-lg"
        >
          <i className="fa-solid fa-right-to-bracket me-2"></i> {t('menu_login')}
        </button>
      </div>
    );
  };

  return (
    <section id="view-landing" className="view-panel active animate__animated animate__fadeIn">
      <div className="hero-section container-fluid">
        <div className="row align-items-center px-4">
          <div className="col-lg-7">
            <span className="hero-tag">{t('hero_tag')}</span>
            <h1 className="hero-title">
              {t('hero_title_1')}<br />
              {language === 'en' ? 'Delivering ' : ''}<span>{t('hero_title_span')}</span>
            </h1>
            <p className="text-muted fs-5 mb-4 max-w-600">
              {t('hero_desc')}
            </p>
            {renderCtas()}
          </div>
          <div className="col-lg-5 d-none d-lg-block text-center">
            <div className="position-relative d-inline-block animate__animated animate__zoomIn">
              <div className="hero-glass-frame p-3 rounded-4 shadow-lg bg-white bg-opacity-10 border border-white border-opacity-20" style={{ backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}>
                <img
                  src="/images/crop_market.png"
                  alt="Indian Farming Prosperous Network"
                  className="img-fluid rounded-4 shadow"
                  style={{ maxHeight: '350px', objectFit: 'cover', border: '4px solid #fff' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Cards Showcase */}
      <div className="container-fluid py-4">
        <h2 className="font-heading mb-4 text-center fw-bold">{t('hub_title')}</h2>
        <div className="row">
          {/* Card 1 */}
          <div className="col-md-6 col-lg-3 mb-4">
            <div className="card card-hover h-100 border-0 glass-card overflow-hidden cursor-pointer" onClick={() => navigate('crops')}>
              <div className="position-relative" style={{ height: '160px', overflow: 'hidden' }}>
                <img
                  src="/images/crop_market.png"
                  alt="Crop Marketplace"
                  className="w-100 h-100 feature-card-img"
                  style={{ objectFit: 'cover', transition: 'transform 0.5s ease' }}
                />
                <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.6) 100%)' }}></div>
                <div className="position-absolute bottom-0 start-0 p-3">
                  <span className="badge bg-success text-white px-2.5 py-1" style={{ borderRadius: '10px', fontSize: '0.65rem', fontWeight: 'bold' }}>{t('direct_trade')}</span>
                </div>
              </div>
              <div className="p-4 text-start">
                <h4 className="font-heading fw-bold fs-5 mb-2 text-success">
                  <i className="fa-solid fa-wheat-awn me-2"></i>{t('card_crops_title')}
                </h4>
                <p className="text-muted small mb-0">{t('card_crops_desc')}</p>
              </div>
            </div>
          </div>
          {/* Card 2 */}
          <div className="col-md-6 col-lg-3 mb-4">
            <div className="card card-hover h-100 border-0 glass-card overflow-hidden cursor-pointer" onClick={() => navigate('tractors')}>
              <div className="position-relative" style={{ height: '160px', overflow: 'hidden' }}>
                <img
                  src="/images/tractor_rental.png"
                  alt="Tractor Rental"
                  className="w-100 h-100 feature-card-img"
                  style={{ objectFit: 'cover', transition: 'transform 0.5s ease' }}
                />
                <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.6) 100%)' }}></div>
                <div className="position-absolute bottom-0 start-0 p-3">
                  <span className="badge bg-warning text-dark px-2.5 py-1" style={{ borderRadius: '10px', fontSize: '0.65rem', fontWeight: 'bold' }}>{t('standard_rates')}</span>
                </div>
              </div>
              <div className="p-4 text-start">
                <h4 className="font-heading fw-bold fs-5 mb-2 text-warning">
                  <i className="fa-solid fa-tractor me-2"></i>{t('card_tractors_title')}
                </h4>
                <p className="text-muted small mb-0">{t('card_tractors_desc')}</p>
              </div>
            </div>
          </div>
          {/* Card 3 */}
          <div className="col-md-6 col-lg-3 mb-4">
            <div className="card card-hover h-100 border-0 glass-card overflow-hidden cursor-pointer" onClick={() => navigate('labors')}>
              <div className="position-relative" style={{ height: '160px', overflow: 'hidden' }}>
                <img
                  src="/images/labor_group.png"
                  alt="Hire Labor Groups"
                  className="w-100 h-100 feature-card-img"
                  style={{ objectFit: 'cover', transition: 'transform 0.5s ease' }}
                />
                <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.6) 100%)' }}></div>
                <div className="position-absolute bottom-0 start-0 p-3">
                  <span className="badge bg-info text-white px-2.5 py-1" style={{ borderRadius: '10px', fontSize: '0.65rem', fontWeight: 'bold' }}>{t('verified_crews')}</span>
                </div>
              </div>
              <div className="p-4 text-start">
                <h4 className="font-heading fw-bold fs-5 mb-2 text-info">
                  <i className="fa-solid fa-people-group me-2"></i>{t('card_labors_title')}
                </h4>
                <p className="text-muted small mb-0">{t('card_labors_desc')}</p>
              </div>
            </div>
          </div>
          {/* Card 4 */}
          <div className="col-md-6 col-lg-3 mb-4">
            <div className="card card-hover h-100 border-0 glass-card overflow-hidden cursor-pointer" onClick={() => navigate('agroservices')}>
              <div className="position-relative" style={{ height: '160px', overflow: 'hidden' }}>
                <img
                  src="/images/borewell_repair.png"
                  alt="Agro Services"
                  className="w-100 h-100 feature-card-img"
                  style={{ objectFit: 'cover', transition: 'transform 0.5s ease' }}
                />
                <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.6) 100%)' }}></div>
                <div className="position-absolute bottom-0 start-0 p-3">
                  <span className="badge bg-danger text-white px-2.5 py-1" style={{ borderRadius: '10px', fontSize: '0.65rem', fontWeight: 'bold' }}>{t('expert_technical')}</span>
                </div>
              </div>
              <div className="p-4 text-start">
                <h4 className="font-heading fw-bold fs-5 mb-2 text-danger">
                  <i className="fa-solid fa-wrench me-2"></i>{t('card_services_title')}
                </h4>
                <p className="text-muted small mb-0">{t('card_services_desc')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default LandingView;
