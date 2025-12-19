
import React from 'react';
import { StatCardProps } from '../types';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon, color, onClick }) => {
  const isPositive = change && change > 0;
  
  return (
    <div 
      onClick={onClick}
      className={`bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all group overflow-hidden relative
        ${onClick ? 'cursor-pointer hover:shadow-xl hover:scale-105 active:scale-95' : ''}`}
    >
      <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 opacity-[0.03] rounded-full ${color}`}></div>
      
      <div className="flex justify-between items-start">
        <div className={`p-3 rounded-xl bg-opacity-10 ${color}`}>
          <div className={`text-opacity-100 ${color.replace('bg-', 'text-')}`}>
            {icon}
          </div>
        </div>
        
        {change !== undefined && (
          <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
            {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {Math.abs(change)}%
          </div>
        )}
      </div>

      <div className="mt-4">
        <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
      </div>

      <div className="mt-3 w-full bg-slate-100 h-1 rounded-full overflow-hidden">
        <div className={`h-full ${color.split(' ')[0]} w-2/3 opacity-40`}></div>
      </div>
    </div>
  );
};

export default StatCard;
