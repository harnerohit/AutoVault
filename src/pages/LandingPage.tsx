import React from 'react';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [ctaInput, setCtaInput] = React.useState('');

  const features = [
    {
      icon: 'psychology',
      title: 'Neural Prediction',
      value: '95%+',
      desc: 'Accuracy powered by Random Forest ML trained on real Indian market data.',
    },
    {
      icon: 'bolt',
      title: 'Instant Results',
      value: '<1s',
      desc: 'Get your car valuation in under a second with our optimized inference engine.',
    },
    {
      icon: 'database',
      title: 'Market Data',
      value: '13K+',
      desc: 'Trained on CarDekho dataset spanning multiple brands, models, and segments.',
    },
    {
      icon: 'verified',
      title: 'Trusted Values',
      value: '₹ Lakhs',
      desc: 'Predictions calibrated to the Indian used car market in accurate Lakh values.',
    },
  ];

  const chartData = [40, 58, 35, 72, 48, 88, 62, 95, 42, 57, 82, 68];

  return (
    <Layout>
      {/* ===== HERO SECTION ===== */}
      <section className="hero">
        <div className="hero-bg">
          <img
            src="/images/hero-car-dark.png"
            alt="Sleek car on dark reflective surface"
          />
          <div className="hero-bg-overlay"></div>
          <div className="hero-bg-glow"></div>
        </div>

        <div className="hero-content">
          <div className="hero-badge">
            <span className="pulse-dot"></span>
            AI Engine Status: Operational
          </div>

          <h1 className="hero-title">
            Predict.<br />
            Value.<br />
            <span className="accent">Sell Smart.</span>
          </h1>

          <p className="hero-description">
            Harness the power of machine learning to get instant, accurate used car
            valuations. Our AI model is trained on thousands of real Indian market
            transactions for precise price predictions.
          </p>

          <div className="hero-actions">
            <button
              className="btn btn-primary btn-lg"
              onClick={() => navigate('/predict')}
            >
              <span className="material-symbols-outlined">auto_awesome</span>
              Get AI Valuation
            </button>
            <button
              className="btn btn-secondary btn-lg"
              onClick={() => navigate('/marketplace')}
            >
              Browse Marketplace
            </button>
          </div>
        </div>

        <div className="hero-stats">
          <div className="hero-stat-value">248K+</div>
          <div className="hero-stat-label">Cars Valuated</div>
        </div>
      </section>

      {/* ===== BENTO STATS GRID ===== */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="section-inner">
          <div className="section-header">
            <div className="section-label">
              <span className="dot"></span>
              Platform Intelligence
            </div>
            <h2 className="section-title">Real-Time Market Analytics</h2>
            <p className="section-subtitle">
              Live data aggregated from the Indian used car market, updated continuously.
            </p>
          </div>

          <div className="bento-grid">
            {/* Main Chart */}
            <div className="bento-item span-8 card-bracketed">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.02em', marginBottom: '6px' }}>
                    Market Price Trends
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Aggregated resale price index across all segments
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span className="badge badge-cyan">
                    <span className="pulse-dot" style={{ width: '4px', height: '4px' }}></span>
                    Live
                  </span>
                </div>
              </div>

              <div className="bar-chart">
                {chartData.map((height, i) => (
                  <div
                    key={i}
                    className={`bar ${i === 7 ? 'active' : ''}`}
                    style={{ height: `${height}%` }}
                  ></div>
                ))}
              </div>
            </div>

            {/* Accuracy Stat */}
            <div className="bento-item span-4 card-bracketed">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '2rem', color: 'var(--cyan)' }}>psychology</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', background: 'var(--green)', display: 'inline-block', boxShadow: '0 0 8px rgba(0,230,118,0.4)' }}></span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.55rem', color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Optimal</span>
                </div>
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '8px' }}>
                95.8%
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Model R² Score
              </div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '20px', lineHeight: '1.6' }}>
                Random Forest Regressor v2.4 with hyperparameter tuning across 5-fold cross-validation.
              </p>
            </div>

            {/* Feature Cards */}
            {features.map((feature, i) => (
              <div 
                key={i} 
                className="bento-item span-3" 
                style={{ cursor: 'pointer' }}
                onClick={() => navigate('/predict')}
              >
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'rgba(0,229,255,0.03)',
                  opacity: 0,
                  transition: 'opacity 0.3s',
                  pointerEvents: 'none',
                }} className="hover-overlay"></div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.6rem', color: 'var(--cyan)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '12px' }}>
                  {feature.title}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '8px' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 700 }}>{feature.value}</span>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="cta-section">
        <div className="cta-bg-image">
          <img src="/images/tech-bg.png" alt="" />
        </div>

        <div className="section-inner">
          <div className="cta-content">
            <h2 className="cta-title">Ready to know your car's worth?</h2>
            <p className="cta-text">
              Enter your car details and our AI model will analyze market trends, depreciation
              curves, and comparable sales to give you an accurate valuation.
            </p>
            <div className="cta-input-row">
              <input
                className="cta-input"
                placeholder="Enter car name or model..."
                type="text"
                value={ctaInput}
                onChange={(e) => setCtaInput(e.target.value)}
              />
              <button
                className="cta-submit"
                onClick={() => navigate('/predict', { state: { carName: ctaInput } })}
              >
                Valuate
              </button>
            </div>
            <div className="cta-status">
              <span className="dot"></span>
              Awaiting input — AI model ready
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default LandingPage;
