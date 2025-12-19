
/**
 * VatsinHR Enterprise Backend (Production Source Reference)
 * Handles persistence for organizational data.
 */
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const SECRET_KEY = 'vatsin-hr-super-secret';

// In-memory persistent arrays
let users = [
  { id: '1', email: 'admin@hrms.com', password: 'admin123', role: 'ADMIN', name: 'Alexander Pierce', department: 'HR', designation: 'HR Director' },
  { id: '2', email: 'emp@hrms.com', password: 'emp123', role: 'EMPLOYEE', name: 'Sarah Jenkins', department: 'Design', designation: 'UI/UX Designer' }
];

let leaves = [];
let timesheets = [];
let notifications = [];

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Routes
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, SECRET_KEY, { expiresIn: '8h' });
  res.json({ user, token });
});

// Leave Management
app.get('/api/leaves', authenticateToken, (req, res) => {
  if (req.user.role === 'ADMIN' || req.user.role === 'MANAGER') {
    return res.json(leaves);
  }
  res.json(leaves.filter(l => l.userId === req.user.id));
});

app.post('/api/leaves', authenticateToken, (req, res) => {
  const newLeave = { 
    id: 'leaf_' + Date.now(), 
    userId: req.user.id,
    userName: req.user.name,
    status: 'PENDING',
    appliedAt: new Date().toISOString(),
    ...req.body 
  };
  leaves.push(newLeave);

  // Notify Admins
  notifications.push({
    id: 'ntf_' + Date.now(),
    userId: '1', // Hardcoded Admin ID for demo
    message: `New Leave Request from ${req.user.name}`,
    isRead: false,
    timestamp: new Date().toISOString()
  });

  res.status(201).json(newLeave);
});

app.put('/api/leaves/:id/status', authenticateToken, (req, res) => {
  if (req.user.role !== 'ADMIN' && req.user.role !== 'MANAGER') {
    return res.sendStatus(403);
  }
  const { status, adminComment } = req.body;
  const leave = leaves.find(l => l.id === req.params.id);
  if (leave) {
    leave.status = status;
    leave.adminComment = adminComment;

    // Notify User
    notifications.push({
      id: 'ntf_' + Date.now(),
      userId: leave.userId,
      message: `Your leave request for ${leave.startDate} has been ${status.toLowerCase()}.`,
      isRead: false,
      timestamp: new Date().toISOString()
    });

    res.json(leave);
  } else {
    res.status(404).json({ message: 'Not found' });
  }
});

// Timesheet Management
app.get('/api/timesheets', authenticateToken, (req, res) => {
  if (req.user.role === 'ADMIN' || req.user.role === 'MANAGER') {
    return res.json(timesheets);
  }
  res.json(timesheets.filter(ts => ts.userId === req.user.id));
});

app.post('/api/timesheets', authenticateToken, (req, res) => {
  const { entries, date, totalHours } = req.body;
  const newTs = { 
    id: 'ts_' + Date.now(), 
    userId: req.user.id,
    userName: req.user.name,
    status: 'PENDING',
    date,
    entries,
    totalHours
  };
  timesheets.push(newTs);

  // Notify Admins
  notifications.push({
    id: 'ntf_' + Date.now(),
    userId: '1', // Hardcoded Admin ID for demo
    message: `New Timesheet submitted by ${req.user.name}.`,
    isRead: false,
    timestamp: new Date().toISOString()
  });

  res.status(201).json(newTs);
});

app.put('/api/timesheets/:id/status', authenticateToken, (req, res) => {
  if (req.user.role !== 'ADMIN' && req.user.role !== 'MANAGER') {
    return res.sendStatus(403);
  }
  const { status } = req.body;
  const ts = timesheets.find(t => t.id === req.params.id);
  if (ts) {
    ts.status = status;

    // Notify the specific Employee
    notifications.push({
      id: 'ntf_' + Date.now(),
      userId: ts.userId,
      message: `Your timesheet for ${ts.date} has been ${status.toLowerCase()}.`,
      isRead: false,
      timestamp: new Date().toISOString()
    });

    res.json(ts);
  } else {
    res.status(404).json({ message: 'Not found' });
  }
});

// Notifications
app.get('/api/notifications', authenticateToken, (req, res) => {
  res.json(notifications.filter(n => n.userId === req.user.id));
});

app.listen(PORT, () => {
  console.log(`VatsinHR Backend active on port ${PORT}`);
});
