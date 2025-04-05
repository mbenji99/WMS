const db = require('../config/db');
const bcrypt = require('bcrypt');

class AuthController {
  static employeeLogin(req, res) {
    const { employee_id, password } = req.body;

    const query = 'SELECT * FROM employees WHERE employee_id = ?';
    db.query(query, [employee_id], async (err, results) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      if (results.length === 0) return res.status(401).json({ error: 'Employee not found' });

      const employee = results[0];

      const isMatch = await bcrypt.compare(password, employee.password);
      if (!isMatch) return res.status(401).json({ error: 'Invalid password' });

      res.status(200).json({ message: 'Employee login successful', employee_id });
    });
  }

  static managerLogin(req, res) {
    const { manager_id, password } = req.body;

    const query = 'SELECT * FROM managers WHERE manager_id = ?';
    db.query(query, [manager_id], async (err, results) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      if (results.length === 0) return res.status(401).json({ error: 'Manager not found' });

      const manager = results[0];

      const isMatch = await bcrypt.compare(password, manager.password);
      if (!isMatch) return res.status(401).json({ error: 'Invalid password' });

      res.status(200).json({ message: 'Manager login successful', manager_id });
    });
  }
}

module.exports = AuthController;
