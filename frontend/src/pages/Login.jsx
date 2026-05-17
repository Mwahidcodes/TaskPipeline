import React, { useState } from 'react';

function Login({ setPage, setToken, setUser }) {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                setToken(data.token);
                setUser(data.user);
                setPage('dashboard');
            } else {
                setMessage(data.message);
            }
        } catch (err) {
            setMessage('The backend server connection could not be established ❌');
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
                <p className="auth-redirect">Don't have an Account? <span onClick={() => setPage('register')}>Sign Up</span></p>
            </div>
        </div>
    );
}

export default Login;