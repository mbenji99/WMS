import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './views/LoginPage';
import EmployeeDashboard from './views/EmployeeDashboard';
import ManagerDashboard from './views/ManagerDashboard';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/employee" element={<EmployeeDashboard />} />
        <Route path="/manager" element={<ManagerDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
