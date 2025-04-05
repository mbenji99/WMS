const express = require('express');
const router = express.Router();
const LoginController = require('../controllers/LoginController');

router.post('/employee', LoginController.employeeLogin);
router.post('/manager', LoginController.managerLogin);

module.exports = router;
