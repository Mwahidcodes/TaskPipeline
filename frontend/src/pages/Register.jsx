import React, { useState } from 'react';

function Register({ setPage }) {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (res.ok) {
                alert('Registration Successful! 🎉 You Can Now Login.');
                setPage('login');
            } else {
                setMessage(data.message);
            }
        } catch (err) {
            setMessage('The backend server connection could not be established. ❌')
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