
import React, { useState, useEffect } from 'react';
import { api } from '../mockApi';
import { User, UserRole, ExpenseClaim, ExpenseCategory, ExpenseStatus } from '../types';
import { 
  Receipt, 
  Plus, 
  Upload, 
  X, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Calendar, 
  DollarSign, 
  Building,
  History,
  Send,
  Loader2,
  FileText
} from 'lucide-react';

const CATEGORIES: ExpenseCategory[] = ['Travel', 'Food', 'Accommodation', 'Office Supplies'];
const CURRENCIES = ['USD', 'INR', 'EUR', 'GBP'];
const PROJECTS = ['Client A', 'Internal', 'Sales Trip', 'Technical Workshop'];

const Expenses: React.FC<{ user: User }> = ({ user }) => {
  const isAdmin = user.role === UserRole.ADMIN || user.role === UserRole.MANAGER;
  const [claims, setClaims] = useState<ExpenseClaim[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    category: CATEGORIES[0],
    project: PROJECTS[0],
    date: new Date().toISOString().split('T')[0],
    currency: CURRENCIES[0],
    amount: '',
    comment: ''
  });

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    setLoading(true);
    const data = await api.getExpenses(user);
    setClaims(data);
    setLoading(false);
  };

  const handleStatusUpdate = async (id: string, status: ExpenseStatus) => {
    setClaims(prev => prev.map(c => c.id === id ? { ...c, status } : c));
    await api.updateExpenseStatus(id, status);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.addExpense({
        ...formData,
        amount: Number(formData.amount),
        userId: user.id,
        userName: user.name
      });
      setIsModalOpen(false);
      setFormData({
        title: '',
        category: CATEGORIES[0],
        project: PROJECTS[0],
        date: new Date().toISOString().split('T')[0],
        currency: CURRENCIES[0],
        amount: '',
        comment: ''
      });
      fetchClaims();
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
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Expense Claims</h1>
          <p className="text-slate-500 text-sm mt-1">
            {isAdmin ? 'Review and manage organization-wide reimbursement requests.' : 'Submit and track your professional reimbursement claims.'}
          </p>
        </div>
        {!isAdmin && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-900 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-950 transition-all shadow-xl shadow-indigo-100"
          >
            <Plus size={18} />
            New Claim
          </button>
        )}
      </div>

      <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <div className="flex items-center gap-3">
            <History className="text-indigo-600" size={24} />
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-[2px]">Claims History</h2>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5">Date</th>
                {isAdmin && <th className="px-8 py-5">Employee</th>}
                <th className="px-8 py-5">Category</th>
                <th className="px-8 py-5">Title</th>
                <th className="px-8 py-5">Amount</th>
                {isAdmin && <th className="px-8 py-5 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {claims.map((claim) => (
                <tr key={claim.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      {claim.status === 'PENDING' && (
                        <span className="flex items-center gap-1.5 text-[10px] font-black text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg uppercase tracking-wider">
                          <AlertCircle size={12} /> Pending
                        </span>
                      )}
                      {claim.status === 'APPROVED' && (
                        <span className="flex items-center gap-1.5 text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg uppercase tracking-wider">
                          <CheckCircle2 size={12} /> Approved
                        </span>
                      )}
                      {claim.status === 'REJECTED' && (
                        <span className="flex items-center gap-1.5 text-[10px] font-black text-rose-600 bg-rose-50 px-3 py-1.5 rounded-lg uppercase tracking-wider">
                          <XCircle size={12} /> Rejected
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm font-bold text-slate-500">{claim.date}</td>
                  {isAdmin && (
                    <td className="px-8 py-5 font-bold text-slate-900 text-sm">{claim.userName}</td>
                  )}
                  <td className="px-8 py-5">
                    <span className="text-[10px] font-black text-indigo-900 bg-indigo-50 px-3 py-1 rounded-lg uppercase tracking-tight">
                      {claim.category}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm font-medium text-slate-700">{claim.title}</td>
                  <td className="px-8 py-5 text-sm font-black text-slate-900">
                    {claim.currency} {claim.amount.toLocaleString()}
                  </td>
                  {isAdmin && (
                    <td className="px-8 py-5 text-right">
                      {claim.status === 'PENDING' && (
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleStatusUpdate(claim.id, 'APPROVED')}
                            className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all"
                            title="Approve"
                          >
                            <CheckCircle2 size={20} />
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate(claim.id, 'REJECTED')}
                            className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                            title="Reject"
                          >
                            <XCircle size={20} />
                          </button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))}
              {claims.length === 0 && !loading && (
                <tr>
                  <td colSpan={isAdmin ? 7 : 5} className="px-8 py-20 text-center">
                    <Receipt size={48} className="mx-auto text-slate-100 mb-4" />
                    <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No claims recorded</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Claim Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white w-full max-w-5xl rounded-[40px] shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex flex-col lg:flex-row h-full max-h-[90vh] overflow-y-auto">
              {/* Left Column: Receipt Area */}
              <div className="lg:w-2/5 bg-slate-800 p-10 flex flex-col items-center justify-center text-center relative">
                <div className="absolute top-6 left-6 flex items-center gap-2 text-white/50 text-[10px] font-black uppercase tracking-widest">
                  <Receipt size={14} /> Digital Evidence
                </div>
                <div className="w-full aspect-square max-w-[280px] bg-slate-700/50 rounded-[40px] border-4 border-dashed border-white/10 flex flex-col items-center justify-center gap-4 group cursor-pointer hover:border-teal-500/50 transition-all">
                  <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center text-white/40 group-hover:text-teal-400 group-hover:bg-teal-400/10 transition-all">
                    <Upload size={32} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Upload Receipts</p>
                    <p className="text-[10px] text-white/30 font-medium mt-1 uppercase tracking-widest">PDF, JPG, PNG up to 10MB</p>
                  </div>
                </div>
                <div className="mt-10 p-4 bg-white/5 rounded-2xl border border-white/5 text-left w-full max-w-[280px]">
                   <p className="text-[10px] font-black text-teal-400 uppercase tracking-widest mb-1">Audit Policy</p>
                   <p className="text-[10px] text-white/50 leading-relaxed font-medium">All reimbursements require clear image proof for tax compliance and enterprise auditing.</p>
                </div>
              </div>

              {/* Right Column: Form Fields */}
              <div className="lg:w-3/5 p-10 bg-white">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Reimbursement Form</h3>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-all shadow-sm">
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Expense Category</label>
                      <select 
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-teal-500/10 font-bold text-slate-700 text-sm appearance-none"
                        value={formData.category}
                        onChange={e => setFormData({...formData, category: e.target.value as ExpenseCategory})}
                      >
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Project / Cost Center</label>
                      <select 
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-teal-500/10 font-bold text-slate-700 text-sm appearance-none"
                        value={formData.project}
                        onChange={e => setFormData({...formData, project: e.target.value})}
                      >
                        {PROJECTS.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Expense Title</label>
                      <input 
                        type="text"
                        required
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-teal-500/10 text-sm font-bold text-slate-900"
                        placeholder="e.g. Flight to SF"
                        value={formData.title}
                        onChange={e => setFormData({...formData, title: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Expense Date</label>
                      <input 
                        type="date"
                        required
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-teal-500/10 text-sm font-bold text-slate-900"
                        value={formData.date}
                        onChange={e => setFormData({...formData, date: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Currency</label>
                      <select 
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-teal-500/10 font-bold text-slate-700 text-sm appearance-none"
                        value={formData.currency}
                        onChange={e => setFormData({...formData, currency: e.target.value})}
                      >
                        {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Amount</label>
                      <input 
                        type="number"
                        required
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-teal-500/10 text-sm font-black text-slate-900"
                        placeholder="0.00"
                        value={formData.amount}
                        onChange={e => setFormData({...formData, amount: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Commentary / Context</label>
                    <textarea 
                      rows={3}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-teal-500/10 text-sm font-medium text-slate-700"
                      placeholder="Brief details about this expenditure..."
                      value={formData.comment}
                      onChange={e => setFormData({...formData, comment: e.target.value})}
                    />
                  </div>

                  <div className="pt-8 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button type="button" className="px-6 py-3 rounded-2xl border-2 border-slate-100 text-slate-400 font-black uppercase tracking-widest text-[10px] hover:bg-slate-50 transition-all">
                        Save Expense
                      </button>
                      <button type="button" className="px-6 py-3 rounded-2xl border-2 border-slate-100 text-slate-400 font-black uppercase tracking-widest text-[10px] hover:bg-slate-50 transition-all">
                        Save and Add Another
                      </button>
                    </div>
                    <button 
                      type="submit"
                      disabled={submitting}
                      className="bg-teal-600 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-[2px] text-xs hover:bg-teal-700 transition-all shadow-xl shadow-teal-100 flex items-center gap-2 disabled:opacity-50"
                    >
                      {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                      Submit Claim
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;
