
import React, { useState, useEffect } from 'react';
import { api } from '../mockApi';
import { AttendanceRecord } from '../types';
import { Clock, Calendar, Search, Filter, Download, MoreHorizontal } from 'lucide-react';

const Attendance: React.FC = () => {
  const [logs, setLogs] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  useEffect(() => {
    api.getAttendance().then(data => {
      setLogs(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Time & Attendance</h1>
          <p className="text-slate-500 text-sm mt-1">Real-time clock-in logs and status monitoring.</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
          <button 
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === 'list' ? 'bg-indigo-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
          >
            List View
          </button>
          <button 
            onClick={() => setViewMode('calendar')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === 'calendar' ? 'bg-indigo-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Calendar
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
           <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 flex-1 min-w-[240px]">
             <Search size={18} className="text-slate-400" />
             <input type="text" placeholder="Search by name..." className="bg-transparent border-none outline-none text-sm w-full font-medium" />
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
                  <th className="px-6 pb-2">Status</th>
                  <th className="px-6 pb-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
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
                       <span className="text-sm font-medium text-slate-400">{log.clockOut || '--:--'}</span>
                    </td>
                    <td className="bg-slate-50/50 group-hover:bg-white border-y border-slate-100 group-hover:border-indigo-100 py-4 px-6">
                       <span className={`text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-wider
                        ${log.status === 'ON-TIME' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
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
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-20 text-center space-y-4">
             <Calendar size={48} className="mx-auto text-indigo-200" />
             <p className="text-slate-500 font-medium italic">Calendar aggregation coming in v1.3...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Attendance;
