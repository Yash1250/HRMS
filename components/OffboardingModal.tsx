
import React, { useState } from 'react';
import { X, UserX, AlertTriangle, Loader2, Calendar, FileText } from 'lucide-react';
import { User } from '../types';

interface OffboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { exitDate: string; exitReason: string; exitComments: string }) => Promise<void>;
  employee: User;
}

const EXIT_REASONS = ['Resignation', 'Termination', 'Layoff', 'Retirement', 'Contract End'];

const OffboardingModal: React.FC<OffboardingModalProps> = ({ isOpen, onClose, onConfirm, employee }) => {
  const [formData, setFormData] = useState({
    exitDate: new Date().toISOString().split('T')[0],
    exitReason: EXIT_REASONS[0],
    exitComments: ''
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.exitComments.trim()) {
      alert("Exit comments are mandatory for HR compliance.");
      return;
    }
    setLoading(true);
    await onConfirm(formData);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={onClose}></div>
      <div className="bg-white w-full max-w-xl rounded-[40px] shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-rose-50/30">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center">
              <UserX size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 leading-tight">Offboard Personnel</h3>
              <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mt-0.5">{employee.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-white hover:text-slate-600 rounded-xl transition-all shadow-sm">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex gap-3">
             <AlertTriangle className="text-amber-500 shrink-0" size={20} />
             <p className="text-xs font-medium text-amber-700 leading-relaxed">
               System access will be revoked for this resource immediately upon confirmation. This action is logged for the organizational audit trail.
             </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Calendar size={12} /> Exit Date
              </label>
              <input 
                type="date"
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-rose-500/10 font-bold text-slate-700 text-sm"
                value={formData.exitDate}
                onChange={e => setFormData({...formData, exitDate: e.target.value})}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Departure Reason</label>
              <select 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-rose-500/10 font-bold text-slate-700 text-sm appearance-none"
                value={formData.exitReason}
                onChange={e => setFormData({...formData, exitReason: e.target.value})}
              >
                {EXIT_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
              <FileText size={12} /> Exit Comments / Narrative
            </label>
            <textarea 
              required
              rows={4}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-rose-500/10 text-sm font-medium text-slate-700"
              placeholder="Detail the exit interview outcomes and compliance notes..."
              value={formData.exitComments}
              onChange={e => setFormData({...formData, exitComments: e.target.value})}
            />
          </div>

          <div className="pt-4 flex items-center gap-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all"
            >
              Abort Workflow
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="flex-[2] py-4 bg-rose-600 text-white rounded-2xl font-black uppercase tracking-[2px] text-xs hover:bg-rose-700 transition-all shadow-xl shadow-rose-100 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <UserX size={18} />}
              Confirm Offboarding
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OffboardingModal;
