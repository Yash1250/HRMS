
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
let expenses = [];
let notifications = [];
let payroll = [
  {
    userId: '2',
    year: 2025,
    payslips: [
      { month: 'January', year: 2025, netSalary: 7083, status: 'Processed', pdfUrl: '#' },
      { month: 'February', year: 2025, netSalary: 7083, status: 'Processed', pdfUrl: '#' }
    ],
    form16: {
      isEligible: true,
      financialYear: '2024-2025',
      generatedDate: '2025-05-15',
      pdfUrl: '#'
    }
  }
];

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

// Payroll
app.get('/api/payroll/:userId', authenticateToken, (req, res) => {
  const record = payroll.find(p => p.userId === req.params.userId);
  if (!record) return res.status(404).json({ message: 'Payroll not found' });
  res.json(record);
});

// Expense Management
app.get('/api/expenses', authenticateToken, (req, res) => {
  if (req.user.role === 'ADMIN' || req.user.role === 'MANAGER') {
    return res.json(expenses);
  }
  res.json(expenses.filter(e => e.userId === req.user.id));
});

app.post('/api/expenses', authenticateToken, (req, res) => {
  const newExp = {
    id: 'exp_' + Date.now(),
    userId: req.user.id,
    userName: req.user.name,
    submittedAt: new Date().toISOString(),
    status: 'PENDING',
    ...req.body
  };
  expenses.push(newExp);

  // Notify Admin
  notifications.push({
    id: 'ntf_' + Date.now(),
    userId: '1', // Target admin
    message: `New Expense Claim of ${newExp.amount} from ${req.user.name}`,
    isRead: false,
    timestamp: new Date().toISOString()
  });

  res.status(201).json(newExp);
});

app.put('/api/expenses/:id/status', authenticateToken, (req, res) => {
  if (req.user.role !== 'ADMIN' && req.user.role !== 'MANAGER') {
    return res.sendStatus(403);
  }
  const { status } = req.body;
  const exp = expenses.find(e => e.id === req.params.id);
  if (exp) {
    exp.status = status;
    // Notify User
    notifications.push({
      id: 'ntf_' + Date.now(),
      userId: exp.userId,
      message: `Your expense claim for ${exp.title} was ${status.toLowerCase()}.`,
      isRead: false,
      timestamp: new Date().toISOString()
    });
    res.json(exp);
  } else {
    res.status(404).json({ message: 'Not found' });
  }
});

app.listen(PORT, () => {
  console.log(`VatsinHR Backend active on port ${PORT}`);
});
