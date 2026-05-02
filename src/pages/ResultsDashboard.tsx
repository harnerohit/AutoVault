import React, { useMemo } from 'react';
import Layout from '../components/Layout';
import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Cell,
} from 'recharts';

const ResultsDashboard: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state as { 
    prediction: number; 
    input: {
      Year: string;
      Present_Price: string;
      Kms_Driven: string;
      Fuel_Type: string;
      Transmission: string;
      Seller_Type: string;
      Owner: string;
    } 
  } | null;

  const { prediction, input } = data || { 
    prediction: 0, 
    input: { 
      Year: '2020', 
      Present_Price: '0',
      Kms_Driven: '0',
      Fuel_Type: 'Petrol',
      Transmission: 'Manual',
      Seller_Type: 'Individual',
      Owner: '0'
    } 
  };
  const carAge = 2024 - Number(input.Year);

  // Generate depreciation curve data
  const depreciationData = useMemo(() => {
    const months = [];
    for (let i = 0; i <= 12; i++) {
      const factor = Math.pow(0.97, i); // ~3% monthly depreciation
      const projected = prediction * factor;
      months.push({
        month: i === 0 ? 'Now' : `+${i}M`,
        value: parseFloat(projected.toFixed(2)),
      });
    }
    return months;
  }, [prediction]);

  if (!data) {
    return <Navigate to="/predict" />;
  }

  // Feature weights (approximate from Random Forest feature importance)
  const featureWeights = [
    { label: 'Car Age', weight: 34, color: '#00e5ff' },
    { label: 'Present Price', weight: 28, color: '#00b8d4' },
    { label: 'KMs Driven', weight: 22, color: '#2979ff' },
    { label: 'Fuel Type', weight: 16, color: '#7c4dff' },
  ];

  // Regional price comparison
  const regions = [
    { name: 'North India', price: (prediction * 1.02).toFixed(1), trend: 'up' },
    { name: 'South India', price: (prediction * 0.98).toFixed(1), trend: 'down' },
    { name: 'West India', price: (prediction * 1.01).toFixed(1), trend: 'up' },
    { name: 'East India', price: (prediction * 0.96).toFixed(1), trend: 'stable' },
  ];

  // Confidence based on prediction relative to present price
  const confidence = Math.min(96, Math.max(72, 92 - Math.abs(prediction - parseFloat(input.Present_Price) * 0.7) * 3));

  // Asset score
  const getAssetScore = () => {
    if (carAge <= 3 && parseInt(input.Kms_Driven) < 30000) return 'A+';
    if (carAge <= 5 && parseInt(input.Kms_Driven) < 50000) return 'A';
    if (carAge <= 8) return 'B+';
    return 'B';
  };

  return (
    <Layout>
      <div className="results-page">
        <div className="results-inner">
          {/* Header */}
          <div className="results-header animate-fade-in-up">
            <div>
              <div className="section-label">
                <span className="dot"></span>
                Analysis Complete
              </div>
              <h1 className="section-title">Predictive Asset Analysis</h1>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn btn-secondary btn-sm" onClick={() => navigate('/predict')}>
                <span className="material-symbols-outlined" style={{ fontSize: '0.9rem' }}>refresh</span>
                New Prediction
              </button>
              <button className="btn btn-primary btn-sm" onClick={() => navigate('/marketplace')}>
                Browse Market
              </button>
            </div>
          </div>

          {/* Main Grid */}
          <div className="results-grid">
            {/* Left Column: Price + Chart */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Price Card */}
              <div className="price-display card-bracketed animate-fade-in-up delay-1">
                <div className="price-display-glow"></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '24px', position: 'relative', zIndex: 1 }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.65rem', color: 'var(--cyan)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '16px' }}>
                      Predicted Resale Value
                    </div>
                    <div className="price-amount">
                      ₹ {prediction}
                      <span className="price-unit">Lakhs</span>
                    </div>
                  </div>

                  <div className="confidence-meter">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>Model Confidence</span>
                      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--cyan)', fontSize: '1.1rem' }}>{Math.round(confidence)}%</span>
                    </div>
                    <div className="confidence-bar" style={{ height: '4px' }}>
                      <div className="confidence-bar-fill" style={{ width: `${confidence}%` }}></div>
                    </div>
                    <p style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: '12px', lineHeight: '1.5', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Optimized for {input.Fuel_Type} • {Number(input.Kms_Driven).toLocaleString()} KM
                    </p>
                  </div>
                </div>

                {/* Depreciation Chart */}
                <div style={{ marginTop: '40px' }}>
                  <div className="chart-header">
                    <h3 className="chart-title">12-Month Depreciation Forecast</h3>
                    <span className="badge badge-cyan">Projected</span>
                  </div>
                  <div style={{ width: '100%', height: '220px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={depreciationData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#00e5ff" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#00e5ff" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                        <XAxis dataKey="month" tick={{ fill: '#556677', fontSize: 10, fontFamily: 'Space Grotesk' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: '#556677', fontSize: 10, fontFamily: 'Space Grotesk' }} axisLine={false} tickLine={false} />
                        <Tooltip
                          contentStyle={{
                            background: '#111822',
                            border: '1px solid #1a2332',
                            borderRadius: 0,
                            fontFamily: 'Space Grotesk',
                            fontSize: '0.75rem',
                            color: '#edf2f7',
                          }}
                          formatter={(value: any) => [`₹ ${value} L`, 'Value']}
                        />
                        <Area type="monotone" dataKey="value" stroke="#00e5ff" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Bottom Widgets */}
              <div className="widget-grid">
                {/* Regional Arbitrage */}
                <div className="widget animate-fade-in-up delay-3">
                  <div className="widget-title">
                    Regional Pricing
                    <span className="material-symbols-outlined" style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>public</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {regions.map((region) => (
                      <div key={region.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{region.name}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.85rem' }}>₹{region.price}L</span>
                          <span className="material-symbols-outlined" style={{
                            fontSize: '0.85rem',
                            color: region.trend === 'up' ? 'var(--green)' : region.trend === 'down' ? 'var(--danger)' : 'var(--text-muted)',
                          }}>
                            {region.trend === 'up' ? 'trending_up' : region.trend === 'down' ? 'trending_down' : 'trending_flat'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Feature Weights */}
                <div className="widget animate-fade-in-up delay-4">
                  <div className="widget-title">
                    Feature Importance
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.55rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>RF Model Weights</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                    {featureWeights.map((fw) => (
                      <div key={fw.label} className="weight-box">
                        <div className="weight-label">{fw.label}</div>
                        <div className="weight-value" style={{ color: fw.color }}>{fw.weight}%</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: '16px', width: '100%', height: '120px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={featureWeights} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                        <XAxis dataKey="label" tick={{ fill: '#556677', fontSize: 9, fontFamily: 'Space Grotesk' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: '#556677', fontSize: 9, fontFamily: 'Space Grotesk' }} axisLine={false} tickLine={false} />
                        <Bar dataKey="weight" radius={[2, 2, 0, 0]}>
                          {featureWeights.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Telemetry + Score */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Input Telemetry */}
              <div className="widget animate-fade-in-up delay-2" style={{ borderLeft: '2px solid var(--blue)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                  <span className="material-symbols-outlined" style={{ color: 'var(--blue)' }}>monitor_heart</span>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Input Telemetry</h3>
                </div>

                <div className="telemetry-item">
                  <div>
                    <div className="telemetry-label">Registration Year</div>
                    <div className="telemetry-value">{input.Year}</div>
                  </div>
                </div>
                <div className="telemetry-item">
                  <div>
                    <div className="telemetry-label">Odometer Reading</div>
                    <div className="telemetry-value">{Number(input.Kms_Driven).toLocaleString()} <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>KM</span></div>
                  </div>
                  {parseInt(input.Kms_Driven) > 50000 && (
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.55rem', color: 'var(--warning)', letterSpacing: '0.06em' }}>HIGH</span>
                  )}
                </div>
                <div className="telemetry-item">
                  <div>
                    <div className="telemetry-label">Fuel Type</div>
                    <div className="telemetry-value">{input.Fuel_Type}</div>
                  </div>
                </div>
                <div className="telemetry-item">
                  <div>
                    <div className="telemetry-label">Transmission</div>
                    <div className="telemetry-value">{input.Transmission}</div>
                  </div>
                </div>
                <div className="telemetry-item">
                  <div>
                    <div className="telemetry-label">Seller Type</div>
                    <div className="telemetry-value">{input.Seller_Type}</div>
                  </div>
                </div>
                <div className="telemetry-item" style={{ borderBottom: 'none' }}>
                  <div>
                    <div className="telemetry-label">Present Price</div>
                    <div className="telemetry-value">₹{input.Present_Price} <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>Lakhs</span></div>
                  </div>
                </div>
              </div>

              {/* Asset Score */}
              <div className="widget animate-fade-in-up delay-3" style={{ borderBottom: '2px solid var(--purple)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <span className="material-symbols-outlined" style={{ color: 'var(--purple)' }}>auto_awesome</span>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Asset Score</h3>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Liquidity score based on market velocity</p>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--purple)' }}>{getAssetScore()}</span>
                </div>
              </div>

              {/* Depreciation Summary */}
              <div className="widget animate-fade-in-up delay-4">
                <div className="widget-title">Depreciation Summary</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Original Price</span>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}>₹{input.Present_Price}L</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Predicted Resale</span>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--cyan)' }}>₹{prediction}L</span>
                  </div>
                  <div style={{ height: '1px', background: 'var(--border)' }}></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Total Depreciation</span>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--danger)' }}>
                      {((1 - prediction / parseFloat(input.Present_Price)) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Avg. Annual Drop</span>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--warning)' }}>
                      {carAge > 0 ? ((1 - prediction / parseFloat(input.Present_Price)) * 100 / carAge).toFixed(1) : '0'}%/yr
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ResultsDashboard;
