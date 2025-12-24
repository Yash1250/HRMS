
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Briefcase, 
  DollarSign, 
  Edit, 
  Shield, 
  CheckCircle,
  Clock,
  ExternalLink,
  MessageSquare,
  UserX,
  AlertTriangle,
  Loader2,
  X
} from 'lucide-react';
import { api } from '../mockApi';
import { User, UserRole } from '../types';
import EditEmployeeModal from '../components/EditEmployeeModal';
import OffboardingModal from '../components/OffboardingModal';

const EmployeeProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isOffboardModalOpen, setIsOffboardModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      api.getEmployeeById(id).then(data => {
        setEmployee(data);
        setLoading(false);
      });
    }
  }, [id]);

  const handleUpdateEmployee = async (data: any) => {
    if (!employee) return;
    const updated = await api.updateEmployee(employee.id, data);
    setEmployee(updated);
    setIsEditModalOpen(false);
  };

  const handleOffboard = async (offboardingData: { exitDate: string; exitReason: string; exitComments: string }) => {
    if (!employee) return;
    try {
      await api.archiveEmployee(employee.id, offboardingData);
      setIsOffboardModalOpen(false);
      navigate('/employees');
    } catch (err) {
      console.error(err);
      alert("Offboarding error: Unable to process transition at this time.");
    }
  };

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-bold uppercase tracking-widest animate-pulse">Retrieving Portfolio...</p>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-black text-slate-900">Personnel Not Found</h2>
        <button 
          onClick={() => navigate('/employees')}
          className="mt-6 inline-flex items-center gap-2 text-indigo-600 font-bold hover:underline"
        >
          <ArrowLeft size={18} /> Back to Directory
        </button>
      </div>
    );
  }

  const isArchived = employee.status === 'Archived';

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
      {/* Header / Nav */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/employees')}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors font-bold uppercase tracking-widest text-xs"
        >
          <ArrowLeft size={16} /> 
          Directory
        </button>
        <div className="flex items-center gap-3">
          {!isArchived && (
            <>
              <button 
                onClick={() => setIsOffboardModalOpen(true)}
                className="flex items-center gap-2 bg-rose-50 text-rose-600 border border-rose-100 px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-rose-100 transition-all"
              >
                <UserX size={16} /> Offboard / Terminate
              </button>
              <button 
                onClick={() => setIsEditModalOpen(true)}
                className="flex items-center gap-2 bg-indigo-900 text-white px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-950 transition-all shadow-xl shadow-indigo-100"
              >
                <Edit size={16} /> Edit Profile
              </button>
            </>
          )}
          {isArchived && (
            <div className="bg-rose-50 text-rose-600 px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest border border-rose-200 flex items-center gap-2">
               <Shield size={14} /> Archived Resource
            </div>
          )}
        </div>
      </div>

      {/* Profile Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Basic Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm p-8 text-center relative overflow-hidden group">
            <div className={`absolute top-0 left-0 w-full h-24 bg-gradient-to-br ${isArchived ? 'from-slate-600 to-slate-400' : 'from-indigo-900 to-indigo-700'}`}></div>
            <div className="relative z-10 mt-4">
              <img 
                src={employee.avatar} 
                alt={employee.name} 
                className={`w-32 h-32 rounded-[40px] object-cover mx-auto ring-8 ring-white shadow-2xl transition-transform group-hover:scale-105 ${isArchived ? 'grayscale' : ''}`}
              />
              <h2 className="text-2xl font-black text-slate-900 mt-6 leading-tight">{employee.name}</h2>
              <p className="text-xs font-black text-slate-400 uppercase tracking-[3px] mt-2">{employee.designation}</p>
              
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                  <div className="flex items-center justify-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${isArchived ? 'bg-rose-500' : employee.clockedIn ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                    <span className="text-xs font-black text-slate-700">{isArchived ? 'ARCHIVED' : employee.clockedIn ? 'ONLINE' : 'OFFLINE'}</span>
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Role</p>
                  <span className="text-xs font-black text-indigo-600">{employee.role}</span>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-100 space-y-4 text-left">
                <div className="flex items-center gap-3 text-slate-600">
                  <Mail size={18} className="text-indigo-600" />
                  <span className="text-sm font-medium">{employee.email}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <Phone size={18} className="text-indigo-600" />
                  <span className="text-sm font-medium">{employee.phone || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <MapPin size={18} className="text-indigo-600" />
                  <span className="text-sm font-medium">{employee.location || 'Remote'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm p-8">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Shield size={18} className="text-indigo-600" /> Security Clearances
            </h3>
            <div className="space-y-3">
              {['Level 3 - Operations', 'Restricted Payroll Access', 'Cloud Infra Admin'].map((perm, i) => (
                <div key={i} className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <CheckCircle size={16} className="text-emerald-500" />
                  <span className="text-xs font-bold text-slate-700">{perm}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Tabs/Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Exit Information if Archived */}
          {isArchived && employee.exitDate && (
            <div className="bg-rose-50 border border-rose-100 rounded-[40px] p-10 animate-in slide-in-from-top-4 duration-500">
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center">
                    <UserX size={20} />
                 </div>
                 <h3 className="text-sm font-black text-rose-900 uppercase tracking-[2px]">Separation Narrative</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                 <div>
                   <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Effective Date</p>
                   <p className="text-lg font-black text-rose-900">{employee.exitDate}</p>
                 </div>
                 <div>
                   <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Reason for Departure</p>
                   <p className="text-lg font-black text-rose-900">{employee.exitReason}</p>
                 </div>
              </div>
              
              <div>
                 <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-2">Internal Remarks</p>
                 <div className="p-4 bg-white/50 rounded-2xl text-rose-800 text-sm font-medium italic border border-rose-200">
                   "{employee.exitComments}"
                 </div>
              </div>
            </div>
          )}

          {/* Work Summary Card */}
          <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm p-10 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
              <Briefcase size={120} />
            </div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-[2px] mb-8">Personnel Biography</h3>
            <p className="text-slate-600 leading-relaxed font-medium">
              {employee.bio || "No biography provided. This employee is a vital part of our global enterprise system, contributing specialized skills to their respective department."}
            </p>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Calendar size={14} /> Employment Start
                </p>
                <p className="text-lg font-black text-slate-900">{employee.joinDate || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <span className="text-sm font-black">₹</span> Annual Package
                </p>
                <p className="text-lg font-black text-slate-900">₹{employee.salary?.toLocaleString('en-IN') || '0'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Clock size={14} /> Current Shift
                </p>
                <p className="text-lg font-black text-slate-900">09:30 - 18:30 IST</p>
              </div>
            </div>
          </div>

          {/* Performance/History Feed */}
          <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
             <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-[2px]">Professional Timeline</h3>
                <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline flex items-center gap-2">
                  Full Audit Log <ExternalLink size={14} />
                </button>
             </div>
             <div className="p-8 space-y-8 relative">
                <div className="absolute left-[47px] top-10 bottom-10 w-0.5 bg-slate-100"></div>
                {[
                  { date: 'Jun 12, 2024', event: 'Employee Shift Finished', desc: 'Successfully completed standard work session.', icon: Clock, color: 'text-emerald-500 bg-emerald-50' },
                  { date: 'Jun 10, 2024', event: 'Payroll Disbursed', desc: 'Monthly compensation package processed and transmitted.', icon: DollarSign, color: 'text-indigo-500 bg-indigo-50' },
                  { date: 'May 25, 2024', event: 'Annual Review Conducted', desc: 'Performance rated as "Exceeds Expectations" for Q2.', icon: Shield, color: 'text-amber-500 bg-amber-50' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 relative z-10">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-white ${item.color}`}>
                      <item.icon size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.date}</p>
                      <h4 className="font-black text-slate-900 leading-tight">{item.event}</h4>
                      <p className="text-sm text-slate-500 mt-1 font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>

      {isEditModalOpen && employee && (
        <EditEmployeeModal 
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={handleUpdateEmployee}
          employee={employee}
        />
      )}

      {isOffboardModalOpen && employee && (
        <OffboardingModal 
          isOpen={isOffboardModalOpen}
          onClose={() => setIsOffboardModalOpen(false)}
          onConfirm={handleOffboard}
          employee={employee}
        />
      )}
    </div>
  );
};

export default EmployeeProfile;
