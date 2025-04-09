// src/views/ManagerDashboard.js

import React, { useState } from 'react';
import {
  createShift,
  viewManagerShift,
  viewManagerSchedule,
  editShift,
  deleteShift,
  createSchedule,
  deleteSchedule,
  editSchedule,
  generateReport,
} from '../api/api';
import {
  FaEdit,
  FaTrash,
  FaCalendarPlus,
  FaCalendarTimes,
  FaFileAlt,
  FaFilter,
  FaCalendarAlt,
  FaEye,
  FaSignOutAlt,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../styles/ManagerDashboardView.css';
import DashboardWrapper from '../components/DashboardWrapper';

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const [shifts, setShifts] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    employee_id: '',
    shift_date: '',
    start_time: '',
    end_time: '',
  });
  const [filterEmployeeId, setFilterEmployeeId] = useState('');
  const [showShiftTable, setShowShiftTable] = useState(false);
  const [showScheduleTable, setShowScheduleTable] = useState(false);
  const [reportFilters, setReportFilters] = useState({
    reportType: 'basic',
    startDate: '',
    endDate: '',
  });

  const handleLogout = () => {
    localStorage.removeItem('manager-id');
    localStorage.removeItem('password1');
    navigate('/');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const formatDateInput = (dateStr) => {
    const date = new Date(dateStr);
    const offset = date.getTimezoneOffset();
    return new Date(date.getTime() - offset * 60000).toISOString().split('T')[0];
  };

  const handleCreateShift = async () => {
    const { employee_id, shift_date, start_time, end_time } = formData;
    if (!employee_id || !shift_date || !start_time || !end_time) {
      setError('All fields are required.');
      return;
    }
    try {
      const response = await createShift({ employee_id, shift_date, start_time, end_time });
      alert(response.message);
      setFormData({ employee_id: '', shift_date: '', start_time: '', end_time: '' });
      setError('');
      if (showShiftTable) handleViewShifts();
    } catch (err) {
      setError(err.error || 'Failed to create shift.');
    }
  };

  const handleCreateSchedule = async () => {
    if (!filterEmployeeId) return alert('Enter Employee ID to create schedule.');
    try {
      const response = await createSchedule(filterEmployeeId);
      alert(response.message);
      if (showScheduleTable) handleViewSchedules();
    } catch (err) {
      setError(err.error || 'Failed to create schedule.');
    }
  };

  const handleDeleteSchedule = async () => {
    if (!filterEmployeeId) return alert('Enter Employee ID to delete schedule.');
    if (!window.confirm('Delete all schedules for this employee?')) return;
    try {
      const result = await deleteSchedule(filterEmployeeId);
      alert(result.message);
      if (showScheduleTable) handleViewSchedules();
    } catch (err) {
      alert(err.error || 'Failed to delete schedule.');
    }
  };

  const handleViewShifts = async () => {
    if (showShiftTable) return setShowShiftTable(false);
    try {
      const managerId = localStorage.getItem('manager-id');
      const password = localStorage.getItem('password1');
      const data = await viewManagerShift(managerId, password);
      const filtered = filterEmployeeId
        ? data.shifts.filter((s) => s.employee_id === parseInt(filterEmployeeId))
        : data.shifts;
      setShifts(filtered);
      setShowShiftTable(true);
      setError('');
    } catch (err) {
      setError(err.error || 'Error fetching shifts.');
    }
  };

  const handleViewSchedules = async () => {
    if (showScheduleTable) return setShowScheduleTable(false);
    try {
      const managerId = localStorage.getItem('manager-id');
      const password = localStorage.getItem('password1');
      const data = await viewManagerSchedule(managerId, password);
      const flat = Object.entries(data).flatMap(([id, value]) =>
        value.schedule.map((s, index) => ({
          shift_id: index + 1,
          employee_id: parseInt(id),
          employee_name: value.employee_name,
          ...s,
        }))
      );
      const filtered = filterEmployeeId
        ? flat.filter((s) => s.employee_id === parseInt(filterEmployeeId))
        : flat;
      setSchedules(filtered);
      setShowScheduleTable(true);
      setError('');
    } catch (err) {
      setError(err.error || 'Error fetching schedules.');
    }
  };

  const handleEditShift = async (shift) => {
    const shift_date = prompt('New date:', formatDateInput(shift.shift_date));
    const start_time = prompt('New start time:', shift.start_time);
    const end_time = prompt('New end time:', shift.end_time);
    if (shift_date && start_time && end_time) {
      try {
        const result = await editShift(shift.shift_id, { shift_date, start_time, end_time });
        alert(result.message);
        handleViewShifts();
      } catch (err) {
        alert(err.error || 'Failed to edit shift.');
      }
    }
  };

  const handleDeleteShift = async (shiftId) => {
    if (!window.confirm('Delete this shift?')) return;
    try {
      const result = await deleteShift(shiftId);
      alert(result.message);
      handleViewShifts();
    } catch (err) {
      alert(err.error || 'Failed to delete shift.');
    }
  };

  const handleEditSchedule = async (item) => {
    const shift_date = prompt('New date:', item.date);
    const start_time = prompt('New start time:', item.start_time);
    const end_time = prompt('New end time:', item.end_time);
    if (shift_date && start_time && end_time) {
      try {
        const result = await editSchedule(item.shift_id, {
          shift_id: item.shift_id,
          shift_date,
          start_time,
          end_time,
        });
        alert(result.message);
        handleViewSchedules();
      } catch (err) {
        alert(err.error || 'Failed to edit schedule.');
      }
    }
  };

  const handleGenerateReport = async () => {
    const { reportType, startDate, endDate } = reportFilters;
    if (!reportType || !startDate || !endDate) {
      setError('Please fill out all report fields.');
      return;
    }
    try {
      const managerId = localStorage.getItem('manager-id');
      const password = localStorage.getItem('password1');
      const data = await generateReport({ reportType, startDate, endDate }, managerId, password);
      setReportData(data.report);
      setError('');
    } catch (err) {
      setError(err.error || 'Failed to generate report.');
    }
  };

  return (
    <DashboardWrapper userType="Manager">
      <div className="manager-dashboard">
        <h2>Manager Dashboard</h2>

        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>

        <div className="filter-bar">
          <label>
            <FaFilter /> Filter by Employee ID:
            <input
              type="text"
              value={filterEmployeeId}
              onChange={(e) => setFilterEmployeeId(e.target.value)}
              placeholder="Enter Employee ID"
            />
          </label>
        </div>

        <div className="button-group">
          <button onClick={handleViewShifts}>
            <FaEye /> {showShiftTable ? 'Hide Shifts' : 'View Shifts'}
          </button>
          <button onClick={handleViewSchedules}>
            <FaCalendarAlt /> {showScheduleTable ? 'Hide Schedule' : 'View Schedule'}
          </button>
          <button onClick={handleCreateSchedule}>
            <FaCalendarPlus /> Create Schedule
          </button>
          <button onClick={handleDeleteSchedule}>
            <FaCalendarTimes /> Delete Schedule
          </button>
        </div>

        <form
          className="create-shift-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleCreateShift();
          }}
        >
          <h3>Create New Shift</h3>
          <input
            type="text"
            name="employee_id"
            placeholder="Employee ID"
            value={formData.employee_id}
            onChange={handleInputChange}
          />
          <input type="date" name="shift_date" value={formData.shift_date} onChange={handleInputChange} />
          <input type="time" name="start_time" value={formData.start_time} onChange={handleInputChange} />
          <input type="time" name="end_time" value={formData.end_time} onChange={handleInputChange} />
          <button type="submit">Create Shift</button>
        </form>

        {showShiftTable && shifts.length > 0 && (
          <div className="table-section">
            <h3>Shifts</h3>
            <table>
              <thead>
                <tr>
                  <th>Emp ID</th>
                  <th>Date</th>
                  <th>Day</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {shifts.map((shift) => (
                  <tr key={shift.shift_id}>
                    <td>{shift.employee_id}</td>
                    <td>{shift.formatted_date}</td>
                    <td>{shift.day_of_week}</td>
                    <td>{shift.start_time}</td>
                    <td>{shift.end_time}</td>
                    <td>
                      <button onClick={() => handleEditShift(shift)}><FaEdit /></button>
                      <button onClick={() => handleDeleteShift(shift.shift_id)}><FaTrash /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showScheduleTable && schedules.length > 0 && (
          <div className="table-section">
            <h3>Schedules</h3>
            <table>
              <thead>
                <tr>
                  <th>Emp ID</th>
                  <th>Employee Name</th>
                  <th>Date</th>
                  <th>Day</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {schedules.map((item) => (
                  <tr key={item.shift_id}>
                    <td>{item.employee_id}</td>
                    <td>{item.employee_name}</td>
                    <td>{item.date}</td>
                    <td>{item.day_of_week}</td>
                    <td>{item.start_time}</td>
                    <td>{item.end_time}</td>
                    <td><button onClick={() => handleEditSchedule(item)}><FaEdit /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="report-section">
          <h3><FaFileAlt /> Generate Report</h3>
          <label>
            Report Type:
            <select
              value={reportFilters.reportType}
              onChange={(e) => setReportFilters({ ...reportFilters, reportType: e.target.value })}
            >
              <option value="basic">Basic</option>
              <option value="clocked">Clocked</option>
            </select>
          </label>
          <input
            type="date"
            value={reportFilters.startDate}
            onChange={(e) => setReportFilters({ ...reportFilters, startDate: e.target.value })}
          />
          <input
            type="date"
            value={reportFilters.endDate}
            onChange={(e) => setReportFilters({ ...reportFilters, endDate: e.target.value })}
          />
          <button onClick={handleGenerateReport}>Generate</button>

          {reportData && Array.isArray(reportData) && (
  <div className="report-output">
    <h4>Report Results</h4>
    <table className="report-table">
      <thead>
        <tr>
          <th>Employee ID</th>
          <th>Name</th>
          <th>Shift Date</th>
          <th>Start Time</th>
          <th>End Time</th>
          <th>Clock In</th>
          <th>Clock Out</th>
          <th>Minutes Worked</th>
        </tr>
      </thead>
      <tbody>
        {reportData.map((entry, index) => (
          <tr key={index}>
            <td>{entry.employee_id}</td>
            <td>{entry.employee_name}</td>
            <td>{new Date(entry.shift_date).toLocaleDateString()}</td>
            <td>{entry.scheduled_start}</td>
            <td>{entry.scheduled_end}</td>
            <td>{entry.clock_in_time ? new Date(entry.clock_in_time).toLocaleTimeString() : '—'}</td>
            <td>{entry.clock_out_time ? new Date(entry.clock_out_time).toLocaleTimeString() : '—'}</td>
            <td>{entry.minutes_worked !== null ? entry.minutes_worked : '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

        </div>

        {error && <p className="error-msg">{error}</p>}
      </div>
    </DashboardWrapper>
  );
};

export default ManagerDashboard;
