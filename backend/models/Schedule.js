const db = require('../config/db');

class Schedule {
  static createFromShifts(employee_id, shift_ids) {
    return new Promise((resolve, reject) => {
      if (!Array.isArray(shift_ids) || shift_ids.length === 0) {
        return reject(new Error('No shifts provided for schedule creation'));
      }

      // Fetch only the selected shifts
      const placeholders = shift_ids.map(() => '?').join(',');
      const queryShifts = `SELECT * FROM shifts WHERE shift_id IN (${placeholders}) AND employee_id = ? ORDER BY shift_date, start_time`;
      db.query(queryShifts, [...shift_ids, employee_id], (err, shifts) => {
        if (err) return reject(new Error('Error fetching shifts'));
        if (shifts.length === 0) return reject(new Error('No matching shifts found for this employee'));

        // Check for existing schedules
        const checkQuery = `
          SELECT shift_date, start_time, end_time 
          FROM schedules 
          WHERE employee_id = ?
        `;

        db.query(checkQuery, [employee_id], (err, existing) => {
          if (err) return reject(new Error('Failed to check existing schedules'));

          const existingSet = new Set(existing.map(s => `${s.shift_date}-${s.start_time}-${s.end_time}`));

          const newValues = shifts.filter(r => {
            const key = `${r.shift_date}-${r.start_time}-${r.end_time}`;
            return !existingSet.has(key);
          });

          if (newValues.length === 0) {
            return reject(new Error('All selected shifts are already scheduled.'));
          }

          const insertQuery = 'INSERT INTO schedules (employee_id, shift_date, start_time, end_time, shift_id) VALUES ?';
          const values = newValues.map(r => [employee_id, r.shift_date, r.start_time, r.end_time, r.shift_id]);

          console.log(' Filtered schedule values to insert:', values);

          db.query(insertQuery, [values], (err) => {
            if (err) {
              console.error(' Insert error:', err.sqlMessage || err.message || err);
              return reject(new Error('Failed to insert schedule'));
            }
            resolve({ message: 'Schedule created successfully from selected shifts.' });
          });
        });
      });
    });
  }

  static deleteByEmployee(employee_id) {
    return new Promise((resolve, reject) => {
      db.query('DELETE FROM schedules WHERE employee_id = ?', [employee_id], (err) => {
        if (err) return reject(new Error('Failed to delete schedule'));
        resolve({ message: 'Schedule deleted successfully' });
      });
    });
  }

  static update(schedule_id, { shift_date, start_time, end_time }) {
    return new Promise((resolve, reject) => {
      const query = 'UPDATE schedules SET shift_date = ?, start_time = ?, end_time = ? WHERE schedule_id = ?';
      db.query(query, [shift_date, start_time, end_time, schedule_id], (err, result) => {
        if (err) return reject(new Error('Update failed'));
        if (result.affectedRows === 0) return reject(new Error('Schedule not found'));
        resolve({ message: 'Schedule updated successfully' });
      });
    });
  }

  static getAll() {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          s.schedule_id,
          s.employee_id,
          e.name AS employee_name,
          s.shift_date,
          s.start_time,
          s.end_time,
          DAYNAME(s.shift_date) AS day_of_week
        FROM schedules s
        JOIN employees e ON s.employee_id = e.employee_id
        ORDER BY s.shift_date, s.start_time
      `;
      db.query(query, (err, results) => {
        if (err) return reject(new Error('Failed to fetch schedules'));
        resolve(results);
      });
    });
  }

  static getForEmployee(employee_id) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          s.schedule_id,
          s.employee_id,
          e.name AS employee_name,
          s.shift_date,
          s.start_time,
          s.end_time,
          DAYNAME(s.shift_date) AS day_of_week
        FROM schedules s
        JOIN employees e ON s.employee_id = e.employee_id
        WHERE s.employee_id = ?
        ORDER BY s.shift_date, s.start_time
      `;
      db.query(query, [employee_id], (err, results) => {
        if (err) return reject(new Error('Failed to fetch schedule for employee'));
        resolve(results);
      });
    });
  }
}

module.exports = Schedule;
