// models/Login.js
const db = require('../config/db');
const bcrypt = require('bcrypt');

class Login {
  static async authenticateUser(id, password, role) {
    return new Promise((resolve, reject) => {
      const table = role === 'manager' ? 'managers' : 'employees';
      const idField = role === 'manager' ? 'manager_id' : 'employee_id';

      db.query(`SELECT * FROM ${table} WHERE ${idField} = ?`, [id], (err, results) => {
        if (err) return reject('DB error');

        if (results.length === 0) return reject(`${role} not found`);

        const user = results[0];
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) return reject('Error comparing password');
          if (!isMatch) return reject('Invalid password');
          resolve(user);
        });
      });
    });
  }
}

module.exports = Login;
