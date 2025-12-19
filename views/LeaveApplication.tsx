
import React, { useState, useEffect } from 'react';
import { api } from '../mockApi';
import { User, LeaveRequest, LeaveType } from '../types';
import { 
  Calendar, 
  Clock, 
  FileText, 
  Send, 
  History, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Paperclip,
  ArrowRight
} from 'lucide-react';

const LEAVE_TYPES: LeaveType[] = [
  'Earned Leave',
  'Sick Leave',
  'Casual Leave',
  'Unpaid Leave',
  'Work From Home'
];

const LeaveApplication: React.FC<{ user: User }> = ({ user }) => {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    type: LEAVE_TYPES[0],
    isHalfDay: false,
    halfDayPeriod: 'First Half' as const,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    reason: ''
  });

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    const data = await api.getLeaves(user);
    setRequests(data);
    setLoading(false);
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.applyLeave({
        ...form,
        userId: user.id,
        userName: user.name,
      });
      setForm({
        type: LEAVE_TYPES[0],
        isHalfDay: false,
        halfDayPeriod: 'First Half',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        reason: ''
      });
      await fetchHistory();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Time Off Portal</h1>
          <p className="text-slate-500 text-sm mt-1">Submit leave requests and track your entitlement balances.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Leave Balances & Form */}
        <div className="xl:col-span-1 space-y-8">
          {/* Balances */}
          <div className="bg-indigo-900 p-8 rounded-[40px] text-white shadow-2xl shadow-indigo-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
            <h3 className="text-xs font-black uppercase tracking-[3px] opacity-70 mb-6">Entitlement Ledger</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white/10 rounded-3xl border border-white/10">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">CL</p>
                <p className="text-2xl font-black mt-1">{user.leaveBalances?.casual || 0}</p>
              </div>
              <div className="text-center p-4 bg-white/10 rounded-3xl border border-white/10">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">SL</p>
                <p className="text-2xl font-black mt-1">{user.leaveBalances?.sick || 0}</p>
              </div>
              <div className="text-center p-4 bg-white/10 rounded-3xl border border-white/10">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">EL</p>
                <p className="text-2xl font-black mt-1">{user.leaveBalances?.earned || 0}</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-[2px] mb-8 flex items-center gap-3">
              <Calendar className="text-indigo-600" size={18} /> New Request
            </h3>
            <form onSubmit={handleApply} className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Leave Category</label>
                <select 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 font-bold text-slate-700 text-sm"
                  value={form.type}
                  onChange={e => setForm({...form, type: e.target.value as LeaveType})}
                >
                  {LEAVE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Duration Format</label>
                <div className="grid grid-cols-2 gap-3">
                   <button 
                     type="button"
                     onClick={() => setForm({...form, isHalfDay: false})}
                     className={`py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all 
                        ${!form.isHalfDay ? 'bg-indigo-900 border-indigo-900 text-white' : 'bg-slate-50 border-slate-200 text-slate-400'}`}
                   >
                     Full Day
                   </button>
                   <button 
                     type="button"
                     onClick={() => setForm({...form, isHalfDay: true})}
                     className={`py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all 
                        ${form.isHalfDay ? 'bg-indigo-900 border-indigo-900 text-white' : 'bg-slate-50 border-slate-200 text-slate-400'}`}
                   >
                     Half Day
                   </button>
                </div>
              </div>

              {form.isHalfDay && (
                <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-300">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Period Selection</label>
                  <select 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 font-bold text-slate-700 text-sm"
                    value={form.halfDayPeriod}
                    onChange={e => setForm({...form, halfDayPeriod: e.target.value as any})}
                  >
                    <option value="First Half">First Half (AM)</option>
                    <option value="Second Half">Second Half (PM)</option>
                  </select>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    {form.isHalfDay ? 'Date' : 'Start Date'}
                  </label>
                  <input 
                    type="date"
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 font-bold text-slate-700 text-sm"
                    value={form.startDate}
                    onChange={e => setForm({...form, startDate: e.target.value})}
                  />
                </div>
                {!form.isHalfDay && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">End Date</label>
                    <input 
                      type="date"
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 font-bold text-slate-700 text-sm"
                      value={form.endDate}
                      onChange={e => setForm({...form, endDate: e.target.value})}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Purpose / Context</label>
                <textarea 
                  required
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 font-medium text-slate-700 text-sm"
                  placeholder="Elaborate on the reason for your absence..."
                  value={form.reason}
                  onChange={e => setForm({...form, reason: e.target.value})}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Evidence (Optional)</label>
                <div className="flex items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl p-4 hover:border-indigo-300 transition-colors cursor-pointer bg-slate-50 group">
                   <div className="flex items-center gap-2 text-slate-400 group-hover:text-indigo-600 transition-colors">
                     <Paperclip size={18} />
                     <span className="text-xs font-bold uppercase tracking-widest">Attach Files</span>
                   </div>
                </div>
              </div>

              <button 
                type="submit"
                disabled={submitting}
                className="w-full bg-indigo-900 text-white py-4 rounded-2xl font-black uppercase tracking-[2px] text-xs hover:bg-indigo-950 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {submitting ? 'Transmitting...' : 'Apply for Leave'}
                <ArrowRight size={18} />
              </button>
            </form>
          </div>
        </div>

        {/* My History */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden min-h-full">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
              <div className="flex items-center gap-3">
                <History className="text-indigo-600" size={24} />
                <h2 className="text-sm font-black text-slate-900 uppercase tracking-[2px]">Filing Archive</h2>
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] bg-white px-3 py-1 rounded-full border border-slate-100 shadow-sm">
                {requests.length} Submissions
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                    <th className="px-8 py-5">Status</th>
                    <th className="px-8 py-5">Dates</th>
                    <th className="px-8 py-5">Category</th>
                    <th className="px-8 py-5">Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {requests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-5">
                         {req.status === 'PENDING' && (
                           <div className="flex items-center gap-2 text-amber-600 font-black uppercase tracking-widest text-[10px]">
                             <AlertCircle size={14} /> Pending
                           </div>
                         )}
                         {req.status === 'APPROVED' && (
                           <div className="flex items-center gap-2 text-emerald-600 font-black uppercase tracking-widest text-[10px]">
                             <CheckCircle2 size={14} /> Approved
                           </div>
                         )}
                         {req.status === 'REJECTED' && (
                           <div className="flex items-center gap-2 text-rose-600 font-black uppercase tracking-widest text-[10px]">
                             <XCircle size={14} /> Rejected
                           </div>
                         )}
                      </td>
                      <td className="px-8 py-5">
                        <p className="text-sm font-black text-slate-900">{req.startDate}</p>
                        {!req.isHalfDay && <p className="text-[10px] text-slate-400 font-bold">to {req.endDate}</p>}
                        {req.isHalfDay && <p className="text-[10px] text-indigo-600 font-black uppercase tracking-wider">{req.halfDayPeriod}</p>}
                      </td>
                      <td className="px-8 py-5 text-xs font-bold text-slate-600">
                        {req.type}
                      </td>
                      <td className="px-8 py-5">
                        <p className="text-xs text-slate-500 font-medium max-w-xs truncate" title={req.reason}>{req.reason}</p>
                        {req.adminComment && (
                          <div className="mt-2 p-2 bg-rose-50 border border-rose-100 rounded-lg">
                            <p className="text-[10px] font-black text-rose-800 uppercase mb-0.5">Admin Note:</p>
                            <p className="text-[10px] text-rose-600 font-bold">{req.adminComment}</p>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                  {requests.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-20 text-center">
                         <FileText size={48} className="mx-auto text-slate-100 mb-4" />
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-[3px]">No leave history recorded</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LeaveApplication;
