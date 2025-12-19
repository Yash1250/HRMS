
import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../mockApi';
import { User, UserRole, TimesheetEntry, TimesheetLineItem } from '../types';
import { 
  Calendar, 
  Clock, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  FileText,
  Building,
  History,
  Send,
  Loader2,
  Trash2,
  X,
  ChevronRight,
  Eye
} from 'lucide-react';

const CLIENTS = ["Acme Corp", "Globex", "Stark Ind", "Initech", "Wayne Ent"];
const PROJECTS = ["Web Dev", "ERP Implementation", "Audit", "Mobile App", "Infrastructure"];

interface TimesheetProps {
  user: User;
}

const Timesheet: React.FC<TimesheetProps> = ({ user }) => {
  const isAdmin = user.role === UserRole.ADMIN || user.role === UserRole.MANAGER;
  const [timesheets, setTimesheets] = useState<TimesheetEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<TimesheetEntry | null>(null);

  // Form State for Multi-Line Entry
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [entries, setEntries] = useState<TimesheetLineItem[]>([
    { client: CLIENTS[0], project: PROJECTS[0], description: '', hours: 0 }
  ]);

  const totalHours = useMemo(() => {
    return entries.reduce((acc, curr) => acc + (Number(curr.hours) || 0), 0);
  }, [entries]);

  useEffect(() => {
    fetchTimesheets();
  }, []);

  const fetchTimesheets = async () => {
    setLoading(true);
    const data = await api.getTimesheets(user);
    setTimesheets(data);
    setLoading(false);
  };

  const addLineItem = () => {
    setEntries([...entries, { client: CLIENTS[0], project: PROJECTS[0], description: '', hours: 0 }]);
  };

  const removeLineItem = (index: number) => {
    if (entries.length === 1) return;
    setEntries(entries.filter((_, i) => i !== index));
  };

  const updateEntry = (index: number, field: keyof TimesheetLineItem, value: any) => {
    const newEntries = [...entries];
    newEntries[index] = { ...newEntries[index], [field]: value };
    setEntries(newEntries);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (totalHours === 0) {
      alert("Please log some hours before submitting.");
      return;
    }
    setSubmitting(true);
    try {
      await api.addTimesheet({
        userId: user.id,
        userName: user.name,
        date: formDate,
        entries: entries,
        totalHours: totalHours
      });
      setEntries([{ client: CLIENTS[0], project: PROJECTS[0], description: '', hours: 0 }]);
      await fetchTimesheets();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    setTimesheets(prev => prev.map(ts => ts.id === id ? { ...ts, status } : ts));
    if (selectedSubmission?.id === id) {
      setSelectedSubmission({ ...selectedSubmission, status });
    }
    await api.updateTimesheetStatus(id, status);
  };

  if (loading && timesheets.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Enterprise Timesheet</h1>
          <p className="text-slate-500 text-sm mt-1">
            {isAdmin ? 'System-wide labor auditing and compliance review.' : 'Log your professional billable hours across multiple projects.'}
          </p>
        </div>
      </div>

      {!isAdmin && (
        <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-900 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100">
                <Plus size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">New Submission</h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Billable Time Entry</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Entry Date:</label>
              <input 
                type="date"
                className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/10 font-bold text-slate-700 text-sm"
                value={formDate}
                onChange={e => setFormDate(e.target.value)}
              />
            </div>
          </div>

          <form onSubmit={handleFormSubmit}>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-y-2">
                <thead>
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <th className="px-4 py-2">Client</th>
                    <th className="px-4 py-2">Project</th>
                    <th className="px-4 py-2">Description</th>
                    <th className="px-4 py-2 w-24">Hours</th>
                    <th className="px-4 py-2 w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry, idx) => (
                    <tr key={idx} className="group animate-in slide-in-from-left-2 duration-300">
                      <td className="px-2">
                        <select 
                          className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 font-bold text-slate-600 text-sm"
                          value={entry.client}
                          onChange={e => updateEntry(idx, 'client', e.target.value)}
                        >
                          {CLIENTS.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </td>
                      <td className="px-2">
                        <select 
                          className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 font-bold text-slate-600 text-sm"
                          value={entry.project}
                          onChange={e => updateEntry(idx, 'project', e.target.value)}
                        >
                          {PROJECTS.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                      </td>
                      <td className="px-2">
                        <input 
                          type="text"
                          placeholder="What did you work on?"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 text-sm font-medium text-slate-700"
                          value={entry.description}
                          onChange={e => updateEntry(idx, 'description', e.target.value)}
                        />
                      </td>
                      <td className="px-2">
                        <input 
                          type="number"
                          step="0.5"
                          min="0"
                          max="24"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 text-sm font-black text-slate-900"
                          value={entry.hours}
                          onChange={e => updateEntry(idx, 'hours', e.target.value)}
                        />
                      </td>
                      <td className="px-2">
                        <button 
                          type="button"
                          onClick={() => removeLineItem(idx)}
                          className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8 flex items-center justify-between pt-8 border-t border-slate-100">
              <button 
                type="button"
                onClick={addLineItem}
                className="flex items-center gap-2 text-indigo-600 font-black uppercase tracking-widest text-[10px] bg-indigo-50 px-5 py-3 rounded-2xl hover:bg-indigo-100 transition-all"
              >
                <Plus size={16} /> Add Line Item
              </button>
              
              <div className="flex items-center gap-8">
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Daily Commitment</p>
                  <p className="text-2xl font-black text-slate-900">{totalHours.toFixed(1)} Hours</p>
                </div>
                <button 
                  type="submit"
                  disabled={submitting}
                  className="bg-indigo-900 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-[2px] text-xs hover:bg-indigo-950 transition-all shadow-xl shadow-indigo-100 flex items-center gap-3 disabled:opacity-50"
                >
                  {submitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                  Dispatch Timesheet
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* History Ledger */}
      <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <div className="flex items-center gap-3">
            <History className="text-indigo-600" size={24} />
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-[2px]">
              {isAdmin ? 'System Audit Ledger' : 'My Submission Archive'}
            </h2>
          </div>
          <div className="flex items-center gap-2">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] bg-white px-4 py-1.5 rounded-full border border-slate-100 shadow-sm">
                {timesheets.length} Records Secure
             </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5">Date</th>
                {isAdmin && <th className="px-8 py-5">Resource</th>}
                <th className="px-8 py-5">Breakdown</th>
                <th className="px-8 py-5">Total Hours</th>
                <th className="px-8 py-5 text-right">Review</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {timesheets.map((ts) => (
                <tr key={ts.id} className="group hover:bg-slate-50/50 transition-colors cursor-pointer" onClick={() => setSelectedSubmission(ts)}>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      {ts.status === 'PENDING' && (
                        <span className="flex items-center gap-1.5 text-[10px] font-black text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg uppercase tracking-wider">
                          <AlertCircle size={12} /> Pending
                        </span>
                      )}
                      {ts.status === 'APPROVED' && (
                        <span className="flex items-center gap-1.5 text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg uppercase tracking-wider">
                          <CheckCircle2 size={12} /> Approved
                        </span>
                      )}
                      {ts.status === 'REJECTED' && (
                        <span className="flex items-center gap-1.5 text-[10px] font-black text-rose-600 bg-rose-50 px-3 py-1.5 rounded-lg uppercase tracking-wider">
                          <XCircle size={12} /> Rejected
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm font-bold text-slate-600">{ts.date}</td>
                  {isAdmin && (
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-[10px] font-black text-indigo-700">
                          {ts.userName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-sm font-bold text-slate-900">{ts.userName}</span>
                      </div>
                    </td>
                  )}
                  <td className="px-8 py-5">
                    <div className="flex flex-wrap gap-1.5">
                      {ts.entries.slice(0, 2).map((e, i) => (
                        <span key={i} className="text-[10px] font-bold text-slate-400 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                          {e.project}
                        </span>
                      ))}
                      {ts.entries.length > 2 && (
                        <span className="text-[10px] font-bold text-indigo-600">+{ts.entries.length - 2} more</span>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm font-black text-slate-900">{ts.totalHours.toFixed(1)}h</td>
                  <td className="px-8 py-5 text-right">
                    <button className="p-2 text-slate-300 hover:text-indigo-600 transition-all bg-white rounded-xl shadow-sm border border-slate-100 group-hover:scale-110">
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drill-down Detail Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-md" onClick={() => setSelectedSubmission(null)}></div>
          <div className="bg-white w-full max-w-3xl rounded-[40px] shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-10 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-white rounded-3xl shadow-xl flex items-center justify-center text-indigo-600 border border-slate-100">
                  <FileText size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 leading-tight">Submission Audit</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{selectedSubmission.userName}</span>
                    <span className="text-slate-200 text-lg leading-none">/</span>
                    <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">{selectedSubmission.date}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedSubmission(null)} className="p-3 text-slate-400 hover:bg-white hover:text-slate-600 rounded-2xl transition-all shadow-sm">
                <X size={24} />
              </button>
            </div>

            <div className="p-10">
              <div className="bg-slate-50 rounded-[32px] border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-white border-b border-slate-100">
                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <th className="px-6 py-4">Client / Project</th>
                      <th className="px-6 py-4">Task Narrative</th>
                      <th className="px-6 py-4 text-right">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedSubmission.entries.map((entry, idx) => (
                      <tr key={idx}>
                        <td className="px-6 py-4">
                          <p className="text-sm font-black text-slate-900">{entry.client}</p>
                          <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">{entry.project}</p>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                          {entry.description || 'No description provided.'}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-sm font-black text-slate-900">{entry.hours}h</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-900 text-white">
                    <tr>
                      <td colSpan={2} className="px-6 py-4 text-xs font-black uppercase tracking-[2px]">Aggregated Commitment</td>
                      <td className="px-6 py-4 text-right text-lg font-black">{selectedSubmission.totalHours.toFixed(1)}h</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="mt-10 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Current State</p>
                  <div className="flex items-center gap-2">
                    {selectedSubmission.status === 'PENDING' && <span className="text-sm font-black text-amber-600">PENDING APPROVAL</span>}
                    {selectedSubmission.status === 'APPROVED' && <span className="text-sm font-black text-emerald-600">VERIFIED & ARCHIVED</span>}
                    {selectedSubmission.status === 'REJECTED' && <span className="text-sm font-black text-rose-600">REJECTED BY ADMIN</span>}
                  </div>
                </div>

                {isAdmin && selectedSubmission.status === 'PENDING' && (
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => handleStatusUpdate(selectedSubmission.id, 'REJECTED')}
                      className="flex items-center gap-2 px-6 py-3 rounded-2xl border-2 border-rose-100 text-rose-600 font-black uppercase tracking-widest text-[10px] hover:bg-rose-50 transition-all"
                    >
                      <XCircle size={18} /> Reject
                    </button>
                    <button 
                      onClick={() => handleStatusUpdate(selectedSubmission.id, 'APPROVED')}
                      className="flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100"
                    >
                      <CheckCircle2 size={18} /> Approve & Commit
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timesheet;
