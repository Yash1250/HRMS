
import React from 'react';
import { X, Mail, Phone, Calendar, Star, Download, Send, CheckCircle2, UserMinus, ArrowRight, UserCheck } from 'lucide-react';
import { Candidate } from '../types';

interface CandidateModalProps {
  candidate: Candidate;
  onClose: () => void;
  onUpdate: (id: string, data: any) => Promise<void>;
}

const CandidateModal: React.FC<CandidateModalProps> = ({ candidate, onClose, onUpdate }) => {
  const handleAction = async (status: string) => {
    await onUpdate(candidate.id, { status });
    onClose();
  };

  const getNextStageInfo = (status: string) => {
    switch (status) {
      case 'Applied':
        return { label: 'Move to Screening', target: 'Screening', icon: ArrowRight };
      case 'Screening':
        return { label: 'Schedule Interview', target: 'Interview', icon: Calendar };
      case 'Interview':
        return { label: 'Extend Offer', target: 'Offer', icon: Send };
      case 'Offer':
        return { label: 'Mark as Hired', target: 'Hired', icon: UserCheck };
      case 'Hired':
        return { label: 'Onboard Candidate', target: null, icon: CheckCircle2 };
      default:
        return { label: 'Advance Stage', target: 'Screening', icon: ArrowRight };
    }
  };

  const nextStep = getNextStageInfo(candidate.status);
  const ActionIcon = nextStep.icon;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-md" onClick={onClose}></div>
      <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-10 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <img src={candidate.avatar} className="w-20 h-20 rounded-[32px] object-cover ring-4 ring-white shadow-xl" alt="" />
            <div>
              <h3 className="text-3xl font-black text-slate-900 leading-tight">{candidate.name}</h3>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">{candidate.role}</span>
                <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider ${candidate.status === 'Rejected' ? 'bg-rose-50 text-rose-700' : 'bg-indigo-50 text-indigo-700'}`}>
                  {candidate.status}
                </span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-3 text-slate-400 hover:bg-white hover:text-slate-600 rounded-2xl transition-all shadow-sm">
            <X size={24} />
          </button>
        </div>

        <div className="p-10 space-y-10">
          <div className="grid grid-cols-2 gap-10">
            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Contact Payload</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-slate-600">
                    <Mail size={18} className="text-indigo-600" />
                    <span className="text-sm font-bold">{candidate.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <Phone size={18} className="text-indigo-600" />
                    <span className="text-sm font-bold">{candidate.phone}</span>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Professional Brief</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-slate-600">
                    <Calendar size={18} className="text-indigo-600" />
                    <span className="text-sm font-bold">Applied: {candidate.appliedAt}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <Star size={18} className="text-amber-500" />
                    <span className="text-sm font-bold">Evaluation Score: {candidate.score}/5.0</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Candidate Evidence</p>
              <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 flex flex-col items-center text-center">
                <Download size={32} className="text-indigo-600 mb-3" />
                <p className="text-sm font-black text-slate-900 uppercase">CV_Fullstack_2024.pdf</p>
                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Digital Signature Verified</p>
                <button className="mt-5 w-full bg-white text-indigo-900 border border-indigo-100 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-50 transition-all">
                  Access Document
                </button>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-50 flex items-center gap-4">
            {candidate.status !== 'Rejected' && (
              <button 
                onClick={() => handleAction('Rejected')}
                className="flex-1 flex items-center justify-center gap-2 py-4 rounded-3xl text-[10px] font-black uppercase tracking-widest text-rose-600 bg-rose-50 border border-rose-100 hover:bg-rose-100 transition-all"
              >
                <UserMinus size={18} /> Archive / Reject
              </button>
            )}
            
            {candidate.status === 'Rejected' ? (
              <button 
                onClick={() => handleAction('Applied')}
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-teal-600 text-white rounded-3xl font-black uppercase tracking-[2px] text-xs hover:bg-teal-700 transition-all shadow-xl shadow-teal-100"
              >
                <CheckCircle2 size={18} /> Restore to Applied
              </button>
            ) : (
              <button 
                onClick={() => nextStep.target && handleAction(nextStep.target)}
                disabled={!nextStep.target}
                className="flex-[2] flex items-center justify-center gap-2 py-4 bg-teal-600 text-white rounded-3xl font-black uppercase tracking-[2px] text-xs hover:bg-teal-700 transition-all shadow-xl shadow-teal-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ActionIcon size={18} /> {nextStep.label}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateModal;
