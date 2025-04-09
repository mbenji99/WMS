// src/views/EmployeeDashboard.js
import React, { useState, useEffect } from 'react';
import {
  viewSchedule,
  viewShift,
  checkClockStatus,
  clockIn,
  clockOut,
} from '../api/api';
import '../styles/EmployeeDashboardView.css';
import DashboardWrapper from '../components/DashboardWrapper';
import { useNavigate } from 'react-router-dom';

const EmployeeDashboard = () => {
  const employeeId = localStorage.getItem('employee-id');
  const employeeName = localStorage.getItem('employee-name');
  const navigate = useNavigate();

  const [shifts, setShifts] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [showShifts, setShowShifts] = useState(false);
  const [showSchedules, setShowSchedules] = useState(false);
  const [clockedInSince, setClockedInSince] = useState(null);
  const [workedMinutes, setWorkedMinutes] = useState(0);

  useEffect(() => {
    const fetchClockStatus = async () => {
      try {
        const status = await checkClockStatus();
        setIsClockedIn(status.isClockedIn);
        if (status.isClockedIn) {
          setClockedInSince(new Date());
        } else {
          setClockedInSince(null);
          setWorkedMinutes(0);
        }
      } catch (err) {
        console.error('Failed to fetch clock status:', err);
      }
    };

    fetchClockStatus();
  }, []);

  useEffect(() => {
    let intervalId;
    if (isClockedIn && clockedInSince) {
      intervalId = setInterval(() => {
        const now = new Date();
        const diff = Math.floor((now - clockedInSince) / 60000);
        setWorkedMinutes(diff);
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [isClockedIn, clockedInSince]);

  const fetchShiftData = async () => {
    try {
      const data = await viewShift();
      setShifts(data);
    } catch (err) {
      console.error('Error fetching shifts:', err);
    }
  };

  const fetchScheduleData = async () => {
    try {
      const data = await viewSchedule();
      setSchedules(data);
    } catch (err) {
      console.error('Error fetching schedule:', err);
    }
  };

  const toggleClock = async () => {
    try {
      if (isClockedIn) {
        await clockOut(employeeId);
        setIsClockedIn(false);
        setClockedInSince(null);
        setWorkedMinutes(0);
      } else {
        await clockIn(employeeId);
        setIsClockedIn(true);
        setClockedInSince(new Date());
      }
    } catch (err) {
      console.error('Clock toggle error:', err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <DashboardWrapper userType="Employee">
      <div className="employee-dashboard">
        <div className="employee-header">
          <h2>Welcome, Employee {employeeName} (ID: {employeeId})</h2>
          <button
            className={`clock-button ${isClockedIn ? 'clocked-in' : 'clocked-out'}`}
            onClick={toggleClock}
          >
            {isClockedIn ? 'Clock Out' : 'Clock In'}
          </button>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>

        {isClockedIn && (
          <p className="clock-timer">🕒 Worked Today: {workedMinutes} minute(s)</p>
        )}

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
