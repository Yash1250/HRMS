
import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Download, 
  TrendingUp, 
  AlertCircle,
  FileText,
  DollarSign,
  ChevronRight,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Loader2,
  Users,
  LayoutDashboard
} from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip } from 'recharts';
import { User, UserRole, PayrollRecord, Payslip } from '../types';
import { api } from '../mockApi';

const adminPayrollData = [
  { month: 'Jan', amount: 120000 },
  { month: 'Feb', amount: 125000 },
  { month: 'Mar', amount: 122000 },
  { month: 'Apr', amount: 128000 },
  { month: 'May', amount: 135000 },
];

const Payroll: React.FC<{ user: User }> = ({ user }) => {
  const isPrivileged = user.role === UserRole.ADMIN || user.role === UserRole.MANAGER;
  
  // State to toggle between Admin Dashboard and Personal Documents for Admins/Managers
  const [viewMode, setViewMode] = useState<'admin' | 'personal'>(isPrivileged ? 'admin' : 'personal');
  const [activeTab, setActiveTab] = useState<'payslips' | 'tax'>('payslips');
  const [payrollRecord, setPayrollRecord] = useState<PayrollRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(2025);

  useEffect(() => {
    // Fetch personal payroll record for everyone (admins are employees too)
    api.getPayroll(user.id).then(record => {
      setPayrollRecord(record);
      setLoading(false);
    });
  }, [user.id]);

  const handleDownload = (filename: string) => {
    // Simulate a PDF download experience
    const blob = new Blob(["Simulated VatsinHR Document Content"], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
      {/* View Switcher for Admins/Managers */}
      {isPrivileged && (
        <div className="flex justify-center">
          <div className="flex gap-1 bg-white p-1.5 rounded-[24px] border border-slate-200 shadow-sm w-fit">
            <button
              onClick={() => setViewMode('admin')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all
                ${viewMode === 'admin' ? 'bg-indigo-900 text-white shadow-xl shadow-indigo-100' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              <LayoutDashboard size={16} />
              Organization Payroll
            </button>
            <button
              onClick={() => setViewMode('personal')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all
                ${viewMode === 'personal' ? 'bg-indigo-900 text-white shadow-xl shadow-indigo-100' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              <FileText size={16} />
              My Documents
            </button>
          </div>
        </div>
      )}

      {viewMode === 'admin' ? (
        /* ADMIN DASHBOARD VIEW */
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Payroll Management</h1>
              <p className="text-slate-500 text-sm mt-1">Global administrative overview of salary disbursements and taxes.</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100">
                <DollarSign size={18} />
                Disburse Salary
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm col-span-1">
              <h3 className="font-black text-slate-900 mb-8 flex items-center gap-3 uppercase tracking-tight">
                <TrendingUp size={20} className="text-teal-600" />
                Cost Intelligence
              </h3>
              <div className="space-y-8">
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Enterprise Monthly Commitment</p>
                  <p className="text-3xl font-black text-indigo-900 mt-1">$142,500.00</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tax Liability</p>
                    <p className="text-lg font-black text-slate-800">$18,420</p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Retirement Fund</p>
                    <p className="text-lg font-black text-slate-800">$22,100</p>
                  </div>
                </div>
                <div className="h-32 w-full pt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={adminPayrollData}>
                      <Bar dataKey="amount" fill="#1A237E" radius={[8, 8, 0, 0]} />
                      <XAxis dataKey="month" hide />
                      <Tooltip cursor={{fill: 'transparent'}} contentStyle={{display: 'none'}} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm lg:col-span-2 overflow-hidden">
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-[2px]">Approval Pipeline</h3>
                <span className="bg-amber-100 text-amber-700 text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-wider border border-amber-200 shadow-sm">
                  4 SUBMISSIONS
                </span>
              </div>
              <div className="divide-y divide-slate-50">
                {[
                  { name: 'Marcus Aurelius', id: '#PY-2045', date: 'May 12, 2024', amount: '$6,800.00', status: 'Pending' },
                  { name: 'Julia Roberts', id: '#PY-2046', date: 'May 12, 2024', amount: '$5,200.00', status: 'Review' },
                  { name: 'Chris Evans', id: '#PY-2047', date: 'May 11, 2024', amount: '$4,500.00', status: 'Pending' },
                  { name: 'Natasha Romanoff', id: '#PY-2048', date: 'May 11, 2024', amount: '$8,200.00', status: 'Pending' },
                ].map((p, i) => (
                  <div key={i} className="px-8 py-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-400 group-hover:bg-indigo-900 group-hover:text-white transition-all">
                        <FileText size={22} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900">{p.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{p.id} • {p.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-slate-900">{p.amount}</p>
                      <button className="text-[10px] font-black text-teal-600 uppercase tracking-widest hover:underline">Verify Entry</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-slate-50/50 text-center border-t border-slate-50">
                <button className="text-[10px] font-black text-slate-400 hover:text-indigo-600 transition-all flex items-center justify-center gap-2 w-full uppercase tracking-[2px]">
                  Master Disbursement History <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* PERSONAL DOCUMENTS VIEW (TABS) */
        <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Financial Documents</h1>
              <p className="text-slate-500 text-sm mt-1">Secure access to your remuneration history and compliance filings.</p>
            </div>
          </div>

          <div className="flex gap-2 bg-white p-1.5 rounded-[24px] border border-slate-200 shadow-sm w-fit">
            <button
              onClick={() => setActiveTab('payslips')}
              className={`flex items-center gap-2 px-6 py-3 rounded-[18px] text-xs font-black uppercase tracking-widest transition-all
                ${activeTab === 'payslips' ? 'bg-indigo-900 text-white shadow-xl shadow-indigo-100' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              <CreditCard size={18} />
              Monthly Payslips
            </button>
            <button
              onClick={() => setActiveTab('tax')}
              className={`flex items-center gap-2 px-6 py-3 rounded-[18px] text-xs font-black uppercase tracking-widest transition-all
                ${activeTab === 'tax' ? 'bg-indigo-900 text-white shadow-xl shadow-indigo-100' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              <ShieldCheck size={18} />
              Tax Documents
            </button>
          </div>

          {activeTab === 'payslips' ? (
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Financial Period</p>
                    <h3 className="text-lg font-black text-slate-900">Yearly Ledger 2025</h3>
                  </div>
                </div>
                <select 
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="bg-slate-50 border border-slate-200 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-indigo-500/10 cursor-pointer"
                >
                  <option value={2025}>2025</option>
                  <option value={2024}>2024</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {payrollRecord?.payslips.map((slip, i) => (
                  <div key={i} className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110"></div>
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h4 className="text-xl font-black text-slate-900 tracking-tight">{slip.month}</h4>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{slip.year}</p>
                        </div>
                        <span className={`text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider
                          ${slip.status === 'Processed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                          {slip.status}
                        </span>
                      </div>

                      <div className="space-y-1 mb-8">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Net Compensation</p>
                        <p className="text-2xl font-black text-slate-900">${slip.netSalary.toLocaleString()}</p>
                      </div>

                      <button 
                        onClick={() => handleDownload(`Payslip_${slip.month}_${slip.year}.pdf`)}
                        className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-[2px] hover:bg-black transition-all shadow-lg shadow-slate-200"
                      >
                        <Download size={16} />
                        Download PDF
                      </button>
                    </div>
                  </div>
                ))}
                {(!payrollRecord || payrollRecord.payslips.length === 0) && (
                  <div className="col-span-full py-20 text-center bg-white rounded-[40px] border border-slate-200 border-dashed">
                    <CreditCard size={48} className="mx-auto text-slate-200 mb-4" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[2px]">No payslips generated for this period</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm relative overflow-hidden group h-full flex flex-col justify-between">
                  <div className="absolute top-0 right-0 p-8 text-teal-600/5 group-hover:scale-110 transition-transform">
                    <ShieldCheck size={160} />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center">
                        <FileText size={24} />
                      </div>
                      <h3 className="text-xl font-black text-slate-900 tracking-tight">Form 16 (Tax Cert)</h3>
                    </div>
                    
                    <p className="text-sm font-medium text-slate-500 mb-8 leading-relaxed">
                      Certificate under section 203 of the Income-tax Act, 1961 for tax deducted at source on salary.
                    </p>

                    <div className="space-y-4 mb-10">
                      <div className="flex justify-between items-center py-3 border-b border-slate-50">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Financial Year</span>
                        <span className="text-xs font-black text-slate-900">{payrollRecord?.form16.financialYear || '2024-2025'}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-slate-50">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Eligibility Status</span>
                        {payrollRecord?.form16.isEligible ? (
                          <span className="text-[9px] font-black bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-lg uppercase tracking-wider">Eligible</span>
                        ) : (
                          <span className="text-[9px] font-black bg-slate-50 text-slate-400 px-2.5 py-1 rounded-lg uppercase tracking-wider">Not Generated</span>
                        )}
                      </div>
                      {payrollRecord?.form16.isEligible && (
                        <div className="flex justify-between items-center py-3">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Generated On</span>
                          <span className="text-xs font-bold text-slate-500">{payrollRecord?.form16.generatedDate}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {payrollRecord?.form16.isEligible ? (
                    <button 
                      onClick={() => handleDownload(`Form16_${payrollRecord.form16.financialYear}.pdf`)}
                      className="w-full flex items-center justify-center gap-2 bg-teal-600 text-white py-5 rounded-[24px] text-xs font-black uppercase tracking-[2px] hover:bg-teal-700 transition-all shadow-xl shadow-teal-100"
                    >
                      <Download size={18} />
                      Download Form 16
                    </button>
                  ) : (
                    <div className="w-full flex items-center justify-center gap-2 bg-slate-100 text-slate-400 py-5 rounded-[24px] text-xs font-black uppercase tracking-[2px] cursor-not-allowed">
                      <AlertCircle size={18} />
                      Pending Compliance
                    </div>
                  )}
                </div>

                <div className="bg-indigo-900 p-10 rounded-[40px] text-white shadow-2xl shadow-indigo-100 relative overflow-hidden flex flex-col justify-center">
                   <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                   <div className="relative z-10">
                     <Clock size={40} className="mb-6 opacity-60" />
                     <h4 className="text-2xl font-black mb-4">Regulatory Notice</h4>
                     <p className="text-sm text-indigo-100/70 leading-relaxed font-medium mb-8">
                       Form 16 is typically generated after the completion of the financial year (March 31st) and the filing of the 4th quarter TDS return. 
                       Expected availability for current year: June 15th, 2025.
                     </p>
                     <button className="text-[10px] font-black uppercase tracking-[3px] py-3 px-6 rounded-2xl border border-white/20 hover:bg-white/10 transition-all">
                       View Tax Guidelines
                     </button>
                   </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Payroll;
