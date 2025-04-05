// src/views/EmployeeDashboard.js
import React, { useEffect, useState } from 'react';
import {
  viewShift,
  viewSchedule,
  clockIn,
  clockOut,
  checkClockStatus,
} from '../api/api';
import '../styles/EmployeeDashboardView.css';
import DashboardWrapper from '../components/DashboardWrapper';

const EmployeeDashboard = () => {
  const [shifts, setShifts] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [showShifts, setShowShifts] = useState(false);
  const [showSchedules, setShowSchedules] = useState(false);
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [employeeId, setEmployeeId] = useState(null);
  const [employeeName, setEmployeeName] = useState('');

  const fetchShiftData = async () => {
    try {
      const data = await viewShift();
      setShifts(data);
    } catch (err) {
      console.error('Failed to fetch shifts:', err);
    }
  };

  const fetchScheduleData = async () => {
    try {
      const data = await viewSchedule();
      setSchedules(data);
    } catch (err) {
      console.error('Failed to fetch schedules:', err);
    }
  };

  const fetchClockStatus = async () => {
    try {
      const { isClockedIn } = await checkClockStatus();
      setIsClockedIn(isClockedIn);
    } catch (err) {
      console.error('Clock status check failed:', err);
    }
  };

  const toggleClock = async () => {
    const id = localStorage.getItem('employee-id');
    if (!id) return;

    try {
      if (isClockedIn) {
        await clockOut(id);
      } else {
        await clockIn(id);
      }
      fetchClockStatus();
    } catch (err) {
      console.error('Clock toggle error:', err);
    }
  };

  useEffect(() => {
    const id = localStorage.getItem('employee-id');
    const name = localStorage.getItem('employee-name');
    setEmployeeId(id);
    setEmployeeName(name || 'Employee');
    fetchClockStatus();
  }, []);

  return (
    <DashboardWrapper>
      <div className="employee-dashboard">
        <div className="employee-header">
          <h2>Welcome, {employeeName} (ID: {employeeId})</h2>
          <button
            className={`clock-button ${isClockedIn ? 'clocked-in' : 'clocked-out'}`}
            onClick={toggleClock}
          >
            {isClockedIn ? 'Clock Out' : 'Clock In'}
          </button>
        </div>

        <div className="button-bar">
          <button onClick={() => {
            if (!showShifts) fetchShiftData();
            setShowShifts(!showShifts);
          }}>
            {showShifts ? 'Hide Shifts' : 'View Shifts'}
          </button>
          <button onClick={() => {
            if (!showSchedules) fetchScheduleData();
            setShowSchedules(!showSchedules);
          }}>
            {showSchedules ? 'Hide Schedule' : 'View Schedule'}
          </button>
        </div>

        {showShifts && shifts.length > 0 && (
          <div className="table-section">
            <h3>Shifts</h3>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Day</th>
                  <th>Start</th>
                  <th>End</th>
                </tr>
              </thead>
              <tbody>
                {shifts.map((shift) => (
                  <tr key={shift.shift_id}>
                    <td>{shift.formatted_date}</td>
                    <td>{shift.day_of_week}</td>
                    <td>{shift.start_time}</td>
                    <td>{shift.end_time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showSchedules && schedules.length > 0 && (
          <div className="table-section">
            <h3>Schedule</h3>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Day</th>
                  <th>Start</th>
                  <th>End</th>
                </tr>
              </thead>
              <tbody>
                {schedules.map((item) => (
                  <tr key={item.schedule_id}>
                    <td>{item.formatted_date}</td>
                    <td>{item.day_of_week}</td>
                    <td>{item.start_time}</td>
                    <td>{item.end_time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardWrapper>
  );
};

export default EmployeeDashboard;
