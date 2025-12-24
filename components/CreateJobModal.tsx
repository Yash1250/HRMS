
import React, { useState } from 'react';
// Fix: Added missing Loader2 icon import
import { X, Briefcase, Plus, Globe, Building, Loader2 } from 'lucide-react';

interface CreateJobModalProps {
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

const CreateJobModal: React.FC<CreateJobModalProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    department: 'Engineering',
    location: 'Remote',
    salary: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit(formData);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-md" onClick={onClose}></div>
      <div className="bg-white w-full max-w-xl rounded-[40px] shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center">
              <Briefcase size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 uppercase">Create Position</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Personnel Recruitment Unit</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-white hover:text-slate-600 rounded-xl transition-all shadow-sm">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Job Title</label>
            <input 
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all text-sm font-bold"
              placeholder="e.g. Senior Software Engineer"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Department</label>
              <select 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 font-bold text-slate-600 text-sm"
                value={formData.department}
                onChange={e => setFormData({...formData, department: e.target.value})}
              >
                <option>Engineering</option>
                <option>Technology</option>
                <option>Design</option>
                <option>Marketing</option>
                <option>Sales</option>
                <option>Human Resources</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Compensation Range (₹)</label>
              <input 
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all text-sm font-bold"
                placeholder="e.g. ₹15,00,000 - ₹20,00,000"
                value={formData.salary}
                onChange={e => setFormData({...formData, salary: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Job Narrative</label>
            <textarea 
              rows={3}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 text-sm font-medium"
              placeholder="Outline role expectations and deliverables..."
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-900 text-white py-4 rounded-3xl font-black uppercase tracking-[2px] text-xs hover:bg-indigo-950 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
            Commit Job Posting
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateJobModal;
