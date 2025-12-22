
import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Award, 
  BarChart3, 
  Plus, 
  Star, 
  CheckCircle2, 
  Clock, 
  MessageSquare,
  ChevronRight,
  ArrowUpRight,
  Target,
  Loader2,
  X,
  // Fix: Added missing Send icon import
  Send
} from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Cell } from 'recharts';
import { api } from '../mockApi';
import { User, UserRole, PerformanceRecord, Goal } from '../types';
import GoalModal from '../components/GoalModal';

const COLORS = ['#1A237E', '#009688', '#FFC107', '#E91E63'];

const Performance: React.FC<{ user: User }> = ({ user }) => {
  const isAdmin = user.role === UserRole.ADMIN;
  const isManager = user.role === UserRole.MANAGER;
  const isPrivileged = isAdmin || isManager;

  const [activeTab, setActiveTab] = useState<'goals' | 'appraisal' | 'analytics'>(isPrivileged ? 'analytics' : 'goals');
  const [performance, setPerformance] = useState<PerformanceRecord | null>(null);
  const [allPerformance, setAllPerformance] = useState<PerformanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [selfRating, setSelfRating] = useState(0);

  useEffect(() => {
    fetchData();
  }, [user.id]);

  const fetchData = async () => {
    setLoading(true);
    const personal = await api.getPerformance(user.id);
    setPerformance(personal);
    if (personal) setSelfRating(personal.appraisals.selfRating);

    if (isPrivileged) {
      const all = await api.getAllPerformance();
      setAllPerformance(all);
    }
    setLoading(false);
  };

  const handleAddGoal = async (data: any) => {
    await api.addGoal(user.id, data);
    fetchData();
    setIsGoalModalOpen(false);
  };

  const handleSelfAppraisal = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const comment = formData.get('selfComment') as string;
    await api.updateAppraisal(user.id, { 
      selfRating, 
      selfComment: comment,
      finalStatus: 'Pending Review' 
    });
    fetchData();
  };

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  // Analytics Data preparation
  const analyticsData = allPerformance.map(p => ({
    name: p.userId === user.id ? 'You' : p.userId.split('-')[1],
    rating: p.appraisals.managerRating || p.appraisals.selfRating
  }));

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Performance Intelligence</h1>
          <p className="text-slate-500 text-sm mt-1">Strategic alignment, key results, and developmental growth.</p>
        </div>
        <div className="flex gap-1 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
          {!isPrivileged && (
            <button
              onClick={() => setActiveTab('goals')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all
                ${activeTab === 'goals' ? 'bg-indigo-900 text-white shadow-lg shadow-indigo-100' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              <Target size={16} /> My Goals
            </button>
          )}
          <button
            onClick={() => setActiveTab('appraisal')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all
              ${activeTab === 'appraisal' ? 'bg-indigo-900 text-white shadow-lg shadow-indigo-100' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            <Award size={16} /> Appraisal Workflow
          </button>
          {isPrivileged && (
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all
                ${activeTab === 'analytics' ? 'bg-indigo-900 text-white shadow-lg shadow-indigo-100' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              <BarChart3 size={16} /> Analytics
            </button>
          )}
        </div>
      </div>

      {activeTab === 'goals' && performance && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Active KPIs & Objectives</h2>
            <button 
              onClick={() => setIsGoalModalOpen(true)}
              className="flex items-center gap-2 bg-indigo-900 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-950 transition-all shadow-lg shadow-indigo-100"
            >
              <Plus size={16} /> New Goal
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {performance.goals.map((goal) => (
              <div key={goal.id} className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform"></div>
                
                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider
                    ${goal.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 
                      goal.status === 'In Progress' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-400'}`}>
                    {goal.status}
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Weight: {goal.weight}</span>
                </div>

                <h3 className="text-xl font-black text-slate-900 mb-6 relative z-10">{goal.title}</h3>

                <div className="space-y-3 relative z-10">
                  <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <span>Current Progress</span>
                    <span>{goal.progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${goal.progress === 100 ? 'bg-emerald-500' : 'bg-indigo-600'}`}
                      style={{ width: `${goal.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'appraisal' && performance && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-8">Quarterly Self Assessment</h3>
              <form onSubmit={handleSelfAppraisal} className="space-y-8">
                <div className="space-y-4">
                  <label className="text-sm font-black text-slate-700 uppercase tracking-widest">Self Proficiency Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setSelfRating(star)}
                        className={`p-3 rounded-2xl transition-all ${selfRating >= star ? 'text-amber-500 bg-amber-50 border-amber-200 border' : 'text-slate-200 bg-slate-50 border-slate-100 border'}`}
                      >
                        <Star size={24} fill={selfRating >= star ? 'currentColor' : 'none'} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Evidence & Remarks</label>
                  <textarea 
                    name="selfComment"
                    rows={4}
                    defaultValue={performance.appraisals.selfComment}
                    className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-[32px] outline-none focus:ring-4 focus:ring-indigo-500/10 font-medium text-slate-700 h-40"
                    placeholder="Elaborate on your key achievements and areas for developmental growth..."
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-indigo-900 text-white py-5 rounded-3xl font-black uppercase tracking-[2px] text-xs hover:bg-indigo-950 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3"
                >
                  <Send size={18} /> Submit Assessment
                </button>
              </form>
            </div>

            {performance.appraisals.managerRating && (
              <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm animate-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-8">Management Verification</h3>
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center">
                    <CheckCircle2 size={32} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Final Manager Rating</p>
                    <div className="flex items-center gap-1 mt-1">
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star key={s} size={18} fill={s <= (performance.appraisals.managerRating || 0) ? '#009688' : 'none'} className={s <= (performance.appraisals.managerRating || 0) ? 'text-teal-600' : 'text-slate-100'} />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 italic text-slate-600 font-medium">
                  "{performance.appraisals.managerComment}"
                </div>
              </div>
            )}
          </div>

          <div className="space-y-8">
            <div className="bg-indigo-900 p-10 rounded-[40px] text-white shadow-2xl shadow-indigo-200 relative overflow-hidden group">
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
              <h4 className="text-[10px] font-black uppercase tracking-[3px] opacity-60 mb-8">Finalized Outcome</h4>
              <div className="flex items-center gap-4 mb-10">
                <div className="text-4xl font-black">
                  {performance.appraisals.managerRating || performance.appraisals.selfRating}.0
                </div>
                <div className="h-10 w-px bg-white/20"></div>
                <div className="text-[10px] font-black uppercase tracking-widest leading-relaxed">
                  Enterprise Performance Score
                </div>
              </div>

              {performance.appraisals.managerRating && performance.appraisals.managerRating >= 4.5 ? (
                <div className="bg-amber-400 text-amber-900 p-6 rounded-3xl border border-amber-300 flex items-center gap-4 shadow-xl shadow-amber-900/20">
                  <Award size={32} />
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest leading-none mb-1">High Potential</p>
                    <p className="text-[10px] font-bold opacity-80 uppercase tracking-wider">Promotion Recommended</p>
                  </div>
                </div>
              ) : performance.appraisals.managerRating && performance.appraisals.managerRating >= 4 ? (
                <div className="bg-teal-400 text-teal-900 p-6 rounded-3xl border border-teal-300 flex items-center gap-4 shadow-xl shadow-teal-900/20">
                  <Award size={32} />
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest leading-none mb-1">Strong Performer</p>
                    <p className="text-[10px] font-bold opacity-80 uppercase tracking-wider">Bonus Eligible</p>
                  </div>
                </div>
              ) : (
                <div className="bg-white/10 p-6 rounded-3xl border border-white/10 flex items-center gap-4">
                  <Clock size={32} className="opacity-40" />
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest leading-none mb-1">Evaluation Active</p>
                    <p className="text-[10px] font-bold opacity-40 uppercase tracking-wider">Cycle {performance.appraisals.cycle}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Development History</h4>
              <div className="space-y-6">
                {['Performance Review Q3', 'Certification: React Adv', 'Code Audit High Score'].map((item, i) => (
                  <div key={i} className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 group-hover:scale-150 transition-transform"></div>
                      <span className="text-xs font-black text-slate-700 uppercase tracking-tight">{item}</span>
                    </div>
                    <ChevronRight size={14} className="text-slate-200 group-hover:text-indigo-600 transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && isPrivileged && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Efficiency Metrics</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Cross-Resource Score Comparison</p>
                </div>
                <TrendingUp size={24} className="text-indigo-600" />
              </div>
              <div className="h-[360px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 'bold'}} dy={10} />
                    <YAxis domain={[0, 5]} axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 'bold'}} />
                    <RechartsTooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)'}} />
                    <Bar dataKey="rating" radius={[12, 12, 0, 0]} barSize={40}>
                      {analyticsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-8">Performance Mix</h3>
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Top Performers</span>
                    <span className="text-sm font-black text-indigo-900">12.5%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 w-[12.5%]"></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Eligible for Bonus</span>
                    <span className="text-sm font-black text-teal-600">48.2%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-500 w-[48.2%]"></div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Awaiting Review</span>
                    <span className="text-sm font-black text-amber-600">39.3%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 w-[39.3%]"></div>
                  </div>
                </div>
              </div>

              <div className="pt-10 border-t border-slate-50">
                <button className="w-full py-4 bg-slate-50 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-900 hover:text-white transition-all shadow-sm flex items-center justify-center gap-2">
                   Generate Full Insight Report <ArrowUpRight size={14} />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
               <h3 className="text-sm font-black text-slate-900 uppercase tracking-[2px]">Governance: Appraisal Queue</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                    <th className="px-10 py-5">Personnel</th>
                    <th className="px-10 py-5">Self Rating</th>
                    <th className="px-10 py-5">Manager Rating</th>
                    <th className="px-10 py-5">Decision Status</th>
                    <th className="px-10 py-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {allPerformance.map((p, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-black text-xs">
                            {p.userId.split('-')[1]}
                          </div>
                          <span className="text-sm font-black text-slate-800">Resource ID: {p.userId}</span>
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <div className="flex gap-0.5">
                          {[1,2,3,4,5].map(s => <Star key={s} size={12} fill={s <= p.appraisals.selfRating ? '#1A237E' : 'none'} className={s <= p.appraisals.selfRating ? 'text-indigo-900' : 'text-slate-200'} />)}
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        {p.appraisals.managerRating ? (
                          <div className="flex gap-0.5">
                            {[1,2,3,4,5].map(s => <Star key={s} size={12} fill={s <= (p.appraisals.managerRating || 0) ? '#009688' : 'none'} className={s <= (p.appraisals.managerRating || 0) ? 'text-teal-600' : 'text-slate-200'} />)}
                          </div>
                        ) : (
                          <span className="text-[10px] font-black text-slate-300 uppercase italic">Pending Verification</span>
                        )}
                      </td>
                      <td className="px-10 py-6">
                        <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider
                          ${p.appraisals.finalStatus.includes('Promotion') ? 'bg-amber-50 text-amber-600' : 
                            p.appraisals.finalStatus.includes('Review') ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-400'}`}>
                          {p.appraisals.finalStatus}
                        </span>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <button className="p-3 text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all">
                          <MessageSquare size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <GoalModal 
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        onAdd={handleAddGoal}
      />
    </div>
  );
};

export default Performance;
