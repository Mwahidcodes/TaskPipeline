import React, { useState } from 'react';
import { BACKEND_URL } from '../config'; // Import the config

function Login({ setPage, setToken, setUser }) {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Payload update: Added username as a fallback if backend requires it
        const payload = { 
            email: formData.email, 
            password: formData.password,
            username: formData.email.split('@')[0] 
        };

        try {
            const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            
            if (res.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                setToken(data.token);
                setUser(data.user);
                setPage('dashboard');
            } else {
                setMessage(data.message || 'Login Failed!');
            }
        } catch (err) {
            setMessage('Backend server could not connect! ❌');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>TaskPipeline</h2>
                <p style={{textAlign: 'center', color: '#94a3b8'}}>Welcome Back Developer</p>
                {message && <p style={{ color: '#ef4444', textAlign: 'center' }}>{message}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" required onChange={(e) => setFormData({...formData, email: e.target.value})} />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" required onChange={(e) => setFormData({...formData, password: e.target.value})} />
                    </div>
                    <button type="submit" className="btn">Secure Login</button>
                </form>
                <p className="auth-redirect">Don't have an account? <span onClick={() => setPage('register')}>Sign Up</span></p>
            </div>
        </div>
    );
}

export default Login;