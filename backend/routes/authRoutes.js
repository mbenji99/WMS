const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

// POST: /api/auth/employee/login
router.post('/employee/login', AuthController.employeeLogin);

// POST: /api/auth/manager/login
router.post('/manager/login', AuthController.managerLogin);

module.exports = router;
