import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

function App() {
  const [page, setPage] = useState('login'); // login, register, dashboard
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  // Check karein agar localstorage mein pehle se user log-in hai
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      setPage('dashboard');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setPage('login');
  };

  return (
    <div className="App">
      {page === 'login' && (
        <Login setPage={setPage} setToken={setToken} setUser={setUser} />
      )}
      {page === 'register' && (
        <Register setPage={setPage} />
      )}
      {page === 'dashboard' && (
        <Dashboard token={token} user={user} handleLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;