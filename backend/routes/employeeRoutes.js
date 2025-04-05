const express = require('express');
const router = express.Router();
const EmployeeController = require('../controllers/EmployeeController');

router.post('/clock-in', EmployeeController.clockIn);
router.post('/clock-out', EmployeeController.clockOut);
router.get('/clock-status', EmployeeController.checkClockStatus);

router.get('/view-schedule', EmployeeController.viewSchedule);
router.get('/view-shift', EmployeeController.viewShifts);

module.exports = router;
