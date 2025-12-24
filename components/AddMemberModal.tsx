
import React, { useState } from 'react';
import { X, UserPlus, Mail, Briefcase, DollarSign, Building } from 'lucide-react';
import { UserRole } from '../types';

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: any) => Promise<void>;
}

const AddMemberModal: React.FC<AddMemberModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: UserRole.EMPLOYEE,
    department: 'Engineering',
    designation: '',
    salary: ''
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onAdd({ ...formData, salary: Number(formData.salary) });
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center">
              <UserPlus size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">Add New Member</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">Personnel Recruitment</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-white hover:text-slate-600 rounded-xl transition-all shadow-sm">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative group">
                <input 
                  required
                  className="w-full pl-4 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm"
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Work Email</label>
              <div className="relative group">
                <input 
                  required
                  type="email"
                  className="w-full pl-4 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm"
                  placeholder="r.sharma@vatsin.in"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Role</label>
              <select 
                className="w-full pl-4 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 font-bold text-slate-600 text-sm"
                value={formData.role}
                onChange={e => setFormData({...formData, role: e.target.value as UserRole})}
              >
                <option value={UserRole.EMPLOYEE}>Employee</option>
                <option value={UserRole.MANAGER}>Manager</option>
                <option value={UserRole.ADMIN}>Admin</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Department</label>
              <select 
                className="w-full pl-4 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 font-bold text-slate-600 text-sm"
                value={formData.department}
                onChange={e => setFormData({...formData, department: e.target.value})}
              >
                <option>Engineering</option>
                <option>Design</option>
                <option>Marketing</option>
                <option>Human Resources</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Designation</label>
              <input 
                required
                className="w-full pl-4 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm"
                placeholder="e.g. Tech Lead"
                value={formData.designation}
                onChange={e => setFormData({...formData, designation: e.target.value})}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Annual CTC (₹)</label>
              <input 
                required
                type="number"
                className="w-full pl-4 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm font-bold"
                placeholder="1200000"
                value={formData.salary}
                onChange={e => setFormData({...formData, salary: e.target.value})}
              />
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-900 text-white py-4 rounded-2xl font-black uppercase tracking-[2px] text-xs hover:bg-indigo-950 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? 'Processing...' : 'Complete Recruitment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMemberModal;
