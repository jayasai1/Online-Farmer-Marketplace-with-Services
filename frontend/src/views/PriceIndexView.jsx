import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Chart, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

const PriceIndexView = () => {
  const { showAlert, t } = useAuth();
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search/Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const [selectedItem, setSelectedItem] = useState(null);

  const canvasRef = useRef(null);
  const chartInstanceRef = useRef(null);

  const translateUnit = (unit) => {
    const key = 'unit_' + unit;
    const val = t(key);
    return val === key ? unit : val;
  };

  const fetchPrices = async () => {
    setLoading(true);
    try {
      const url = `/api/prices?search=${encodeURIComponent(search)}&category=${category}`;
      const res = await fetch(url);
      const data = await res.json();
      setPrices(data);

      // Default select first item if available
      if (data.length > 0 && !selectedItem) {
        setSelectedItem(data[0]);
      }
    } catch (err) {
      showAlert('danger', 'Error loading price index.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, [search, category]);

  // Effect to render or update Chart.js when selectedItem changes
  useEffect(() => {
    if (!selectedItem || !canvasRef.current) return;

    // Destroy existing chart if it exists
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    
    // Generate months label (e.g. past 6 months)
    const labels = ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'Today'];

    // Retrieve theme colors
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const gridColor = isDark ? '#1b2e23' : '#e2e8f0';
    const textColor = isDark ? '#94a3b8' : '#64748b';

    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: `${selectedItem.name} (₹)`,
          data: selectedItem.history,
          borderColor: '#2ecc71',
          backgroundColor: 'rgba(46, 204, 113, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.3,
          pointBackgroundColor: '#d9a036',
          pointBorderColor: '#ffffff',
          pointRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            grid: { color: gridColor },
            ticks: { color: textColor }
          },
          y: {
            grid: { color: gridColor },
            ticks: { color: textColor }
          }
        }
      }
    });

    // Cleanup on unmount or item update
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [selectedItem]);

  const selectItem = (priceItem) => {
    setSelectedItem(priceItem);
  };

  return (
    <section id="view-prices" className="view-panel active animate__animated animate__fadeIn">
      <div className="mb-4">
        <h2 className="font-heading mb-1 fw-bold">{t('price_index_header')}</h2>
        <p className="text-muted">{t('price_index_sub')}</p>
      </div>

      <div className="row">
        {/* Left: Table Comparison */}
        <div className="col-lg-7 mb-4">
          <div className="card border-0 glass-card p-4 shadow h-100">
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
              <h5 className="font-heading fw-bold mb-0">{t('price_directory')}</h5>
              <div className="d-flex gap-2">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="form-control form-control-sm border-0 bg-light"
                  placeholder={t('search_item')}
                  style={{ borderRadius: '8px', width: '140px' }}
                />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="form-select form-select-sm border-0 bg-light"
                  style={{ borderRadius: '8px' }}
                >
                  <option value="all">{t('opt_all')}</option>
                  <option value="seeds">{t('opt_seeds')}</option>
                  <option value="pesticides">{t('opt_pesticides')}</option>
                  <option value="fertilizers">{t('opt_fertilizers')}</option>
                </select>
              </div>
            </div>
            
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-success" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : prices.length === 0 ? (
              <div className="text-center py-5 text-muted">No items match your search filters.</div>
            ) : (
              <div className="table-responsive">
                <table className="table custom-table">
                  <thead>
                    <tr>
                      <th>{t('col_product_name')}</th>
                      <th>{t('col_todays_rate')}</th>
                      <th>{t('col_last_month')}</th>
                      <th>{t('col_change')}</th>
                      <th className="text-end">{t('col_action')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prices.map((price) => {
                      let trendBadge = null;
                      if (price.trend === 'up') {
                        trendBadge = <span className="trend-pill trend-up"><i className="fa-solid fa-arrow-trend-up"></i> +{price.changePercent}%</span>;
                      } else if (price.trend === 'down') {
                        trendBadge = <span className="trend-pill trend-down"><i className="fa-solid fa-arrow-trend-down"></i> {price.changePercent}%</span>;
                      } else {
                        trendBadge = <span className="trend-pill bg-light text-secondary"><i className="fa-solid fa-minus"></i> {t('stable')}</span>;
                      }

                      const isCurrent = selectedItem && selectedItem.id === price.id ? 'table-success' : '';

                      return (
                        <tr
                          key={price.id}
                          className={`cursor-pointer ${isCurrent}`}
                          onClick={() => selectItem(price)}
                        >
                          <td>
                            <div className="fw-bold text-main">{price.name}</div>
                            <span className="badge bg-light text-muted border text-capitalize" style={{ fontSize: '0.7rem' }}>
                              {t('opt_' + price.category)}
                            </span>
                          </td>
                          <td className="fw-bold">
                            ₹{price.currentPrice} <span className="text-muted small" style={{ fontWeight: 'normal' }}>/ {translateUnit(price.unit)}</span>
                          </td>
                          <td>₹{price.lastMonthPrice} / {translateUnit(price.unit)}</td>
                          <td>{trendBadge}</td>
                          <td className="text-end">
                            <button className="btn btn-sm btn-outline-success">
                              <i className="fa-solid fa-chart-line"></i> {t('view_trend')}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right: Line Chart Visualization */}
        <div className="col-lg-5 mb-4">
          <div className="card border-0 glass-card p-4 shadow h-100 d-flex flex-column justify-content-between">
            {selectedItem ? (
              <div>
                <h5 className="font-heading fw-bold mb-1">{selectedItem.name}</h5>
                <p className="text-muted small mb-3">{t('rate_movements')} {translateUnit(selectedItem.unit)} {t('over_six_months')}</p>
              </div>
            ) : (
              <div>
                <h5 className="font-heading fw-bold mb-1">{t('select_item')}</h5>
                <p className="text-muted small mb-3">{t('click_view_trend')}</p>
              </div>
            )}
            
            {/* Graph Wrapper */}
            <div className="flex-grow-1 d-flex align-items-center justify-content-center" style={{ minHeight: '250px', maxHeight: '350px', position: 'relative' }}>
              <canvas ref={canvasRef} id="priceTrendChartCanvas"></canvas>
            </div>

            <div className="mt-3 p-3 bg-light rounded-3 text-muted small border text-dark">
              <i className="fa-solid fa-lightbulb text-warning me-1"></i>
              <span>
                <strong>{t('market_tip')}:</strong> {t('market_tip_desc')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PriceIndexView;
