
import React, { useState } from 'react';
// Fix: Added missing CheckCircle2 icon import
import { X, Target, Briefcase, Plus, CheckCircle2 } from 'lucide-react';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: any) => Promise<void>;
}

const GoalModal: React.FC<GoalModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    title: '',
    weight: '25%'
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onAdd(formData);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-3xl flex items-center justify-center shadow-inner">
              <Target size={28} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900">Define KPI</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Strategic Objective Unit</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 text-slate-400 hover:bg-white hover:text-slate-600 rounded-2xl transition-all shadow-sm">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Objective Narrative</label>
            <div className="relative group">
              <input 
                required
                autoFocus
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-3xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm font-bold text-slate-900"
                placeholder="e.g. Optimize CI/CD Pipeline Performance"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Strategy Weightage (%)</label>
            <select 
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-3xl outline-none focus:ring-4 focus:ring-indigo-500/10 font-black text-slate-600 text-sm appearance-none"
              value={formData.weight}
              onChange={e => setFormData({...formData, weight: e.target.value})}
            >
              <option value="10%">10% - Secondary Objective</option>
              <option value="20%">20% - Standard Task</option>
              <option value="25%">25% - Key Performance Area</option>
              <option value="40%">40% - Primary Strategic Initiative</option>
              <option value="50%">50% - Critical Mission Goal</option>
            </select>
          </div>

          <div className="pt-4 flex items-center gap-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-4 rounded-3xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={loading || !formData.title}
              className="flex-[2] py-4 bg-indigo-900 text-white rounded-3xl font-black uppercase tracking-[2px] text-xs hover:bg-indigo-950 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? <Plus size={18} className="animate-spin" /> : <CheckCircle2 className="w-4 h-4" size={18} />}
              Commit Goal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoalModal;
