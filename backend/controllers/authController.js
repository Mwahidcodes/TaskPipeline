const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// 📝 USER REGISTRATION
exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check karein ke user pehle se register to nahi hai
        const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: 'Yeh email pehle se registered hai! ⚠️' });
        }

        // Password ko hash (encrypt) karein
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Database mein naya user insert karein
        const newUser = await pool.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
            [username, email, hashedPassword]
        );

        // JWT Token generate karein
        const payload = { user: { id: newUser.rows[0].id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' }, (err, token) => {
            if (err) throw err;
            res.status(201).json({ token, user: newUser.rows[0], message: 'Registration successful! 🎉' });
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// 🔑 USER LOGIN
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // User ko email se dhoondein
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            return res.status(400).json({ message: 'Invalid Credentials! ❌' });
        }

        // Password match karein
        const isMatch = await bcrypt.compare(password, user.rows[0].password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials! ❌' });
        }

        // JWT Token generate karein
        const payload = { user: { id: user.rows[0].id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' }, (err, token) => {
            if (err) throw err;
            res.json({ 
                token, 
                user: { id: user.rows[0].id, username: user.rows[0].username, email: user.rows[0].email },
                message: 'Welcome back! 🚀' 
            });
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};