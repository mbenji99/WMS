const bcrypt = require('bcryptjs');
const mysql = require('mysql');

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '061502kp',
  database: 'attendance_system',
});

db.connect(async (err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to database.');

  try {
    // Add Multiple Managers
    const managers = [
      {
        id: 1,
        name: 'Admin User',
        password: 'password123',
      },
      {
        id: 2,
        name: 'Second Admin',
        password: 'admin456',
      },
    ];

    for (const mgr of managers) {
      const hashedManagerPassword = await bcrypt.hash(mgr.password, 10);

      db.query(
        'INSERT INTO managers (manager_id, name, password) VALUES (?, ?, ?)',
        [mgr.id, mgr.name, hashedManagerPassword],
        (error) => {
          if (error) {
            console.error(`Error inserting manager ${mgr.id}:`, error);
          } else {
            console.log(`Manager ${mgr.id} added successfully.`);
          }
        }
      );
    }

    // Add Multiple Employees
    const employees = [
      {
        id: 1001,
        name: 'John Doe',
        password: 'employee456',
      },
      {
        id: 1002,
        name: 'Jane Smith',
        password: 'employee789',
      },
      {
        id: 1003,
        name: 'Michael Lee',
        password: 'employee123',
      },
    ];

    // Hash and insert each employee
    for (const emp of employees) {
      const hashedPassword = await bcrypt.hash(emp.password, 10);

      db.query(
        'INSERT INTO employees (employee_id, name, password) VALUES (?, ?, ?)',
        [emp.id, emp.name, hashedPassword],
        (error) => {
          if (error) {
            console.error(`Error inserting employee ${emp.id}:`, error);
          } else {
            console.log(`Employee ${emp.id} added successfully.`);
          }
        }
      );
    }

    // Delay closing the DB to allow async inserts to finish
    setTimeout(() => {
      db.end();
    }, 1500);

  } catch (error) {
    console.error('Error hashing passwords or inserting records:', error);
    db.end();
  }
});
