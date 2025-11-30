const express = require('express');
const router = express.Router();
const apiKeyController = require('../controllers/apiKeyController');

router.get('/generate', apiKeyController.generateKey);

module.exports = router;