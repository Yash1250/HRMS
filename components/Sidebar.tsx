
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Clock, 
  CreditCard, 
  Briefcase, 
  Settings, 
  FileText,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CalendarClock,
  CalendarDays,
  Stamp,
  Receipt
} from 'lucide-react';
import { UserRole } from '../types';

interface SidebarProps {
  isOpen: boolean;
  role: UserRole;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, role, toggleSidebar }) => {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard, roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE] },
    { name: 'Employees', path: '/employees', icon: Users, roles: [UserRole.ADMIN, UserRole.MANAGER] },
    { name: 'Recruitment', path: '/recruitment', icon: Briefcase, roles: [UserRole.ADMIN, UserRole.MANAGER] },
    { name: 'Attendance', path: '/attendance', icon: Clock, roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE] },
    { name: 'My Leaves', path: '/leaves', icon: CalendarDays, roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE] },
    { name: 'Leave Approvals', path: '/admin/leaves', icon: Stamp, roles: [UserRole.ADMIN, UserRole.MANAGER] },
    { name: 'Timesheets', path: '/timesheet', icon: CalendarClock, roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE] },
    { name: 'Expense Claims', path: '/expenses', icon: Receipt, roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE] },
    { 
      name: role === UserRole.ADMIN ? 'Payroll Management' : 'Payroll & Documents', 
      path: role === UserRole.ADMIN ? '/payroll' : '/my-payroll', 
      icon: CreditCard, 
      roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE] 
    },
    { name: 'Documentation', path: '/docs', icon: ShieldCheck, roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE] },
    { name: 'Settings', path: '/settings', icon: Settings, roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE] },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(role));

  return (
    <aside 
      className={`sidebar-gradient text-white transition-all duration-300 ease-in-out flex flex-col relative z-50 
      ${isOpen ? 'w-64' : 'w-20'} h-screen`}
    >
      {/* Brand Header */}
      <div className="h-20 flex items-center px-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-md">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          {isOpen && <span className="font-bold text-xl tracking-tight uppercase">VatsinHR</span>}
        </div>
      </div>

      {/* Toggle Button */}
      <button 
        onClick={toggleSidebar}
        className="absolute -right-3 top-24 bg-teal-500 text-white rounded-full p-1 border-2 border-slate-50 hover:bg-teal-600 shadow-md transition-colors"
      >
        {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>

      {/* Navigation Links */}
      <nav className="flex-1 mt-6 px-3 space-y-1 overflow-y-auto custom-scrollbar">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all group
              ${isActive 
                ? 'bg-white/10 text-white font-medium shadow-sm ring-1 ring-white/20' 
                : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon size={22} className={`${isActive ? 'text-teal-400' : 'group-hover:text-teal-300'}`} />
              {isOpen && <span className="whitespace-nowrap">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Version Info */}
      {isOpen && (
        <div className="p-6 text-xs text-white/40 border-t border-white/5">
          <p>VatsinHR Enterprise v1.2.4</p>
          <p>© 2024 Vatsin Solutions</p>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
