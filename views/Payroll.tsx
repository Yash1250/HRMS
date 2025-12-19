
import React from 'react';
import { 
  CreditCard, 
  Download, 
  TrendingUp, 
  AlertCircle,
  FileText,
  DollarSign,
  ChevronRight
} from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip } from 'recharts';

const payrollData = [
  { month: 'Jan', amount: 120000 },
  { month: 'Feb', amount: 125000 },
  { month: 'Mar', amount: 122000 },
  { month: 'Apr', amount: 128000 },
  { month: 'May', amount: 135000 },
];

const Payroll: React.FC = () => {
  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Payroll & Compensation</h1>
          <p className="text-slate-500 text-sm mt-1">Manage salary disbursements, structures, and taxes.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100">
            <DollarSign size={18} />
            Disburse Salary
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Statistics Cards */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm col-span-1">
          <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
            <TrendingUp size={18} className="text-teal-600" />
            Payroll Overview
          </h3>
          <div className="space-y-6">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Monthly Cost</p>
              <p className="text-2xl font-black text-indigo-900 mt-1">$142,500.00</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div>
                 <p className="text-xs text-slate-500 font-medium">Taxes (Est.)</p>
                 <p className="text-lg font-bold text-slate-800">$18,420</p>
               </div>
               <div>
                 <p className="text-xs text-slate-500 font-medium">Benefits</p>
                 <p className="text-lg font-bold text-slate-800">$22,100</p>
               </div>
            </div>
            <div className="h-32 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={payrollData}>
                  <Bar dataKey="amount" fill="#1A237E" radius={[4, 4, 0, 0]} />
                  <XAxis dataKey="month" hide />
                  <Tooltip cursor={{fill: 'transparent'}} contentStyle={{display: 'none'}} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Payslips */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm lg:col-span-2 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900">Pending Approvals</h3>
            <span className="bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 rounded-full font-bold">4 REQUESTS</span>
          </div>
          <div className="divide-y divide-slate-100">
            {[
              { name: 'Marcus Aurelius', id: '#PY-2045', date: 'May 12, 2024', amount: '$6,800.00', status: 'Pending' },
              { name: 'Julia Roberts', id: '#PY-2046', date: 'May 12, 2024', amount: '$5,200.00', status: 'Review' },
              { name: 'Chris Evans', id: '#PY-2047', date: 'May 11, 2024', amount: '$4,500.00', status: 'Pending' },
              { name: 'Natasha Romanoff', id: '#PY-2048', date: 'May 11, 2024', amount: '$8,200.00', status: 'Pending' },
            ].map((p, i) => (
              <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <FileText size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{p.name}</p>
                    <p className="text-xs text-slate-400">{p.id} • {p.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-slate-900">{p.amount}</p>
                  <button className="text-[10px] font-bold text-teal-600 uppercase tracking-widest hover:underline">Verify</button>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 bg-slate-50 text-center">
             <button className="text-xs font-bold text-slate-400 hover:text-indigo-600 transition-all flex items-center justify-center gap-2 w-full">
               VIEW FULL HISTORY <ChevronRight size={14} />
             </button>
          </div>
        </div>
      </div>

      <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl flex items-start gap-4">
         <AlertCircle className="text-indigo-600 flex-shrink-0" />
         <div>
           <h4 className="font-bold text-indigo-900">Tax Compliance Reminder</h4>
           <p className="text-sm text-indigo-700 mt-1">The Q2 tax filing deadline is approaching on June 30th. Ensure all deduction records are synchronized with the government portal by next Friday.</p>
           <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-all shadow-md">Run Audit Tool</button>
         </div>
      </div>
    </div>
  );
};

export default Payroll;
