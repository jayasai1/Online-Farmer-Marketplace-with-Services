import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const AuthView = () => {
  const { login, register, t } = useAuth();
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'
  
  // Login Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Registration Form States
  const [regRole, setRegRole] = useState('farmer'); // 'farmer' or 'buyer'
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regLocation, setRegLocation] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) return;
    await login(loginEmail, loginPassword);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!regUsername || !regEmail || !regPhone || !regLocation || !regPassword) return;
    await register(regUsername, regEmail, regPhone, regRole, regLocation, regPassword);
  };

  return (
    <section id="view-auth" className="view-panel active animate__animated animate__fadeIn">
      <div className="card border-0 glass-card auth-container shadow-lg">
        <div className="row g-0">
          <div className="col-md-5 auth-hero-pane">
            <div>
              <i className="fa-solid fa-seedling text-warning fs-1 mb-3"></i>
              <h3 className="font-heading fw-bold text-white fs-2 mb-3">{t('logo_brand')} {t('logo_sub')}</h3>
              <p className="text-light opacity-75">{t('auth_hero_desc')}</p>
            </div>
            <div className="mt-auto">
              <div className="d-flex align-items-center gap-2 mb-2">
                <i className="fa-solid fa-shield-halved text-warning"></i>
                <small className="text-white">{t('secured_payments')}</small>
              </div>
              <div className="d-flex align-items-center gap-2">
                <i className="fa-solid fa-user-check text-warning"></i>
                <small className="text-white">{t('verified_providers')}</small>
              </div>
            </div>
          </div>

          <div className="col-md-7 p-4 p-md-5 bg-surface">
            {/* Pill Navigation */}
            <ul className="nav nav-pills mb-4" role="tablist">
              <li className="nav-item flex-fill text-center" role="presentation">
                <button
                  onClick={() => setActiveTab('login')}
                  className={`nav-link w-100 border-0 ${activeTab === 'login' ? 'active' : ''}`}
                  type="button"
                >
                  {t('login_account_tab')}
                </button>
              </li>
              <li className="nav-item flex-fill text-center" role="presentation">
                <button
                  onClick={() => setActiveTab('register')}
                  className={`nav-link w-100 border-0 ${activeTab === 'register' ? 'active' : ''}`}
                  type="button"
                >
                  {t('new_reg_tab')}
                </button>
              </li>
            </ul>

            <div className="tab-content">
              {/* LOGIN PANEL */}
              {activeTab === 'login' && (
                <div className="tab-pane fade show active">
                  <h4 className="font-heading mb-3">{t('welcome_back')}</h4>
                  <p className="text-muted small mb-4">
                    {t('login_tip')}
                  </p>
                  <form onSubmit={handleLoginSubmit}>
                    <div className="mb-3">
                      <label className="form-label small fw-bold">{t('email_user')}</label>
                      <div className="input-group">
                        <span className="input-group-text"><i className="fa-solid fa-envelope"></i></span>
                        <input
                          type="email"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          className="form-control"
                          placeholder="example@agromarket.com"
                          required
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="form-label small fw-bold">{t('password_label')}</label>
                      <div className="input-group">
                        <span className="input-group-text"><i className="fa-solid fa-lock"></i></span>
                        <input
                          type="password"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          className="form-control"
                          placeholder="••••••••"
                          required
                        />
                      </div>
                    </div>
                    <button type="submit" className="btn btn-primary w-100 py-2.5">
                      <i className="fa-solid fa-right-to-bracket me-1"></i> {t('sign_in_btn')}
                    </button>
                  </form>
                </div>
              )}

              {/* REGISTRATION PANEL */}
              {activeTab === 'register' && (
                <div className="tab-pane fade show active animate__animated animate__fadeIn">
                  <h4 className="font-heading mb-3">{t('join_platform')}</h4>
                  <p className="text-muted small mb-4">{t('reg_desc')}</p>
                  
                  <form onSubmit={handleRegisterSubmit}>
                    <div className="mb-3">
                      <label className="form-label small fw-bold">{t('select_role')}</label>
                      <div className="role-selector">
                        <button
                          type="button"
                          className={`role-btn ${regRole === 'farmer' ? 'active' : ''}`}
                          onClick={() => setRegRole('farmer')}
                        >
                          <i className="fa-solid fa-tractor me-1"></i> {t('farmer_seller')}
                        </button>
                        <button
                          type="button"
                          className={`role-btn ${regRole === 'buyer' ? 'active' : ''}`}
                          onClick={() => setRegRole('buyer')}
                        >
                          <i className="fa-solid fa-store me-1"></i> {t('buyer_trader')}
                        </button>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-bold">{t('full_name')}</label>
                      <input
                        type="text"
                        value={regUsername}
                        onChange={(e) => setRegUsername(e.target.value)}
                        className="form-control"
                        placeholder="Ramesh Patel"
                        required
                      />
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label small fw-bold">{t('email_address')}</label>
                        <input
                          type="email"
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          className="form-control"
                          placeholder="ramesh@gmail.com"
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label small fw-bold">{t('mobile_no')}</label>
                        <input
                          type="tel"
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          className="form-control"
                          placeholder="+91 98765 43210"
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-bold">{t('operating_loc')}</label>
                      <input
                        type="text"
                        value={regLocation}
                        onChange={(e) => setRegLocation(e.target.value)}
                        className="form-control"
                        placeholder="Mehsana, Gujarat, IN"
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label className="form-label small fw-bold">{t('create_pwd')}</label>
                      <input
                        type="password"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="form-control"
                        placeholder="••••••••"
                        required
                      />
                    </div>

                    <button type="submit" className="btn btn-primary w-100 py-2.5">
                      <i className="fa-solid fa-user-plus me-1"></i> {t('create_acc_btn')}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuthView;
