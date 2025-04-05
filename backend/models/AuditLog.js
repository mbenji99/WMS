const db = require('../config/db');

class AuditLog {
  constructor({ employee_id, action, timestamp }) {
    this.employee_id = employee_id;
    this.action = action;
    this.timestamp = timestamp;
  }

  async save() {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO audit_logs (employee_id, action, timestamp)
        VALUES (?, ?, ?)
      `;
      db.query(query, [this.employee_id, this.action, this.timestamp], (err) => {
        if (err) {
          console.error("Failed to save audit log:", err);
          return reject(new Error('Failed to save audit log.'));
        }
        resolve();
      });
    });
  }

  static adjustClockTimes(log_id, { new_clock_in_time, new_clock_out_time }) {
    return new Promise((resolve, reject) => {
      let updateQuery = 'UPDATE clock_in_out_logs SET ';
      const updateParams = [];

      if (new_clock_in_time) {
        updateQuery += 'clock_in_time = ?, ';
        updateParams.push(new_clock_in_time);
      }
      if (new_clock_out_time) {
        updateQuery += 'clock_out_time = ?, ';
        updateParams.push(new_clock_out_time);
      }

      updateQuery = updateQuery.slice(0, -2) + ' WHERE log_id = ?';
      updateParams.push(log_id);

      db.query(updateQuery, updateParams, (err, result) => {
        if (err) return reject({ error: 'Failed to update clock-in/out log' });
        if (result.affectedRows === 0) return reject({ error: 'No log found with the provided ID' });
        resolve({ message: 'Clock-in/out log updated successfully' });
      });
    });
  }

  static generateClockedReport(startDate, endDate) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          e.employee_id,
          e.name AS employee_name,
          s.shift_date,
          s.start_time AS scheduled_start,
          s.end_time AS scheduled_end,
          l.clock_in_time,
          l.clock_out_time,
          TIMESTAMPDIFF(MINUTE, l.clock_in_time, l.clock_out_time) AS minutes_worked
        FROM shifts s
        JOIN employees e ON s.employee_id = e.employee_id
        LEFT JOIN clock_in_out_logs l 
          ON e.employee_id = l.employee_id AND DATE(l.clock_in_time) = s.shift_date
        WHERE s.shift_date BETWEEN ? AND ?
        ORDER BY s.shift_date ASC, e.employee_id ASC
      `;
      db.query(query, [startDate, endDate], (err, results) => {
        if (err) return reject({ error: 'Failed to generate report' });
        resolve(results);
      });
    });
  }
}

module.exports = AuditLog;
