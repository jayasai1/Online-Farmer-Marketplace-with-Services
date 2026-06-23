import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const CropsView = () => {
  const { currentUser, navigate, showAlert, t } = useAuth();
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search/Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [organicOnly, setOrganicOnly] = useState(false);

  // Buying Modal States
  const [showModal, setShowModal] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [buyQty, setBuyQty] = useState(100);

  const translateUnit = (unit) => {
    const key = 'unit_' + unit;
    const val = t(key);
    return val === key ? unit : val;
  };

  const fetchCrops = async () => {
    setLoading(true);
    try {
      const url = `/api/crops?search=${encodeURIComponent(search)}&category=${category}&organicOnly=${organicOnly}`;
      const res = await fetch(url);
      const data = await res.json();
      setCrops(Array.isArray(data) ? data : []);
    } catch (err) {
      showAlert('danger', 'Error loading crops directory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrops();
  }, [search, category, organicOnly]);

  const openBuyModal = (cropItem) => {
    if (!currentUser) {
      showAlert('warning', t('crop_login_warning'));
      navigate('auth');
      return;
    }

    if (currentUser.role === 'farmer') {
      showAlert('danger', t('crop_farmer_warning'));
      return;
    }

    setSelectedCrop(cropItem);
    setBuyQty(Math.min(100, cropItem.quantity));
    setShowModal(true);
  };

  const handleBuySubmit = async (e) => {
    e.preventDefault();
    if (!selectedCrop) return;

    if (buyQty <= 0) {
      showAlert('danger', t('enter_valid_qty'));
      return;
    }

    if (buyQty > selectedCrop.quantity) {
      showAlert('warning', `${t('only_available') === 'only available.' ? 'Only ' : ''}${selectedCrop.quantity} ${translateUnit(selectedCrop.unit)} ${t('only_available')}`);
      return;
    }

    try {
      const res = await fetch('/api/crops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'buy',
          cropId: selectedCrop.id,
          quantity: buyQty,
          price: selectedCrop.price
        })
      });
      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        showAlert('success', `${t('success_ordered')} ${buyQty} ${translateUnit(selectedCrop.unit)} of ${selectedCrop.name}. Code: ${data.orderCode}.`);
        fetchCrops();
      } else {
        showAlert('danger', data.message || 'Purchase failed.');
      }
    } catch (err) {
      showAlert('danger', 'Server communication failure.');
    }
  };

  return (
    <section id="view-crops" className="view-panel active animate__animated animate__fadeIn">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <h2 className="font-heading mb-1 fw-bold">{t('crops_title')}</h2>
          <p className="text-muted mb-0">{t('crops_subtitle')}</p>
        </div>
      </div>

      {/* Search & Filtering Widgets */}
      <div className="card border-0 glass-card p-3 mb-4 shadow">
        <div className="row g-3 align-items-center">
          <div className="col-md-4">
            <div className="search-bar w-100 max-width-none">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('search_crops_placeholder')}
              />
            </div>
          </div>
          <div className="col-md-3">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="form-select border-0 bg-light py-2"
              style={{ borderRadius: '30px' }}
            >
              <option value="all">{t('all_categories')}</option>
              <option value="grains">{t('category_grains')}</option>
              <option value="vegetables">{t('category_vegetables')}</option>
              <option value="fruits">{t('category_fruits')}</option>
            </select>
          </div>
          <div className="col-md-3">
            <div className="form-check form-switch ms-2">
              <input
                className="form-check-input"
                type="checkbox"
                id="crop-organic-filter"
                checked={organicOnly}
                onChange={(e) => setOrganicOnly(e.target.checked)}
              />
              <label className="form-check-label fw-bold text-success" htmlFor="crop-organic-filter">
                <i className="fa-solid fa-leaf me-1"></i> {t('organic_only')}
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Crops List Grid */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (!Array.isArray(crops) || crops.length === 0) ? (
        <div className="col-12 text-center py-5">
          <i className="fa-solid fa-circle-exclamation text-muted fs-1 mb-3"></i>
          <h5 className="text-muted">{t('no_crops_found')}</h5>
        </div>
      ) : (
        <div className="row">
          {(Array.isArray(crops) ? crops : []).map((crop) => (
            <div key={crop.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card card-hover marketplace-card border-0 glass-card">
                <div className="marketplace-img-wrapper">
                  <img
                    src={crop.image}
                    alt={crop.name}
                    onError={(e) => {
                      e.target.src =
                        'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=600&auto=format&fit=crop';
                    }}
                  />
                  <span className="marketplace-category">{t('category_' + crop.category)}</span>
                </div>
                <div className="marketplace-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="marketplace-title mb-0">{crop.name}</h5>
                    {crop.isOrganic && (
                      <span className="badge-organic">
                        <i className="fa-solid fa-leaf me-1"></i>{t('organic_badge')}
                      </span>
                    )}
                  </div>
                  <div className="marketplace-seller">
                    <i className="fa-solid fa-user-circle"></i>
                    <span>
                      {t('by')} {crop.seller} ({crop.location})
                    </span>
                  </div>
                  <p className="text-muted small flex-grow-1 text-truncate-2">{crop.description}</p>
                  <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                    <div className="marketplace-price">
                      ₹{crop.price} <span>/ {translateUnit(crop.unit)}</span>
                    </div>
                    <div className="text-end">
                      <span
                        className="badge bg-light text-success border border-success d-block mb-1"
                        style={{ fontSize: '0.75rem' }}
                      >
                        {t('qty')}: {crop.quantity} {translateUnit(crop.unit)}
                      </span>
                      <button
                        onClick={() => openBuyModal(crop)}
                        className="btn btn-sm btn-primary"
                        disabled={crop.quantity <= 0}
                      >
                        <i className="fa-solid fa-shopping-cart me-1"></i> {crop.quantity <= 0 ? t('out_of_stock') : t('buy_now')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dynamic Buy Crop Modal */}
      {showModal && selectedCrop && (
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
                  <i className="fa-solid fa-cart-shopping me-2"></i> {t('purchase_crop_directly')}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <form onSubmit={handleBuySubmit}>
                <div className="modal-body p-4">
                  <div className="p-3 bg-light rounded-3 mb-4 border text-dark">
                    <h6 className="fw-bold font-heading mb-1 text-success">{selectedCrop.name}</h6>
                    <div className="small text-muted mb-1">
                      {t('grower')}: <span className="fw-bold text-dark">{selectedCrop.seller}</span>
                    </div>
                    <div className="small text-muted mb-1">
                      {t('operating_loc')}: <span className="fw-bold text-dark">{selectedCrop.location}</span>
                    </div>
                    <div className="small text-muted">
                      {t('base_price')}: <span className="fw-bold text-dark">₹{selectedCrop.price} / {translateUnit(selectedCrop.unit)}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label small fw-bold">
                      {t('qty_to_buy')} ({translateUnit(selectedCrop.unit)}):
                    </label>
                    <input
                      type="number"
                      value={buyQty}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        setBuyQty(Math.min(val, selectedCrop.quantity));
                      }}
                      className="form-control text-center fs-5"
                      min="1"
                      max={selectedCrop.quantity}
                      required
                    />
                  </div>

                  <div
                    className="p-3 rounded-3 d-flex justify-content-between align-items-center"
                    style={{ backgroundColor: 'var(--primary-light)' }}
                  >
                    <span className="fw-bold text-success">{t('total_amount_pay')}:</span>
                    <span className="fw-bold text-success fs-4">
                      ₹{(buyQty * selectedCrop.price).toLocaleString()}
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
                    <i className="fa-solid fa-circle-check me-1"></i> {t('place_order')}
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

export default CropsView;
