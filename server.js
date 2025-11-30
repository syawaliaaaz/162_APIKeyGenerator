require('dotenv').config(); 
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const sequelize = require('./config/database');
const db = require('./models');

// Import Routes
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const apiKeyRoutes = require('./routes/apikeyRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Gunakan Routes
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/keys', apiKeyRoutes);

// Tes koneksi database
sequelize.authenticate()
    .then(() => console.log('✅ Koneksi ke database berhasil'))
    .catch(err => console.error('❌ Gagal koneksi:', err));

// Jalankan Server & Sync Database
const PORT = process.env.PORT || 3000;

sequelize.sync({ alter: true }) 
    .then(() => {
        console.log('>>> Database Connected & Synced (Mode Aman)!');
        app.listen(PORT, () => {
            console.log(`>>> Server berjalan di http://localhost:${PORT}`);
        });
        createDefaultAdmin(); 
    })
    .catch(err => console.error('>>> GAGAL KONEKSI DB:', err));

// Fungsi Buat Admin Default
const bcrypt = require('bcryptjs');
const Admin = db.Admin;

async function createDefaultAdmin() {
    try {
        const email = 'admin@gmail.com';
        const [admin, created] = await Admin.findOrCreate({
            where: { email },
            defaults: {
                email,
                password: await bcrypt.hash('123456', 10)
            }
        });
        if (created) {
            console.log('>>> Admin Default Siap:', `${email} / 123456`);
        } else {
            console.log('>>> Admin sudah ada:', admin.email);
        }
    } catch (e) {
        console.error('Error create admin:', e);
    }
}
