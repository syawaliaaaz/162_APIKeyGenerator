const crypto = require('crypto');

exports.generateKey = (req, res) => {
    // Membuat random string 32 karakter
    const key = crypto.randomBytes(16).toString('hex');
    res.json({ key });
};