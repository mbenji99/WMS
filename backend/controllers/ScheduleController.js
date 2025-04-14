const Schedule = require('../models/Schedule');

class ScheduleController {
  async createSchedule(req, res) {
    try {
      const { employee_id, shift_ids } = req.body;

      if (!employee_id || !Array.isArray(shift_ids) || shift_ids.length === 0) {
        return res.status(400).json({ error: 'Invalid or missing schedule data' });
      }

      const schedule = new Schedule();
      const result = await schedule.generateFromShifts(employee_id, shift_ids);

      res.status(201).json({ message: 'Schedule created', result });
    } catch (err) {
      console.error('Schedule creation error:', err);
      res.status(500).json({ error: 'Failed to create schedule' });
    }
  }

  async viewSchedule(req, res) {
    try {
      const { employee_id } = req.query;
      const data = await Schedule.findByEmployee(employee_id);
      res.status(200).json({ schedule: data });
    } catch (err) {
      res.status(500).json({ error: 'Failed to retrieve schedule' });
    }
  }

  async deleteSchedule(req, res) {
    try {
      const { employee_id } = req.params;
      const result = await Schedule.deleteByEmployee(employee_id);
      res.status(200).json({ message: 'Schedule deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete schedule' });
    }
  }
}

module.exports = new ScheduleController();
