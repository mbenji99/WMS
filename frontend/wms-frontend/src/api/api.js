// src/api/api.js
import axios from 'axios';

const API_BASE = 'http://localhost:3000/api';

// ===== AUTH HEADERS =====
export const getEmployeeAuthHeaders = () => ({
  'employee-id': localStorage.getItem('employee-id'),
  'password': localStorage.getItem('password'),
});

export const getManagerAuthHeaders = () => ({
  'manager-id': localStorage.getItem('manager-id'),
  'password': localStorage.getItem('password1'),
});

// ===== EMPLOYEE API =====
export const viewSchedule = async () => {
  const response = await axios.get(`${API_BASE}/employee/view-schedule`, {
    headers: getEmployeeAuthHeaders(),
  });
  return response.data;
};

export const viewShift = async () => {
  const response = await axios.get(`${API_BASE}/employee/view-shift`, {
    headers: getEmployeeAuthHeaders(),
  });
  return response.data;
};

export const checkClockStatus = async () => {
  const response = await axios.get(`${API_BASE}/employee/clock-status`, {
    headers: getEmployeeAuthHeaders(),
  });
  return response.data;
};

export const clockIn = async (employee_id) => {
  const response = await axios.post(`${API_BASE}/employee/clock-in`, {
    employee_id,
  }, {
    headers: getEmployeeAuthHeaders(),
  });
  return response.data;
};

export const clockOut = async (employee_id) => {
  const response = await axios.post(`${API_BASE}/employee/clock-out`, {
    employee_id,
  }, {
    headers: getEmployeeAuthHeaders(),
  });
  return response.data;
};

// ===== MANAGER API =====
export const viewManagerShift = async (managerId, password) => {
  const response = await axios.get(`${API_BASE}/manager/view-shift`, {
    headers: {
      'manager-id': managerId,
      'password1': password,
    },
  });
  return response.data;
};

export const viewManagerSchedule = async (managerId, password) => {
  const response = await axios.get(`${API_BASE}/manager/view-schedule`, {
    headers: {
      'manager-id': managerId,
      'password1': password,
    },
  });
  return response.data; 
};


export const createShift = async (shiftData) => {
  const response = await axios.post(`${API_BASE}/manager/create-shift`, shiftData, {
    headers: getManagerAuthHeaders(),
  });
  return response.data;
};

export const editShift = async (shiftId, updatedData) => {
  const response = await axios.put(`${API_BASE}/manager/edit-shift/${shiftId}`, updatedData, {
    headers: getManagerAuthHeaders(),
  });
  return response.data;
};

export const deleteShift = async (shiftId) => {
  const response = await axios.delete(`${API_BASE}/manager/delete-shift/${shiftId}`, {
    headers: getManagerAuthHeaders(),
  });
  return response.data;
};

export const createSchedule = async (employeeId, shiftIds) => {
  console.log("Sending schedule request:", {
    employee_id: employeeId,
    shift_ids: shiftIds
  });

  const response = await axios.post(`${API_BASE}/manager/create-schedule`, {
    employee_id: employeeId,
    shift_ids: shiftIds
  }, {
    headers: getManagerAuthHeaders(),
  });

  return response.data;
};



export const editSchedule = async (shiftId, updatedData) => {
  const response = await axios.put(`${API_BASE}/manager/edit-schedule/${shiftId}`, updatedData, {
    headers: getManagerAuthHeaders(),
  });
  return response.data;
};

export const deleteSchedule = async (employeeId) => {
  const response = await axios.delete(`${API_BASE}/manager/delete-schedule/${employeeId}`, {
    headers: getManagerAuthHeaders(),
  });
  return response.data;
};

export const generateReport = async ({ reportType, startDate, endDate }) => {
  const headers = getManagerAuthHeaders();
  const response = await axios.get(`${API_BASE}/manager/generate-report`, {
    headers,
    params: {
      reportType,
      start_date: startDate,
      end_date: endDate,
    },
  });
  return response.data;
};
