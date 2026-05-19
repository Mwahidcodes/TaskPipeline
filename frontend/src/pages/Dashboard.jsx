import React, { useState, useEffect } from 'react';
import { BACKEND_URL } from '../config';

function Dashboard({ token, user, handleLogout }) {
    const [tasks, setTasks] = useState([]);
    
    const fetchTasks = async () => {
        try {
            const res = await fetch(`${BACKEND_URL}/api/tasks`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setTasks(data);
            }
        } catch (err) { console.error('Error fetching tasks:', err); }
    };

    useEffect(() => { fetchTasks(); }, []);

    return (
        <div className="dashboard-layout">
            <div className="sidebar">
                <h2>TaskPipeline</h2>
                <p>Welcome, {user?.username}</p>
                <button onClick={handleLogout}>Logout</button>
            </div>
            <div className="main-content">
                {/* Yahan apna purana Kanban board ka structure wapas add karein */}
                <div className="kanban-board">
                   {/* Tasks display logic */}
                </div>
            </div>
        </div>
    );
}
export default Dashboard;