
import React, { useState, useEffect } from 'react';
import { api } from '../mockApi';
import { User, LeaveRequest, UserRole } from '../types';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  X, 
  Search, 
  Clock, 
  ArrowUpRight,
  MessageSquare
} from 'lucide-react';

const LeaveAdminPanel: React.FC<{ user: User }> = ({ user }) => {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectionModal, setRejectionModal] = useState<{ isOpen: boolean; leaveId: string | null; comment: string }>({
    isOpen: false,
    leaveId: null,
    comment: ''
  });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    const data = await api.getLeaves(user);
    setRequests(data);
    setLoading(false);
  };

  const handleAction = async (id: string, status: 'APPROVED' | 'REJECTED', comment: string = '') => {
    // Optimistic UI update
    if (status === 'REJECTED' && !comment) {
      setRejectionModal({ isOpen: true, leaveId: id, comment: '' });
      return;
    }

    setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    await api.updateLeaveStatus(id, status, comment);
    
    if (status === 'REJECTED') {
      setRejectionModal({ isOpen: false, leaveId: null, comment: '' });
    }
    fetchRequests();
  };

  const pendingRequests = requests.filter(r => r.status === 'PENDING');
  const finalizedRequests = requests.filter(r => r.status !== 'PENDING');

  if (loading && requests.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Governance: Leave Control</h1>
          <p className="text-slate-500 text-sm mt-1">Audit and process personnel leave requests for the organization.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Stats Summary */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
               <Clock size={80} />
             </div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Pending Review</p>
             <h3 className="text-4xl font-black text-indigo-900">{pendingRequests.length}</h3>
             <p className="text-xs font-bold text-slate-500 mt-2 flex items-center gap-1">
               Requires Immediate Action <ArrowUpRight size={14} />
             </p>
          </div>
          <div className="bg-indigo-900 p-8 rounded-[40px] text-white shadow-xl shadow-indigo-100">
             <ShieldCheck size={32} className="mb-6 opacity-70" />
             <h4 className="text-xl font-black leading-tight">VatsinHR Governance</h4>
             <p className="text-xs text-indigo-100/70 mt-3 leading-relaxed font-medium">
               Authorized personnel only. All approval actions are logged for compliance and audit reporting.
             </p>
          </div>
        </div>

        {/* Approval Queue */}
        <div className="lg:col-span-3 space-y-8">
          <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
             <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                <div className="flex items-center gap-3">
                   <Clock className="text-amber-500" size={24} />
                   <h2 className="text-sm font-black text-slate-900 uppercase tracking-[2px]">Awaiting Processing</h2>
                </div>
                <div className="flex items-center gap-2 bg-slate-100 border border-slate-100 rounded-xl px-4 py-2">
                   <Search size={14} className="text-slate-400" />
                   <input type="text" placeholder="Search resources..." className="bg-transparent border-none outline-none text-xs font-bold w-32" />
                </div>
             </div>

             <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                      <th className="px-8 py-5">Employee</th>
                      <th className="px-8 py-5">Details</th>
                      <th className="px-8 py-5">Narrative</th>
                      <th className="px-8 py-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {pendingRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-8 py-5">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-xl flex items-center justify-center font-black text-xs">
                                {req.userName.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <p className="text-sm font-black text-slate-900">{req.userName}</p>
                                <p className="text-[10px] font-bold text-slate-400">ID: {req.userId}</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-8 py-5">
                          <p className="text-xs font-black text-indigo-600 uppercase tracking-wider">{req.type}</p>
                          <p className="text-[10px] font-bold text-slate-500 mt-1">
                             {req.startDate} {req.isHalfDay ? `(${req.halfDayPeriod})` : `to ${req.endDate}`}
                          </p>
                        </td>
                        <td className="px-8 py-5">
                           <p className="text-xs text-slate-500 font-medium max-w-xs line-clamp-2" title={req.reason}>{req.reason}</p>
                        </td>
                        <td className="px-8 py-5 text-right">
                           <div className="flex items-center justify-end gap-3">
                              <button 
                                onClick={() => handleAction(req.id, 'REJECTED')}
                                className="p-3 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-all border border-rose-100 shadow-sm"
                                title="Reject Submission"
                              >
                                <X size={20} />
                              </button>
                              <button 
                                onClick={() => handleAction(req.id, 'APPROVED')}
                                className="p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-all border border-emerald-100 shadow-sm"
                                title="Approve Submission"
                              >
                                <CheckCircle2 size={20} />
                              </button>
                           </div>
                        </td>
                      </tr>
                    ))}
                    {pendingRequests.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-20 text-center">
                           <CheckCircle2 size={48} className="mx-auto text-emerald-100 mb-4" />
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[3px]">All submissions processed</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
             </div>
          </div>

          {/* Audit History */}
          <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden opacity-80">
             <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-[2px]">Audit Pipeline History</h3>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <tbody className="divide-y divide-slate-50">
                    {finalizedRequests.slice(0, 5).map(req => (
                      <tr key={req.id}>
                        <td className="px-8 py-4 font-black text-slate-900">{req.userName}</td>
                        <td className="px-8 py-4 text-slate-500">{req.startDate}</td>
                        <td className="px-8 py-4">
                           <span className={`px-3 py-1 rounded-lg font-black uppercase tracking-widest text-[9px]
                             ${req.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                             {req.status}
                           </span>
                        </td>
                        <td className="px-8 py-4 text-slate-400 italic">"{req.adminComment || 'No comment'}"</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </div>
        </div>
      </div>

      {/* Rejection Modal */}
      {rejectionModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setRejectionModal({ ...rejectionModal, isOpen: false })}></div>
          <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200 p-10">
            <div className="flex items-center gap-4 mb-8">
               <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-3xl flex items-center justify-center shadow-inner">
                 <MessageSquare size={28} />
               </div>
               <div>
                  <h3 className="text-2xl font-black text-slate-900">Final Decision Note</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Personnel Notification Required</p>
               </div>
            </div>

            <div className="space-y-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Rejection Justification</label>
                  <textarea 
                    autoFocus
                    required
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-3xl outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all font-medium text-slate-700 h-32"
                    placeholder="Specify the regulatory or operational reason for rejection..."
                    value={rejectionModal.comment}
                    onChange={e => setRejectionModal({ ...rejectionModal, comment: e.target.value })}
                  />
               </div>

               <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setRejectionModal({ ...rejectionModal, isOpen: false })}
                    className="flex-1 py-4 rounded-3xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    disabled={!rejectionModal.comment}
                    onClick={() => handleAction(rejectionModal.leaveId!, 'REJECTED', rejectionModal.comment)}
                    className="flex-[2] py-4 bg-rose-600 text-white rounded-3xl font-black uppercase tracking-[2px] text-xs hover:bg-rose-700 transition-all shadow-xl shadow-rose-100 disabled:opacity-50"
                  >
                    Confirm Rejection
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveAdminPanel;
