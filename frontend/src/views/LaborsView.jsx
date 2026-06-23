import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const LaborsView = () => {
  const { currentUser, navigate, showAlert, t } = useAuth();
  const [labors, setLabors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search/Filters
  const [search, setSearch] = useState('');
  const [skillFilter, setSkillFilter] = useState('all');

  // Booking Modal States
  const [showModal, setShowModal] = useState(false);
  const [selectedLabor, setSelectedLabor] = useState(null);
  const [durationDays, setDurationDays] = useState(3);
  const [startDate, setStartDate] = useState('');

  const fetchLabors = async () => {
    setLoading(true);
    try {
      const url = `/api/services?type=labor&search=${encodeURIComponent(search)}&skillFilter=${skillFilter}`;
      const res = await fetch(url);
      const data = await res.json();
      setLabors(Array.isArray(data) ? data : []);
    } catch (err) {
      showAlert('danger', 'Error loading labor directory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLabors();
  }, [search, skillFilter]);

  const openBookModal = (laborItem) => {
    if (!currentUser) {
      showAlert('warning', t('labor_login_warning'));
      navigate('auth');
      return;
    }

    setSelectedLabor(laborItem);
    setDurationDays(3);
    
    // Set tomorrow date as default
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setStartDate(tomorrow.toISOString().split('T')[0]);
    
    setShowModal(true);
  };

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    if (!selectedLabor) return;

    if (durationDays <= 0 || !startDate) {
      showAlert('danger', t('enter_duration_date'));
      return;
    }

    try {
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'book',
          serviceType: 'labor',
          serviceId: selectedLabor.id,
          startDate,
          duration: durationDays,
          durationType: 'days',
          rate: selectedLabor.dailyRate
        })
      });
      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        showAlert('success', `${t('labor_crew_hired')} Code: ${data.bookingCode}. Est. wages: ₹${data.totalCost}.`);
        navigate(currentUser.role === 'farmer' ? 'farmer-dashboard' : 'buyer-dashboard');
      } else {
        showAlert('danger', data.message || 'Labor booking failed.');
      }
    } catch (err) {
      showAlert('danger', 'Server communication failure.');
    }
  };

  return (
    <section id="view-labors" className="view-panel active animate__animated animate__fadeIn">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="font-heading mb-1 fw-bold">{t('labors_title')}</h2>
          <p className="text-muted mb-0">{t('labors_subtitle')}</p>
        </div>
      </div>

      {/* Search & Filter Widgets */}
      <div className="card border-0 glass-card p-3 mb-4 shadow">
        <div className="row g-3">
          <div className="col-md-6">
            <div className="search-bar w-100 max-width-none">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('search_labors_placeholder')}
              />
            </div>
          </div>
          <div className="col-md-4">
            <select
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              className="form-select border-0 bg-light py-2"
              style={{ borderRadius: '30px' }}
            >
              <option value="all">{t('all_skills')}</option>
              <option value="harvesting">{t('skill_harvesting')}</option>
              <option value="sowing">{t('skill_sowing')}</option>
              <option value="weeding">{t('skill_weeding')}</option>
              <option value="driving">{t('skill_driving')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Labor List Cards */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (!Array.isArray(labors) || labors.length === 0) ? (
        <div className="col-12 text-center py-5">
          <i className="fa-solid fa-circle-exclamation text-muted fs-1 mb-3"></i>
          <h5 className="text-muted">{t('no_labors_found')}</h5>
        </div>
      ) : (
        <div className="row">
          {(Array.isArray(labors) ? labors : []).map((labor) => (
            <div key={labor.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card card-hover labor-card border-0 glass-card h-100 d-flex flex-column justify-content-between">
                <div className="marketplace-body">
                  <div className="labor-header">
                    <img
                      src={labor.avatar}
                      alt={labor.name}
                      className="labor-avatar"
                      onError={(e) => {
                        e.target.src =
                          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop';
                      }}
                    />
                    <div>
                      <h5 className="mb-1 font-heading fw-bold">{labor.name}</h5>
                      <div className="d-flex align-items-center gap-2">
                        <span className="badge bg-success-subtle text-success border border-success-subtle">
                          {labor.size} {t('member_crew')}
                        </span>
                        <div className="rating-stars small">
                          <i className="fa-solid fa-star"></i> {labor.rating} ({labor.reviews})
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <small className="text-muted d-block mb-1">
                      <strong>{t('menu_services')}:</strong>
                    </small>
                    <div>
                      {labor.skills.map((skill) => (
                        <span key={skill} className="labor-badge-skill">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="text-muted small flex-grow-1">{labor.experience}</p>

                  <div className="pt-3 border-top mt-3 d-flex justify-content-between align-items-center">
                    <div>
                      <div className="marketplace-price">
                        ₹{labor.dailyRate} <span style={{ fontSize: '0.75rem' }}>/ {t('day')}</span>
                      </div>
                      <div className="text-muted small" style={{ fontSize: '0.75rem' }}>
                        <i className="fa-solid fa-location-dot"></i> {labor.location}
                      </div>
                    </div>
                    <button onClick={() => openBookModal(labor)} className="btn btn-sm btn-primary">
                      <i className="fa-solid fa-calendar-check me-1"></i> {t('book_crew')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Book Labor Modal */}
      {showModal && selectedLabor && (
        <div
          className="modal fade show"
          style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          tabIndex="-1"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content border-0 shadow-lg animate__animated animate__zoomIn animate__faster">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title font-heading fw-bold">
                  <i className="fa-solid fa-people-group me-2"></i> {t('book_farm_labor')}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <form onSubmit={handleBookSubmit}>
                <div className="modal-body p-4 text-dark">
                  <div className="p-3 bg-light rounded-3 mb-4 border">
                    <h6 className="fw-bold font-heading mb-1 text-success">{selectedLabor.name}</h6>
                    <div className="small text-muted">
                      {t('daily_wage_rate')}: <span className="fw-bold text-success">₹{selectedLabor.dailyRate} / {t('day')} {t('per_worker_group')}</span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold">{t('duration_booking_days')}</label>
                    <input
                      type="number"
                      value={durationDays}
                      onChange={(e) => setDurationDays(parseInt(e.target.value) || 0)}
                      className="form-control"
                      min="1"
                      placeholder="3"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label small fw-bold">{t('work_start_date')}</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="form-control"
                      required
                    />
                  </div>

                  <div
                    className="p-3 rounded-3 d-flex justify-content-between align-items-center"
                    style={{ backgroundColor: 'var(--primary-light)' }}
                  >
                    <span className="fw-bold text-success">{t('est_total_wages')}:</span>
                    <span className="fw-bold text-success fs-4">
                      ₹{(durationDays * selectedLabor.dailyRate).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    {t('cancel_btn')}
                  </button>
                  <button type="submit" className="btn btn-primary px-4">
                    <i className="fa-solid fa-calendar-plus me-1"></i> {t('book_group_btn')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default LaborsView;
