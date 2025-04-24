import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import ActionButton from '../Common/ActionButton';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      return;
    }
    
    // Here you would normally authenticate against your backend
    // For demo purposes, we'll use a simple check
    if (username === 'admin' && password === 'admin123') {
      // Store auth state (in a real app, use proper auth tokens)
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', 'staff');
      
      // Redirect to staff dashboard
      navigate('/staff');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login to AIRA</h2>
        
        {error && <div className="login-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>
          
          <div className="form-actions">
            <ActionButton text="Login" type="default" />
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;