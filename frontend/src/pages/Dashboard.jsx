import React, { useState, useEffect } from 'react';
import { BACKEND_URL } from '../config';

function Dashboard({ token, user, handleLogout }) {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState('');

    // Backend se tasks fetch karne ka function
    const fetchTasks = async () => {
        try {
            const res = await fetch(`${BACKEND_URL}/api/tasks`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                setTasks(data);
            }
        } catch (err) {
            console.error('Tasks fetch karne mein error:', err);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    // Naya task add karne ka handler
    const handleAddTask = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${BACKEND_URL}/api/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ title, description })
            });
            const data = await res.json();
            if (res.ok) {
                setTitle('');
                setDescription('');
                fetchTasks(); // Board refresh karein
            } else {
                setMessage(data.message);
            }
        } catch (err) {
            setMessage('Task add nahi ho saka! ❌');
        }
    };

    // Task ka status update karne ka handler
    const handleUpdateStatus = async (id, currentStatus) => {
        let nextStatus = 'In Progress';
        if (currentStatus === 'In Progress') nextStatus = 'Done';

        try {
            const res = await fetch(`${BACKEND_URL}/api/tasks/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: nextStatus })
            });
            if (res.ok) fetchTasks();
        } catch (err) {
            console.error(err);
        }
    };

    // Task delete karne ka handler
    const handleDeleteTask = async (id) => {
        if (!window.confirm('ℹ️ Kya aap waqai yeh task delete karna chahti hain?')) return;
        try {
            const res = await fetch(`${BACKEND_URL}/api/tasks/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) fetchTasks();
        } catch (err) {
            console.error(err);
        }
    };

    // Filter tasks by status
    const todoTasks = tasks.filter(t => t.status === 'To Do');
    const progressTasks = tasks.filter(t => t.status === 'In Progress');
    const doneTasks = tasks.filter(t => t.status === 'Done');

    return (
        <div className="dashboard-layout">
            {/* Sidebar */}
            <div className="sidebar">
                <div>
                    <h2>TaskPipeline</h2>
                    <p style={{ color: '#06b6d4' }}>DevOps Hub 🚀</p>
                    <hr style={{ borderColor: '#334155' }} />
                    <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>User: <strong>{user?.username}</strong></p>
                </div>
                <button className="btn" style={{ background: '#ef4444' }} onClick={handleLogout}>Logout</button>
            </div>

            {/* Main Content Area */}
            <div className="main-content">
                <h2>Project Pipeline Dashboard</h2>
                {message && <p style={{ color: '#ef4444' }}>{message}</p>}

                {/* Task Form */}
                <form className="task-form" onSubmit={handleAddTask}>
                    <input 
                        type="text" 
                        placeholder="Task Title (e.g., Setup Jenkins)" 
                        value={title} 
                        required 
                        onChange={(e) => setTitle(e.target.value)} 
                        style={{ flex: 1 }}
                    />
                    <input 
                        type="text" 
                        placeholder="Description" 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                        style={{ flex: 2 }}
                    />
                    <button type="submit" className="btn" style={{ width: 'auto', padding: '0 1.5rem' }}>+ Create Task</button>
                </form>

                {/* Kanban Board */}
                <div className="kanban-board">
                    <div className="kanban-column todo">
                        <h3>To Do 🟡 <span>({todoTasks.length})</span></h3>
                        {todoTasks.map(task => (
                            <div key={task.id} className="task-card">
                                <h4>{task.title}</h4>
                                <p>{task.description}</p>
                                <div className="task-actions">
                                    <button className="btn-sm" onClick={() => handleUpdateStatus(task.id, task.status)}>Start ➔</button>
                                    <button className="btn-sm btn-delete" onClick={() => handleDeleteTask(task.id)}>🗑️</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="kanban-column progress">
                        <h3>In Progress 🔵 <span>({progressTasks.length})</span></h3>
                        {progressTasks.map(task => (
                            <div key={task.id} className="task-card">
                                <h4>{task.title}</h4>
                                <p>{task.description}</p>
                                <div className="task-actions">
                                    <button className="btn-sm" style={{ background: '#10b981' }} onClick={() => handleUpdateStatus(task.id, task.status)}>Finish ➔</button>
                                    <button className="btn-sm btn-delete" onClick={() => handleDeleteTask(task.id)}>🗑️</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="kanban-column done">
                        <h3>Done 🟢 <span>({doneTasks.length})</span></h3>
                        {doneTasks.map(task => (
                            <div key={task.id} className="task-card" style={{ opacity: 0.7 }}>
                                <h4 style={{ textDecoration: 'line-through' }}>{task.title}</h4>
                                <p>{task.description}</p>
                                <div className="task-actions" style={{ justifyContent: 'flex-end' }}>
                                    <button className="btn-sm btn-delete" onClick={() => handleDeleteTask(task.id)}>🗑️</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;