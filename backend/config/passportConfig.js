const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const db = require('../config/db');

console.log('✅ Passport local strategy configuration loaded.');

// 🔐 Manager Authentication Strategy
passport.use('manager-local', new LocalStrategy({
  usernameField: 'manager_id',
  passwordField: 'password'
}, (manager_id, password, done) => {
  const query = 'SELECT * FROM managers WHERE manager_id = ?';
  db.query(query, [manager_id], async (err, results) => {
    if (err) return done(err);
    if (results.length === 0) return done(null, false, { message: 'Invalid manager credentials.' });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return done(null, false, { message: 'Invalid manager credentials.' });

    user.role = 'manager';
    return done(null, user);
  });
}));

// 🔐 Employee Authentication Strategy
passport.use('employee-local', new LocalStrategy({
  usernameField: 'employee_id',
  passwordField: 'password'
}, (employee_id, password, done) => {
  const query = 'SELECT * FROM employees WHERE employee_id = ?';
  db.query(query, [employee_id], async (err, results) => {
    if (err) return done(err);
    if (results.length === 0) return done(null, false, { message: 'Invalid employee credentials.' });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return done(null, false, { message: 'Invalid employee credentials.' });

    user.role = 'employee';
    return done(null, user);
  });
}));

// 🔐 Serialize user
passport.serializeUser((user, done) => {
  done(null, { id: user.manager_id || user.employee_id, role: user.role });
});

// 🔐 Deserialize user
passport.deserializeUser((obj, done) => {
  const { id, role } = obj;

  let query;
  if (role === 'manager') {
    query = 'SELECT * FROM managers WHERE manager_id = ?';
  } else if (role === 'employee') {
    query = 'SELECT * FROM employees WHERE employee_id = ?';
  } else {
    return done(new Error('Invalid role specified during deserialization.'));
  }

  db.query(query, [id], (err, results) => {
    if (err) return done(err);
    if (results.length === 0) return done(null, false);

    const user = results[0];
    user.role = role;
    done(null, user);
  });
});

module.exports = passport;
