-- Create the database
CREATE DATABASE IF NOT EXISTS attendance_system;
USE attendance_system;

-- Employees Table
CREATE TABLE IF NOT EXISTS employees (
    employee_id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL -- hashed password
);

-- Managers Table
CREATE TABLE IF NOT EXISTS managers (
    manager_id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL -- hashed password
);

-- Shifts Table
CREATE TABLE IF NOT EXISTS shifts (
    shift_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT,
    shift_date DATE,
    start_time TIME,
    end_time TIME,
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE
);

-- Schedules Table
CREATE TABLE IF NOT EXISTS schedules (
    schedule_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT,
    shift_date DATE,
    start_time TIME,
    end_time TIME,
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE
);

-- Clock In/Out Logs Table
CREATE TABLE IF NOT EXISTS clock_in_out_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT,
    clock_in_time DATETIME,
    clock_out_time DATETIME,
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE
);

-- Audit Log Table
CREATE TABLE IF NOT EXISTS audit_logs (
    audit_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT,
    action VARCHAR(100),
    timestamp DATETIME,
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE SET NULL
);
