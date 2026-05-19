import React, { useState } from 'react';
import { BACKEND_URL } from '../config'; // Config import kiya

function Register({ setPage }) {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Yahan localhost ki jagah BACKEND_URL use kiya
            const res = await fetch(`${BACKEND_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (res.ok) {
                alert('Registration successful! 🎉 you can login now.');
                setPage('login');
            } else {
                setMessage(data.message || 'Registration Failed!');
            }
        } catch (err) {
            setMessage('Backend server could not connect! ❌');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>TaskPipeline</h2>
                <p style={{textAlign: 'center', color: '#94a3b8'}}>Create New Account</p>
                {message && <p style={{ color: '#ef4444', textAlign: 'center' }}>{message}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Username</label>
                        <input type="text" required onChange={(e) => setFormData({...formData, username: e.target.value})} />
                    </div>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" required onChange={(e) => setFormData({...formData, email: e.target.value})} />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" required onChange={(e) => setFormData({...formData, password: e.target.value})} />
                    </div>
                    <button type="submit" className="btn">Sign Up</button>
                </form>
                <p className="auth-redirect">Already have an account? <span onClick={() => setPage('login')}>Login</span></p>
            </div>
        </div>
    );
}

export default Register;