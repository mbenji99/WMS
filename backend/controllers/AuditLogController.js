const AuditLog = require('../models/AuditLog');

class AuditLogController {
  async logEvent(req, res) {
    try {
      const { employee_id, action } = req.body;
      const log = new AuditLog(employee_id, action);
      await log.record();
      res.status(201).json({ message: 'Event logged' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to log event' });
    }
  }

  async viewLogs(req, res) {
    try {
      const logs = await AuditLog.getAll();
      res.status(200).json({ logs });
    } catch (err) {
      res.status(500).json({ error: 'Failed to retrieve logs' });
    }
  }
}

module.exports = new AuditLogController();
