const Manager = require('../models/Manager');
const Shift = require('../models/Shift');
const Schedule = require('../models/Schedule');
const AuditLog = require('../models/AuditLog');
const db = require('../config/db');

class ManagerController {
  static async viewAllShifts(req, res) {
    try {
      const shifts = await Shift.getAll();
      res.status(200).json({ message: 'Shifts retrieved successfully', shifts });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async viewAllSchedules(req, res) {
     try { const raw = await Schedule.getAll(); 
      const grouped = {};
      raw.forEach(schedule => {
        const id = schedule.employee_id;
        if (!grouped[id]) {
          grouped[id] = {
            employee_name: schedule.employee_name || 'Unknown',
            schedule: [],
          };
        }
        grouped[id].schedule.push({
          date: schedule.shift_date,
          day_of_week: schedule.day_of_week,
          start_time: schedule.start_time,
          end_time: schedule.end_time,
        });
      });
      
      res.status(200).json(grouped);
      } catch (err) { res.status(500).json({ error: err.message }); 
    } 
  }

  static async createShift(req, res) {
    const { employee_id, shift_date, start_time, end_time } = req.body;
    try {
      const shift = new Shift(null, employee_id, shift_date, start_time, end_time);
      await shift.save();

      await new AuditLog({
        employee_id,
        action: 'Shift Created',
        timestamp: new Date()
      }).save();

      res.status(201).json({ message: 'Shift created successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async editShift(req, res) {
    const { id } = req.params;
    const { shift_date, start_time, end_time } = req.body;
    try {
      const shift = new Shift(id);
      await shift.load();
      shift.shift_date = shift_date;
      shift.start_time = start_time;
      shift.end_time = end_time;
      await shift.update();

      res.status(200).json({ message: 'Shift updated successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async deleteShift(req, res) {
    const { id } = req.params;
    try {
      const shift = new Shift(id);
      await shift.delete();

      res.status(200).json({ message: 'Shift deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async createSchedule(req, res) {
    const { employee_id } = req.body;
    try {
      const result = await Schedule.createFromShifts(employee_id);
      await new AuditLog({
        employee_id,
        action: 'Schedule Created',
        timestamp: new Date()
      }).save();
      res.status(201).json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async editSchedule(req, res) {
    const { id } = req.params;
    const { shift_date, start_time, end_time } = req.body;

    try {
      const result = await Schedule.update(id, { shift_date, start_time, end_time });
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async deleteSchedule(req, res) {
    const { id } = req.params;

    try {
      const result = await Schedule.deleteByEmployee(id);
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async adjustClockInOut(req, res) {
    const { log_id, new_clock_in_time, new_clock_out_time } = req.body;

    if (!log_id) return res.status(400).json({ error: 'Log ID is required' });

    try {
      const result = await AuditLog.adjustClockTimes(log_id, { new_clock_in_time, new_clock_out_time });
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ error: err.error || 'Failed to update clock times' });
    }
  }

  static async generateReport(req, res) {
    const { reportType, start_date, end_date } = req.query;

    if (!reportType || !start_date || !end_date) {
      return res.status(400).json({ error: 'reportType, start_date, and end_date are required.' });
    }

    try {
      if (reportType === 'basic') {
        const query = `
          SELECT e.employee_id, e.name AS employee_name, s.shift_date, s.start_time, s.end_time
          FROM shifts s
          JOIN employees e ON s.employee_id = e.employee_id
          WHERE s.shift_date BETWEEN ? AND ?
          ORDER BY e.employee_id, s.shift_date
        `;

        db.query(query, [start_date, end_date], (err, results) => {
          if (err) return res.status(500).json({ error: 'Failed to generate basic report' });

          const report = {};
          results.forEach(row => {
            if (!report[row.employee_id]) {
              report[row.employee_id] = {
                employeeName: row.employee_name,
                shifts: []
              };
            }
            report[row.employee_id].shifts.push({
              date: row.shift_date,
              startTime: row.start_time,
              endTime: row.end_time
            });
          });

          res.status(200).json({ message: 'Basic report generated', report });
        });
      } else if (reportType === 'clocked') {
        const result = await AuditLog.generateClockedReport(start_date, end_date);
        res.status(200).json({ message: 'Clocked report generated', report: result });
      } else {
        res.status(400).json({ error: 'Invalid reportType. Use "basic" or "clocked".' });
      }
    } catch (err) {
      console.error('Report generation error:', err);
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = ManagerController;
