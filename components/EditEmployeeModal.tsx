
import React, { useState, useEffect } from 'react';
import { X, Edit3, Mail, Briefcase, DollarSign, Building, CheckCircle2, Loader2 } from 'lucide-react';
import { User, UserRole } from '../types';

interface EditEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (data: any) => Promise<void>;
  employee: User;
}

const EditEmployeeModal: React.FC<EditEmployeeModalProps> = ({ isOpen, onClose, onUpdate, employee }) => {
  const [formData, setFormData] = useState({
    name: employee.name,
    email: employee.email,
    role: employee.role,
    department: employee.department,
    designation: employee.designation,
    salary: employee.salary?.toString() || '',
    phone: employee.phone || '',
    location: employee.location || '',
    bio: employee.bio || ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData({
      name: employee.name,
      email: employee.email,
      role: employee.role,
      department: employee.department,
      designation: employee.designation,
      salary: employee.salary?.toString() || '',
      phone: employee.phone || '',
      location: employee.location || '',
      bio: employee.bio || ''
    });
  }, [employee]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onUpdate({ ...formData, salary: Number(formData.salary) });
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner">
              <Edit3 size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">Modify Resource</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Personnel Archive Update</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-white hover:text-slate-600 rounded-xl transition-all shadow-sm">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Identity</label>
              <input 
                required
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm font-bold"
                placeholder="Full Name"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Corporate Email</label>
              <input 
                required
                type="email"
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm font-bold"
                placeholder="Email Address"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Governance Role</label>
              <select 
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 font-bold text-slate-700 text-sm appearance-none"
                value={formData.role}
                onChange={e => setFormData({...formData, role: e.target.value as UserRole})}
              >
                <option value={UserRole.EMPLOYEE}>Employee</option>
                <option value={UserRole.MANAGER}>Manager</option>
                <option value={UserRole.ADMIN}>Admin</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Operational Unit</label>
              <select 
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 font-bold text-slate-700 text-sm appearance-none"
                value={formData.department}
                onChange={e => setFormData({...formData, department: e.target.value})}
              >
                <option>Engineering</option>
                <option>Technology</option>
                <option>Design</option>
                <option>Marketing</option>
                <option>Human Resources</option>
                <option>Management</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Designation</label>
              <input 
                required
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm font-bold"
                placeholder="Designation"
                value={formData.designation}
                onChange={e => setFormData({...formData, designation: e.target.value})}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Annual CTC (₹)</label>
              <input 
                required
                type="number"
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm font-bold"
                placeholder="Annual Package"
                value={formData.salary}
                onChange={e => setFormData({...formData, salary: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Resource Biography</label>
            <textarea 
              rows={3}
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 text-sm font-medium text-slate-700"
              placeholder="Elaborate on resource background..."
              value={formData.bio}
              onChange={e => setFormData({...formData, bio: e.target.value})}
            />
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
              className="flex-[2] py-4 bg-indigo-900 text-white rounded-2xl font-black uppercase tracking-[2px] text-xs hover:bg-indigo-950 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
              Commit Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployeeModal;
