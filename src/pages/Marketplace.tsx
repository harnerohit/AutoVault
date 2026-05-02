import React, { useState, useMemo } from 'react';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';

// Sample car data derived from the CarDekho dataset structure
const CARS_DATA = [
  { id: 1, name: 'Maruti Swift', brand: 'Maruti', model: 'Swift', year: 2020, price: 5.2, fuel: 'Petrol', transmission: 'Manual', km: 22000, owner: 0, seats: 5, engine: 1197, power: 82, mileage: 21.2 },
  { id: 2, name: 'Hyundai i20', brand: 'Hyundai', model: 'i20', year: 2019, price: 6.8, fuel: 'Petrol', transmission: 'Manual', km: 35000, owner: 0, seats: 5, engine: 1197, power: 82, mileage: 18.6 },
  { id: 3, name: 'Honda City', brand: 'Honda', model: 'City', year: 2018, price: 8.5, fuel: 'Diesel', transmission: 'Automatic', km: 45000, owner: 1, seats: 5, engine: 1498, power: 98, mileage: 25.1 },
  { id: 4, name: 'Toyota Fortuner', brand: 'Toyota', model: 'Fortuner', year: 2021, price: 32.5, fuel: 'Diesel', transmission: 'Automatic', km: 18000, owner: 0, seats: 7, engine: 2755, power: 174, mileage: 14.4 },
  { id: 5, name: 'Maruti Baleno', brand: 'Maruti', model: 'Baleno', year: 2020, price: 5.9, fuel: 'Petrol', transmission: 'Manual', km: 28000, owner: 0, seats: 5, engine: 1197, power: 82, mileage: 22.3 },
  { id: 6, name: 'Kia Seltos', brand: 'Kia', model: 'Seltos', year: 2021, price: 14.2, fuel: 'Diesel', transmission: 'Automatic', km: 15000, owner: 0, seats: 5, engine: 1493, power: 113, mileage: 20.8 },
  { id: 7, name: 'Tata Nexon', brand: 'Tata', model: 'Nexon', year: 2022, price: 9.8, fuel: 'Petrol', transmission: 'Manual', km: 12000, owner: 0, seats: 5, engine: 1199, power: 118, mileage: 17.4 },
  { id: 8, name: 'Mahindra XUV700', brand: 'Mahindra', model: 'XUV700', year: 2022, price: 18.5, fuel: 'Diesel', transmission: 'Automatic', km: 10000, owner: 0, seats: 7, engine: 2198, power: 182, mileage: 16.0 },
  { id: 9, name: 'Volkswagen Polo', brand: 'Volkswagen', model: 'Polo', year: 2019, price: 5.4, fuel: 'Petrol', transmission: 'Manual', km: 42000, owner: 1, seats: 5, engine: 999, power: 75, mileage: 18.8 },
  { id: 10, name: 'Hyundai Creta', brand: 'Hyundai', model: 'Creta', year: 2021, price: 12.5, fuel: 'Petrol', transmission: 'Automatic', km: 20000, owner: 0, seats: 5, engine: 1497, power: 113, mileage: 16.8 },
  { id: 11, name: 'Maruti Dzire', brand: 'Maruti', model: 'Dzire', year: 2020, price: 5.8, fuel: 'Petrol', transmission: 'Automatic', km: 25000, owner: 0, seats: 5, engine: 1197, power: 82, mileage: 23.3 },
  { id: 12, name: 'Skoda Kushaq', brand: 'Skoda', model: 'Kushaq', year: 2022, price: 13.2, fuel: 'Petrol', transmission: 'Automatic', km: 8000, owner: 0, seats: 5, engine: 1498, power: 148, mileage: 15.7 },
];

const ALL_BRANDS = [...new Set(CARS_DATA.map(c => c.brand))];

const Marketplace: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [fuelFilter, setFuelFilter] = useState<string | null>(null);
  const [transmissionFilter, setTransmissionFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'year' | 'km'>('year');

  const filteredCars = useMemo(() => {
    let cars = [...CARS_DATA];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      cars = cars.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.brand.toLowerCase().includes(q) ||
        c.model.toLowerCase().includes(q)
      );
    }

    if (selectedBrand) {
      cars = cars.filter(c => c.brand === selectedBrand);
    }

    if (fuelFilter) {
      cars = cars.filter(c => c.fuel === fuelFilter);
    }

    if (transmissionFilter) {
      cars = cars.filter(c => c.transmission === transmissionFilter);
    }

    switch (sortBy) {
      case 'price-asc': cars.sort((a, b) => a.price - b.price); break;
      case 'price-desc': cars.sort((a, b) => b.price - a.price); break;
      case 'year': cars.sort((a, b) => b.year - a.year); break;
      case 'km': cars.sort((a, b) => a.km - b.km); break;
    }

    return cars;
  }, [searchQuery, selectedBrand, fuelFilter, transmissionFilter, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedBrand(null);
    setFuelFilter(null);
    setTransmissionFilter(null);
    setSortBy('year');
  };

  const miniChartData = [40, 60, 35, 85, 50, 70, 45, 90, 30, 55];

  const getCarIcon = (brand: string) => {
    const icons: Record<string, string> = {
      Maruti: '🚗', Hyundai: '🚙', Honda: '🏎️', Toyota: '🛻',
      Kia: '🚘', Tata: '🚕', Mahindra: '🚐', Volkswagen: '🏁', Skoda: '🚖',
    };
    return icons[brand] || '🚗';
  };

  return (
    <Layout>
      <div className="marketplace-page">
        <div className="marketplace-inner">
          {/* Sidebar */}
          <aside className="marketplace-sidebar animate-slide-in-left">
            {/* Filters */}
            <div className="filter-card card-bracketed">
              <div className="filter-title">
                Filters
                <span className="filter-reset" onClick={resetFilters}>Reset All</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Search */}
                <div className="form-group">
                  <label className="form-label">Search</label>
                  <input
                    className="filter-input"
                    type="text"
                    placeholder="Car name, brand..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Brand filter */}
                <div className="form-group">
                  <label className="form-label">Brand</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {ALL_BRANDS.map((brand) => {
                      const isSelected = selectedBrand === brand;
                      return (
                        <label 
                          key={brand} 
                          style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '10px', 
                            cursor: 'pointer', 
                            padding: '4px 8px',
                            background: isSelected ? 'var(--cyan-subtle)' : 'transparent',
                            borderRadius: '4px',
                            transition: 'all 0.2s',
                          }}
                          onClick={() => setSelectedBrand(isSelected ? null : brand)}
                        >
                          <div
                            style={{
                              width: '14px', height: '14px',
                              border: `1px solid ${isSelected ? 'var(--cyan)' : 'var(--border)'}`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              transition: 'all 0.2s',
                            }}
                          >
                            {isSelected && (
                              <div style={{ width: '8px', height: '8px', background: 'var(--cyan)' }}></div>
                            )}
                          </div>
                          <span style={{
                            fontFamily: 'var(--font-display)', fontSize: '0.72rem', textTransform: 'uppercase',
                            color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                          }}>
                            {brand}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Fuel filter */}
                <div className="form-group">
                  <label className="form-label">Fuel Type</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {['Petrol', 'Diesel'].map((fuel) => {
                      const isSelected = fuelFilter === fuel;
                      return (
                        <button
                          key={fuel}
                          onClick={() => setFuelFilter(isSelected ? null : fuel)}
                          style={{
                            padding: '6px 14px',
                            fontFamily: 'var(--font-display)', fontSize: '0.65rem',
                            textTransform: 'uppercase', letterSpacing: '0.06em',
                            border: '1px solid',
                            borderColor: isSelected ? 'var(--cyan)' : 'var(--border)',
                            background: isSelected ? 'rgba(0, 229, 255, 0.15)' : 'transparent',
                            color: isSelected ? 'var(--cyan)' : 'var(--text-secondary)',
                            boxShadow: isSelected ? '0 0 10px rgba(0, 229, 255, 0.1)' : 'none',
                            cursor: 'pointer', transition: 'all 0.2s',
                          }}
                        >
                          {fuel}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Transmission filter */}
                <div className="form-group">
                  <label className="form-label">Transmission</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {['Manual', 'Automatic'].map((tr) => {
                      const isSelected = transmissionFilter === tr;
                      return (
                        <button
                          key={tr}
                          onClick={() => setTransmissionFilter(isSelected ? null : tr)}
                          style={{
                            padding: '6px 14px',
                            fontFamily: 'var(--font-display)', fontSize: '0.65rem',
                            textTransform: 'uppercase', letterSpacing: '0.06em',
                            border: '1px solid',
                            borderColor: isSelected ? 'var(--cyan)' : 'var(--border)',
                            background: isSelected ? 'rgba(0, 229, 255, 0.15)' : 'transparent',
                            color: isSelected ? 'var(--cyan)' : 'var(--text-secondary)',
                            boxShadow: isSelected ? '0 0 10px rgba(0, 229, 255, 0.1)' : 'none',
                            cursor: 'pointer', transition: 'all 0.2s',
                          }}
                        >
                          {tr}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Market Flow Mini Chart */}
            <div className="filter-card" style={{ overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--cyan)' }}>Market Activity</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '6px', height: '6px', background: 'var(--green)', display: 'inline-block', boxShadow: '0 0 6px rgba(0,230,118,0.4)', animation: 'pulse-glow 2s ease-in-out infinite' }}></span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.55rem', color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Live</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '80px' }}>
                {miniChartData.map((h, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: `${h}%`,
                      background: 'rgba(0,229,255,0.15)',
                      transition: 'all 0.3s',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => { (e.target as HTMLElement).style.background = 'var(--cyan)'; }}
                    onMouseLeave={(e) => { (e.target as HTMLElement).style.background = 'rgba(0,229,255,0.15)'; }}
                  ></div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.45rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>08:00</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.45rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>16:00</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.45rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Now</span>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="marketplace-main">
            {/* Header */}
            <div className="marketplace-header animate-fade-in-up">
              <div>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '-0.02em', marginBottom: '6px' }}>
                  Market Inventory
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Listings:</span>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.8rem', fontWeight: 700, color: 'var(--cyan)' }}>{filteredCars.length}</span>
                  </div>
                  <div style={{ width: '1px', height: '12px', background: 'var(--border)' }}></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Total DB:</span>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.8rem', fontWeight: 600 }}>13,208</span>
                  </div>
                </div>
              </div>

              {/* Sort */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'price-asc' | 'price-desc' | 'year' | 'km')}
                  className="form-select"
                  style={{ width: 'auto', padding: '8px 36px 8px 12px', fontSize: '0.75rem' }}
                >
                  <option value="year">Newest First</option>
                  <option value="price-asc">Price: Low → High</option>
                  <option value="price-desc">Price: High → Low</option>
                  <option value="km">Lowest KMs</option>
                </select>
              </div>
            </div>

            {/* Car Grid */}
            <div className="car-grid">
              {filteredCars.map((car, index) => (
                <div key={car.id} className="car-card animate-fade-in-up" style={{ animationDelay: `${index * 0.05}s` }}>
                  {/* Image placeholder with icon */}
                  <div className="car-card-image">
                    <span style={{ fontSize: '4rem' }}>{getCarIcon(car.brand)}</span>
                    <div className="car-card-badge">
                      <span className={`badge ${car.owner === 0 ? 'badge-green' : 'badge-warning'}`}>
                        {car.owner === 0 ? 'First Owner' : `${car.owner} Owner`}
                      </span>
                    </div>
                    <div style={{
                      position: 'absolute', bottom: '12px', right: '12px',
                      fontFamily: 'var(--font-display)', fontSize: '0.5rem', color: 'rgba(255,255,255,0.3)',
                      letterSpacing: '0.08em',
                    }}>
                      ID: #AV-{String(car.id).padStart(3, '0')}
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="car-card-body">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                      <div>
                        <div className="car-card-name">{car.name}</div>
                        <div className="car-card-brand">{car.brand} • {car.year}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div className="car-card-price">₹{car.price}L</div>
                        <div className="car-card-price-label">Selling Price</div>
                      </div>
                    </div>

                    {/* Specs */}
                    <div className="car-card-specs">
                      <div className="car-card-spec">
                        <div className="car-card-spec-label">KMs</div>
                        <div className="car-card-spec-value">{(car.km / 1000).toFixed(0)}K</div>
                      </div>
                      <div className="car-card-spec">
                        <div className="car-card-spec-label">Fuel</div>
                        <div className="car-card-spec-value">{car.fuel}</div>
                      </div>
                      <div className="car-card-spec">
                        <div className="car-card-spec-label">Trans</div>
                        <div className="car-card-spec-value">{car.transmission === 'Manual' ? 'MT' : 'AT'}</div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="car-card-footer">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '0.85rem', color: 'var(--cyan)' }}>local_gas_station</span>
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                          {car.mileage} km/l
                        </span>
                      </div>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => navigate('/predict', { state: { car } })}
                        style={{ padding: '6px 14px', fontSize: '0.6rem' }}
                      >
                        Get Valuation
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty state */}
            {filteredCars.length === 0 && (
              <div style={{
                textAlign: 'center', padding: '80px 20px',
                background: 'var(--bg-card)', border: '1px solid var(--border)',
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: '3rem', color: 'var(--text-dim)', marginBottom: '16px', display: 'block' }}>search_off</span>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, marginBottom: '8px' }}>No cars found</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Try adjusting your filters or search query.</p>
                <button className="btn btn-secondary" style={{ marginTop: '20px' }} onClick={resetFilters}>Reset Filters</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Marketplace;
