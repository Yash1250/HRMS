
import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { Plus } from 'lucide-react';
import { Candidate } from '../types';
import CandidateCard from './CandidateCard';

interface KanbanColumnProps {
  stage: { id: string; color: string };
  candidates: Candidate[];
  onCardClick: (candidate: Candidate) => void;
  onAddCandidate: (status: string) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ stage, candidates, onCardClick, onAddCandidate }) => {
  return (
    <div className="w-80 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${stage.color}`}></div>
          <h3 className="font-black text-slate-900 text-sm uppercase tracking-widest">{stage.id}</h3>
          <span className="text-[10px] bg-white border border-slate-200 text-slate-500 font-black px-2 py-0.5 rounded-full shadow-sm">
            {candidates.length}
          </span>
        </div>
        <button 
          onClick={() => onAddCandidate(stage.id)}
          className="text-slate-300 hover:text-indigo-600 transition-colors"
          title={`Add candidate to ${stage.id}`}
        >
          <Plus size={18} />
        </button>
      </div>

      <Droppable droppableId={stage.id}>
        {(provided, snapshot) => (
          <div 
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`flex-1 rounded-[32px] p-3 space-y-3 min-h-[500px] transition-all border-2 border-dashed
              ${snapshot.isDraggingOver ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50/50 border-slate-200'}`}
          >
            {candidates.map((candidate, index) => (
              <CandidateCard 
                key={candidate.id} 
                candidate={candidate} 
                index={index} 
                onClick={() => onCardClick(candidate)}
              />
            ))}
            {provided.placeholder}
            {candidates.length === 0 && !snapshot.isDraggingOver && (
              <div className="h-20 flex items-center justify-center text-slate-300 font-bold uppercase tracking-widest text-[10px]">
                Drop here
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default KanbanColumn;
