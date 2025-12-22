
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './views/Dashboard';
import Login from './views/Login';
import EmployeeManagement from './views/EmployeeManagement';
import Recruitment from './views/Recruitment';
import Payroll from './views/Payroll';
import Attendance from './views/Attendance';
import Documentation from './views/Documentation';
import Settings from './views/Settings';
import EmployeeProfile from './views/EmployeeProfile';
import Timesheet from './views/Timesheet';
import LeaveApplication from './views/LeaveApplication';
import LeaveAdminPanel from './views/LeaveAdminPanel';
import Expenses from './views/Expenses';
import Performance from './views/Performance';
import { User, AuthState } from './types';

const App: React.FC = () => {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    token: localStorage.getItem('nexus_token'),
    loading: true
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('nexus_user');
    if (savedUser && auth.token) {
      setAuth({ user: JSON.parse(savedUser), token: auth.token, loading: false });
    } else {
      setAuth(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const handleLogin = (user: User, token: string) => {
    localStorage.setItem('nexus_token', token);
    localStorage.setItem('nexus_user', JSON.stringify(user));
    setAuth({ user, token, loading: false });
  };

  const handleLogout = () => {
    localStorage.removeItem('nexus_token');
    localStorage.removeItem('nexus_user');
    setAuth({ user: null, token: null, loading: false });
  };

  if (auth.loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium animate-pulse">Initializing VatsinHR Core...</p>
        </div>
      </div>
    );
  }

  if (!auth.user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className="flex min-h-screen bg-[#F8FAFC] overflow-hidden">
        <Sidebar 
          isOpen={isSidebarOpen} 
          role={auth.user.role} 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        />
        
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
          <Navbar 
            user={auth.user} 
            onLogout={handleLogout}
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />
          
          <main className="flex-1 overflow-y-auto p-4 md:p-8">
            <Routes>
              <Route path="/" element={<Dashboard user={auth.user} />} />
              <Route path="/employees" element={<EmployeeManagement />} />
              <Route path="/employees/:id" element={<EmployeeProfile />} />
              <Route path="/recruitment" element={<Recruitment />} />
              <Route path="/payroll" element={<Payroll user={auth.user} />} />
              <Route path="/my-payroll" element={<Payroll user={auth.user} />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/leaves" element={<LeaveApplication user={auth.user} />} />
              <Route path="/admin/leaves" element={<LeaveAdminPanel user={auth.user} />} />
              <Route path="/timesheet" element={<Timesheet user={auth.user} />} />
              <Route path="/expenses" element={<Expenses user={auth.user} />} />
              <Route path="/docs" element={<Documentation user={auth.user} />} />
              <Route path="/performance" element={<Performance user={auth.user} />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
