
import React from 'react';

export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  EMPLOYEE = 'EMPLOYEE'
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
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
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

export interface AppNotification {
  id: string;
  userId: string;
  message: string;
  isRead: boolean;
  type: 'LEAVE_SUBMITTED' | 'LEAVE_STATUS_CHANGED' | 'GENERAL';
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
  category: 'Policy' | 'Contract' | 'Onboarding' | 'General';
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
