
const db = require('../config/db');

class Manager {
  static getById(id) {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM managers WHERE manager_id = ?', [id], (err, results) => {
        if (err) return reject(err);
        resolve(results[0]);
      });
    });
  }
}

module.exports = Manager;
