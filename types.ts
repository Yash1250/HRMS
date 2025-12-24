
import React from 'react';

export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  EMPLOYEE = 'EMPLOYEE'
}

export interface Candidate {
  id: string;
  name: string;
  role: string;
  jobId?: string; // Optional link to a Job ID
  status: 'Applied' | 'Screening' | 'Interview' | 'Offer' | 'Hired' | 'Rejected';
  email: string;
  phone: string;
  experience: string;
  score: number;
  appliedAt: string;
  avatar: string;
  lastUpdate: string;
}

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  salary: string;
  description: string;
  postedAt: string;
}

export interface LeaveBalance {
  earned: number;
  sick: number;
  casual: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  designation: string;
  department: string;
  clockedIn?: boolean;
  clockInTime?: string;
  salary?: number;
  phone?: string;
  joinDate?: string;
  location?: string;
  bio?: string;
  leaveBalances?: LeaveBalance;
  status?: 'Active' | 'Archived';
  canLogin?: boolean;
  // Offboarding fields
  exitDate?: string;
  exitReason?: string;
  exitComments?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
}

export interface Goal {
  id: string;
  title: string;
  progress: number;
  status: 'Not Started' | 'In Progress' | 'Completed';
  weight: string;
}

export interface Appraisal {
  cycle: string;
  selfRating: number;
  managerRating: number | null;
  selfComment: string;
  managerComment: string;
  finalStatus: string;
}

export interface PerformanceRecord {
  userId: string;
  goals: Goal[];
  appraisals: Appraisal;
}

export interface TimesheetLineItem {
  client: string;
  project: string;
  description: string;
  hours: number;
}

export interface TimesheetEntry {
  id: string;
  userId: string;
  userName: string;
  date: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  entries: TimesheetLineItem[];
  totalHours: number;
}

export type LeaveType = 'Earned Leave' | 'Sick Leave' | 'Casual Leave' | 'Unpaid Leave' | 'Work From Home';
export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface LeaveRequest {
  id: string;
  userId: string;
  userName: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  isHalfDay: boolean;
  halfDayPeriod?: 'First Half' | 'Second Half';
  reason: string;
  status: LeaveStatus;
  adminComment?: string;
  appliedAt: string;
}

export type ExpenseCategory = 'Travel' | 'Food' | 'Accommodation' | 'Office Supplies';
export type ExpenseStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface ExpenseClaim {
  id: string;
  userId: string;
  userName: string;
  title: string;
  category: ExpenseCategory;
  project: string;
  date: string;
  currency: string;
  amount: number;
  comment: string;
  status: ExpenseStatus;
  submittedAt: string;
}

// Added 'Verified' to status to allow intermediate payroll verification state
export interface Payslip {
  month: string;
  year: number;
  netSalary: number;
  status: 'Processed' | 'Pending' | 'Verified';
  pdfUrl: string;
}

export interface TaxDocument {
  isEligible: boolean;
  financialYear: string;
  generatedDate: string;
  pdfUrl: string;
}

export interface PayrollRecord {
  userId: string;
  year: number;
  payslips: Payslip[];
  form16: TaxDocument;
}

export interface AppNotification {
  id: string;
  userId: string;
  message: string;
  isRead: boolean;
  type: 'LEAVE_SUBMITTED' | 'LEAVE_STATUS_CHANGED' | 'EXPENSE_SUBMITTED' | 'EXPENSE_STATUS_CHANGED' | 'GENERAL';
  timestamp: string;
}

export interface DashboardStats {
  totalEmployees: number;
  activeVacancies: number;
  avgAttendance: string;
  monthlyPayroll: string;
  pendingLeaves: number;
  myLeaveBalance: number;
  myWorkingHours: string;
}

export interface AttendanceRecord {
  id: string;
  empId: string;
  empName: string;
  date: string;
  clockIn: string;
  clockOut: string | null;
  status: 'ON-TIME' | 'LATE' | 'ON_LEAVE' | 'ABSENT';
}

export interface HRDocument {
  id: string;
  name: string;
  category: string; // Used as folder identifier
  uploadDate: string;
  size: string;
  type: string;
}

export interface CompanySettings {
  companyName: string;
  timezone: string;
  fiscalYearStart: string;
  notificationsEnabled: boolean;
}

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  color: string;
  onClick?: () => void;
}
