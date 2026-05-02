import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'AI Predictor', path: '/predict' },
    { name: 'Marketplace', path: '/marketplace' },
  ];

  return (
    <div className="app-layout">
      {/* Navigation */}
      <header className="navbar">
        <Link to="/" className="navbar-brand">
          <span className="brand-dot"></span>
          AutoVault
        </Link>

        <nav className={`navbar-nav ${isMobileMenuOpen ? 'mobile-nav-active' : ''}`}>
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="navbar-actions">
          <span className="material-symbols-outlined navbar-icon">notifications</span>
          <span className="material-symbols-outlined navbar-icon">settings</span>
          <Link to="/predict" className="btn btn-primary btn-sm">
            Get Valuation
          </Link>
        </div>

        <button 
          className="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span className="material-symbols-outlined">
            {isMobileMenuOpen ? 'close' : 'menu'}
          </span>
        </button>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {children}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-inner">
          <div>
            <div className="footer-brand">AutoVault</div>
            <div className="footer-copy">
              © 2024 AutoVault AI Systems. Powered by Machine Learning.
            </div>
          </div>
          <div className="footer-links">
            <a className="footer-link" href="#">Privacy Policy</a>
            <a className="footer-link" href="#">Terms of Service</a>
            <a className="footer-link" href="#">API Docs</a>
            <a className="footer-link" href="#">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
