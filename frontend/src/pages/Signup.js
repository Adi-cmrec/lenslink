// pages/Signup.js - Signup page
import React, { useState } from 'react';

const API_URL = 'http://localhost:8000';

function Signup({ onSwitchToLogin, onSignupSuccess }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Account created successfully! Please login.');
        setTimeout(() => onSignupSuccess(), 2000);
      } else {
        setError(data.detail || 'Signup failed');
      }
    } catch (err) {
      setError('Network error. Please check if backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Join LensLink</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="John Doe"
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="your@email.com"
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength="6"
            placeholder="At least 6 characters"
          />
        </div>
        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>
      <p className="link-text" onClick={onSwitchToLogin}>
        Already have an account? Login
      </p>
    </div>
  );
}

export default Signup;

