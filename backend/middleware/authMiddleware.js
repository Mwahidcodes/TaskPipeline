const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function (req, res, next) {
    // Header se token get karein
    const token = req.header('Authorization');

    // Check karein agar token nahi hai
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied! ❌' });
    }

    try {
        // Token se 'Bearer ' remove karein agar frontend se bhejte waqt add kiya ho
        const cleanToken = token.startsWith('Bearer ') ? token.slice(7, token.length) : token;
        
        // Token verify karein
        const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET);
        
        // Request mein user ka data attach karein
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token valid nahi hai! ❌' });
    }
};