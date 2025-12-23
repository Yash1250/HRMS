
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Filter, 
  Search, 
  Download, 
  UserPlus, 
  Mail, 
  Phone, 
  MoreVertical,
  ChevronRight,
  Eye,
  Users,
  UserX,
  History
} from 'lucide-react';
import { api } from '../mockApi';
import { User } from '../types';
import AddMemberModal from '../components/AddMemberModal';

const EmployeeManagement: React.FC = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeView, setActiveView] = useState<'active' | 'archived'>('active');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const data = await api.getEmployees();
    setEmployees(data);
    setLoading(false);
  };

  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const matchesSearch = 
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.designation.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTab = activeView === 'active' 
        ? (emp.status !== 'Archived') 
        : (emp.status === 'Archived');

      return matchesSearch && matchesTab;
    });
  }, [searchTerm, employees, activeView]);

  const handleAddEmployee = async (data: any) => {
    await api.addEmployee(data);
    fetchEmployees();
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Personnel Directory</h1>
          <p className="text-slate-500 text-sm mt-1">Unified view of the global organizational fleet.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:bg-slate-50 transition-colors shadow-sm">
            <Download size={20} />
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-900 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-950 transition-all shadow-xl shadow-indigo-100"
          >
            <UserPlus size={18} />
            Hire New Member
          </button>
        </div>
      </div>

      <div className="flex gap-2 bg-white p-1.5 rounded-[24px] border border-slate-200 shadow-sm w-fit">
        <button
          onClick={() => setActiveView('active')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all
            ${activeView === 'active' ? 'bg-indigo-900 text-white shadow-xl shadow-indigo-100' : 'text-slate-400 hover:bg-slate-50'}`}
        >
          <Users size={16} />
          Active Fleet
        </button>
        <button
          onClick={() => setActiveView('archived')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all
            ${activeView === 'archived' ? 'bg-indigo-900 text-white shadow-xl shadow-indigo-100' : 'text-slate-400 hover:bg-slate-50'}`}
        >
          <History size={16} />
          Historical Archive
        </button>
      </div>

      <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm flex flex-wrap items-center gap-6">
        <div className="flex-1 min-w-[300px] flex items-center gap-3 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100 focus-within:ring-4 focus-within:ring-indigo-500/10 focus-within:border-indigo-500/50 transition-all">
          <Search size={20} className="text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by name, ID, or designation..." 
            className="bg-transparent border-none outline-none text-sm w-full font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-4">
          <select className="bg-white border border-slate-200 text-[10px] font-black uppercase tracking-widest py-3 px-5 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 text-slate-600">
            <option>All Departments</option>
            <option>Engineering</option>
            <option>Design</option>
          </select>
          <button className="flex items-center gap-2 bg-slate-100 text-slate-700 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-colors">
            <Filter size={18} />
            Advanced
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center font-black text-slate-400 uppercase tracking-[4px]">Syncing Directory...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredEmployees.map((emp) => (
            <div 
              key={emp.id} 
              onClick={() => navigate(`/employees/${emp.id}`)}
              className={`bg-white rounded-[32px] border border-slate-200 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group overflow-hidden cursor-pointer
                ${emp.status === 'Archived' ? 'opacity-75 grayscale-[0.5]' : ''}`}
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className="relative">
                    <img src={emp.avatar} alt={emp.name} className="w-20 h-20 rounded-3xl object-cover ring-4 ring-slate-50 shadow-md group-hover:ring-teal-100 transition-all" />
                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-4 border-white 
                      ${emp.status === 'Archived' ? 'bg-slate-400' : emp.clockedIn ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                  </div>
                  <button className="p-2 text-slate-300 hover:text-indigo-600 transition-colors">
                    <MoreVertical size={24} />
                  </button>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-xl text-slate-900 group-hover:text-indigo-900 transition-colors leading-tight">{emp.name}</h3>
                    {emp.status === 'Archived' && (
                      <span className="bg-rose-50 text-rose-600 text-[8px] font-black px-2 py-1 rounded uppercase tracking-widest border border-rose-100">Terminated</span>
                    )}
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] mt-2">{emp.designation}</p>
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-3 py-1 rounded-lg uppercase tracking-wider">{emp.department}</span>
                    <span className="bg-slate-50 text-slate-500 text-[10px] font-bold px-3 py-1 rounded-lg uppercase tracking-wider">{emp.id}</span>
                  </div>
                </div>

                <div className="mt-8">
                  <button 
                    onClick={(e) => { e.stopPropagation(); navigate(`/employees/${emp.id}`); }}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-white border-2 border-indigo-900 text-indigo-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-900 hover:text-white transition-all shadow-sm"
                  >
                    <Eye size={16} /> View Full Profile
                  </button>
                </div>
              </div>
              
              <button className="w-full py-4 bg-slate-50 border-t border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-[3px] hover:bg-slate-100 hover:text-indigo-900 transition-all flex items-center justify-center gap-3">
                Professional Roadmap <ChevronRight size={14} />
              </button>
            </div>
          ))}
          {filteredEmployees.length === 0 && (
            <div className="col-span-full py-24 text-center">
              {activeView === 'archived' ? <History size={48} className="mx-auto text-slate-100 mb-4" /> : <Users size={48} className="mx-auto text-slate-100 mb-4" />}
              <p className="text-slate-400 font-black uppercase tracking-[3px] text-xs">No matching {activeView} personnel records found</p>
            </div>
          )}
        </div>
      )}

      <AddMemberModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddEmployee} 
      />
    </div>
  );
};

export default EmployeeManagement;
