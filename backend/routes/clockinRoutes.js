const express = require('express');
const router = express.Router();
const EmployeeController = require('../controllers/EmployeeController');

// Clock In
router.post('/employee/clock-in', EmployeeController.clockIn);

// Clock Out
router.post('/employee/clock-out', EmployeeController.clockOut);

// Clock Status
router.get('/employee/clock-status', EmployeeController.checkClockStatus);

module.exports = router;
