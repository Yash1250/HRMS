import { User, UserRole, DashboardStats, AttendanceRecord, HRDocument, CompanySettings, TimesheetEntry, LeaveRequest, AppNotification, ExpenseClaim, ExpenseStatus, PayrollRecord, PerformanceRecord, Goal, Candidate, Job } from './types';

// ==========================================
// 1. INITIAL DATA (INDIAN CONTEXT)
// ==========================================

const INITIAL_USERS: User[] = [
  {
    id: 'USR-001',
    name: 'Vikram Malhotra',
    email: 'admin@vatsin.in',
    role: UserRole.ADMIN,
    avatar: 'https://i.pravatar.cc/150?u=vikram',
    designation: 'Managing Director',
    department: 'Management',
    clockedIn: false,
    salary: 3500000,
    phone: '+91 98123 45678',
    joinDate: '2020-03-15',
    location: 'Mumbai, MH',
    bio: 'Experienced corporate leader driving organizational excellence.',
    leaveBalances: { earned: 15, sick: 10, casual: 12 },
    status: 'Active',
    canLogin: true
  },
  {
    id: 'USR-002',
    name: 'Ananya Iyer',
    email: 'emp@vatsin.in',
    role: UserRole.EMPLOYEE,
    avatar: 'https://i.pravatar.cc/150?u=ananya',
    designation: 'Senior React Developer',
    department: 'Technology',
    clockedIn: false,
    salary: 1800000,
    phone: '+91 91234 56789',
    joinDate: '2023-01-10',
    location: 'Bengaluru, KA',
    bio: 'Frontend architect focused on high-performance web apps.',
    leaveBalances: { earned: 12, sick: 8, casual: 5 },
    status: 'Active',
    canLogin: true
  }
];

const INITIAL_JOBS: Job[] = [
  { id: 'j1', title: 'Frontend Developer', department: 'Engineering', location: 'Bengaluru / Remote', salary: '₹ 12 - 15 LPA', description: 'Expertise in React, TypeScript and Tailwind.', postedAt: '2024-05-01' },
  { id: 'j2', title: 'HR Manager', department: 'People Ops', location: 'Mumbai, MH', salary: '₹ 8 - 10 LPA', description: 'Lead talent acquisition.', postedAt: '2024-05-05' },
  { id: 'j3', title: 'Marketing Intern', department: 'Growth', location: 'Remote', salary: '₹ 3 - 4 LPA', description: 'Help scale organic reach.', postedAt: '2024-05-12' }
];

const INITIAL_CANDIDATES: Candidate[] = [
  { id: 'c1', name: 'Rahul Sharma', role: 'Frontend Developer', jobId: 'j1', status: 'Applied', email: 'rahul.s@outlook.in', phone: '+91 98765 43210', experience: '3 Years', score: 4.2, appliedAt: '2024-05-10', avatar: 'https://i.pravatar.cc/150?u=rahul', lastUpdate: '2d ago' },
  { id: 'c2', name: 'Priya Patel', role: 'HR Manager', jobId: 'j2', status: 'Screening', email: 'priya.p@gmail.com', phone: '+91 98234 56789', experience: '5 Years', score: 4.8, appliedAt: '2024-05-11', avatar: 'https://i.pravatar.cc/150?u=priya', lastUpdate: '1d ago' },
  { id: 'c3', name: 'Amit Verma', role: 'Frontend Developer', jobId: 'j1', status: 'Interview', email: 'verma.amit@vatsin.in', phone: '+91 99887 76655', experience: '4 Years', score: 4.5, appliedAt: '2024-05-12', avatar: 'https://i.pravatar.cc/150?u=amit', lastUpdate: '3h ago' },
  { id: 'c4', name: 'Sneha Reddy', role: 'Marketing Intern', jobId: 'j3', status: 'Hired', email: 'sneha.r@yahoo.com', phone: '+91 91234 56789', experience: 'Fresher', score: 4.9, appliedAt: '2024-05-09', avatar: 'https://i.pravatar.cc/150?u=sneha', lastUpdate: '5h ago' }
];

const INITIAL_PAYROLL: PayrollRecord[] = [
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

const INITIAL_PERFORMANCE: PerformanceRecord[] = [
  {
    userId: 'USR-002', // Ananya
    goals: [
      { id: '101', title: 'Reduce API Latency', progress: 80, status: 'In Progress', weight: '30%' },
      { id: '102', title: 'React Certification', progress: 100, status: 'Completed', weight: '20%' }
    ],
    appraisals: {
      cycle: '2024-Q4',
      selfRating: 4,
      managerRating: 4.5,
      selfComment: 'Delivered ahead of schedule.',
      managerComment: 'Excellent architectural decisions.',
      finalStatus: 'Eligible for Promotion'
    }
  }
];

const INITIAL_EXPENSES: ExpenseClaim[] = [
  { id: 'exp1', userId: 'USR-002', userName: 'Ananya Iyer', title: 'Client Lunch', category: 'Food', project: 'Client A', date: '2024-05-10', currency: 'INR', amount: 4500, comment: 'Kickoff meeting.', status: 'PENDING', submittedAt: '2024-05-10T14:30:00Z' }
];

const INITIAL_DOCS: HRDocument[] = [
  { id: 'd1', name: 'POSH Policy 2024.pdf', category: 'policies', uploadDate: '2024-01-10', size: '1.4 MB', type: 'application/pdf' },
  { id: 'd2', name: 'Leave Policy 2025.pdf', category: 'policies', uploadDate: '2024-02-15', size: '2.1 MB', type: 'application/pdf' },
  { id: 'd3', name: 'Standard NDA.docx', category: 'contracts', uploadDate: '2023-11-20', size: '450 KB', type: 'docx' }
];

// ==========================================
// 2. MOCK CLASS IMPLEMENTATION
// ==========================================

class MockDatabase {
  private users: User[];
  private payroll: PayrollRecord[];
  private attendance: AttendanceRecord[];
  private settings: CompanySettings;
  private leaves: LeaveRequest[];
  private expenses: ExpenseClaim[];
  private candidates: Candidate[];
  private jobs: Job[];
  private documents: HRDocument[];
  private timesheets: TimesheetEntry[];
  private performance: PerformanceRecord[];
  private notifications: AppNotification[];

  constructor() {
    this.users = JSON.parse(localStorage.getItem('vatsin_users') || JSON.stringify(INITIAL_USERS));
    this.payroll = JSON.parse(localStorage.getItem('vatsin_payroll') || JSON.stringify(INITIAL_PAYROLL));
    this.attendance = JSON.parse(localStorage.getItem('vatsin_attendance') || '[]');
    this.leaves = JSON.parse(localStorage.getItem('vatsin_leaves') || '[]');
    this.expenses = JSON.parse(localStorage.getItem('vatsin_expenses') || JSON.stringify(INITIAL_EXPENSES));
    this.candidates = JSON.parse(localStorage.getItem('vatsin_candidates') || JSON.stringify(INITIAL_CANDIDATES));
    this.jobs = JSON.parse(localStorage.getItem('vatsin_jobs') || JSON.stringify(INITIAL_JOBS));
    this.documents = JSON.parse(localStorage.getItem('vatsin_documents') || JSON.stringify(INITIAL_DOCS));
    this.performance = JSON.parse(localStorage.getItem('vatsin_performance') || JSON.stringify(INITIAL_PERFORMANCE));
    this.timesheets = JSON.parse(localStorage.getItem('vatsin_timesheets') || '[]');
    this.notifications = JSON.parse(localStorage.getItem('vatsin_notifications') || '[]');
    this.settings = JSON.parse(localStorage.getItem('vatsin_settings') || JSON.stringify({
      companyName: 'Vatsin Solutions Pvt. Ltd.',
      timezone: 'UTC+05:30 (IST)',
      fiscalYearStart: 'April',
      notificationsEnabled: true
    }));
  }

  private save() {
    localStorage.setItem('vatsin_users', JSON.stringify(this.users));
    localStorage.setItem('vatsin_payroll', JSON.stringify(this.payroll));
    localStorage.setItem('vatsin_attendance', JSON.stringify(this.attendance));
    localStorage.setItem('vatsin_leaves', JSON.stringify(this.leaves));
    localStorage.setItem('vatsin_expenses', JSON.stringify(this.expenses));
    localStorage.setItem('vatsin_candidates', JSON.stringify(this.candidates));
    localStorage.setItem('vatsin_jobs', JSON.stringify(this.jobs));
    localStorage.setItem('vatsin_documents', JSON.stringify(this.documents));
    localStorage.setItem('vatsin_performance', JSON.stringify(this.performance));
    localStorage.setItem('vatsin_timesheets', JSON.stringify(this.timesheets));
    localStorage.setItem('vatsin_notifications', JSON.stringify(this.notifications));
  }

  // --- AUTH ---
  async login(email: string, pass: string): Promise<{ user: User; token: string }> {
    await new Promise(r => setTimeout(r, 600));
    const user = this.users.find(u => u.email === email && u.status !== 'Archived');
    const validPass = user?.role === 'ADMIN' ? 'admin123' : 'emp123';
    if (!user || pass !== validPass) throw new Error('Invalid credentials');
    return { user, token: 'fake-jwt-' + Math.random() };
  }

  // --- RECRUITMENT ---
  async getJobs(): Promise<Job[]> { return this.jobs; }
  async getCandidates(): Promise<Candidate[]> { return this.candidates; }
  
  async addJob(jobData: any): Promise<Job> {
    const job: Job = { ...jobData, id: 'j' + Date.now(), postedAt: new Date().toISOString().split('T')[0] };
    this.jobs.push(job);
    this.save();
    return job;
  }

  async addCandidate(data: any): Promise<Candidate> {
    const c: Candidate = { 
      ...data, id: 'c' + Date.now(), appliedAt: new Date().toISOString().split('T')[0], 
      score: 4.0, lastUpdate: 'Just now', avatar: `https://i.pravatar.cc/150?u=${Math.random()}` 
    };
    this.candidates.push(c);
    this.save();
    return c;
  }

  async moveCandidate(id: string, status: string): Promise<void> {
    const c = this.candidates.find(x => x.id === id);
    if (c) { c.status = status as any; c.lastUpdate = 'Just now'; this.save(); }
  }

  async onboardCandidate(data: any): Promise<void> {
    const newUser = {
      id: 'USR-' + Date.now(),
      name: data.name,
      email: data.workEmail,
      role: UserRole.EMPLOYEE,
      department: data.department,
      designation: data.designation,
      salary: Number(data.salary),
      status: 'Active',
      canLogin: true,
      avatar: 'https://i.pravatar.cc/150?u=' + Date.now(),
      joinDate: new Date().toISOString().split('T')[0],
      clockedIn: false,
      leaveBalances: { earned: 12, sick: 10, casual: 10 }
    } as User;
    this.users.push(newUser);

    const c = this.candidates.find(x => x.id === data.candidateId);
    if (c) c.status = 'Hired';

    this.payroll.push({
      userId: newUser.id,
      year: 2024,
      payslips: [{ month: 'May', year: 2024, netSalary: Math.floor(newUser.salary/12), status: 'Pending', pdfUrl: '#' }],
      form16: { isEligible: false, financialYear: '2023-2024', generatedDate: '', pdfUrl: '' }
    });
    this.save();
  }

  async updateCandidate(id: string, data: any): Promise<Candidate> {
    const idx = this.candidates.findIndex(c => c.id === id);
    if (idx !== -1) {
      this.candidates[idx] = { ...this.candidates[idx], ...data, lastUpdate: 'Just now' };
      this.save();
      return this.candidates[idx];
    }
    throw new Error('Not found');
  }

  // --- EMPLOYEES ---
  async getEmployees(): Promise<User[]> { return this.users; }
  async getEmployeeById(id: string): Promise<User | null> { return this.users.find(u => u.id === id) || null; }
  
  async addEmployee(data: any): Promise<User> {
    const u: User = { 
      ...data, id: 'USR-'+Date.now(), avatar: 'https://i.pravatar.cc/150?u='+Date.now(), 
      status: 'Active', canLogin: true, clockedIn: false, joinDate: new Date().toISOString().split('T')[0]
    };
    this.users.push(u);
    this.payroll.push({ userId: u.id, year: 2024, payslips: [{ month: 'May', year: 2024, netSalary: Math.floor(u.salary/12), status: 'Pending', pdfUrl: '#' }], form16: { isEligible: false, financialYear: '2023-2024', generatedDate: '', pdfUrl: '' } });
    this.save();
    return u;
  }

  async updateEmployee(id: string, data: any): Promise<User> {
    const idx = this.users.findIndex(u => u.id === id);
    if (idx !== -1) { this.users[idx] = { ...this.users[idx], ...data }; this.save(); return this.users[idx]; }
    throw new Error('Not found');
  }

  async archiveEmployee(id: string, data: any): Promise<void> {
    const u = this.users.find(x => x.id === id);
    if (u) { u.status = 'Archived'; u.canLogin = false; (u as any).exitData = data; this.save(); }
  }

  // --- PAYROLL (ADVANCED) ---
  async getAdminPayrollList(): Promise<any[]> {
    await new Promise(r => setTimeout(r, 400));
    return this.users.filter(u => u.status !== 'Archived').map(u => {
      const record = this.payroll.find(p => p.userId === u.id);
      const slip = record?.payslips.find(s => s.month === 'May' && s.year === 2024);
      return {
        userId: u.id, name: u.name,
        amount: slip ? `₹${slip.netSalary.toLocaleString('en-IN')}` : '₹0',
        status: slip ? slip.status : 'N/A', date: 'May 12, 2024'
      };
    });
  }

  async verifyBatchPayroll(): Promise<any> {
    await new Promise(r => setTimeout(r, 600));
    let count = 0;
    this.payroll.forEach(rec => {
      const slip = rec.payslips.find(s => s.month === 'May' && s.year === 2024);
      if (slip && slip.status === 'Pending') { slip.status = 'Verified'; count++; }
    });
    this.save();
    return { success: true, count };
  }

  async disbursePayroll(): Promise<any> {
    await new Promise(r => setTimeout(r, 800));
    let count = 0;
    let total = 0;
    this.payroll.forEach(rec => {
      const slip = rec.payslips.find(s => s.month === 'May' && s.year === 2024);
      if (slip && slip.status === 'Verified') { slip.status = 'Processed'; count++; total += slip.netSalary; }
    });
    this.save();
    return { success: true, count, total: `₹${total.toLocaleString('en-IN')}` };
  }

  async getPayroll(userId: string): Promise<PayrollRecord | null> {
    return this.payroll.find(p => p.userId === userId) || null;
  }

  async verifyIndividualPayroll(userId: string): Promise<any> {
    const rec = this.payroll.find(p => p.userId === userId);
    const slip = rec?.payslips.find(s => s.month === 'May' && s.year === 2024);
    if (slip) { slip.status = 'Verified'; this.save(); return { success: true }; }
    throw new Error('Not found');
  }

  async getDistributionHistory(): Promise<any[]> {
    return [
      { month: 'April', year: 2024, total: 8425000, employees: 422, status: 'Disbursed' },
      { month: 'March', year: 2024, total: 8250000, employees: 418, status: 'Disbursed' },
    ];
  }

  // --- ATTENDANCE ---
  async getAttendance(): Promise<AttendanceRecord[]> { return this.attendance; }
  
  async toggleClock(userId: string): Promise<User> {
    const u = this.users.find(x => x.id === userId);
    if (!u) throw new Error('User not found');
    u.clockedIn = !u.clockedIn;
    
    if (u.clockedIn) {
      this.attendance.push({
        id: 'att_' + Date.now(), empId: u.id, empName: u.name, date: new Date().toLocaleDateString('en-GB'),
        clockIn: new Date().toLocaleTimeString(), clockOut: null, status: 'ON-TIME'
      } as any);
    } else {
      const today = new Date().toLocaleDateString('en-GB');
      const rec = this.attendance.find(a => a.empId === u.id && a.date === today && !a.clockOut);
      if (rec) { rec.clockOut = new Date().toLocaleTimeString(); }
    }
    this.save();
    return { ...u };
  }

  // --- EXPENSES ---
  async getExpenses(u: User): Promise<ExpenseClaim[]> {
    if (u.role === 'ADMIN') return this.expenses;
    return this.expenses.filter(e => e.userId === u.id);
  }
  
  async addExpense(data: any): Promise<void> {
    this.expenses.push({ ...data, id: 'exp_'+Date.now(), status: 'PENDING', submittedAt: new Date().toISOString() });
    this.save();
  }

  async updateExpenseStatus(id: string, status: string): Promise<void> {
    const ex = this.expenses.find(x => x.id === id);
    if (ex) { ex.status = status as any; this.save(); }
  }

  // --- PERFORMANCE ---
  async getPerformance(uid: string): Promise<PerformanceRecord | null> { return this.performance.find(p => p.userId === uid) || null; }
  async getAllPerformance(): Promise<PerformanceRecord[]> { return this.performance; }
  async addGoal(uid: string, goal: any): Promise<void> {
    const rec = this.performance.find(p => p.userId === uid);
    const newGoal = { ...goal, id: Date.now(), progress: 0, status: 'Not Started' };
    if (rec) rec.goals.push(newGoal);
    else this.performance.push({ userId: uid, goals: [newGoal], appraisals: { cycle: '2024-Q4', selfRating: 0, managerRating: null, selfComment: '', managerComment: '', finalStatus: 'Pending' } });
    this.save();
  }
  async updateAppraisal(uid: string, data: any): Promise<void> {
    const rec = this.performance.find(p => p.userId === uid);
    if (rec) { rec.appraisals = { ...rec.appraisals, ...data }; this.save(); }
  }

  // --- DOCUMENTS ---
  async getDocumentsByCategory(cat: string): Promise<HRDocument[]> { return this.documents.filter(d => d.category === cat); }
  async addDocument(data: any): Promise<HRDocument> {
    const d = { ...data, id: 'd'+Date.now(), uploadDate: new Date().toISOString().split('T')[0], type: 'application/pdf' };
    this.documents.push(d); this.save(); return d;
  }
  async deleteDocument(cat: string, id: string): Promise<void> {
    this.documents = this.documents.filter(d => d.id !== id); this.save();
  }

  // --- LEAVES & TIMESHEETS ---
  async getLeaves(u: User): Promise<LeaveRequest[]> { 
    if (u.role === UserRole.ADMIN || u.role === UserRole.MANAGER) return this.leaves;
    return this.leaves.filter(l => l.userId === u.id);
  }
  async applyLeave(data: any): Promise<void> { 
    this.leaves.push({ ...data, id: 'l'+Date.now(), status: 'PENDING', appliedAt: new Date().toISOString() }); 
    this.save(); 
  }
  async updateLeaveStatus(id: string, s: string, c: string): Promise<void> { 
    const l = this.leaves.find(x => x.id === id); if(l) { l.status = s as any; l.adminComment = c; this.save(); }
  }
  async getTimesheets(u: User): Promise<TimesheetEntry[]> { 
    if (u.role === UserRole.ADMIN || u.role === UserRole.MANAGER) return this.timesheets;
    return this.timesheets.filter(t => t.userId === u.id);
  }
  async addTimesheet(data: any): Promise<void> { 
    this.timesheets.push({ ...data, id: 't'+Date.now(), status: 'PENDING' }); 
    this.save(); 
  }
  async updateTimesheetStatus(id: string, status: string): Promise<void> {
    const ts = this.timesheets.find(x => x.id === id);
    if (ts) { ts.status = status as any; this.save(); }
  }

  // --- NOTIFICATIONS ---
  async getNotifications(uid: string): Promise<AppNotification[]> { 
    return this.notifications.filter(n => n.userId === uid); 
  }
  async markNotificationsRead(uid: string): Promise<void> {
    this.notifications.forEach(n => { if (n.userId === uid) n.isRead = true; });
    this.save();
  }

  // --- SETTINGS ---
  async getSettings(): Promise<CompanySettings> { return this.settings; }
  async updateSettings(s: CompanySettings): Promise<void> { this.settings = s; this.save(); }

  // --- DASHBOARD STATS ---
  async getDashboardStats(user: User, period: string): Promise<DashboardStats> {
    return {
      totalEmployees: this.users.filter(u => u.status !== 'Archived').length,
      activeVacancies: this.jobs.length,
      avgAttendance: '96%',
      monthlyPayroll: `₹${(this.users.reduce((acc, u) => acc + (u.salary || 0), 0) / 12).toLocaleString('en-IN')}`,
      pendingLeaves: this.leaves.filter(l => l.status === 'PENDING').length,
      myLeaveBalance: user.leaveBalances?.earned || 0,
      myWorkingHours: user.clockedIn ? 'Ongoing' : '0h'
    };
  }
}

export const api = new MockDatabase();