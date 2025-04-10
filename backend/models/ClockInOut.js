
const db = require('../config/db');

class ClockInOut {
  static async logClockIn(employee_id) {
    const query = `
      INSERT INTO clock_in_out_logs (employee_id, clock_in_time)
      VALUES (?, NOW())
    `;
    return new Promise((resolve, reject) => {
      db.query(query, [employee_id], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }

  static async logClockOut(employee_id) {
    const query = `
      UPDATE clock_in_out_logs
      SET clock_out_time = NOW()
      WHERE employee_id = ? AND clock_out_time IS NULL
    `;
    return new Promise((resolve, reject) => {
      db.query(query, [employee_id], (err, result) => {
        if (err) return reject(err);
        if (result.affectedRows === 0) {
          return reject(new Error('No active clock-in found'));
        }
        resolve(result);
      });
    });
  }

  static async isClockedIn(employee_id) {
    const query = `
      SELECT * FROM clock_in_out_logs
      WHERE employee_id = ? AND clock_out_time IS NULL
    `;
    return new Promise((resolve, reject) => {
      db.query(query, [employee_id], (err, results) => {
        if (err) return reject(err);
        resolve(results.length > 0);
      });
    });
  }

  static async getTodayWorkedMinutes(employee_id) {
    const query = `
      SELECT TIMESTAMPDIFF(MINUTE, clock_in_time, clock_out_time) AS minutes_worked
      FROM clock_in_out_logs
      WHERE employee_id = ? AND DATE(clock_in_time) = CURDATE()
      AND clock_out_time IS NOT NULL
    `;
    return new Promise((resolve, reject) => {
      db.query(query, [employee_id], (err, results) => {
        if (err) return reject(err);

        const totalMinutes = results.reduce((sum, row) => {
          return sum + (row.minutes_worked || 0);
        }, 0);

        resolve(totalMinutes);
      });
    });
  }
}

module.exports = ClockInOut;
