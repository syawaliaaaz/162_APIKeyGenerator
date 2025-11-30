const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
    const tokenHeader = req.headers['authorization'];
    
    if (!tokenHeader) return res.status(403).json({ message: 'Akses ditolak (No Token)' });

    // Format header biasanya: "Bearer <token>"
    const token = tokenHeader.split(' ')[1]; 

    if (!token) return res.status(403).json({ message: 'Format token salah' });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Token tidak valid' });
        req.userId = decoded.id;
        next();
    });
};

module.exports = { verifyToken };