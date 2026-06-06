import { Link, useLocation } from 'react-router-dom';
import './css/Navbar.css';

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <span className="navbar__brand">Invoice Manager</span>
      <div className="navbar__links">
        <Link
          to="/"
          className={`navbar__link ${location.pathname === '/' ? 'navbar__link--active' : ''}`}
        >
          Invoices
        </Link>
        <Link
          to="/summary"
          className={`navbar__link ${location.pathname === '/summary' ? 'navbar__link--active' : ''}`}
        >
          Summary
        </Link>
      </div>
    </nav>
  );
}