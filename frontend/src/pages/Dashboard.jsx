import React, { useState, useEffect } from 'react';
import { BACKEND_URL } from '../config';

function Dashboard({ token, user, handleLogout }) {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState('');

    const fetchTasks = async () => {
        try {
            const res = await fetch(`${BACKEND_URL}/api/tasks`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) setTasks(data);
        } catch (err) { console.error('Error:', err); }
    };

    useEffect(() => { fetchTasks(); }, []);

    const handleAddTask = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${BACKEND_URL}/api/tasks`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ title, description })
            });
            if (res.ok) { setTitle(''); setDescription(''); fetchTasks(); }
        } catch (err) { setMessage('Could not add Task!'); }
    };

    const handleUpdateStatus = async (id, currentStatus) => {
        let nextStatus = currentStatus === 'In Progress' ? 'Done' : 'In Progress';
        try {
            await fetch(`${BACKEND_URL}/api/tasks/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ status: nextStatus })
            });
            fetchTasks();
        } catch (err) { console.error(err); }
    };

    const handleDeleteTask = async (id) => {
        if (!window.confirm('Delete this task?')) return;
        try {
            await fetch(`${BACKEND_URL}/api/tasks/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchTasks();
        } catch (err) { console.error(err); }
    };

    const todoTasks = tasks.filter(t => t.status === 'To Do');
    const progressTasks = tasks.filter(t => t.status === 'In Progress');
    const doneTasks = tasks.filter(t => t.status === 'Done');

    return (
        <div className="dashboard-layout">
            <div className="sidebar">
                <h2>TaskPipeline</h2>
                <p>User: <strong>{user?.username}</strong></p>
                <button className="btn" onClick={handleLogout}>Logout</button>
            </div>
            <div className="main-content">
                <form className="task-form" onSubmit={handleAddTask}>
                    <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    <input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                    <button type="submit">+ Add</button>
                </form>
                <div className="kanban-board">
                    <div className="kanban-column"><h3>To Do</h3>{todoTasks.map(t => <div key={t.id}>{t.title} <button onClick={() => handleUpdateStatus(t.id, t.status)}>➔</button></div>)}</div>
                    <div className="kanban-column"><h3>In Progress</h3>{progressTasks.map(t => <div key={t.id}>{t.title} <button onClick={() => handleUpdateStatus(t.id, t.status)}>➔</button></div>)}</div>
                    <div className="kanban-column"><h3>Done</h3>{doneTasks.map(t => <div key={t.id}>{t.title}</div>)}</div>
                </div>
            </div>
        </div>
    );
}
export default Dashboard;