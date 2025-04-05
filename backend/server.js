const express = require('express');
const session = require('express-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const cors = require('cors');
require('./config/passportConfig');

const loginRoutes = require('./routes/loginRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const managerRoutes = require('./routes/managerRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Always place CORS at the top
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
}));

// Middleware
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Session
app.use(session({
  secret: 'managerpass',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/employee', employeeRoutes);
app.use('/api/manager', managerRoutes);

// Start server
const port = 3000;
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
