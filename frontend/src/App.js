// App.js - Main application component
import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import PhotographerList from './pages/PhotographerList';
import PhotographerDetail from './pages/PhotographerDetail';

function App() {
  const [currentPage, setCurrentPage] = useState('list'); // list, login, signup, profile, detail
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [selectedPhotographerId, setSelectedPhotographerId] = useState(null);

  // Check for saved token on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (tokenData, userData) => {
    setToken(tokenData);
    setUser(userData);
    localStorage.setItem('token', tokenData);
    localStorage.setItem('user', JSON.stringify(userData));
    setCurrentPage('profile');
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentPage('list');
  };

  const viewPhotographerDetail = (photographerId) => {
    setSelectedPhotographerId(photographerId);
    setCurrentPage('detail');
  };

  return (
    <div className="App">
      {/* Header */}
      <header className="header">
        <div className="container">
          <h1 className="logo" onClick={() => setCurrentPage('list')}>
            LensLink
          </h1>
          <nav className="nav">
            <button onClick={() => setCurrentPage('list')}>Browse</button>
            {token ? (
              <>
                <button onClick={() => setCurrentPage('profile')}>My Profile</button>
                <button onClick={handleLogout}>Logout</button>
                <span className="user-name">Hi, {user?.name}</span>
              </>
            ) : (
              <>
                <button onClick={() => setCurrentPage('login')}>Login</button>
                <button onClick={() => setCurrentPage('signup')}>Signup</button>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {currentPage === 'list' && (
          <PhotographerList onViewDetail={viewPhotographerDetail} />
        )}
        {currentPage === 'login' && (
          <Login onLogin={handleLogin} onSwitchToSignup={() => setCurrentPage('signup')} />
        )}
        {currentPage === 'signup' && (
          <Signup onSwitchToLogin={() => setCurrentPage('login')} onSignupSuccess={() => setCurrentPage('login')} />
        )}
        {currentPage === 'profile' && token && (
          <Profile token={token} user={user} />
        )}
        {currentPage === 'detail' && selectedPhotographerId && (
          <PhotographerDetail photographerId={selectedPhotographerId} onBack={() => setCurrentPage('list')} />
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2026 LensLink - Connect with Professional Photographers</p>
      </footer>
    </div>
  );
}

export default App;
