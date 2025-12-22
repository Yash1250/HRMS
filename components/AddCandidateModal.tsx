
import React, { useState } from 'react';
import { X, UserPlus, Mail, Phone, Briefcase, Upload, Loader2, CheckCircle2 } from 'lucide-react';
import { Job } from '../types';

interface AddCandidateModalProps {
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  jobs: Job[];
  defaultStatus: string;
}

const AddCandidateModal: React.FC<AddCandidateModalProps> = ({ onClose, onSubmit, jobs, defaultStatus }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    jobId: jobs[0]?.id || '',
    status: defaultStatus
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.jobId) return alert("Please select an active job posting.");
    
    setLoading(true);
    const selectedJob = jobs.find(j => j.id === formData.jobId);
    await onSubmit({
      ...formData,
      role: selectedJob?.title || 'Personnel'
    });
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-md" onClick={onClose}></div>
      <div className="bg-white w-full max-w-xl rounded-[40px] shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-2xl flex items-center justify-center">
              <UserPlus size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 uppercase">Manual Entry</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">New Talent Inbound</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-white hover:text-slate-600 rounded-xl transition-all shadow-sm">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
            <input 
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all text-sm font-bold"
              placeholder="e.g. Johnathan Wick"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Work Email</label>
              <input 
                required
                type="email"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 text-sm font-bold"
                placeholder="wick@high-table.com"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Phone</label>
              <input 
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 text-sm font-bold"
                placeholder="+1 555-0101"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Linked Job Posting</label>
            <select 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 font-bold text-slate-600 text-sm"
              value={formData.jobId}
              onChange={e => setFormData({...formData, jobId: e.target.value})}
            >
              {jobs.length > 0 ? (
                jobs.map(j => <option key={j.id} value={j.id}>{j.title} ({j.department})</option>)
              ) : (
                <option value="">No Active Job Openings</option>
              )}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Curriculum Vitae (CV)</label>
            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-teal-500/50 hover:bg-teal-50/30 transition-all cursor-pointer group">
              <Upload className="text-slate-300 group-hover:text-teal-600 transition-colors mb-2" size={24} />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select PDF Document</p>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading || jobs.length === 0}
            className="w-full bg-teal-600 text-white py-4 rounded-3xl font-black uppercase tracking-[2px] text-xs hover:bg-teal-700 transition-all shadow-xl shadow-teal-100 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
            Inject into {defaultStatus}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCandidateModal;
