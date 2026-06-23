import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const AgroServicesView = () => {
  const { currentUser, navigate, showAlert, t } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search/Filters
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Booking Modal States
  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [durationDays, setDurationDays] = useState(2);
  const [startDate, setStartDate] = useState('');

  const fetchServices = async () => {
    setLoading(true);
    try {
      const url = `/api/services?type=agroservice&search=${encodeURIComponent(search)}&categoryFilter=${categoryFilter}`;
      const res = await fetch(url);
      const data = await res.json();
      setServices(Array.isArray(data) ? data : []);
    } catch (err) {
      showAlert('danger', 'Error loading agro technical services.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [search, categoryFilter]);

  const openBookModal = (serviceItem) => {
    if (!currentUser) {
      showAlert('warning', t('booking_login_warning'));
      navigate('auth');
      return;
    }

    setSelectedService(serviceItem);
    setDurationDays(2);
    
    // Set tomorrow date as default
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setStartDate(tomorrow.toISOString().split('T')[0]);
    
    setShowModal(true);
  };

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    if (!selectedService) return;

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
          serviceType: 'agroservice',
          serviceId: selectedService.id,
          startDate,
          duration: durationDays,
          durationType: 'days',
          rate: selectedService.dailyRate
        })
      });
      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        showAlert('success', `${t('category_agro_tech')} Booked! Code: ${data.bookingCode}. Est. cost: ₹${data.totalCost}.`);
        navigate(currentUser.role === 'farmer' ? 'farmer-dashboard' : 'buyer-dashboard');
      } else {
        showAlert('danger', data.message || 'Booking registration failed.');
      }
    } catch (err) {
      showAlert('danger', 'Server communication failure.');
    }
  };

  const getCategoryLabel = (cat) => {
    switch (cat) {
      case 'borewell': return t('category_borewell_worker');
      case 'motor-repair': return t('category_motor_repairer');
      case 'tractor-repair': return t('category_tractor_mechanic');
      default: return t('category_agro_tech');
    }
  };

  return (
    <section id="view-agroservices" className="view-panel active animate__animated animate__fadeIn">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="font-heading mb-1 fw-bold">{t('services_title')}</h2>
          <p className="text-muted mb-0">{t('services_subtitle')}</p>
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
                placeholder={t('search_services_placeholder')}
              />
            </div>
          </div>
          <div className="col-md-4">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="form-select border-0 bg-light py-2"
              style={{ borderRadius: '30px' }}
            >
              <option value="all">{t('all_specialties')}</option>
              <option value="borewell">{t('specialty_borewell')}</option>
              <option value="motor-repair">{t('specialty_motor')}</option>
              <option value="tractor-repair">{t('specialty_tractor')}</option>
              <option value="other">{t('specialty_irrigation')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Agro Services Directory Cards */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (!Array.isArray(services) || services.length === 0) ? (
        <div className="col-12 text-center py-5">
          <i className="fa-solid fa-circle-exclamation text-muted fs-1 mb-3"></i>
          <h5 className="text-muted">{t('no_providers_found')}</h5>
        </div>
      ) : (
        <div className="row">
          {(Array.isArray(services) ? services : []).map((service) => (
            <div key={service.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card card-hover labor-card border-0 glass-card h-100 d-flex flex-column justify-content-between">
                <div className="marketplace-body">
                  <div className="labor-header">
                    <img
                      src={service.avatar}
                      alt={service.name}
                      className="labor-avatar"
                      onError={(e) => {
                        e.target.src =
                          'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=150&auto=format&fit=crop';
                      }}
                    />
                    <div>
                      <h5 className="mb-1 font-heading fw-bold">{service.name}</h5>
                      <div className="d-flex align-items-center gap-2">
                        <span className="badge bg-success-subtle text-success border border-success-subtle">
                          {getCategoryLabel(service.category)}
                        </span>
                        <div className="rating-stars small">
                          <i className="fa-solid fa-star"></i> {service.rating} ({service.reviews})
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <small className="text-muted d-block mb-1">
                      <strong>{t('menu_services')}:</strong>
                    </small>
                    <div>
                      {service.skills.map((skill) => (
                        <span key={skill} className="labor-badge-skill" style={{ backgroundColor: 'rgba(217, 160, 54, 0.1)', color: 'var(--secondary)' }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="text-muted small flex-grow-1">{service.experience}</p>

                  <div className="pt-3 border-top mt-3 d-flex justify-content-between align-items-center">
                    <div>
                      <div className="marketplace-price">
                        {service.dailyRate > 0 ? (
                          <>₹{service.dailyRate} <span style={{ fontSize: '0.75rem' }}>/ {t('day')}</span></>
                        ) : (
                          <>₹{service.serviceCharge} <span style={{ fontSize: '0.75rem' }}>{t('visit_charge_suffix')}</span></>
                        )}
                      </div>
                      <div className="text-muted small" style={{ fontSize: '0.75rem' }}>
                        <i className="fa-solid fa-location-dot"></i> {service.location}
                      </div>
                    </div>
                    <button onClick={() => openBookModal(service)} className="btn btn-sm btn-primary">
                      <i className="fa-solid fa-calendar-check me-1"></i> {t('book_expert')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Book Technical Service Modal */}
      {showModal && selectedService && (
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
                  <i className="fa-solid fa-wrench me-2"></i> {t('services_title')}
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
                    <h6 className="fw-bold font-heading mb-1 text-success">{selectedService.name}</h6>
                    <div className="small text-muted mb-1">
                      {t('lead_provider')}: <span className="fw-bold text-dark">{selectedService.providerName}</span>
                    </div>
                    <div className="small text-muted">
                      {t('base_rate')}:{' '}
                      <span className="fw-bold text-success">
                        {selectedService.dailyRate > 0
                          ? `₹${selectedService.dailyRate} / ${t('day')}`
                          : `₹${selectedService.serviceCharge} ${t('visit_charge_suffix')}`}
                      </span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold">{t('duration_days_label')}</label>
                    <input
                      type="number"
                      value={durationDays}
                      onChange={(e) => setDurationDays(parseInt(e.target.value) || 0)}
                      className="form-control"
                      min="1"
                      placeholder="2"
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
                    <span className="fw-bold text-success">{t('est_service_wages')}:</span>
                    <span className="fw-bold text-success fs-4">
                      ₹{((durationDays || 1) * (selectedService.dailyRate || selectedService.serviceCharge)).toLocaleString()}
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
                    <i className="fa-solid fa-calendar-check me-1"></i> {t('register_booking_btn')}
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

export default AgroServicesView;
