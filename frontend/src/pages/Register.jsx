import React, { useState } from 'react';
import { BACKEND_URL } from '../config';

function Register({ setPage }) {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${BACKEND_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) { alert('Success!'); setPage('login'); } 
            else { setMessage('Failed'); }
        } catch (err) { setMessage('Server connection failed!'); }
    };
    return (
        <form onSubmit={handleSubmit}>
            <input placeholder="Username" onChange={(e) => setFormData({...formData, username: e.target.value})} />
            <input type="email" placeholder="Email" onChange={(e) => setFormData({...formData, email: e.target.value})} />
            <input type="password" placeholder="Password" onChange={(e) => setFormData({...formData, password: e.target.value})} />
            <button type="submit">Sign Up</button>
        </form>
    );
}
export default Register;