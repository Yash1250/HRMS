
import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { MoreHorizontal, Clock, Star, MessageSquare, FileText } from 'lucide-react';
import { Candidate } from '../types';

interface CandidateCardProps {
  candidate: Candidate;
  index: number;
  onClick: () => void;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, index, onClick }) => {
  return (
    <Draggable draggableId={candidate.id} index={index}>
      {(provided, snapshot) => (
        <div 
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={onClick}
          className={`bg-white p-4 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 group cursor-pointer
            ${snapshot.isDragging ? 'ring-4 ring-indigo-500/20 shadow-2xl border-indigo-300' : ''}`}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <img src={candidate.avatar} className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-50" alt="" />
              <div>
                <h4 className="text-sm font-black text-slate-900 leading-none group-hover:text-indigo-900 transition-colors">{candidate.name}</h4>
                <p className="text-[10px] text-slate-400 mt-1.5 font-bold uppercase tracking-wider">{candidate.role}</p>
              </div>
            </div>
            <button className="text-slate-300 hover:text-slate-500 transition-colors">
              <MoreHorizontal size={18} />
            </button>
          </div>

          <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-[2px] mb-4">
            <div className="flex items-center gap-1 text-slate-400">
              <Clock size={12} className="text-slate-300" />
              {candidate.lastUpdate}
            </div>
            <div className="flex items-center gap-1 text-amber-500">
              <Star size={12} fill="currentColor" />
              {candidate.score}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-50">
            <div className="flex -space-x-1.5">
              <div className="w-6 h-6 rounded-lg border-2 border-white bg-indigo-500 flex items-center justify-center text-[7px] font-black text-white shadow-sm">HR</div>
              <div className="w-6 h-6 rounded-lg border-2 border-white bg-teal-500 flex items-center justify-center text-[7px] font-black text-white shadow-sm">CT</div>
            </div>
            <div className="flex items-center gap-1">
              <button className="p-1.5 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                <MessageSquare size={14} />
              </button>
              <button className="p-1.5 text-slate-300 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all">
                <FileText size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default CandidateCard;