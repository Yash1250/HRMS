
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Loader2,
  ListFilter,
  Kanban,
  RotateCcw,
  UserX,
  Mail,
  MoreHorizontal,
  Briefcase,
  MapPin,
  Calendar,
  Users
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { api } from '../mockApi';
import { Candidate, Job } from '../types';
import KanbanColumn from '../components/KanbanColumn';
import CandidateModal from '../components/CandidateModal';
import CreateJobModal from '../components/CreateJobModal';
import AddCandidateModal from '../components/AddCandidateModal';

const STAGES = [
  { id: 'Applied', color: 'bg-slate-500' },
  { id: 'Screening', color: 'bg-amber-500' },
  { id: 'Interview', color: 'bg-indigo-500' },
  { id: 'Offer', color: 'bg-teal-500' },
  { id: 'Hired', color: 'bg-emerald-500' },
];

const Recruitment: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [addCandidateState, setAddCandidateState] = useState<{ isOpen: boolean; defaultStatus: string }>({
    isOpen: false,
    defaultStatus: 'Applied'
  });
  const [activeView, setActiveView] = useState<'pipeline' | 'jobs' | 'rejected'>('pipeline');

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [cData, jData] = await Promise.all([
        api.getCandidates(),
        api.getJobs()
      ]);
      setCandidates(cData);
      setJobs(jData);
    } catch (err) {
      console.error("Recruitment error:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCandidates = useMemo(() => {
    return candidates.filter(c => 
      (c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
       c.role.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [candidates, searchTerm]);

  const pipelineCandidates = useMemo(() => {
    return filteredCandidates.filter(c => c.status !== 'Rejected');
  }, [filteredCandidates]);

  const rejectedCandidates = useMemo(() => {
    return filteredCandidates.filter(c => c.status === 'Rejected');
  }, [filteredCandidates]);

  const onDragEnd = async (result: DropResult) => {
    const { draggableId, destination } = result;
    if (!destination) return;
    
    const newStatus = destination.droppableId;
    const candidateId = draggableId;

    // Optimistic Update
    const originalCandidates = [...candidates];
    setCandidates(prev => prev.map(c => 
      c.id === candidateId ? { ...c, status: newStatus as any, lastUpdate: 'Just now' } : c
    ));

    try {
      await api.moveCandidate(candidateId, newStatus);
    } catch (err) {
      setCandidates(originalCandidates);
      alert("Failed to sync status with server.");
    }
  };

  const handleCreateJob = async (jobData: any) => {
    const newJob = await api.addJob(jobData);
    setJobs(prev => [newJob, ...prev]);
    setIsJobModalOpen(false);
  };

  const handleAddCandidate = async (candidateData: any) => {
    const newCandidate = await api.addCandidate(candidateData);
    setCandidates(prev => [newCandidate, ...prev]);
    setAddCandidateState({ isOpen: false, defaultStatus: 'Applied' });
  };

  const handleUpdateCandidate = async (id: string, data: any) => {
    const updated = await api.updateCandidate(id, data);
    setCandidates(prev => prev.map(c => c.id === id ? updated : c));
    if (selectedCandidate?.id === id) setSelectedCandidate(updated);
  };

  const handleRestore = async (id: string) => {
    const updated = await api.updateCandidate(id, { status: 'Applied' });
    setCandidates(prev => prev.map(c => c.id === id ? updated : c));
  };

  const getApplicantCount = (roleTitle: string) => {
    return candidates.filter(c => c.role === roleTitle && c.status !== 'Rejected').length;
  };

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-6 animate-in fade-in duration-500 overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">ATS Pipeline</h1>
          <p className="text-slate-500 text-sm mt-1">Global talent acquisition and candidate orchestration.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600" size={16} />
            <input 
              type="text" 
              placeholder="Search directory..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 outline-none text-sm w-48 lg:w-64 focus:ring-4 focus:ring-teal-500/10 transition-all font-medium" 
            />
          </div>
          {activeView === 'jobs' ? (
            <button 
              onClick={() => setIsJobModalOpen(true)}
              className="flex items-center gap-2 bg-[#1A237E] text-white px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-900 transition-all shadow-xl shadow-indigo-100"
            >
              <Plus size={18} />
              Post Position
            </button>
          ) : (
             <button 
              onClick={() => setAddCandidateState({ isOpen: true, defaultStatus: 'Applied' })}
              className="flex items-center gap-2 bg-teal-600 text-white px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-teal-700 transition-all shadow-xl shadow-teal-100"
            >
              <Plus size={18} />
              Add Candidate
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-2 bg-white p-1.5 rounded-[24px] border border-slate-200 shadow-sm w-fit">
        <button
          onClick={() => setActiveView('pipeline')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all
            ${activeView === 'pipeline' ? 'bg-indigo-900 text-white shadow-xl shadow-indigo-100' : 'text-slate-400 hover:bg-slate-50'}`}
        >
          <Kanban size={16} />
          Pipeline
        </button>
        <button
          onClick={() => setActiveView('jobs')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all
            ${activeView === 'jobs' ? 'bg-indigo-900 text-white shadow-xl shadow-indigo-100' : 'text-slate-400 hover:bg-slate-50'}`}
        >
          <Briefcase size={16} />
          Active Jobs
        </button>
        <button
          onClick={() => setActiveView('rejected')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all
            ${activeView === 'rejected' ? 'bg-indigo-900 text-white shadow-xl shadow-indigo-100' : 'text-slate-400 hover:bg-slate-50'}`}
        >
          <UserX size={16} />
          Archived
        </button>
      </div>

      {activeView === 'pipeline' && (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex-1 overflow-x-auto pb-4 custom-scrollbar">
            <div className="flex gap-6 h-full min-w-max pr-6">
              {STAGES.map((stage) => (
                <KanbanColumn 
                  key={stage.id} 
                  stage={stage} 
                  candidates={pipelineCandidates.filter(c => c.status === stage.id)}
                  onCardClick={setSelectedCandidate}
                  onAddCandidate={(status) => setAddCandidateState({ isOpen: true, defaultStatus: status })}
                />
              ))}
            </div>
          </div>
        </DragDropContext>
      )}

      {activeView === 'jobs' && (
        <div className="flex-1 overflow-y-auto pb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
                 <div className="absolute top-0 right-0 p-8 text-slate-50 group-hover:scale-110 transition-transform">
                    <Briefcase size={100} />
                 </div>
                 <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                       <span className="bg-teal-50 text-teal-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider border border-teal-100">
                         {job.department}
                       </span>
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{job.postedAt}</span>
                    </div>
                    <h3 className="text-xl font-black text-slate-900 leading-tight mb-2">{job.title}</h3>
                    <div className="flex items-center gap-2 text-slate-500 mb-6">
                       <MapPin size={14} className="text-indigo-600" />
                       <span className="text-xs font-bold">{job.location}</span>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl mb-8 flex items-center justify-between">
                       <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Budget</p>
                          <p className="text-sm font-black text-slate-700">{job.salary}</p>
                       </div>
                       <div className="text-right">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Pipeline</p>
                          <p className="text-sm font-black text-indigo-700">{getApplicantCount(job.title)} Candidates</p>
                       </div>
                    </div>

                    <button className="w-full py-4 bg-indigo-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[2px] hover:bg-indigo-950 transition-all flex items-center justify-center gap-3">
                       <Users size={16} /> Manage Pool
                    </button>
                 </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeView === 'rejected' && (
        <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden flex-1 overflow-y-auto">
          <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-[2px]">Rejected Talent Repository</h3>
            <span className="bg-rose-100 text-rose-700 text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-wider border border-rose-200">
              {rejectedCandidates.length} ENTRIES
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                  <th className="px-10 py-5">Candidate</th>
                  <th className="px-10 py-5">Role Applied</th>
                  <th className="px-10 py-5">Contact</th>
                  <th className="px-10 py-5">Last Status</th>
                  <th className="px-10 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {rejectedCandidates.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-10 py-5">
                      <div className="flex items-center gap-4">
                        <img src={c.avatar} className="w-10 h-10 rounded-xl object-cover" alt="" />
                        <div>
                          <p className="text-sm font-black text-slate-900">{c.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Archived {c.lastUpdate}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-5">
                      <span className="text-xs font-bold text-slate-600">{c.role}</span>
                    </td>
                    <td className="px-10 py-5">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Mail size={14} />
                        <span className="text-xs font-medium">{c.email}</span>
                      </div>
                    </td>
                    <td className="px-10 py-5">
                       <span className="bg-rose-50 text-rose-600 text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider border border-rose-100">
                         Rejected
                       </span>
                    </td>
                    <td className="px-10 py-5 text-right">
                       <div className="flex items-center justify-end gap-2">
                         <button 
                           onClick={() => setSelectedCandidate(c)}
                           className="p-2.5 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                           title="View Profile"
                         >
                           <Search size={18} />
                         </button>
                         <button 
                           onClick={() => handleRestore(c.id)}
                           className="p-2.5 text-teal-600 hover:bg-teal-50 rounded-xl transition-all"
                           title="Restore Candidate"
                         >
                           <RotateCcw size={18} />
                         </button>
                       </div>
                    </td>
                  </tr>
                ))}
                {rejectedCandidates.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-20 text-center">
                       <UserX size={48} className="mx-auto text-slate-100 mb-4" />
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-[3px]">No archived talent records</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedCandidate && (
        <CandidateModal 
          candidate={selectedCandidate} 
          onClose={() => setSelectedCandidate(null)}
          onUpdate={handleUpdateCandidate}
        />
      )}

      {isJobModalOpen && (
        <CreateJobModal 
          onClose={() => setIsJobModalOpen(false)} 
          onSubmit={handleCreateJob}
        />
      )}

      {addCandidateState.isOpen && (
        <AddCandidateModal 
          onClose={() => setAddCandidateState({ ...addCandidateState, isOpen: false })}
          onSubmit={handleAddCandidate}
          jobs={jobs}
          defaultStatus={addCandidateState.defaultStatus}
        />
      )}
    </div>
  );
};

export default Recruitment;
