const db = require('../config/db');

class EmployeeController {
  static clockIn(req, res) {
    const employee_id = req.body.employee_id;

    const query = `
      INSERT INTO clock_in_out_logs (employee_id, clock_in_time)
      VALUES (?, NOW())
    `;

    db.query(query, [employee_id], (err) => {
      if (err) return res.status(500).json({ error: 'Failed to clock in' });
      res.status(200).json({ message: 'Clocked in successfully' });
    });
  }

  static clockOut(req, res) {
    const employee_id = req.body.employee_id;

    const query = `
      UPDATE clock_in_out_logs
      SET clock_out_time = NOW()
      WHERE employee_id = ? AND clock_out_time IS NULL
    `;

    db.query(query, [employee_id], (err, result) => {
      if (err) return res.status(500).json({ error: 'Failed to clock out' });
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'No active clock-in found' });
      }
      res.status(200).json({ message: 'Clocked out successfully' });
    });
  }

  static checkClockStatus(req, res) {
    const employee_id = req.headers['employee-id'];

    const query = `
      SELECT * FROM clock_in_out_logs
      WHERE employee_id = ? AND clock_out_time IS NULL
    `;

    db.query(query, [employee_id], (err, results) => {
      if (err) return res.status(500).json({ error: 'Failed to check clock status' });

      const isClockedIn = results.length > 0;
      res.status(200).json({ isClockedIn });
    });
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
