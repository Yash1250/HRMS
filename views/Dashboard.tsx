
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Briefcase, 
  Clock, 
  CreditCard, 
  Plus, 
  Calendar,
  ExternalLink,
  MapPin,
  TrendingUp,
  Power,
  ChevronDown
} from 'lucide-react';
import StatCard from '../components/StatCard';
import AddMemberModal from '../components/AddMemberModal';
import { User, UserRole, DashboardStats } from '../types';
import { api } from '../mockApi';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const payrollData = [
  { name: 'Jan', amount: 645000 },
  { name: 'Feb', amount: 680000 },
  { name: 'Mar', amount: 670000 },
  { name: 'Apr', amount: 720000 },
  { name: 'May', amount: 750000 },
  { name: 'Jun', amount: 790000 },
];

const Dashboard: React.FC<{ user: User }> = ({ user }) => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User>(user);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('Month');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const isAdmin = currentUser.role === UserRole.ADMIN;

  useEffect(() => {
    fetchData(period);
  }, [period]);

  const fetchData = async (p: string) => {
    const s = await api.getDashboardStats(currentUser, p);
    setStats(s);
    setLoading(false);
  };

  const handleClockToggle = async () => {
    try {
      const updatedUser = await api.toggleClock(currentUser.id);
      setCurrentUser(updatedUser);
      localStorage.setItem('nexus_user', JSON.stringify(updatedUser));
      fetchData(period);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddMember = async (data: any) => {
    await api.addEmployee(data);
    fetchData(period); // Update stats
  };

  if (loading || !stats) return <div className="p-8 text-center text-slate-500 font-medium">Querying Enterprise Core...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Enterprise Overview</h1>
          <p className="text-slate-500 text-sm mt-1">
            {isAdmin ? 'System intelligence and workforce performance.' : `Welcome back to your workspace, ${currentUser.name}.`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <select 
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="appearance-none bg-white border border-slate-200 px-5 py-3 pr-12 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-700 hover:bg-slate-50 transition-all shadow-sm outline-none focus:ring-4 focus:ring-indigo-500/10 cursor-pointer"
            >
              <option>Today</option>
              <option>Week</option>
              <option>Month</option>
            </select>
            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
          {isAdmin && (
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 bg-indigo-900 hover:bg-indigo-950 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-indigo-100 transition-all"
            >
              <Plus size={18} />
              Add Member
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {isAdmin ? (
          <>
            <StatCard 
              title="Workforce" 
              value={stats.totalEmployees} 
              change={3.4} 
              icon={<Users />} 
              color="bg-indigo-500" 
              onClick={() => navigate('/employees')}
            />
            <StatCard 
              title="Active Hiring" 
              value={stats.activeVacancies} 
              change={15} 
              icon={<Briefcase />} 
              color="bg-teal-500" 
              onClick={() => navigate('/recruitment')}
            />
            <StatCard 
              title="Attendance" 
              value={stats.avgAttendance} 
              change={1.2} 
              icon={<Clock />} 
              color="bg-amber-500" 
              onClick={() => navigate('/attendance')}
            />
            <StatCard 
              title="Payroll Cost" 
              value={stats.monthlyPayroll} 
              change={6.8} 
              icon={<CreditCard />} 
              color="bg-rose-500" 
              onClick={() => navigate('/payroll')}
            />
          </>
        ) : (
          <>
            <StatCard 
              title="Leave Credits" 
              value={`${stats.myLeaveBalance} Days`} 
              icon={<Calendar />} 
              color="bg-teal-500" 
              onClick={() => navigate('/leaves')}
            />
            <StatCard 
              title="Active Shift" 
              value={stats.myWorkingHours} 
              icon={<Clock />} 
              color="bg-amber-500" 
              onClick={() => navigate('/attendance')}
            />
            <StatCard 
              title="Projected Pay" 
              value="₹72,450.00" 
              icon={<CreditCard />} 
              color="bg-indigo-500" 
              onClick={() => navigate('/payroll')}
            />
            <StatCard 
              title="Requests" 
              value={stats.pendingLeaves} 
              icon={<TrendingUp />} 
              color="bg-rose-500" 
              onClick={() => navigate('/leaves')}
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-black text-slate-900 text-lg uppercase tracking-tight">Financial Trends</h3>
              <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-[2px] font-black">Expenditure Overview ({period})</p>
            </div>
            <button 
              onClick={() => navigate(isAdmin ? '/payroll' : '/payroll')}
              className="text-indigo-600 text-[10px] font-black uppercase tracking-widest hover:underline flex items-center gap-2"
            >
              Full Analytics <ExternalLink size={14} />
            </button>
          </div>
          
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={payrollData}>
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1A237E" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#1A237E" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 'bold'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 'bold'}} />
                <Tooltip 
                  formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Amount']}
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)' }}
                />
                <Area type="monotone" dataKey="amount" stroke="#1A237E" strokeWidth={5} fillOpacity={1} fill="url(#chartGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-teal-50/50 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150"></div>
            <h3 className="font-black text-slate-900 mb-6 flex items-center gap-3 relative z-10 uppercase tracking-tight">
               <Clock className="text-teal-500" size={20} />
               Duty Control
            </h3>
            
            <div className={`p-6 rounded-2xl mb-6 flex items-center justify-between transition-all duration-500 relative z-10 ${currentUser.clockedIn ? 'bg-emerald-50 border border-emerald-100 shadow-inner' : 'bg-slate-50 border border-slate-100'}`}>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${currentUser.clockedIn ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></div>
                  <span className={`text-xs font-black uppercase tracking-widest ${currentUser.clockedIn ? 'text-emerald-700' : 'text-slate-500'}`}>
                    {currentUser.clockedIn ? 'Active Session' : 'Offline'}
                  </span>
                </div>
              </div>
              {currentUser.clockedIn && (
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Time In</p>
                  <p className="text-sm font-black text-emerald-700">{currentUser.clockInTime}</p>
                </div>
              )}
            </div>

            <button 
              onClick={handleClockToggle}
              className={`w-full py-4 rounded-2xl font-black uppercase tracking-[2px] text-xs flex items-center justify-center gap-3 transition-all transform active:scale-95 shadow-xl relative z-10
              ${currentUser.clockedIn 
                ? 'bg-white border-2 border-rose-100 text-rose-600 hover:bg-rose-50 shadow-rose-100' 
                : 'bg-teal-600 text-white hover:bg-teal-700 shadow-teal-100'}`}
            >
              <Power size={20} />
              {currentUser.clockedIn ? 'End Shift' : 'Initiate Shift'}
            </button>
            
            <div className="mt-6 flex items-center gap-2 text-[10px] font-bold text-slate-400 justify-center uppercase tracking-widest relative z-10">
              <MapPin size={12} />
              India HQ • Secure Channel
            </div>
          </div>

          <div className="bg-indigo-900 p-8 rounded-[32px] shadow-2xl shadow-indigo-200 text-white relative overflow-hidden group border border-white/10">
            <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
            <h4 className="font-black mb-6 relative z-10 uppercase tracking-widest text-xs opacity-70">Corporate Calendar</h4>
            <div className="flex items-center gap-5 relative z-10">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-2xl rounded-2xl flex items-center justify-center font-black text-3xl border border-white/20">15</div>
              <div>
                <p className="font-black text-sm uppercase tracking-tight">Independence Day</p>
                <p className="text-xs text-indigo-200 font-bold">Thursday, August 15, 2024</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddMemberModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={handleAddMember} 
      />
    </div>
  );
};

export default Dashboard;
