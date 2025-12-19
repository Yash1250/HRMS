
import React from 'react';
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Clock, 
  MessageSquare, 
  Star,
  FileText
} from 'lucide-react';

const stages = [
  { id: 'applied', title: 'Applied', color: 'bg-slate-500' },
  { id: 'screen', title: 'Resume Screen', color: 'bg-amber-500' },
  { id: 'interview', title: 'Interview', color: 'bg-indigo-500' },
  { id: 'technical', title: 'Technical', color: 'bg-teal-500' },
  { id: 'offer', title: 'Offer', color: 'bg-emerald-500' },
];

const candidates = [
  { id: 1, name: 'Alice Freeman', role: 'UX Researcher', stage: 'applied', score: 4.5, time: '2d ago', img: 'https://picsum.photos/seed/alice/100/100' },
  { id: 2, name: 'Brad Pitt', role: 'Lead Frontend', stage: 'screen', score: 4.8, time: '1d ago', img: 'https://picsum.photos/seed/brad/100/100' },
  { id: 3, name: 'Catherine Zeta', role: 'DevOps Lead', stage: 'interview', score: 4.2, time: '3h ago', img: 'https://picsum.photos/seed/cath/100/100' },
  { id: 4, name: 'David Gandy', role: 'HR Intern', stage: 'technical', score: 4.9, time: '5h ago', img: 'https://picsum.photos/seed/david/100/100' },
  { id: 5, name: 'Eva Green', role: 'Product Manager', stage: 'offer', score: 5.0, time: 'Just now', img: 'https://picsum.photos/seed/eva/100/100' },
];

const Recruitment: React.FC = () => {
  return (
    <div className="h-full flex flex-col space-y-6 animate-in fade-in duration-500 overflow-hidden">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Recruitment Pipeline</h1>
          <p className="text-slate-500 text-sm mt-1">Manage active candidates and job applications.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600" size={16} />
            <input 
              type="text" 
              placeholder="Filter candidates..." 
              className="pl-9 pr-4 py-2 rounded-xl bg-white border border-slate-200 outline-none text-sm w-48 lg:w-64 focus:ring-2 focus:ring-teal-500 transition-all" 
            />
          </div>
          <button className="flex items-center gap-2 bg-[#1A237E] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-900 transition-all shadow-lg">
            <Plus size={18} />
            New Job Post
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-6 h-full min-w-max pr-6">
          {stages.map((stage) => (
            <div key={stage.id} className="w-80 flex flex-col">
              <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${stage.color}`}></div>
                  <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">{stage.title}</h3>
                  <span className="text-[10px] bg-slate-200 text-slate-600 font-bold px-1.5 py-0.5 rounded">
                    {candidates.filter(c => c.stage === stage.id).length}
                  </span>
                </div>
                <button className="text-slate-400 hover:text-slate-600"><Plus size={16} /></button>
              </div>

              <div className="bg-slate-100/50 rounded-2xl p-3 space-y-3 min-h-[400px] border border-slate-200 border-dashed">
                {candidates
                  .filter((c) => c.stage === stage.id)
                  .map((candidate) => (
                    <div key={candidate.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all cursor-grab active:cursor-grabbing group">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <img src={candidate.img} className="w-8 h-8 rounded-lg" alt="" />
                          <div>
                            <h4 className="text-sm font-bold text-slate-900 leading-none">{candidate.name}</h4>
                            <p className="text-[10px] text-slate-400 mt-1 font-medium">{candidate.role}</p>
                          </div>
                        </div>
                        <button className="text-slate-300 hover:text-slate-500 transition-colors">
                          <MoreHorizontal size={16} />
                        </button>
                      </div>

                      <div className="flex items-center gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-4">
                        <div className="flex items-center gap-1">
                          <Clock size={12} className="text-slate-300" />
                          {candidate.time}
                        </div>
                        <div className="flex items-center gap-1 text-amber-500">
                          <Star size={12} fill="currentColor" />
                          {candidate.score}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                        <div className="flex -space-x-2">
                          <div className="w-6 h-6 rounded-full border-2 border-white bg-indigo-500 flex items-center justify-center text-[8px] font-bold text-white">HR</div>
                          <div className="w-6 h-6 rounded-full border-2 border-white bg-teal-500 flex items-center justify-center text-[8px] font-bold text-white">CT</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="p-1.5 text-slate-400 hover:bg-slate-50 rounded-lg">
                            <MessageSquare size={14} />
                          </button>
                          <button className="p-1.5 text-slate-400 hover:bg-slate-50 rounded-lg">
                            <FileText size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                <button className="w-full py-2 bg-transparent text-slate-400 hover:text-slate-600 text-xs font-semibold border-2 border-dashed border-slate-200 rounded-xl transition-all">
                  + Drop candidate here
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Recruitment;
