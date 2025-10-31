import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Store, LayoutDashboard, TrendingUp } from 'lucide-react';
import AdminDashboard from './pages/AdminDashboard';
import ViewerPage from './pages/ViewerPage';
import './App.css';

function App() {
  const location = useLocation();

  return (
    <div className="app">
      <nav className="navbar">
        <div className="container">
          <div className="nav-content">
            <div className="nav-brand">
              <Store size={28} />
              <span>Live Commerce</span>
            </div>
            <div className="nav-links">
              <Link 
                to="/" 
                className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}
              >
                <LayoutDashboard size={18} />
                Admin
              </Link>
              <Link 
                to="/viewer" 
                className={location.pathname === '/viewer' ? 'nav-link active' : 'nav-link'}
              >
                <TrendingUp size={18} />
                Live Shop
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/viewer" element={<ViewerPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
