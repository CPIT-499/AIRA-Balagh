import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import MessageForm from './components/User/MessageForm';
import StaffDashboard from './components/Staff/StaffDashboard';
import DepartmentManager from './components/Department/DepartmentManager';
import Login from './components/Auth/Login';
import './App.css';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    // Check authentication status when component mounts
    const authStatus = localStorage.getItem('isAuthenticated') === 'true';
    setIsAuthenticated(authStatus);
    
    // Add event listener for storage changes (login/logout)
    const handleStorageChange = () => {
      const authStatus = localStorage.getItem('isAuthenticated') === 'true';
      setIsAuthenticated(authStatus);
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="aira-app">
        <header className="app-header">
          <h1>AIRA - AI Routing Assistant</h1>
          <nav className="app-nav">
            <Link to="/" className="nav-link">User Form</Link>
            {isAuthenticated ? (
              <>
                <Link to="/staff" className="nav-link">Staff Dashboard</Link>
                <Link to="/departments" className="nav-link">Departments</Link>
                <button onClick={handleLogout} className="nav-link logout-btn">Logout</button>
              </>
            ) : (
              <Link to="/login" className="nav-link">Staff Login</Link>
            )}
          </nav>
        </header>
        <main className="app-content">
          <Routes>
            <Route path="/" element={<MessageForm />} />
            <Route path="/login" element={<Login />} />
            <Route path="/staff" element={
              <ProtectedRoute>
                <StaffDashboard />
              </ProtectedRoute>
            } />
            <Route path="/departments" element={
              <ProtectedRoute>
                <DepartmentManager />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
