// controllers/loginController.js

const Login = require('../models/Login');

// Handle employee login
exports.employeeLogin = async (req, res) => {
  const { employee_id, password } = req.body;

  if (!employee_id || !password) {
    return res.status(400).json({ error: 'Employee ID and password are required.' });
  }

  try {
    const login = new Login();
    const result = await login.authenticateEmployee(employee_id, password);

    if (result) {
      return res.status(200).json({ message: 'Employee login successful.' });
    } else {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }
  } catch (err) {
    console.error('Employee login error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

// Handle manager login
exports.managerLogin = async (req, res) => {
  const { manager_id, password } = req.body;

  if (!manager_id || !password) {
    return res.status(400).json({ error: 'Manager ID and password are required.' });
  }

  try {
    const login = new Login();
    const result = await login.authenticateManager(manager_id, password);

    if (result) {
      return res.status(200).json({ message: 'Manager login successful.' });
    } else {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }
  } catch (err) {
    console.error('Manager login error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};
