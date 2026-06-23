import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const FarmerDashboard = () => {
  const { currentUser, navigate, showAlert, t } = useAuth();
  const [crops, setCrops] = useState([]);
  const [sales, setSales] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Listing Form Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('grains');
  const [newPrice, setNewPrice] = useState(30);
  const [newUnit, setNewUnit] = useState('kg');
  const [newQty, setNewQty] = useState(1000);
  const [newOrganic, setNewOrganic] = useState(false);
  const [newDesc, setNewDesc] = useState('');

  const translateUnit = (unit) => {
    const key = 'unit_' + unit;
    const val = t(key);
    return val === key ? unit : val;
  };

  const translateCategory = (cat) => {
    const key = 'category_' + cat;
    const val = t(key);
    return val === key ? cat : val;
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Fetch my crop listings
      const cropsRes = await fetch('/api/crops?myListings=true');
      const cropsData = await cropsRes.json();
      setCrops(Array.isArray(cropsData) ? cropsData : []);

      // 2. Fetch my sales orders
      const salesRes = await fetch('/api/crops?mySales=true');
      const salesData = await salesRes.json();
      setSales(Array.isArray(salesData) ? salesData : []);

      // 3. Fetch hired service bookings (tractors, labors, technical repairers)
      const bookingsRes = await fetch('/api/services?bookings=true');
      const bookingsData = await bookingsRes.json();
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
    } catch (err) {
      showAlert('danger', 'Error fetching farmer dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDeleteListing = async (cropId) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      const res = await fetch('/api/crops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', cropId })
      });
      const data = await res.json();
      if (data.success) {
        showAlert('success', 'Crop listing removed successfully.');
        fetchDashboardData();
      } else {
        showAlert('danger', data.message || 'Failed to remove listing.');
      }
    } catch (err) {
      showAlert('danger', 'Delete communication error.');
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!newName || !newDesc) return;

    try {
      const res = await fetch('/api/crops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add',
          name: newName,
          category: newCategory,
          price: newPrice,
          unit: newUnit,
          quantity: newQty,
          isOrganic: newOrganic,
          description: newDesc
        })
      });
      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        showAlert('success', 'Crop listed in marketplace successfully!');
        
        // Reset Form
        setNewName('');
        setNewCategory('grains');
        setNewPrice(30);
        setNewUnit('kg');
        setNewQty(1000);
        setNewOrganic(false);
        setNewDesc('');
        
        fetchDashboardData();
      } else {
        showAlert('danger', data.message || 'Crop listing insertion failed.');
      }
    } catch (err) {
      showAlert('danger', 'Listing addition failure.');
    }
  };

  // Statistic summaries calculations
  const totalRevenue = sales.reduce((sum, order) => sum + order.totalCost, 0);
  const tractorsHiredCount = bookings.filter(b => b.serviceType === 'tractor').length;
  const laborsHiredCount = bookings.filter(b => b.serviceType === 'labor').length;
  const technicalHiredCount = bookings.filter(b => b.serviceType === 'agroservice').length;

  return (
    <section id="view-farmer-dashboard" className="view-panel active animate__animated animate__fadeIn">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <h2 className="font-heading mb-1 fw-bold">{t('farmer_portal')}</h2>
          <p className="text-muted mb-0">{t('farmer_subtitle')}</p>
        </div>
        <button className="btn btn-primary animate__animated animate__pulse animate__infinite animate__slower" onClick={() => setShowAddModal(true)}>
          <i className="fa-solid fa-circle-plus me-1"></i> {t('list_new_crop')}
        </button>
      </div>

      {/* Stats Summary Row */}
      <div className="stats-grid">
        <div className="card border-0 glass-card stat-card shadow">
          <div className="stat-info">
            <h5 className="text-uppercase text-muted">{t('menu_crops')}</h5>
            <h2 className="text-success fw-bold">{crops.length}</h2>
          </div>
          <div className="stat-icon icon-emerald">
            <i className="fa-solid fa-seedling"></i>
          </div>
        </div>
        <div className="card border-0 glass-card stat-card shadow">
          <div className="stat-info">
            <h5 className="text-uppercase text-muted">{t('revenue')}</h5>
            <h2 className="text-warning fw-bold">₹{totalRevenue.toLocaleString()}</h2>
          </div>
          <div className="stat-icon icon-gold">
            <i className="fa-solid fa-indian-rupee-sign"></i>
          </div>
        </div>
        <div className="card border-0 glass-card stat-card shadow">
          <div className="stat-info">
            <h5 className="text-uppercase text-muted">{t('machinery_leased')}</h5>
            <h2 className="text-primary fw-bold">{tractorsHiredCount}</h2>
          </div>
          <div className="stat-icon icon-blue">
            <i className="fa-solid fa-tractor"></i>
          </div>
        </div>
        <div className="card border-0 glass-card stat-card shadow">
          <div className="stat-info">
            <h5 className="text-uppercase text-muted">{t('bookings_count')}</h5>
            <h2 className="text-danger fw-bold">{laborsHiredCount + technicalHiredCount}</h2>
          </div>
          <div className="stat-icon icon-red">
            <i className="fa-solid fa-people-group"></i>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="row">
          {/* Left Column: Crop Listings & Sales */}
          <div className="col-lg-7 mb-4">
            <div className="card border-0 glass-card p-4 shadow mb-4">
              <h5 className="font-heading fw-bold mb-3">
                <i className="fa-solid fa-list-check text-success me-2"></i> {t('active_listings')}
              </h5>
              <div className="table-responsive">
                <table className="table custom-table">
                  <thead>
                    <tr>
                      <th>{t('col_crop_name')}</th>
                      <th>{t('col_category')}</th>
                      <th>{t('col_price_rate')}</th>
                      <th>{t('col_stock_left')}</th>
                      <th className="text-end">{t('col_action')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {crops.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center text-muted py-3">{t('no_active_listings')}</td>
                      </tr>
                    ) : (
                      crops.map((c) => (
                        <tr key={c.id}>
                          <td>
                            <div className="fw-bold text-main">{c.name}</div>
                            {c.isOrganic && (
                              <span className="badge bg-success-subtle text-success border border-success-subtle" style={{ fontSize: '0.65rem' }}>
                                {t('organic_badge')}
                              </span>
                            )}
                          </td>
                          <td className="text-capitalize">{translateCategory(c.category)}</td>
                          <td className="fw-bold text-success">₹{c.price} / {translateUnit(c.unit)}</td>
                          <td>{c.quantity} {translateUnit(c.unit)}</td>
                          <td className="text-end">
                            <button
                              onClick={() => handleDeleteListing(c.id)}
                              className="btn btn-sm btn-outline-danger"
                            >
                              <i className="fa-solid fa-trash-can"></i> {t('delete_btn')}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card border-0 glass-card p-4 shadow">
              <h5 className="font-heading fw-bold mb-3">
                <i className="fa-solid fa-file-invoice-dollar text-warning me-2"></i> {t('sales_orders')}
              </h5>
              <div className="table-responsive">
                <table className="table custom-table">
                  <thead>
                    <tr>
                      <th>{t('col_order_id')}</th>
                      <th>{t('col_crop_details')}</th>
                      <th>{t('col_purchased_qty')}</th>
                      <th>{t('col_revenue')}</th>
                      <th>{t('col_status')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sales.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center text-muted py-3">{t('no_sales_transacted')}</td>
                      </tr>
                    ) : (
                      sales.map((order) => (
                        <tr key={order.orderId}>
                          <td className="fw-bold text-dark">{order.orderId}</td>
                          <td>{order.cropName}</td>
                          <td>{order.quantity} {translateUnit(order.unit)}</td>
                          <td className="fw-bold text-success">₹{order.totalCost.toLocaleString()}</td>
                          <td>
                            <span className="badge bg-success text-white px-2.5 py-1.5" style={{ borderRadius: '10px' }}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column: Hired Services Tracker (Machinery, Labor, and Technical repairs!) */}
          <div className="col-lg-5 mb-4">
            <div className="card border-0 glass-card p-4 shadow h-100">
              <h5 className="font-heading fw-bold mb-3">
                <i className="fa-solid fa-handshake text-primary me-2"></i> {t('services_tracker')}
              </h5>
              <p className="text-muted small">{t('services_tracker_desc')}</p>
              <div className="table-responsive">
                <table className="table custom-table">
                  <thead>
                    <tr>
                      <th>{t('col_booking_id')}</th>
                      <th>{t('col_details')}</th>
                      <th>{t('col_duration')}</th>
                      <th>{t('col_total_cost')}</th>
                      <th>{t('col_status')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center text-muted py-3">{t('no_services_hired')}</td>
                      </tr>
                    ) : (
                      bookings.map((b) => (
                        <tr key={b.bookingId}>
                          <td>
                            <div className="fw-bold text-main">{b.bookingId}</div>
                            <span className="badge bg-light text-muted border text-capitalize" style={{ fontSize: '0.65rem' }}>
                              {t('menu_' + b.serviceType + 's') === 'menu_' + b.serviceType + 's' ? b.serviceType : t('menu_' + b.serviceType + 's')}
                            </span>
                          </td>
                          <td>
                            <div className="text-main" style={{ fontSize: '0.85rem' }}>{b.serviceName}</div>
                            <small className="text-muted">{t('by')}: {b.owner}</small>
                          </td>
                          <td className="small">
                            {b.startDate}
                            <div className="fw-bold">{b.durationValue} {translateUnit(b.durationType)}</div>
                          </td>
                          <td className="fw-bold text-success">₹{b.totalCost.toLocaleString()}</td>
                          <td>
                            <span className="badge bg-primary text-white" style={{ borderRadius: '10px' }}>
                              {b.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic List Crop Modal */}
      {showAddModal && (
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
                  <i className="fa-solid fa-wheat-awn me-2"></i> {t('list_crop_title')}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowAddModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <form onSubmit={handleAddSubmit}>
                <div className="modal-body p-4 text-dark">
                  <div className="mb-3">
                    <label className="form-label small fw-bold">{t('field_crop_title')}</label>
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="form-control"
                      placeholder={t('placeholder_crop_title')}
                      required
                    />
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label small fw-bold">{t('field_category')}</label>
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="form-select"
                      >
                        <option value="grains">{t('category_grains')}</option>
                        <option value="vegetables">{t('category_vegetables')}</option>
                        <option value="fruits">{t('category_fruits')}</option>
                        <option value="others">{t('category_others')}</option>
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <div className="form-check form-switch mt-4 pt-2">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="crop-organic-switch"
                          checked={newOrganic}
                          onChange={(e) => setNewOrganic(e.target.checked)}
                        />
                        <label className="form-check-label fw-bold text-success" htmlFor="crop-organic-switch">
                          <i className="fa-solid fa-leaf me-1"></i> {t('field_certified_organic')}
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label small fw-bold">{t('field_selling_rate')}</label>
                      <div className="input-group">
                        <span className="input-group-text">₹</span>
                        <input
                          type="number"
                          value={newPrice}
                          onChange={(e) => setNewPrice(parseFloat(e.target.value) || 0)}
                          className="form-control"
                          placeholder="30"
                          min="1"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label small fw-bold">{t('field_selling_unit')}</label>
                      <select
                        value={newUnit}
                        onChange={(e) => setNewUnit(e.target.value)}
                        className="form-select"
                      >
                        <option value="kg">{t('unit_kg')}</option>
                        <option value="quintal">{t('unit_quintal')}</option>
                        <option value="ton">{t('unit_ton')}</option>
                        <option value="box">{t('unit_box')}</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold">{t('field_stock_available')}</label>
                    <input
                      type="number"
                      value={newQty}
                      onChange={(e) => setNewQty(parseFloat(e.target.value) || 0)}
                      className="form-control"
                      placeholder="1000"
                      min="1"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold">{t('field_spec_desc')}</label>
                    <textarea
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      className="form-control"
                      rows="3"
                      placeholder={t('placeholder_spec_desc')}
                      required
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowAddModal(false)}
                  >
                    {t('cancel_btn')}
                  </button>
                  <button type="submit" className="btn btn-primary px-4">
                    <i className="fa-solid fa-circle-check me-1"></i> {t('list_yield_btn')}
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

export default FarmerDashboard;
