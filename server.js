/**
 * VatsinHR Enterprise Backend (MERGED MASTER)
 * Combines Legacy Modules (Expenses, Performance) with Next-Gen Modules (Payroll, ATS, Indian Localization).
 */
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const SECRET_KEY = 'vatsin-hr-super-secret';

// ==========================================
// 1. DATA ARCHIVE (GLOBAL STATE)
// ==========================================

// USERS (Indian Context)
let users = [
  { id: 'USR-001', email: 'admin@vatsin.in', password: 'admin123', role: 'ADMIN', name: 'Vikram Malhotra', department: 'Management', designation: 'Managing Director', status: 'Active', canLogin: true, avatar: 'https://i.pravatar.cc/150?u=vikram', salary: 3500000, joinDate: '2020-03-15' },
  { id: 'USR-002', email: 'emp@vatsin.in', password: 'emp123', role: 'EMPLOYEE', name: 'Ananya Iyer', department: 'Technology', designation: 'Senior React Developer', status: 'Active', canLogin: true, avatar: 'https://i.pravatar.cc/150?u=ananya', salary: 1800000, joinDate: '2023-01-10' }
];

// RECRUITMENT DATA
let jobs = [
  { id: 'j1', title: 'Frontend Developer', department: 'Engineering', location: 'Bengaluru / Remote', salary: '₹ 12,00,000 - ₹ 15,00,000', description: 'Expertise in React, TypeScript and Tailwind CSS required.', postedAt: '2024-05-01' },
  { id: 'j2', title: 'HR Manager', department: 'People Ops', location: 'Mumbai, MH', salary: '₹ 8,00,000 - ₹ 10,00,000', description: 'Lead talent acquisition and organizational culture.', postedAt: '2024-05-05' },
  { id: 'j3', title: 'Marketing Intern', department: 'Growth', location: 'Remote', salary: '₹ 3,00,000 - ₹ 4,00,000', description: 'Help scale our organic reach and community engagement.', postedAt: '2024-05-12' }
];

let candidates = [
  { id: 'c1', name: 'Rahul Sharma', role: 'Frontend Developer', jobId: 'j1', status: 'Applied', email: 'rahul.s@outlook.in', phone: '+91 98765 43210', experience: '3 Years', score: 4.2, appliedAt: '2024-05-10', avatar: 'https://i.pravatar.cc/150?u=rahul', lastUpdate: '2d ago' },
  { id: 'c2', name: 'Priya Patel', role: 'HR Manager', jobId: 'j2', status: 'Screening', email: 'priya.p@gmail.com', phone: '+91 98234 56789', experience: '5 Years', score: 4.8, appliedAt: '2024-05-11', avatar: 'https://i.pravatar.cc/150?u=priya', lastUpdate: '1d ago' },
  { id: 'c3', name: 'Amit Verma', role: 'Frontend Developer', jobId: 'j1', status: 'Interview', email: 'verma.amit@vatsin.in', phone: '+91 99887 76655', experience: '4 Years', score: 4.5, appliedAt: '2024-05-12', avatar: 'https://i.pravatar.cc/150?u=amit', lastUpdate: '3h ago' },
  { id: 'c4', name: 'Sneha Reddy', role: 'Marketing Intern', jobId: 'j3', status: 'Hired', email: 'sneha.r@yahoo.com', phone: '+91 91234 56789', experience: 'Fresher', score: 4.9, appliedAt: '2024-05-09', avatar: 'https://i.pravatar.cc/150?u=sneha', lastUpdate: '5h ago' },
  { id: 'c5', name: 'Arjun Das', role: 'Frontend Developer', jobId: 'j1', status: 'Rejected', email: 'arjun.d@rediffmail.com', phone: '+91 90000 11111', experience: '2 Years', score: 3.1, appliedAt: '2024-05-13', avatar: 'https://i.pravatar.cc/150?u=arjun', lastUpdate: 'Just now' }
];

// PAYROLL DATA (New Structure)
let payroll = [
  {
    userId: 'USR-001',
    year: 2024,
    payslips: [
      { month: 'May', year: 2024, netSalary: 285000, status: 'Pending', pdfUrl: '#' },
      { month: 'April', year: 2024, netSalary: 285000, status: 'Processed', pdfUrl: '#' }
    ],
    form16: { isEligible: true, financialYear: '2023-2024', generatedDate: '2024-05-15', pdfUrl: '#' }
  },
  {
    userId: 'USR-002',
    year: 2024,
    payslips: [
      { month: 'May', year: 2024, netSalary: 125000, status: 'Pending', pdfUrl: '#' },
      { month: 'April', year: 2024, netSalary: 125000, status: 'Processed', pdfUrl: '#' }
    ],
    form16: { isEligible: true, financialYear: '2023-2024', generatedDate: '2024-05-15', pdfUrl: '#' }
  }
];

// DOCUMENTATION (Flat Structure)
let documents = [
  { id: 'd1', name: 'POSH Policy 2024.pdf', category: 'policies', uploadDate: '2024-01-10', size: '1.4 MB', type: 'application/pdf' },
  { id: 'd2', name: 'Leave Policy 2025.pdf', category: 'policies', uploadDate: '2024-02-15', size: '2.1 MB', type: 'application/pdf' },
  { id: 'd3', name: 'Standard NDA India.docx', category: 'contracts', uploadDate: '2023-11-20', size: '450 KB', type: 'docx' }
];

// EXPENSES (Restored from Old, Mapped to USR-002)
let expenses = [
  { id: 'exp1', userId: 'USR-002', userName: 'Ananya Iyer', title: 'Client Lunch - Bengaluru', category: 'Food', project: 'Client A', date: '2024-05-10', currency: 'INR', amount: 4500, comment: 'Project kickoff lunch.', status: 'PENDING', submittedAt: '2024-05-10T14:30:00Z' }
];

// PERFORMANCE (Restored from Old, Mapped to USR-002)
let performance = [
  {
    "userId": "USR-002", // Ananya
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

// ATTENDANCE & OTHERS
let attendance = [
    { id: 1, userId: 'USR-001', date: '23/12/2025', checkIn: '09:00 AM', checkOut: '06:00 PM', status: 'Present', production: '9h' },
    { id: 2, userId: 'USR-002', date: '23/12/2025', checkIn: '09:15 AM', checkOut: '06:30 PM', status: 'Present', production: '9h 15m' }
];
let notifications = [];
let leaves = [];
let timesheets = [];

// ==========================================
// 2. MIDDLEWARE
// ==========================================

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

// ==========================================
// 3. ROUTES: AUTH
// ==========================================

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password && u.status !== 'Archived');
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, SECRET_KEY, { expiresIn: '8h' });
  res.json({ user, token });
});

// ==========================================
// 4. ROUTES: RECRUITMENT (ATS)
// ==========================================

app.get('/api/recruitment/jobs', authenticateToken, (req, res) => {
  res.json(jobs);
});

app.post('/api/recruitment/jobs', authenticateToken, (req, res) => {
  const newJob = { ...req.body, id: 'j' + (jobs.length + 1), postedAt: new Date().toISOString().split('T')[0] };
  jobs.push(newJob);
  res.status(201).json(newJob);
});

app.get('/api/recruitment/candidates', authenticateToken, (req, res) => {
  res.json(candidates);
});

app.post('/api/recruitment/candidates', authenticateToken, (req, res) => {
  const newCandidate = { 
    ...req.body, 
    id: 'c' + (candidates.length + 1), 
    appliedAt: new Date().toISOString().split('T')[0],
    score: 4.0,
    lastUpdate: 'Just now',
    avatar: `https://i.pravatar.cc/150?u=${Date.now()}`
  };
  candidates.push(newCandidate);
  res.status(201).json(newCandidate);
});

app.put('/api/recruitment/move', authenticateToken, (req, res) => {
  const { candidateId, newStatus } = req.body;
  const candidate = candidates.find(c => c.id === candidateId);
  if (candidate) {
    candidate.status = newStatus;
    candidate.lastUpdate = 'Just now';
    console.log(`SERVER: Candidate ${candidateId} moved to ${newStatus}`);
    res.json({ success: true, candidate });
  } else {
    res.status(404).json({ message: 'Candidate not found' });
  }
});

// ==========================================
// 5. ROUTES: EMPLOYEES & ONBOARDING
// ==========================================

app.get('/api/employees', authenticateToken, (req, res) => {
  res.json(users);
});

app.get('/api/employees/:id', authenticateToken, (req, res) => {
  const emp = users.find(u => u.id === req.params.id);
  emp ? res.json(emp) : res.status(404).json({ message: 'Employee not found' });
});

app.post('/api/employees/onboard', authenticateToken, (req, res) => {
  const { name, workEmail, department, designation, salary, candidateId } = req.body;
  const newUser = {
    id: 'USR-' + Date.now(),
    name,
    email: workEmail,
    role: 'EMPLOYEE',
    department,
    designation,
    salary: Number(salary),
    status: 'Active',
    canLogin: true,
    avatar: 'https://i.pravatar.cc/150?u=' + Date.now(),
    joinDate: new Date().toISOString().split('T')[0],
    password: 'emp123'
  };
  users.push(newUser);
  
  // Mark candidate as Hired in ATS
  const candidate = candidates.find(c => c.id === candidateId);
  if (candidate) candidate.status = 'Hired';

  // Initialize Payroll Record
  payroll.push({
    userId: newUser.id,
    year: 2024,
    payslips: [{ month: 'May', year: 2024, netSalary: Math.floor(newUser.salary / 12), status: 'Pending', pdfUrl: '#' }],
    form16: { isEligible: false, financialYear: '2023-2024', generatedDate: '', pdfUrl: '' }
  });

  res.status(201).json(newUser);
});

app.post('/api/employees/offboard', authenticateToken, (req, res) => {
  const { userId, exitDate, exitReason, exitComments } = req.body;
  const emp = users.find(u => u.id === userId);
  if (emp) {
    emp.status = 'Archived';
    emp.canLogin = false;
    emp.exitDate = exitDate;
    emp.exitReason = exitReason;
    emp.exitComments = exitComments;
    res.json({ success: true });
  } else {
    res.status(404).json({ message: 'Employee not found' });
  }
});

// ==========================================
// 6. ROUTES: PAYROLL (Advanced Logic)
// ==========================================

app.get('/api/payroll/admin-list', authenticateToken, (req, res) => {
  if (req.user.role !== 'ADMIN') return res.sendStatus(403);
  const list = users.filter(u => u.status !== 'Archived').map(u => {
    const record = payroll.find(p => p.userId === u.id);
    const slip = record?.payslips.find(s => s.month === 'May' && s.year === 2024);
    return {
      userId: u.id,
      name: u.name,
      amount: slip ? `₹${slip.netSalary.toLocaleString('en-IN')}` : '₹0',
      status: slip ? slip.status : 'N/A',
      date: 'May 12, 2024'
    };
  });
  res.json(list);
});

app.post('/api/payroll/verify/:userId', authenticateToken, (req, res) => {
  const { userId } = req.params;
  const record = payroll.find(p => p.userId === userId);
  if (record) {
    const slip = record.payslips.find(s => s.month === 'May' && s.year === 2024);
    if (slip) {
      slip.status = 'Verified';
      console.log(`SERVER: Individual Verification - User ${userId} status set to Verified`);
      return res.json({ success: true });
    }
  }
  res.status(404).json({ message: 'Record not found' });
});

app.post('/api/payroll/verify-all', authenticateToken, (req, res) => {
  console.log("SERVER: Verifying all pending entries...");
  let count = 0;
  payroll.forEach(record => {
    const slip = record.payslips.find(s => s.month === 'May' && s.year === 2024);
    if (slip && slip.status === 'Pending') {
      slip.status = 'Verified';
      count++;
    }
  });
  console.log(`SERVER: Updated ${count} records to Verified.`);
  res.json({ success: true, count });
});

app.post('/api/payroll/disburse', authenticateToken, (req, res) => {
  let count = 0;
  let total = 0;
  payroll.forEach(record => {
    const slip = record.payslips.find(s => s.month === 'May' && s.year === 2024);
    if (slip && slip.status === 'Verified') {
      slip.status = 'Processed';
      count++;
      total += slip.netSalary;
    }
  });
  res.json({ success: true, count, total: `₹${total.toLocaleString('en-IN')}` });
});

app.get('/api/payroll/:userId', authenticateToken, (req, res) => {
  const record = payroll.find(p => p.userId === req.params.userId);
  record ? res.json(record) : res.status(404).json({ message: 'Not found' });
});

// ==========================================
// 7. ROUTES: PERFORMANCE (Restored)
// ==========================================

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

// ==========================================
// 8. ROUTES: EXPENSES (Restored)
// ==========================================

app.get('/api/expenses', authenticateToken, (req, res) => {
  if (req.user.role === 'ADMIN') {
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
  res.status(201).json(newExp);
});

app.put('/api/expenses/:id/status', authenticateToken, (req, res) => {
  if (req.user.role !== 'ADMIN') return res.sendStatus(403);
  const { status } = req.body;
  const exp = expenses.find(e => e.id === req.params.id);
  if (exp) {
    exp.status = status;
    res.json(exp);
  } else {
    res.status(404).json({ message: 'Not found' });
  }
});

// ==========================================
// 9. ROUTES: DOCUMENTS
// ==========================================

app.get('/api/documents/:category', authenticateToken, (req, res) => {
  res.json(documents.filter(d => d.category === req.params.category));
});

app.post('/api/documents', authenticateToken, (req, res) => {
  const newDoc = { 
    ...req.body, 
    id: 'd' + (documents.length + 1), 
    uploadDate: new Date().toISOString().split('T')[0], 
    type: 'application/pdf'
  };
  documents.push(newDoc);
  res.status(201).json(newDoc);
});

app.delete('/api/documents/:id', authenticateToken, (req, res) => {
  const idx = documents.findIndex(d => d.id === req.params.id);
  if (idx !== -1) {
    documents.splice(idx, 1);
    res.json({ success: true });
  } else {
    res.status(404).json({ message: 'Document not found' });
  }
});

// ==========================================
// 10. ROUTES: ATTENDANCE (New)
// ==========================================

app.get('/api/attendance/:userId', authenticateToken, (req, res) => {
    const history = attendance.filter(a => a.userId === req.params.userId);
    res.json(history);
});

app.post('/api/attendance/clock-in', authenticateToken, (req, res) => {
    const { userId, time } = req.body;
    attendance.push({
        id: Date.now(),
        userId,
        date: new Date().toLocaleDateString('en-GB'),
        checkIn: time,
        checkOut: null,
        status: 'Present',
        production: 'In Progress'
    });
    res.json({ success: true });
});

app.post('/api/attendance/clock-out', authenticateToken, (req, res) => {
    const { userId, time } = req.body;
    const todayStr = new Date().toLocaleDateString('en-GB');
    const record = attendance.find(a => a.userId === userId && a.date === todayStr);
    if(record) {
        record.checkOut = time;
        record.production = '9h'; // Dummy calculation
        res.json({ success: true });
    } else {
        res.status(404).json({ message: 'No check-in found for today' });
    }
});

// ==========================================
// SERVER START
// ==========================================

app.listen(PORT, () => {
  console.log(`VatsinHR Enterprise Core active on port ${PORT}`);
  console.log(`System Status: RECRUITMENT_READY, PAYROLL_READY, AUTH_ACTIVE, PERF_ACTIVE`);
});