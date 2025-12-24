
import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, User, DollarSign, FileText, CreditCard, Loader2 } from 'lucide-react';

interface PayrollVerificationModalProps {
  onClose: () => void;
  onVerify: (userId?: string) => Promise<any>;
  onSuccess: () => void;
  month: string;
  mode: 'single' | 'batch';
  selectedEmployee?: { userId: string; name: string; amount: string };
  batchList?: any[];
}

const PayrollVerificationModal: React.FC<PayrollVerificationModalProps> = ({ 
  onClose, 
  onVerify, 
  onSuccess,
  month, 
  mode, 
  selectedEmployee,
  batchList = [] 
}) => {
  const [loading, setLoading] = useState(false);

  const handleAction = async () => {
    setLoading(true);
    try {
      // Execute the verification logic
      const res = await onVerify(selectedEmployee?.userId);
      
      if (res && res.success) {
        console.log("CLIENT: Verification successfully committed to server.");
        // Close modal and tell parent to refresh data
        onClose();
        if (onSuccess) onSuccess();
      } else {
        alert("Verification Error: The server rejected the request. Please audit records manually.");
      }
    } catch (error) {
      console.error("Verification sequence failed:", error);
      alert("System Error: Failed to commit verification. Please check network connectivity.");
    } finally {
      // THIS IS CRITICAL: Runs whether it succeeds OR fails to reset the UI
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-md" onClick={onClose}></div>
      <div className="bg-white w-full max-w-4xl rounded-[40px] shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner">
              {mode === 'single' ? <FileText size={24} /> : <ShieldCheck size={24} />}
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 leading-tight">
                {mode === 'single' ? `Verify ${selectedEmployee?.name}` : 'Batch Payroll Audit'}
              </h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Cycle: {month} 2024</p>
            </div>
          </div>
          <button onClick={onClose} disabled={loading} className="p-2 text-slate-400 hover:bg-white hover:text-slate-600 rounded-xl transition-all shadow-sm disabled:opacity-30">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          {mode === 'single' ? (
            <div className="max-w-xl mx-auto space-y-6">
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Earnings Breakdown</h4>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-slate-500">Basic Salary</span>
                    <span className="font-black text-slate-900">₹85,000</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-slate-500">HRA</span>
                    <span className="font-black text-slate-900">₹34,000</span>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-indigo-900 rounded-[32px] text-white flex justify-between items-center shadow-xl shadow-indigo-100">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[3px] opacity-60">Net Payable</p>
                  <p className="text-3xl font-black mt-1">{selectedEmployee?.amount}</p>
                </div>
                <CreditCard size={48} className="opacity-20" />
              </div>
            </div>
          ) : (
            <>
              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-8 flex gap-3 items-center">
                <ShieldCheck className="text-amber-500" size={20} />
                <p className="text-xs font-bold text-amber-700">Audit required for {batchList.filter(e => e.status === 'Pending').length} pending records.</p>
              </div>

              <div className="rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <tr>
                      <th className="px-6 py-4">Employee</th>
                      <th className="px-6 py-4 text-center">Status</th>
                      <th className="px-6 py-4 text-right">Net Payable</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {batchList.map((emp, i) => (
                      <tr key={i} className="hover:bg-slate-50/30 transition-colors">
                        <td className="px-6 py-4 text-sm font-black text-slate-900">{emp.name}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`text-[9px] font-black px-2 py-1 rounded-lg uppercase tracking-wider
                            ${emp.status === 'Verified' ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'}`}>
                            {emp.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-black text-slate-900">{emp.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        <div className="p-8 border-t border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/20">
          <div className="flex flex-col">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aggregate Amount</span>
             <span className="text-xl font-black text-indigo-900">
               {mode === 'single' ? selectedEmployee?.amount : '₹84,25,000.00'}
             </span>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={onClose}
              disabled={loading}
              className="px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-white transition-all shadow-sm disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              onClick={handleAction}
              disabled={loading}
              className="flex items-center gap-2 bg-indigo-900 text-white px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-950 transition-all shadow-xl shadow-indigo-100 disabled:opacity-50 min-w-[200px] justify-center"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
              {loading ? 'Processing...' : (mode === 'single' ? `Approve ${selectedEmployee?.name?.split(' ')[0]}` : 'Approve Batch')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayrollVerificationModal;
