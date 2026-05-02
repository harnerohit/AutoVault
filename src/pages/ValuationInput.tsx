import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useNavigate, useLocation } from 'react-router-dom';
import API_BASE_URL from '../config';

const ValuationInput: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCondition, setSelectedCondition] = useState('Pristine');
  const [formData, setFormData] = useState({
    Year: '2020',
    Present_Price: '5.59',
    Kms_Driven: '25000',
    Fuel_Type: 'Petrol',
    Transmission: 'Manual',
    Seller_Type: 'Individual',
    Owner: '0',
  });

  useEffect(() => {
    if (location.state && location.state.car) {
      const { car } = location.state;
      setFormData({
        Year: car.year.toString(),
        Present_Price: car.price.toString(),
        Kms_Driven: car.km.toString(),
        Fuel_Type: car.fuel,
        Transmission: car.transmission,
        Seller_Type: 'Individual', // Default or from car if available
        Owner: car.owner.toString(),
      });
    } else if (location.state && location.state.carName) {
      // Handle navigation from LandingPage CTA
      // We don't have full car data, but we could potentially use the name
      console.log("Navigated from landing with car name:", location.state.carName);
    }
  }, [location.state]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePredict = async () => {
    // Basic validation
    if (!formData.Year || !formData.Present_Price || !formData.Kms_Driven) {
      setError('Please fill in all specification fields.');
      return;
    }

    if (parseFloat(formData.Present_Price) <= 0 || parseInt(formData.Kms_Driven) < 0) {
      setError('Please enter valid positive values for price and kilometers.');
      return;
    }

    setLoading(true);
    setError(null);

    // Feature engineering: car_age
    const currentYear = 2024; // Reference year used in training
    const car_age = currentYear - Number(formData.Year);

    const payload = {
      Present_Price: parseFloat(formData.Present_Price),
      Kms_Driven: parseInt(formData.Kms_Driven),
      Owner: parseInt(formData.Owner),
      car_age: car_age,
      Fuel_Type_Diesel: formData.Fuel_Type === 'Diesel' ? 1 : 0,
      Fuel_Type_Petrol: formData.Fuel_Type === 'Petrol' ? 1 : 0,
      Seller_Type_Individual: formData.Seller_Type === 'Individual' ? 1 : 0,
      Transmission_Manual: formData.Transmission === 'Manual' ? 1 : 0,
      Condition: selectedCondition,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to get prediction');

      const data = await response.json();
      navigate('/results', { state: { prediction: data.prediction, input: formData } });
    } catch (err) {
      console.error('Prediction error:', err);
      setError('Could not connect to the prediction server. Make sure the Flask API is running on port 5001.');
    } finally {
      setLoading(false);
    }
  };

  const carAge = 2024 - Number(formData.Year);

  return (
    <Layout>
      <div className="valuation-page">
        <div className="valuation-inner">
          {/* Header */}
          <div className="valuation-header animate-fade-in-up">
            <div>
              <div className="section-label">
                <span className="dot"></span>
                System Status: Active
              </div>
              <h1 className="section-title">
                {location.state?.car?.name || location.state?.carName || 'Vehicle'} Valuation Terminal
              </h1>
            </div>
            <div style={{ display: 'flex', gap: '24px' }}>
              <div style={{ background: 'var(--bg-card)', padding: '12px 20px', borderLeft: '2px solid var(--cyan)' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.55rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Model Version</div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--cyan)', fontSize: '0.9rem' }}>RF v2.5</div>
              </div>
              <div style={{ background: 'var(--bg-card)', padding: '12px 20px', borderLeft: '2px solid var(--green)' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.55rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>API Status</div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--green)', fontSize: '0.9rem' }}>Online</div>
              </div>
            </div>
          </div>

          {/* Main Grid */}
          <div className="valuation-grid">
            {/* Left: Core Specifications Form */}
            <div className="animate-fade-in-up delay-1">
              <div className="form-card card-bracketed">
                <h2 className="form-card-title">
                  <span className="dot"></span>
                  Core Specifications
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div className="form-group">
                    <label className="form-label">Manufacturing Year</label>
                    <input
                      name="Year"
                      value={formData.Year}
                      onChange={handleChange}
                      className="form-input"
                      type="number"
                      min="1990"
                      max="2024"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Present Price (Lakhs ₹)</label>
                    <input
                      name="Present_Price"
                      value={formData.Present_Price}
                      onChange={handleChange}
                      className="form-input"
                      type="number"
                      step="0.01"
                      placeholder="Ex: 5.59"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Kilometers Driven</label>
                      <input
                        name="Kms_Driven"
                        value={formData.Kms_Driven}
                        onChange={handleChange}
                        className="form-input"
                        type="number"
                        placeholder="Ex: 25000"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Fuel Type</label>
                      <select
                        name="Fuel_Type"
                        value={formData.Fuel_Type}
                        onChange={handleChange}
                        className="form-select"
                      >
                        <option value="Petrol">Petrol</option>
                        <option value="Diesel">Diesel</option>
                        <option value="CNG">CNG</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Transmission</label>
                      <select
                        name="Transmission"
                        value={formData.Transmission}
                        onChange={handleChange}
                        className="form-select"
                      >
                        <option value="Manual">Manual</option>
                        <option value="Automatic">Automatic</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Seller Type</label>
                      <select
                        name="Seller_Type"
                        value={formData.Seller_Type}
                        onChange={handleChange}
                        className="form-select"
                      >
                        <option value="Individual">Individual</option>
                        <option value="Dealer">Dealer</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Previous Owners</label>
                    <select
                      name="Owner"
                      value={formData.Owner}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="0">0 — First Hand</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3+</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Center: Vehicle Preview + Predict Button */}
            <div className="animate-fade-in-up delay-2" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="vehicle-preview">
                <img
                  className="vehicle-preview-img"
                  src="/images/hero-car-dark.png"
                  alt="Vehicle visualization"
                />
                <div className="vehicle-preview-corners"></div>

                <div className="vehicle-preview-hud">
                  <span className="badge badge-cyan" style={{ fontSize: '0.55rem' }}>
                    <span style={{ width: '4px', height: '4px', background: 'var(--cyan)', display: 'inline-block', animation: 'pulse-glow 2s ease-in-out infinite' }}></span>
                    Scan Active
                  </span>
                </div>

                <div className="vehicle-preview-overlay">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)' }}>
                      Recognition Confidence
                    </span>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--cyan)', fontSize: '0.85rem' }}>
                      98.4%
                    </span>
                  </div>
                  <div className="confidence-bar">
                    <div className="confidence-bar-fill" style={{ width: '98.4%' }}></div>
                  </div>
                </div>
              </div>

              {/* Live Summary */}
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '20px' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.65rem', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
                  Live Input Summary
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.5rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Age</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.1rem' }}>{carAge} yrs</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.5rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Fuel</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.1rem' }}>{formData.Fuel_Type}</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.5rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>KMs</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.1rem' }}>{Number(formData.Kms_Driven).toLocaleString()}</div>
                  </div>
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div style={{ background: 'rgba(255,82,82,0.08)', border: '1px solid rgba(255,82,82,0.2)', padding: '16px', color: 'var(--danger)', fontSize: '0.8rem', fontFamily: 'var(--font-body)' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '1rem', verticalAlign: 'middle', marginRight: '8px' }}>error</span>
                  {error}
                </div>
              )}

              {/* Predict Button */}
              <button
                onClick={handlePredict}
                disabled={loading}
                className="btn-predict"
              >
                <span className="material-symbols-outlined">auto_awesome</span>
                {loading ? (
                  <>
                    <span className="spinner" style={{ width: '18px', height: '18px', borderColor: 'transparent', borderTopColor: 'var(--bg-deep)' }}></span>
                    Processing...
                  </>
                ) : (
                  'Initiate Valuation'
                )}
              </button>
            </div>

            {/* Right: Condition & Meta */}
            <div className="animate-fade-in-up delay-3" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-card">
                <h2 className="form-card-title">Condition Analysis</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { name: 'Pristine', desc: 'No defects detected', icon: 'verified' },
                    { name: 'Good', desc: 'Standard wear levels', icon: 'check_circle' },
                    { name: 'Fair', desc: 'Minor maintenance needed', icon: 'info' },
                    { name: 'Poor', desc: 'Significant wear detected', icon: 'warning' },
                  ].map((cond) => {
                    const isSelected = selectedCondition === cond.name;
                    return (
                      <div
                        key={cond.name}
                        className={`condition-option ${isSelected ? 'selected' : ''}`}
                        onClick={() => setSelectedCondition(cond.name)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div>
                          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                            {cond.name}
                          </div>
                          <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            {cond.desc}
                          </div>
                        </div>
                        <span className="material-symbols-outlined" style={{ fontSize: '1.1rem', color: isSelected ? 'var(--cyan)' : 'var(--text-dim)' }}>
                          {isSelected ? 'radio_button_checked' : 'radio_button_unchecked'}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Meta info */}
                <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.55rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>ML Engine</span>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.55rem', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Random Forest v2.4</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.55rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Training Data</span>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.55rem', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>CarDekho 2024</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.55rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Features Used</span>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.55rem', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>8 Parameters</span>
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

export default ValuationInput;
