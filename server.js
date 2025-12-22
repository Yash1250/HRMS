
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
let performance = [
  {
    "userId": "2",
    "goals": [
      { "id": 101, "title": "Reduce API Latency", "progress": 80, "status": "In Progress", "weight": "30%" },
      { "id": 102, "title": "Complete React Certification", "progress": 100, "status": "Completed", "weight": "20%" }
    ],
    "appraisals": {
      "cycle": "2024-Q4",
      "selfRating": 4,
      "managerRating": 4.5,
      "selfComment": "I delivered the module ahead of time.",
      "managerComment": "Excellent work on the UI architecture.",
      "finalStatus": "Eligible for Promotion"
    }
  }
];

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

// Hierarchical Documentation
let documents = {
  "policies": [
    { "id": "d1", "name": "IT Security Policy.pdf", "uploadDate": "2024-01-10", "size": "2.4 MB", "type": "application/pdf" },
    { "id": "d2", "name": "Leave Policy 2025.pdf", "uploadDate": "2024-02-15", "size": "1.1 MB", "type": "application/pdf" }
  ],
  "contracts": [
    { "id": "d3", "name": "Standard Employment Agreement.docx", "uploadDate": "2023-11-20", "size": "500 KB", "type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }
  ],
  "onboarding": [],
  "reports": []
};

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

// Performance
app.get('/api/performance/:userId', authenticateToken, (req, res) => {
  const data = performance.find(p => p.userId === req.params.userId);
  res.json(data || null);
});

app.post('/api/performance/goals', authenticateToken, (req, res) => {
  const { userId, title, weight } = req.body;
  let record = performance.find(p => p.userId === userId);
  const newGoal = { id: Date.now(), title, weight, progress: 0, status: 'Not Started' };
  if (record) {
    record.goals.push(newGoal);
  } else {
    performance.push({ userId, goals: [newGoal], appraisals: { cycle: '2024-Q4', selfRating: 0, managerRating: null, selfComment: '', managerComment: '', finalStatus: 'Pending' } });
  }
  res.status(201).json(newGoal);
});

app.put('/api/performance/review', authenticateToken, (req, res) => {
  const { userId, selfRating, selfComment, managerRating, managerComment, finalStatus } = req.body;
  let record = performance.find(p => p.userId === userId);
  if (record) {
    record.appraisals = { ...record.appraisals, selfRating, selfComment, managerRating, managerComment, finalStatus };
    res.json(record);
  } else {
    res.status(404).json({ message: 'Not found' });
  }
});

// Documentation
app.get('/api/documents/:folderId', authenticateToken, (req, res) => {
  const folder = documents[req.params.folderId];
  if (!folder) return res.status(404).json({ message: 'Folder not found' });
  res.json(folder);
});

app.post('/api/documents/:folderId', authenticateToken, (req, res) => {
  if (req.user.role !== 'ADMIN' && req.user.role !== 'MANAGER') {
    return res.sendStatus(403);
  }
  const { name, size } = req.body;
  const newDoc = {
    id: 'd' + Date.now(),
    name,
    uploadDate: new Date().toISOString().split('T')[0],
    size,
    type: 'application/pdf'
  };
  if (!documents[req.params.folderId]) {
    documents[req.params.folderId] = [];
  }
  documents[req.params.folderId].push(newDoc);
  res.status(201).json(newDoc);
});

// Added DELETE endpoint for documents
app.delete('/api/documents/:folderId/:fileId', authenticateToken, (req, res) => {
  if (req.user.role !== 'ADMIN' && req.user.role !== 'MANAGER') {
    return res.sendStatus(403);
  }
  const { folderId, fileId } = req.params;
  if (documents[folderId]) {
    documents[folderId] = documents[folderId].filter(d => d.id !== fileId);
    return res.json({ success: true });
  }
  res.status(404).json({ message: 'Folder not found' });
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
