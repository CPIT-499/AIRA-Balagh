import { Link } from 'react-router-dom';
import './Header.css';

function Header({ isAuthenticated, onLogout, username }) {
  return (
    <header className="header">
      <div className="header-logo">
        <Link to="/">AIRA - AI Routing Assistant</Link>
      </div>
      
      <nav className="header-nav">
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <div className="user-info">
              <span className="username">{username}</span>
              <button className="logout-button" onClick={onLogout}>
                Logout
              </button>
            </div>
          </>
        ) : (
          <>
            <Link to="/" className="nav-link">Submit Ticket</Link>
            <Link to="/login" className="nav-link login-link">Staff Login</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;