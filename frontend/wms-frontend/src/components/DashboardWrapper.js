import React from 'react';
import '../styles/DashboardWrapper.css';

const DashboardWrapper = ({ children }) => {
  return (
    <div className="dashboard-wrapper">
      <header className="dashboard-header">
        <h1 className="company-logo">Dar-J-Step</h1>
        <h2 className="system-title">Workforce Management System</h2>
      </header>
      <div className="dashboard-content">{children}</div>
    </div>
  );
};

export default DashboardWrapper;
