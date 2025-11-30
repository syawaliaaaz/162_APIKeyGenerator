const db = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const Admin = db.Admin;
const User = db.User;
const ApiKey = db.ApiKey;

// 1. Login Admin
exports.login = async (req, res) => {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ where: { email } });

    if (!admin) return res.status(404).json({ message: 'Email tidak ditemukan' });

    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) return res.status(401).json({ message: 'Password salah' });

    // Buat Token
    const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ token });
};

// 2. Dashboard Data (Cek status 30 hari)
exports.getAllData = async (req, res) => {
    try {
        const data = await ApiKey.findAll({
            // PENTING: Mengambil data User (firstName, lastName, email)
            include: [{ 
                model: User, 
                attributes: ['firstName', 'lastName', 'email'] 
            }],
            order: [['createdAt', 'DESC']]
        });

        const result = data.map(item => {
            const created = new Date(item.createdAt);
            const now = new Date();
            const diffTime = Math.abs(now - created);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
            
            // Logic Valid: Umur <= 30 hari DAN status di DB 'active'
            const isValidTime = diffDays <= 30;
            const finalStatus = (isValidTime && item.status === 'active') ? 'Valid' : 'Invalid';

            // FITUR PERBAIKAN:
            // Jika User null (karena reset DB atau terhapus), kita beri data default biar Dashboard tidak error
            const userData = item.User ? item.User : { firstName: 'Unknown', lastName: '', email: '-' };

            return {
                id: item.id,
                User: userData, // Kita kirim sebagai 'User' agar terbaca di frontend
                key_string: item.key_string,
                createdAt: item.createdAt,
                daysOld: diffDays,
                statusDB: item.status,
                calculatedStatus: finalStatus
            };
        });

        res.json(result);
    } catch (error) {
        console.error("Error Get Data:", error);
        res.status(500).json({ error: error.message });
    }
};

// 3. Hapus Key
exports.deleteKey = async (req, res) => {
    try {
        await ApiKey.destroy({ where: { id: req.params.id } });
        res.json({ message: 'Deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 4. Toggle Status (Aktif/Nonaktif)
exports.toggleStatus = async (req, res) => {
    try {
        const key = await ApiKey.findByPk(req.params.id);
        if (key) {
            key.status = key.status === 'active' ? 'inactive' : 'active';
            await key.save();
            res.json({ message: 'Updated', status: key.status });
        } else {
            res.status(404).json({ message: 'Key not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};