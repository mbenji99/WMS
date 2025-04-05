const db = require('../config/db');

class Shift {
  constructor(shift_id, employee_id, shift_date, start_time, end_time) {
    this.shift_id = shift_id;
    this.employee_id = employee_id;
    this.shift_date = shift_date;
    this.start_time = start_time;
    this.end_time = end_time;
  }

  async save() {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO shifts (employee_id, shift_date, start_time, end_time)
        VALUES (?, ?, ?, ?)
      `;
      const values = [this.employee_id, this.shift_date, this.start_time, this.end_time];

      db.query(query, values, (err, result) => {
        if (err) {
          console.error("Shift save failed:", err);
          return reject(new Error('Failed to save shift.'));
        }
        this.shift_id = result.insertId;
        console.log("Shift saved with ID:", this.shift_id);
        resolve();
      });
    });
  }

  async update() {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE shifts
        SET shift_date = ?, start_time = ?, end_time = ?
        WHERE shift_id = ?
      `;
      const values = [this.shift_date, this.start_time, this.end_time, this.shift_id];

      db.query(query, values, (err) => {
        if (err) {
          console.error("Shift update failed:", err);
          return reject(new Error('Failed to update shift.'));
        }
        resolve();
      });
    });
  }

  async delete() {
    return new Promise((resolve, reject) => {
      const query = `DELETE FROM shifts WHERE shift_id = ?`;
      db.query(query, [this.shift_id], (err) => {
        if (err) {
          console.error("Shift delete failed:", err);
          return reject(new Error('Failed to delete shift.'));
        }
        resolve();
      });
    });
  }

  async load() {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM shifts WHERE shift_id = ?`;
      db.query(query, [this.shift_id], (err, results) => {
        if (err || results.length === 0) {
          return reject(new Error('Shift not found.'));
        }
        const row = results[0];
        this.employee_id = row.employee_id;
        this.shift_date = row.shift_date;
        this.start_time = row.start_time;
        this.end_time = row.end_time;
        resolve();
      });
    });
  }

  static async getAll() {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT s.*, 
          DATE_FORMAT(s.shift_date, '%Y-%m-%d') AS formatted_date,
          DAYNAME(s.shift_date) AS day_of_week,
          e.name AS employee_name
        FROM shifts s
        LEFT JOIN employees e ON s.employee_id = e.employee_id
        ORDER BY s.shift_date ASC, s.start_time ASC
      `;
      db.query(query, (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      });
    });
  }
}

module.exports = Shift;
