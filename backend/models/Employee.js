// models/Employee.js
const db = require('../config/db');

class Employee {
  static getById(id) {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM employees WHERE employee_id = ?', [id], (err, results) => {
        if (err) return reject(err);
        resolve(results[0]);
      });
    });
  }
}

module.exports = Employee;
