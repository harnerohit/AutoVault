import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ValuationInput from './pages/ValuationInput';
import ResultsDashboard from './pages/ResultsDashboard';
import Marketplace from './pages/Marketplace';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/predict" element={<ValuationInput />} />
        <Route path="/results" element={<ResultsDashboard />} />
        <Route path="/marketplace" element={<Marketplace />} />
        {/* Fallback to landing page */}
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
