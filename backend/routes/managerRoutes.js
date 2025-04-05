const express = require('express');
const router = express.Router();
const ManagerController = require('../controllers/ManagerController'); 

// Shift routes
router.post('/create-shift', ManagerController.createShift);
router.put('/edit-shift/:id', ManagerController.editShift);
router.delete('/delete-shift/:id', ManagerController.deleteShift);
router.get('/view-shift', ManagerController.viewAllShifts); 

// Schedule routes
router.post('/create-schedule', ManagerController.createSchedule);
router.put('/edit-schedule/:id', ManagerController.editSchedule);
router.delete('/delete-schedule/:id', ManagerController.deleteSchedule);
router.get('/view-schedule', ManagerController.viewAllSchedules); 

// Reports
router.get('/generate-report', ManagerController.generateReport);
router.put('/adjust-clockinout', ManagerController.adjustClockInOut); 

module.exports = router;
