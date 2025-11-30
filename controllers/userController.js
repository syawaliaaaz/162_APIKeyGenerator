const db = require('../models');
const User = db.User;
const ApiKey = db.ApiKey;

exports.registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, generatedKey } = req.body;

        // 1. Simpan / Cari User
        let user = await User.findOne({ where: { email } });
        if (!user) {
            user = await User.create({ firstName, lastName, email });
        }

        // 2. Simpan API Key
        // PERBAIKAN PENTING DISINI: 
        // Dulu tertulis 'user_id', sekarang harus 'userId' agar sesuai dengan Model.
        const newKey = await ApiKey.create({
            key_string: generatedKey,
            userId: user.id  // <--- UBAH INI (dulu user_id)
        });

        res.status(201).json({ message: 'Success', data: newKey });
    } catch (error) {
        console.error("Error Register:", error); // Cek terminal jika error
        res.status(500).json({ error: error.message });
    }
};