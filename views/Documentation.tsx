
import React, { useState, useEffect } from 'react';
import { api } from '../mockApi';
import { HRDocument } from '../types';
import { FileText, Folder, Upload, Search, Download, Trash2, CheckCircle } from 'lucide-react';

const Documentation: React.FC = () => {
  const [docs, setDocs] = useState<HRDocument[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    api.getDocuments().then(setDocs);
  }, []);

  const handleUpload = async () => {
    setUploading(true);
    setProgress(0);
    
    // Simulate progress bar
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + 5;
      });
    }, 100);

    const newDoc = await api.addDocument({
      name: `Contract_Amended_${Math.floor(Math.random() * 1000)}.pdf`,
      category: 'Contract',
      size: '1.4 MB',
      type: 'application/pdf'
    });

    setDocs(prev => [newDoc, ...prev]);
    setUploading(false);
    setProgress(0);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Corporate Repository</h1>
          <p className="text-slate-500 text-sm mt-1">Global document management and policy storage.</p>
        </div>
        <button 
          onClick={handleUpload}
          disabled={uploading}
          className="flex items-center gap-3 bg-indigo-900 text-white px-6 py-3.5 rounded-2xl text-sm font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-950 transition-all disabled:opacity-50"
        >
          <Upload size={18} />
          {uploading ? `Uploading ${progress}%` : 'Upload Document'}
        </button>
      </div>

      {uploading && (
        <div className="w-full bg-white p-4 rounded-2xl border border-indigo-100 shadow-sm animate-pulse">
          <div className="flex items-center justify-between mb-2">
             <span className="text-xs font-bold text-indigo-900 uppercase tracking-widest">Encrypting and Storing...</span>
             <span className="text-xs font-black text-indigo-900">{progress}%</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
             <div className="h-full bg-indigo-600 transition-all duration-300" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      )}

      {/* Folders Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { name: 'Policies', count: 12, color: 'text-indigo-600 bg-indigo-50' },
          { name: 'Contracts', count: 48, color: 'text-teal-600 bg-teal-50' },
          { name: 'Onboarding', count: 5, color: 'text-amber-600 bg-amber-50' },
          { name: 'Reports', count: 24, color: 'text-rose-600 bg-rose-50' },
        ].map((folder) => (
          <div key={folder.name} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group">
             <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${folder.color}`}>
               <Folder size={24} fill="currentColor" fillOpacity={0.2} />
             </div>
             <h3 className="font-bold text-slate-900">{folder.name}</h3>
             <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-bold">{folder.count} Files</p>
          </div>
        ))}
      </div>

      {/* Recent Files */}
      <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-black text-slate-900 text-lg">Master Inventory</h2>
          <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
            <Search size={16} className="text-slate-400" />
            <input type="text" placeholder="Quick search..." className="bg-transparent border-none outline-none text-xs w-32 md:w-48 font-medium" />
          </div>
        </div>
        
        <div className="divide-y divide-slate-50">
          {docs.map((doc) => (
            <div key={doc.id} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-100 text-slate-400 rounded-xl flex items-center justify-center">
                  <FileText size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{doc.name}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest">{doc.category}</span>
                    <span className="text-[10px] text-slate-400 font-medium">Added {doc.uploadDate}</span>
                    <span className="text-[10px] text-slate-400 font-medium">{doc.size}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-slate-300 hover:text-indigo-600 transition-colors">
                  <Download size={18} />
                </button>
                <button className="p-2 text-slate-300 hover:text-rose-600 transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Documentation;
