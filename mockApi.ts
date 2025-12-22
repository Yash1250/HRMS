
import { User, UserRole, DashboardStats, AttendanceRecord, HRDocument, CompanySettings, TimesheetEntry, LeaveRequest, AppNotification, ExpenseClaim, ExpenseStatus, PayrollRecord } from './types';

const INITIAL_USERS: User[] = [
  {
    id: 'USR-001',
    name: 'Alexander Pierce',
    email: 'admin@hrms.com',
    role: UserRole.ADMIN,
    avatar: 'https://i.pravatar.cc/150?u=admin',
    designation: 'HR Director',
    department: 'Human Resources',
    clockedIn: false,
    salary: 120000,
    phone: '+1 (555) 123-4567',
    joinDate: '2022-03-15',
    location: 'San Francisco, CA',
    bio: 'Dedicated HR leader with over 10 years of experience in organizational development and employee engagement.',
    leaveBalances: { earned: 15, sick: 10, casual: 12 }
  },
  {
    id: 'USR-002',
    name: 'Sarah Jenkins',
    email: 'emp@hrms.com',
    role: UserRole.EMPLOYEE,
    avatar: 'https://i.pravatar.cc/150?u=emp',
    designation: 'UI/UX Designer',
    department: 'Design',
    clockedIn: false,
    salary: 85000,
    phone: '+1 (555) 987-6543',
    joinDate: '2023-01-10',
    location: 'Austin, TX',
    bio: 'Creative designer passionate about crafting intuitive user experiences and modern visual systems.',
    leaveBalances: { earned: 12, sick: 8, casual: 5 }
  }
];

const INITIAL_PAYROLL: PayrollRecord[] = [
  {
    userId: 'USR-002',
    year: 2025,
    payslips: [
      { month: 'January', year: 2025, netSalary: 7083, status: 'Processed', pdfUrl: '#' },
      { month: 'February', year: 2025, netSalary: 7083, status: 'Processed', pdfUrl: '#' },
      { month: 'March', year: 2025, netSalary: 7083, status: 'Processed', pdfUrl: '#' }
    ],
    form16: {
      isEligible: true,
      financialYear: '2024-2025',
      generatedDate: '2025-05-15',
      pdfUrl: '#'
    }
  }
];

class MockDatabase {
  private users: User[];
  private attendance: AttendanceRecord[];
  private documents: HRDocument[];
  private settings: CompanySettings;
  private timesheets: TimesheetEntry[];
  private leaves: LeaveRequest[];
  private expenses: ExpenseClaim[];
  private notifications: AppNotification[];
  private payroll: PayrollRecord[];

  constructor() {
    this.users = JSON.parse(localStorage.getItem('vatsin_users') || JSON.stringify(INITIAL_USERS));
    this.attendance = JSON.parse(localStorage.getItem('vatsin_attendance') || '[]');
    this.documents = JSON.parse(localStorage.getItem('vatsin_docs') || '[]');
    this.timesheets = JSON.parse(localStorage.getItem('vatsin_timesheets') || '[]');
    this.leaves = JSON.parse(localStorage.getItem('vatsin_leaves') || '[]');
    this.expenses = JSON.parse(localStorage.getItem('vatsin_expenses') || '[]');
    this.notifications = JSON.parse(localStorage.getItem('vatsin_notifications') || '[]');
    this.payroll = JSON.parse(localStorage.getItem('vatsin_payroll') || JSON.stringify(INITIAL_PAYROLL));
    this.settings = JSON.parse(localStorage.getItem('vatsin_settings') || JSON.stringify({
      companyName: 'Vatsin Solutions Ltd.',
      timezone: 'UTC-08:00 (PST)',
      fiscalYearStart: 'January',
      notificationsEnabled: true
    }));
  }

  private save() {
    localStorage.setItem('vatsin_users', JSON.stringify(this.users));
    localStorage.setItem('vatsin_attendance', JSON.stringify(this.attendance));
    localStorage.setItem('vatsin_docs', JSON.stringify(this.documents));
    localStorage.setItem('vatsin_timesheets', JSON.stringify(this.timesheets));
    localStorage.setItem('vatsin_leaves', JSON.stringify(this.leaves));
    localStorage.setItem('vatsin_expenses', JSON.stringify(this.expenses));
    localStorage.setItem('vatsin_notifications', JSON.stringify(this.notifications));
    localStorage.setItem('vatsin_payroll', JSON.stringify(this.payroll));
    localStorage.setItem('vatsin_settings', JSON.stringify(this.settings));
  }

  async login(email: string, pass: string): Promise<{ user: User; token: string }> {
    await new Promise(r => setTimeout(r, 600));
    const user = this.users.find(u => u.email === email);
    if (!user) throw new Error('Invalid credentials');
    return { user, token: 'fake-jwt-' + Math.random() };
  }

  async getDashboardStats(user: User, period: string = 'Month'): Promise<DashboardStats> {
    await new Promise(r => setTimeout(r, 300));
    const modifier = period === 'Today' ? 0.1 : period === 'Week' ? 0.4 : 1;
    const pendingCount = this.leaves.filter(l => l.status === 'PENDING').length;
    
    return {
      totalEmployees: this.users.length + 480,
      activeVacancies: Math.round(12 * modifier),
      avgAttendance: '94.5%',
      monthlyPayroll: `$${Math.round(142500 * modifier).toLocaleString()}`,
      pendingLeaves: pendingCount,
      myLeaveBalance: user.leaveBalances ? (user.leaveBalances.earned + user.leaveBalances.sick + user.leaveBalances.casual) : 0,
      myWorkingHours: user.clockedIn ? '6h 45m' : '0h 0m'
    };
  }

  async getPayroll(userId: string): Promise<PayrollRecord | null> {
    await new Promise(r => setTimeout(r, 500));
    return this.payroll.find(p => p.userId === userId) || null;
  }

  async getEmployees(): Promise<User[]> {
    return this.users;
  }

  async getEmployeeById(id: string): Promise<User | null> {
    await new Promise(r => setTimeout(r, 400));
    const user = this.users.find(u => u.id === id);
    return user ? { ...user } : null;
  }

  async addEmployee(employee: Partial<User>): Promise<User> {
    await new Promise(r => setTimeout(r, 800));
    const newUser: User = {
      id: `USR-${Math.floor(Math.random() * 1000)}`,
      name: employee.name || 'Unknown',
      email: employee.email || '',
      role: employee.role || UserRole.EMPLOYEE,
      avatar: `https://i.pravatar.cc/150?u=${Math.random()}`,
      designation: employee.designation || 'Specialist',
      department: employee.department || 'General',
      salary: employee.salary || 50000,
      clockedIn: false,
      joinDate: new Date().toISOString().split('T')[0],
      location: 'HQ',
      phone: '+1 (000) 000-0000',
      leaveBalances: { earned: 12, sick: 10, casual: 10 }
    };
    this.users.push(newUser);
    this.save();
    return newUser;
  }

  async getAttendance(): Promise<AttendanceRecord[]> {
    return [...this.attendance].reverse();
  }

  async toggleClock(userId: string): Promise<User> {
    const user = this.users.find(u => u.id === userId);
    if (!user) throw new Error('User not found');
    user.clockedIn = !user.clockedIn;
    user.clockInTime = user.clockedIn ? new Date().toLocaleTimeString() : undefined;
    
    if (user.clockedIn) {
      this.attendance.push({
        id: Math.random().toString(36).substr(2, 9),
        empId: userId,
        empName: user.name,
        date: new Date().toISOString().split('T')[0],
        clockIn: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        clockOut: null,
        status: new Date().getHours() < 10 ? 'ON-TIME' : 'LATE'
      });
    }
    this.save();
    return { ...user };
  }

  // Expenses
  async getExpenses(user: User): Promise<ExpenseClaim[]> {
    await new Promise(r => setTimeout(r, 400));
    if (user.role === UserRole.ADMIN || user.role === UserRole.MANAGER) {
      return [...this.expenses].reverse();
    }
    return this.expenses.filter(e => e.userId === user.id).reverse();
  }

  async addExpense(claim: Partial<ExpenseClaim>): Promise<ExpenseClaim> {
    await new Promise(r => setTimeout(r, 600));
    const newClaim: ExpenseClaim = {
      id: 'exp_' + Math.random().toString(36).substr(2, 9),
      userId: claim.userId || '',
      userName: claim.userName || '',
      title: claim.title || 'Expense Claim',
      category: claim.category || 'Travel',
      project: claim.project || 'General',
      date: claim.date || new Date().toISOString().split('T')[0],
      currency: claim.currency || 'USD',
      amount: claim.amount || 0,
      comment: claim.comment || '',
      status: 'PENDING',
      submittedAt: new Date().toISOString()
    };
    this.expenses.push(newClaim);

    // Notify Admin
    this.notifications.push({
      id: 'ntf_' + Math.random().toString(36).substr(2, 9),
      userId: 'USR-001',
      message: `New Expense Claim of ${newClaim.currency} ${newClaim.amount} from ${newClaim.userName}`,
      isRead: false,
      type: 'EXPENSE_SUBMITTED',
      timestamp: new Date().toISOString()
    });

    this.save();
    return newClaim;
  }

  async updateExpenseStatus(id: string, status: ExpenseStatus): Promise<void> {
    await new Promise(r => setTimeout(r, 500));
    const claim = this.expenses.find(e => e.id === id);
    if (claim) {
      claim.status = status;

      // Notify User
      this.notifications.push({
        id: 'ntf_' + Math.random().toString(36).substr(2, 9),
        userId: claim.userId,
        message: `Your expense claim for ${claim.title} was ${status.toLowerCase()}.`,
        isRead: false,
        type: 'EXPENSE_STATUS_CHANGED',
        timestamp: new Date().toISOString()
      });

      this.save();
    }
  }

  // Leaves & Notifications
  async getLeaves(user: User): Promise<LeaveRequest[]> {
    await new Promise(r => setTimeout(r, 400));
    if (user.role === UserRole.ADMIN || user.role === UserRole.MANAGER) {
      return [...this.leaves].reverse();
    }
    return this.leaves.filter(l => l.userId === user.id).reverse();
  }

  async applyLeave(request: Partial<LeaveRequest>): Promise<LeaveRequest> {
    await new Promise(r => setTimeout(r, 800));
    const newLeave: LeaveRequest = {
      id: 'leaf_' + Math.random().toString(36).substr(2, 9),
      userId: request.userId || '',
      userName: request.userName || '',
      type: request.type || 'Casual Leave',
      startDate: request.startDate || '',
      endDate: request.endDate || '',
      isHalfDay: request.isHalfDay || false,
      halfDayPeriod: request.halfDayPeriod,
      reason: request.reason || '',
      status: 'PENDING',
      appliedAt: new Date().toISOString()
    };
    this.leaves.push(newLeave);

    // Notify Admin
    this.notifications.push({
      id: 'ntf_' + Math.random().toString(36).substr(2, 9),
      userId: 'USR-001', // Target admin
      message: `New Leave Request from ${newLeave.userName} (${newLeave.type})`,
      isRead: false,
      type: 'LEAVE_SUBMITTED',
      timestamp: new Date().toISOString()
    });

    this.save();
    return newLeave;
  }

  async updateLeaveStatus(id: string, status: 'APPROVED' | 'REJECTED', adminComment: string = ''): Promise<void> {
    await new Promise(r => setTimeout(r, 600));
    const leave = this.leaves.find(l => l.id === id);
    if (leave) {
      leave.status = status;
      leave.adminComment = adminComment;

      // Notify User
      this.notifications.push({
        id: 'ntf_' + Math.random().toString(36).substr(2, 9),
        userId: leave.userId,
        message: `Your leave request for ${leave.startDate} has been ${status.toLowerCase()}.`,
        isRead: false,
        type: 'LEAVE_STATUS_CHANGED',
        timestamp: new Date().toISOString()
      });

      this.save();
    }
  }

  async getNotifications(userId: string): Promise<AppNotification[]> {
    await new Promise(r => setTimeout(r, 200));
    return this.notifications.filter(n => n.userId === userId).reverse();
  }

  async markNotificationsRead(userId: string): Promise<void> {
    this.notifications.filter(n => n.userId === userId).forEach(n => n.isRead = true);
    this.save();
  }

  async getDocuments(): Promise<HRDocument[]> { return this.documents; }
  async addDocument(doc: Partial<HRDocument>): Promise<HRDocument> {
    await new Promise(r => setTimeout(r, 1000));
    const newDoc: HRDocument = { id: 'D'+Math.random(), name: doc.name || '', category: doc.category || 'General', uploadDate: new Date().toISOString(), size: '1MB', type: 'doc' };
    this.documents.push(newDoc); this.save(); return newDoc;
  }
  async getTimesheets(u: User): Promise<TimesheetEntry[]> { return this.timesheets.filter(t => u.role === 'ADMIN' || t.userId === u.id); }
  async addTimesheet(e: any): Promise<any> { this.timesheets.push({...e, id: 'T'+Math.random()}); this.save(); return e; }
  async updateTimesheetStatus(id: string, s: any): Promise<void> { 
    const t = this.timesheets.find(x => x.id === id); if(t) t.status = s; this.save(); 
  }
  async getSettings(): Promise<CompanySettings> { return this.settings; }
  async updateSettings(s: CompanySettings): Promise<CompanySettings> { this.settings = s; this.save(); return s; }
}

export const api = new MockDatabase();
