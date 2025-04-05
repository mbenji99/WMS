import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css';

const LoginPage = () => {
  const [userType, setUserType] = useState('employee');
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const endpoint =
        userType === 'employee'
          ? 'http://localhost:3000/api/auth/employee/login'
          : 'http://localhost:3000/api/auth/manager/login';

      const payload =
        userType === 'employee'
          ? { employee_id: id, password }
          : { manager_id: id, password };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Login failed');

      if (userType === 'employee') {
        localStorage.setItem('employee-id', id);
        localStorage.setItem('password', password);
        navigate('/employee');
      } else {
        localStorage.setItem('manager-id', id);
        localStorage.setItem('password1', password);
        navigate('/manager');
      }
    } catch (err) {
      setError(err.message || 'Login failed.');
    }
  };

  return (
    <div className="login-container">
      <h1 className="company-name">Dar-J-Step</h1>
      <h2 className="system-title">Workforce Management System</h2>

      <form onSubmit={handleLogin} className="login-form">
        <div className="user-selection">
          <label>
            <input
              type="radio"
              name="userType"
              value="employee"
              checked={userType === 'employee'}
              onChange={() => setUserType('employee')}
            />
            Employee
          </label>
          <label>
            <input
              type="radio"
              name="userType"
              value="manager"
              checked={userType === 'manager'}
              onChange={() => setUserType('manager')}
            />
            Manager
          </label>
        </div>

        <input
          type="text"
          placeholder="ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        {error && <p className="error-msg">{error}</p>}
      </form>
    </div>
  );
};

export default LoginPage;
