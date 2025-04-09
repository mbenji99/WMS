-- Drop existing tables if needed
DROP TABLE IF EXISTS clock_in_out_logs;
DROP TABLE IF EXISTS schedules;
DROP TABLE IF EXISTS shifts;
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS managers;

-- Employees table
CREATE TABLE employees (
  employee_id INT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL
);

-- Managers table
CREATE TABLE managers (
  manager_id INT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL
);

-- Shifts table with 
CREATE TABLE shifts (
  shift_id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT NOT NULL,
  shift_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  FOREIGN KEY (employee_id) REFERENCES employees(employee_id),
  UNIQUE KEY unique_shift (employee_id, shift_date, start_time, end_time)
);

-- Schedules table 
CREATE TABLE schedules (
  schedule_id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT NOT NULL,
  shift_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  FOREIGN KEY (employee_id) REFERENCES employees(employee_id),
  UNIQUE KEY unique_schedule (employee_id, shift_date, start_time, end_time)
);

-- Clock In/Out Logs
CREATE TABLE clock_in_out_logs (
  log_id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT NOT NULL,
  clock_in_time DATETIME,
  clock_out_time DATETIME,
  FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);

-- Audit Logs
CREATE TABLE audit_logs (
  log_id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT,
  action VARCHAR(255),
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);
