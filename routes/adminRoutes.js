const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/login', adminController.login);
router.get('/dashboard', verifyToken, adminController.getAllData);
router.delete('/key/:id', verifyToken, adminController.deleteKey);
router.put('/key/:id/toggle', verifyToken, adminController.toggleStatus);

module.exports = router;