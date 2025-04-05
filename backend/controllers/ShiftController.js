const Shift = require('../models/Shift');

class ShiftController {
  async createShift(req, res) {
    try {
      const shift = new Shift(req.body);
      const result = await shift.create();
      res.status(201).json({ message: 'Shift created successfully', shift_id: result.insertId });
    } catch (err) {
      console.error('Create Shift Error:', err);
      res.status(500).json({ error: 'Failed to create shift' });
    }
  }

  async getShiftsByManager(req, res) {
    try {
      const { manager_id } = req.headers;
      const shifts = await Shift.findByManager(manager_id);
      res.status(200).json({ shifts });
    } catch (err) {
      res.status(500).json({ error: 'Failed to retrieve shifts' });
    }
  }

  async updateShift(req, res) {
    try {
      const { shift_id } = req.params;
      const result = await Shift.update(shift_id, req.body);
      res.status(200).json({ message: 'Shift updated successfully', result });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update shift' });
    }
  }

  async deleteShift(req, res) {
    try {
      const { shift_id } = req.params;
      const result = await Shift.delete(shift_id);
      res.status(200).json({ message: 'Shift deleted successfully', result });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete shift' });
    }
  }
}

module.exports = new ShiftController();
