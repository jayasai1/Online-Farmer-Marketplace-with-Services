import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const TractorsView = () => {
  const { currentUser, navigate, showAlert, t } = useAuth();
  const [tractors, setTractors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search/Filters
  const [search, setSearch] = useState('');
  const [hpFilter, setHpFilter] = useState('all');

  // Booking Modal States
  const [showModal, setShowModal] = useState(false);
  const [selectedTractor, setSelectedTractor] = useState(null);
  const [durationType, setDurationType] = useState('hours'); // 'hours' or 'days'
  const [durationVal, setDurationVal] = useState(4);
  const [startDate, setStartDate] = useState('');

  const translateUnit = (unit) => {
    const key = 'unit_' + unit;
    const val = t(key);
    return val === key ? unit : val;
  };

  const fetchTractors = async () => {
    setLoading(true);
    try {
      const url = `/api/services?type=tractor&search=${encodeURIComponent(search)}&hpFilter=${hpFilter}`;
      const res = await fetch(url);
      const data = await res.json();
      setTractors(Array.isArray(data) ? data : []);
    } catch (err) {
      showAlert('danger', 'Error loading machinery rentals.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTractors();
  }, [search, hpFilter]);

  const openRentModal = (tractorItem) => {
    if (!currentUser) {
      showAlert('warning', t('tractor_login_warning'));
      navigate('auth');
      return;
    }

    setSelectedTractor(tractorItem);
    setDurationType('hours');
    setDurationVal(4);
    
    // Set default tomorrow date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setStartDate(tomorrow.toISOString().split('T')[0]);
    
    setShowModal(true);
  };

  const handleRentSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTractor) return;

    if (durationVal <= 0 || !startDate) {
      showAlert('danger', t('enter_duration_date'));
      return;
    }

    const rate = durationType === 'hours' ? selectedTractor.rentPerHour : selectedTractor.rentPerDay;

    try {
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'book',
          serviceType: 'tractor',
          serviceId: selectedTractor.id,
          startDate,
          duration: durationVal,
          durationType,
          rate
        })
      });
      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        showAlert('success', `${t('tractor_reserved')} Code: ${data.bookingCode}. Est. cost: ₹${data.totalCost}.`);
        navigate(currentUser.role === 'farmer' ? 'farmer-dashboard' : 'buyer-dashboard');
      } else {
        showAlert('danger', data.message || 'Machinery reservation failed.');
      }
    } catch (err) {
      showAlert('danger', 'Server communication failure.');
    }
  };

  const calculateTotal = () => {
    if (!selectedTractor) return 0;
    const rate = durationType === 'hours' ? selectedTractor.rentPerHour : selectedTractor.rentPerDay;
    return durationVal * rate;
  };

  return (
    <section id="view-tractors" className="view-panel active animate__animated animate__fadeIn">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="font-heading mb-1 fw-bold">{t('tractors_title')}</h2>
          <p className="text-muted mb-0">{t('tractors_subtitle')}</p>
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
                placeholder={t('search_tractors_placeholder')}
              />
            </div>
          </div>
          <div className="col-md-4">
            <select
              value={hpFilter}
              onChange={(e) => setHpFilter(e.target.value)}
              className="form-select border-0 bg-light py-2"
              style={{ borderRadius: '30px' }}
            >
              <option value="all">{t('all_hp')}</option>
              <option value="low">{t('low_hp')}</option>
              <option value="high">{t('high_hp')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tractor Cards Grid */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (!Array.isArray(tractors) || tractors.length === 0) ? (
        <div className="col-12 text-center py-5">
          <i className="fa-solid fa-circle-exclamation text-muted fs-1 mb-3"></i>
          <h5 className="text-muted">{t('no_tractors_found')}</h5>
        </div>
      ) : (
        <div className="row">
          {(Array.isArray(tractors) ? tractors : []).map((tractor) => (
            <div key={tractor.id} className="col-md-6 mb-4">
              <div className="card card-hover marketplace-card border-0 glass-card">
                <div className="row g-0">
                  <div className="col-sm-5 marketplace-img-wrapper" style={{ height: '100%', minHeight: '220px' }}>
                    <img
                      src={tractor.image}
                      alt={tractor.name}
                      className="h-100 w-100"
                      style={{ objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.src =
                          'https://images.unsplash.com/photo-1595246140625-573b715d11dc?q=80&w=600&auto=format&fit=crop';
                      }}
                    />
                  </div>
                  <div className="col-sm-7 d-flex flex-column">
                    <div className="marketplace-body">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="marketplace-title mb-0">{tractor.name}</h5>
                        <div className="rating-stars">
                          <i className="fa-solid fa-star"></i> {tractor.rating}
                        </div>
                      </div>
                      <div className="marketplace-seller mb-2">
                        <i className="fa-solid fa-tractor"></i>
                        <span>
                          {t('by')} {tractor.owner} ({tractor.location})
                        </span>
                      </div>
                      
                      <div className="spec-grid">
                        {Object.entries(tractor.specifications).map(([key, val]) => (
                          <div key={key} className="spec-item">
                            <i className="fa-solid fa-circle-check"></i>
                            <span>
                              <strong>{key}:</strong> {val}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="d-flex justify-content-between align-items-center mt-auto pt-3 border-top">
                        <div className="marketplace-price">
                          ₹{tractor.rentPerHour} <span style={{ fontSize: '0.75rem' }}>/ {t('hour')}</span>
                          <div className="text-muted" style={{ fontSize: '0.75rem', fontWeight: 'normal' }}>
                            {t('or')} ₹{tractor.rentPerDay} / {t('day')}
                          </div>
                        </div>
                        <button onClick={() => openRentModal(tractor)} className="btn btn-sm btn-primary">
                          <i className="fa-solid fa-key me-1"></i> {t('rent_now')}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rent Tractor Booking Modal */}
      {showModal && selectedTractor && (
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
                  <i className="fa-solid fa-key me-2"></i> {t('rent_machinery_booking')}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <form onSubmit={handleRentSubmit}>
                <div className="modal-body p-4 text-dark">
                  <div className="p-3 bg-light rounded-3 mb-4 border">
                    <h6 className="fw-bold font-heading mb-1 text-success">{selectedTractor.name}</h6>
                    <div className="small text-muted mb-2">
                      {t('by')}: <span className="fw-bold text-dark">{selectedTractor.owner} ({selectedTractor.location})</span>
                    </div>
                    <div className="small text-muted">
                      {t('base_price')}: <span className="fw-bold text-success">₹{selectedTractor.rentPerHour}/hr | ₹{selectedTractor.rentPerDay}/day</span>
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">{t('rent_duration_type')}</label>
                      <select
                        value={durationType}
                        onChange={(e) => {
                          setDurationType(e.target.value);
                          setDurationVal(e.target.value === 'hours' ? 4 : 1);
                        }}
                        className="form-select"
                      >
                        <option value="hours">{t('hourly_hire')}</option>
                        <option value="days">{t('daily_lease')}</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">{t('duration_qty')}</label>
                      <input
                        type="number"
                        value={durationVal}
                        onChange={(e) => setDurationVal(parseInt(e.target.value) || 0)}
                        className="form-control"
                        min="1"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label small fw-bold">{t('lease_start_date')}</label>
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
                    <span className="fw-bold text-success">{t('total_est_rent')}:</span>
                    <span className="fw-bold text-success fs-4">
                      ₹{calculateTotal().toLocaleString()}
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
                    <i className="fa-solid fa-calendar-check me-1"></i> {t('reserve_tractor')}
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

export default TractorsView;
