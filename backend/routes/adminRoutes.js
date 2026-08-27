const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Login administrador
router.post('/login', adminController.login);

module.exports = router;