const pool = require('../config/db');

// ➕ CREATE A NEW TASK
exports.createTask = async (req, res) => {
    const { title, description } = req.body;
    const userId = req.user.id; // Yeh ID authMiddleware se aa rahi hai

    try {
        const newTask = await pool.query(
            'INSERT INTO tasks (title, description, user_id) VALUES ($1, $2, $3) RETURNING *',
            [title, description, userId]
        );
        res.status(201).json({ task: newTask.rows[0], message: 'Task create ho gaya! 🎯' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// 📋 GET ALL TASKS OF THE LOGGED-IN USER
exports.getTasks = async (req, res) => {
    const userId = req.user.id;

    try {
        const userTasks = await pool.query(
            'SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC',
            [userId]
        );
        res.json(userTasks.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// 🔄 UPDATE TASK STATUS (To Do, In Progress, Done)
exports.updateTaskStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    // Check karein ke status sahi bhej raha hai frontend
    const validStatuses = ['To Do', 'In Progress', 'Done'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status value! ⚠️' });
    }

    try {
        // Pehle check karein ke task isi user ka hai ya nahi
        const task = await pool.query('SELECT * FROM tasks WHERE id = $1 AND user_id = $2', [id, userId]);
        if (task.rows.length === 0) {
            return res.status(44)
            return res.status(404).json({ message: 'Task nahi mila ya aap authorized nahi hain! ❌' });
        }

        const updatedTask = await pool.query(
            'UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        );
        res.json({ task: updatedTask.rows[0], message: 'Status update ho gaya! 🔄' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// ❌ DELETE A TASK
exports.deleteTask = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        // Check karein ke task isi user ka hai
        const task = await pool.query('SELECT * FROM tasks WHERE id = $1 AND user_id = $2', [id, userId]);
        if (task.rows.length === 0) {
            return res.status(404).json({ message: 'Task nahi mila ya aap authorized nahi hain! ❌' });
        }

        await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
        res.json({ message: 'Task kamyabi se delete ho gaya! 🗑️' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};