
import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../mockApi';
import { AttendanceRecord, User, UserRole } from '../types';
import { Clock, Calendar, Search, Filter, Download, MoreHorizontal, UserX, TrendingUp, Info } from 'lucide-react';

interface AttendanceProps {
  user: User;
}

const Attendance: React.FC<AttendanceProps> = ({ user }) => {
  const [logs, setLogs] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  
  const isAdmin = user.role === UserRole.ADMIN || user.role === UserRole.MANAGER;

  useEffect(() => {
    fetchLogs();
  }, [user.id]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await api.getAttendance(user);
      setLogs(data);
    } catch (err) {
      console.error("Attendance Sync Error", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = useMemo(() => {
    // Only admins search across all logs; employees only see their own anyway
    if (!isAdmin) return logs;
    return logs.filter(log => 
      log.empName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.empId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [logs, searchTerm, isAdmin]);

  const avgProduction = useMemo(() => {
    if (logs.length === 0) return "0h";
    // Dummy logic for summary visualization
    return "8h 45m";
  }, [logs]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Time & Attendance</h1>
          <p className="text-slate-500 text-sm mt-1">
            {isAdmin ? 'Global workforce status monitoring and historical audit logs.' : 'Track your personal check-in history and production hours.'}
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
          <button 
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === 'list' ? 'bg-indigo-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
          >
            History List
          </button>
          <button 
            onClick={() => setViewMode('calendar')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === 'calendar' ? 'bg-indigo-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Calendar
          </button>
        </div>
      </div>

      {!isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm flex items-center gap-5 group hover:shadow-lg transition-all">
             <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Clock size={28} />
             </div>
             <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg. Production</p>
                <p className="text-2xl font-black text-slate-900">{avgProduction}</p>
             </div>
          </div>
          <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm flex items-center gap-5 group hover:shadow-lg transition-all">
             <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Calendar size={28} />
             </div>
             <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Days Present</p>
                <p className="text-2xl font-black text-slate-900">{logs.length} / 30</p>
             </div>
          </div>
          <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm flex items-center gap-5 group hover:shadow-lg transition-all">
             <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingUp size={28} />
             </div>
             <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Efficiency</p>
                <p className="text-2xl font-black text-slate-900">92%</p>
             </div>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
           <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 flex-1 min-w-[240px]">
             {isAdmin ? (
               <>
                <Search size={18} className="text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search by name or Employee ID..." 
                  className="bg-transparent border-none outline-none text-sm w-full font-medium"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
               </>
             ) : (
               <div className="flex items-center gap-2 text-slate-400">
                 <Info size={16} />
                 <span className="text-xs font-bold uppercase tracking-widest">Filtered for User: {user.name}</span>
               </div>
             )}
           </div>
           <div className="flex items-center gap-2">
             <button className="p-2.5 text-slate-400 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100">
               <Filter size={20} />
             </button>
             <button className="p-2.5 text-slate-400 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100">
               <Download size={20} />
             </button>
           </div>
        </div>

        {viewMode === 'list' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-3">
              <thead>
                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="px-6 pb-2">Employee</th>
                  <th className="px-6 pb-2">Date</th>
                  <th className="px-6 pb-2">Check In</th>
                  <th className="px-6 pb-2">Check Out</th>
                  <th className="px-6 pb-2">Production</th>
                  <th className="px-6 pb-2">Status</th>
                  <th className="px-6 pb-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="group hover:scale-[1.005] transition-transform">
                    <td className="bg-slate-50/50 group-hover:bg-white border-y border-l border-slate-100 group-hover:border-indigo-100 py-4 px-6 rounded-l-2xl">
                       <p className="text-sm font-bold text-slate-900">{log.empName}</p>
                       <p className="text-[10px] text-slate-400 font-medium">#{log.empId}</p>
                    </td>
                    <td className="bg-slate-50/50 group-hover:bg-white border-y border-slate-100 group-hover:border-indigo-100 py-4 px-6">
                       <span className="text-sm text-slate-600 font-medium">{log.date}</span>
                    </td>
                    <td className="bg-slate-50/50 group-hover:bg-white border-y border-slate-100 group-hover:border-indigo-100 py-4 px-6">
                       <div className="flex items-center gap-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                         <span className="text-sm font-black text-slate-700">{log.clockIn}</span>
                       </div>
                    </td>
                    <td className="bg-slate-50/50 group-hover:bg-white border-y border-slate-100 group-hover:border-indigo-100 py-4 px-6">
                       <span className={`text-sm font-medium ${log.clockOut ? 'text-slate-600' : 'text-slate-400 italic'}`}>{log.clockOut || '--:--'}</span>
                    </td>
                    <td className="bg-slate-50/50 group-hover:bg-white border-y border-slate-100 group-hover:border-indigo-100 py-4 px-6">
                       <span className={`text-xs font-black uppercase ${log.production === 'In Progress' ? 'text-indigo-600 animate-pulse' : 'text-slate-700'}`}>{log.production}</span>
                    </td>
                    <td className="bg-slate-50/50 group-hover:bg-white border-y border-slate-100 group-hover:border-indigo-100 py-4 px-6">
                       <span className={`text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-wider
                        ${log.status === 'Present' || log.status === 'ON-TIME' ? 'bg-emerald-50 text-emerald-600' : 
                          log.status === 'Half Day' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'}`}>
                         {log.status}
                       </span>
                    </td>
                    <td className="bg-slate-50/50 group-hover:bg-white border-y border-r border-slate-100 group-hover:border-indigo-100 py-4 px-6 rounded-r-2xl text-right">
                       <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
                         <MoreHorizontal size={18} />
                       </button>
                    </td>
                  </tr>
                ))}
                {!loading && filteredLogs.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-20 text-center">
                      <UserX size={48} className="mx-auto text-slate-100 mb-4" />
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[3px]">No attendance records found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-20 text-center space-y-4">
             <Calendar size={48} className="mx-auto text-indigo-200" />
             <p className="text-slate-500 font-medium italic">Calendar visualization is being synchronized with local regulations...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Attendance;
