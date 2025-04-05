const mysql = require('mysql');

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '061502kp',
  database: 'attendance_system',
  connectionLimit: 10, // Optimal pool size for small-medium apps
});

db.getConnection((err, connection) => {
  if (err) {
    console.error('MySQL connection pool error:', err.message);
  } else {
    console.log('MySQL connection pool established.');
    connection.release(); // Release the connection back to the pool
  }
});

module.exports = db;
