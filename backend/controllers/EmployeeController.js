const ClockInOut = require('../models/ClockInOut');
const db = require('../config/db');

class EmployeeController {
  static async clockIn(req, res) {
    const employee_id = req.body.employee_id;
    try {
      await ClockInOut.logClockIn(employee_id);
      res.status(200).json({ message: 'Clocked in successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message || 'Failed to clock in' });
    }
  }

  static async clockOut(req, res) {
    const employee_id = req.body.employee_id;
    try {
      const result = await ClockInOut.logClockOut(employee_id);
      res.status(200).json({ message: result.message });
    } catch (err) {
      res.status(500).json({ error: err.message || 'Failed to clock out' });
    }
  }

  static async checkClockStatus(req, res) {
    const employee_id = req.headers['employee-id'];
    try {
      const isClockedIn = await ClockInOut.isClockedIn(employee_id);
      const minutesWorked = await ClockInOut.getMinutesWorkedToday(employee_id);
      res.status(200).json({ isClockedIn, minutesWorked });
    } catch (err) {
      res.status(500).json({ error: 'Failed to check clock status' });
    }
  }

  static viewSchedule(req, res) {
    const employee_id = req.headers['employee-id'];

    const query = `
      SELECT 
        schedule_id,
        employee_id,
        shift_date,
        DATE_FORMAT(shift_date, '%Y-%m-%d') AS formatted_date,
        DAYNAME(shift_date) AS day_of_week,
        start_time,
        end_time
      FROM schedules
      WHERE employee_id = ?
      ORDER BY shift_date, start_time
    `;

    db.query(query, [employee_id], (err, results) => {
      if (err) return res.status(500).json({ error: 'Failed to fetch schedule' });
      res.status(200).json(results);
    });
  }

  static viewShifts(req, res) {
    const employee_id = req.headers['employee-id'];

    const query = `
      SELECT 
        shift_id,
        employee_id,
        shift_date,
        DATE_FORMAT(shift_date, '%Y-%m-%d') AS formatted_date,
        DAYNAME(shift_date) AS day_of_week,
        start_time,
        end_time
      FROM shifts
      WHERE employee_id = ?
      ORDER BY shift_date, start_time
    `;

    db.query(query, [employee_id], (err, results) => {
      if (err) return res.status(500).json({ error: 'Failed to fetch shifts' });
      res.status(200).json(results);
    });
  }
}

module.exports = EmployeeController;
