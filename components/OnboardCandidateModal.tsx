
import React, { useState } from 'react';
import { X, UserCheck, Mail, Briefcase, Building, ShieldCheck, Loader2, Key } from 'lucide-react';
import { Candidate } from '../types';

interface OnboardCandidateModalProps {
  candidate: Candidate;
  onClose: () => void;
  onConfirm: (data: any) => Promise<void>;
}

const OnboardCandidateModal: React.FC<OnboardCandidateModalProps> = ({ candidate, onClose, onConfirm }) => {
  const [formData, setFormData] = useState({
    name: candidate.name,
    personalEmail: candidate.email,
    workEmail: `${candidate.name.toLowerCase().replace(/\s+/g, '.')}@vatsinhr.com`,
    department: 'Engineering',
    designation: candidate.role,
    salary: '85000'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onConfirm({
      ...formData,
      candidateId: candidate.id,
      password: 'emp123' // Default password as per requirement
    });
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={onClose}></div>
      <div className="bg-white w-full max-w-xl rounded-[40px] shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8 border-b border-slate-100 bg-teal-50/30 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-2xl flex items-center justify-center shadow-inner">
              <UserCheck size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 leading-tight">Convert to Personnel</h3>
              <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest mt-0.5">Onboarding: {candidate.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-white hover:text-slate-600 rounded-xl transition-all shadow-sm">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex gap-3">
             <ShieldCheck className="text-indigo-500 shrink-0" size={20} />
             <div>
               <p className="text-xs font-bold text-indigo-900">System Integration Active</p>
               <p className="text-[10px] font-medium text-indigo-700/70 leading-relaxed">
                 Submitting this form will create a secure login for the resource and migrate their profile to the active personnel directory.
               </p>
             </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Official Identity</label>
                <input 
                  disabled
                  className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-2xl text-sm font-bold text-slate-500"
                  value={formData.name}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assigned Designation</label>
                <input 
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-teal-500/10 font-bold text-slate-700 text-sm"
                  value={formData.designation}
                  onChange={e => setFormData({...formData, designation: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Official Work Email (Login ID)</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  required
                  type="email"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-teal-500/10 font-bold text-slate-700 text-sm"
                  value={formData.workEmail}
                  onChange={e => setFormData({...formData, workEmail: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Operational Unit</label>
                <select 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-teal-500/10 font-bold text-slate-700 text-sm appearance-none"
                  value={formData.department}
                  onChange={e => setFormData({...formData, department: e.target.value})}
                >
                  <option>Engineering</option>
                  <option>Design</option>
                  <option>Marketing</option>
                  <option>Human Resources</option>
                  <option>Sales</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Annual Package ($)</label>
                <input 
                  required
                  type="number"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-teal-500/10 font-bold text-slate-700 text-sm"
                  value={formData.salary}
                  onChange={e => setFormData({...formData, salary: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between">
             <div className="flex items-center gap-2">
               <Key size={14} className="text-slate-400" />
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Initial Credentials:</span>
             </div>
             <code className="text-xs font-black text-indigo-600 bg-white px-3 py-1 rounded-lg border border-slate-100">emp123</code>
          </div>

          <div className="pt-4 flex items-center gap-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="flex-[2] py-4 bg-teal-600 text-white rounded-2xl font-black uppercase tracking-[2px] text-xs hover:bg-teal-700 transition-all shadow-xl shadow-teal-100 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <UserCheck size={18} />}
              Complete Hired Transition
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OnboardCandidateModal;
