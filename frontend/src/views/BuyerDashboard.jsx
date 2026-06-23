import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const BuyerDashboard = () => {
  const { navigate, showAlert, t } = useAuth();
  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const translateUnit = (unit) => {
    const key = 'unit_' + unit;
    const val = t(key);
    return val === key ? unit : val;
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Fetch my purchased crop orders
      const ordersRes = await fetch('/api/crops?myOrders=true');
      const ordersData = await ordersRes.json();
      setOrders(Array.isArray(ordersData) ? ordersData : []);

      // 2. Fetch my hired service bookings
      const bookingsRes = await fetch('/api/services?bookings=true');
      const bookingsData = await bookingsRes.json();
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
    } catch (err) {
      showAlert('danger', 'Error loading buyer dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Filter service bookings
  const tractorsBooked = bookings.filter(b => b.serviceType === 'tractor');
  const laborsBooked = bookings.filter(b => b.serviceType === 'labor');
  const agroBooked = bookings.filter(b => b.serviceType === 'agroservice');

  // Aggregated stat values
  const totalPurchasesValue = orders.reduce((sum, order) => sum + order.totalCost, 0);

  return (
    <section id="view-buyer-dashboard" className="view-panel active animate__animated animate__fadeIn">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <h2 className="font-heading mb-1 fw-bold">{t('buyer_portal')}</h2>
          <p className="text-muted mb-0">{t('buyer_subtitle')}</p>
        </div>
        <button className="btn btn-outline-primary" onClick={() => navigate('crops')}>
          <i className="fa-solid fa-shopping-basket me-1"></i> {t('browse_market')}
        </button>
      </div>

      {/* Stats Summary Row */}
      <div className="stats-grid">
        <div className="card border-0 glass-card stat-card shadow">
          <div className="stat-info">
            <h5 className="text-uppercase text-muted">{t('purchases_value')}</h5>
            <h2 className="text-success fw-bold">₹{totalPurchasesValue.toLocaleString()}</h2>
          </div>
          <div className="stat-icon icon-emerald">
            <i className="fa-solid fa-wallet"></i>
          </div>
        </div>
        <div className="card border-0 glass-card stat-card shadow">
          <div className="stat-info">
            <h5 className="text-uppercase text-muted">{t('active_orders')}</h5>
            <h2 className="text-warning fw-bold">{orders.length}</h2>
          </div>
          <div className="stat-icon icon-gold">
            <i className="fa-solid fa-box-open"></i>
          </div>
        </div>
        <div className="card border-0 glass-card stat-card shadow">
          <div className="stat-info">
            <h5 className="text-uppercase text-muted">{t('tractor_rentals')}</h5>
            <h2 className="text-primary fw-bold">{tractorsBooked.length}</h2>
          </div>
          <div className="stat-icon icon-blue">
            <i className="fa-solid fa-tractor"></i>
          </div>
        </div>
        <div className="card border-0 glass-card stat-card shadow">
          <div className="stat-info">
            <h5 className="text-uppercase text-muted">{t('bookings_count')}</h5>
            <h2 className="text-danger fw-bold">{laborsBooked.length + agroBooked.length}</h2>
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
          {/* Left Column: Purchased Crop Orders */}
          <div className="col-lg-7 mb-4">
            <div className="card border-0 glass-card p-4 shadow h-100">
              <h5 className="font-heading fw-bold mb-3">
                <i className="fa-solid fa-truck-ramp-box text-success me-2"></i> {t('my_purchases')}
              </h5>
              <div className="table-responsive">
                <table className="table custom-table">
                  <thead>
                    <tr>
                      <th>{t('col_order_id')}</th>
                      <th>{t('col_crop_details')}</th>
                      <th>{t('col_purchased_qty')}</th>
                      <th>{t('col_total_cost')}</th>
                      <th>{t('col_status')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center text-muted py-3">{t('no_purchases_recorded')}</td>
                      </tr>
                    ) : (
                      orders.map((o) => (
                        <tr key={o.orderId}>
                          <td className="fw-bold text-dark">{o.orderId}</td>
                          <td>
                            <div className="text-main fw-bold">{o.cropName}</div>
                            <small className="text-muted">{t('by')}: {o.seller}</small>
                          </td>
                          <td>{o.quantity} {translateUnit(o.unit)}</td>
                          <td className="fw-bold text-success">₹{o.totalCost.toLocaleString()}</td>
                          <td>
                            <span className="badge bg-success text-white px-2.5 py-1.5" style={{ borderRadius: '10px' }}>
                              {o.status}
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

          {/* Right Column: Rented Tractors & Booked Workers & Repair Logs */}
          <div className="col-lg-5 mb-4">
            <div className="card border-0 glass-card p-4 shadow mb-4">
              <h5 className="font-heading fw-bold mb-3">
                <i className="fa-solid fa-tractor text-primary me-2"></i> {t('rented_tractors_logs')}
              </h5>
              <div className="table-responsive">
                <table className="table custom-table">
                  <thead>
                    <tr>
                      <th>{t('col_booking_id')}</th>
                      <th>{t('col_details')}</th>
                      <th>{t('col_duration')}</th>
                      <th>{t('col_total_cost')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tractorsBooked.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center text-muted py-2">{t('no_equipment_booked')}</td>
                      </tr>
                    ) : (
                      tractorsBooked.map((tItem) => (
                        <tr key={tItem.bookingId}>
                          <td className="fw-bold text-dark">{tItem.bookingId}</td>
                          <td>
                            <div className="text-main" style={{ fontSize: '0.85rem' }}>{tItem.tractorName}</div>
                            <small className="text-muted">{t('by')}: {tItem.owner}</small>
                          </td>
                          <td className="small">
                            {tItem.startDate}
                            <div className="fw-bold">{tItem.durationValue} {translateUnit(tItem.durationType)}</div>
                          </td>
                          <td className="fw-bold text-success">₹{tItem.totalCost.toLocaleString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card border-0 glass-card p-4 shadow">
              <h5 className="font-heading fw-bold mb-3">
                <i className="fa-solid fa-people-group text-danger me-2"></i> {t('service_bookings_labor_repairs')}
              </h5>
              <div className="table-responsive">
                <table className="table custom-table">
                  <thead>
                    <tr>
                      <th>{t('col_booking_id')}</th>
                      <th>{t('col_specialist_group')}</th>
                      <th>{t('col_duration')}</th>
                      <th>{t('col_wages_paid')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {laborsBooked.length === 0 && agroBooked.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center text-muted py-2">{t('no_workers_booked')}</td>
                      </tr>
                    ) : (
                      [...laborsBooked, ...agroBooked].map((l) => (
                        <tr key={l.bookingId}>
                          <td className="fw-bold text-dark">
                            {l.bookingId}
                            <div className="text-muted small text-capitalize" style={{ fontSize: '0.65rem' }}>
                              {t('menu_' + l.serviceType + 's') === 'menu_' + l.serviceType + 's' ? l.serviceType : t('menu_' + l.serviceType + 's')}
                            </div>
                          </td>
                          <td>
                            <div className="text-main" style={{ fontSize: '0.85rem' }}>{l.serviceName}</div>
                            {l.serviceType === 'agroservice' && (
                              <small className="text-muted">{t('by')}: {l.owner}</small>
                            )}
                          </td>
                          <td className="small">
                            {l.startDate}
                            <div className="fw-bold">{l.durationValue} {t('day')}s</div>
                          </td>
                          <td className="fw-bold text-success">₹{l.totalCost.toLocaleString()}</td>
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
    </section>
  );
};

export default BuyerDashboard;
