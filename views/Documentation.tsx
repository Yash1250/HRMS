
import React, { useState, useEffect } from 'react';
import { api } from '../mockApi';
import { HRDocument, User, UserRole } from '../types';
import { 
  FileText, 
  Folder, 
  Upload, 
  Search, 
  Download, 
  Trash2, 
  ArrowLeft,
  MoreVertical,
  X,
  Loader2,
  FileIcon,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert
} from 'lucide-react';

interface DocumentationProps {
  user: User;
}

const Documentation: React.FC<DocumentationProps> = ({ user }) => {
  const isAdmin = user.role === UserRole.ADMIN || user.role === UserRole.MANAGER;
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [docs, setDocs] = useState<HRDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadData, setUploadData] = useState({ name: '', size: '1.2 MB' });
  const [uploading, setUploading] = useState(false);

  // Custom Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [docToDelete, setDocToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const folders = [
    { id: 'policies', name: 'Policies & Compliance', description: 'Internal guidelines and regulatory documents.', count: 12, color: 'text-indigo-600 bg-indigo-50' },
    { id: 'contracts', name: 'Employment Contracts', description: 'Standard hiring agreements and offer letters.', count: 48, color: 'text-teal-600 bg-teal-50' },
    { id: 'onboarding', name: 'Onboarding Material', description: 'Guides and checklists for new personnel.', count: 5, color: 'text-amber-600 bg-amber-50' },
    { id: 'reports', name: 'Analytical Reports', description: 'Monthly workforce and expenditure summaries.', count: 24, color: 'text-rose-600 bg-rose-50' },
  ];

  useEffect(() => {
    if (selectedFolder) {
      fetchDocs(selectedFolder);
    }
  }, [selectedFolder]);

  const fetchDocs = async (folderId: string) => {
    setLoading(true);
    const data = await api.getDocumentsByCategory(folderId);
    setDocs(data);
    setLoading(false);
  };

  const handleDownload = (filename: string) => {
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

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFolder) return;
    setUploading(true);
    try {
      const newDoc = await api.addDocument({
        name: uploadData.name.endsWith('.pdf') ? uploadData.name : uploadData.name + '.pdf',
        category: selectedFolder,
        size: uploadData.size
      });
      setDocs(prev => [newDoc, ...prev]);
      setIsUploadModalOpen(false);
      setUploadData({ name: '', size: '1.2 MB' });
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const openDeleteModal = (docId: string) => {
    setDocToDelete(docId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!docToDelete || !selectedFolder) return;
    setDeleting(true);
    try {
      await api.deleteDocument(selectedFolder, docToDelete);
      setDocs(prev => prev.filter(doc => doc.id !== docToDelete));
      setIsDeleteModalOpen(false);
      setDocToDelete(null);
    } catch (err) {
      console.error("Deletion failed", err);
      alert("System error: Unable to archive document at this time.");
    } finally {
      setDeleting(false);
    }
  };

  const renderFolderGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 animate-in fade-in duration-500">
      {folders.map((folder) => (
        <div 
          key={folder.id} 
          onClick={() => setSelectedFolder(folder.id)}
          className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
          <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mb-8 relative z-10 transition-transform group-hover:scale-110 ${folder.color}`}>
            <Folder size={32} fill="currentColor" fillOpacity={0.2} />
          </div>
          <h3 className="text-xl font-black text-slate-900 leading-tight relative z-10">{folder.name}</h3>
          <p className="text-sm text-slate-500 mt-3 font-medium relative z-10">{folder.description}</p>
          <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between relative z-10">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{folder.count} Records</span>
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-900 group-hover:text-white transition-all shadow-sm">
              <ArrowLeft className="rotate-180" size={14} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderFileList = () => {
    const folderInfo = folders.find(f => f.id === selectedFolder);
    return (
      <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setSelectedFolder(null)}
              className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-900 hover:border-indigo-100 transition-all shadow-sm group"
            >
              <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">{folderInfo?.name}</h2>
              <p className="text-slate-500 text-sm mt-0.5">Master repository for category files.</p>
            </div>
          </div>
          {isAdmin && (
            <button 
              onClick={() => setIsUploadModalOpen(true)}
              className="flex items-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-teal-700 transition-all shadow-xl shadow-teal-100"
            >
              <Upload size={18} />
              Upload Document
            </button>
          )}
        </div>

        <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
            <div className="flex items-center gap-4 bg-white border border-slate-200 px-5 py-2.5 rounded-2xl w-full max-w-md shadow-sm">
              <Search size={18} className="text-slate-400" />
              <input 
                type="text" 
                placeholder="Search files in this folder..." 
                className="bg-transparent border-none outline-none text-xs w-full font-black uppercase tracking-widest placeholder:text-slate-300"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                  <th className="px-10 py-5">File Name</th>
                  <th className="px-10 py-5">Date Uploaded</th>
                  <th className="px-10 py-5">File Size</th>
                  <th className="px-10 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="py-20 text-center">
                      <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
                    </td>
                  </tr>
                ) : docs.length > 0 ? (
                  docs.map((doc) => (
                    <tr key={doc.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                            <FileText size={20} />
                          </div>
                          <span className="text-sm font-black text-slate-800">{doc.name}</span>
                        </div>
                      </td>
                      <td className="px-10 py-6 text-sm font-bold text-slate-400">{doc.uploadDate}</td>
                      <td className="px-10 py-6 text-sm font-bold text-slate-900">{doc.size}</td>
                      <td className="px-10 py-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleDownload(doc.name)}
                            className="p-3 text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all"
                            title="Download File"
                          >
                            <Download size={20} />
                          </button>
                          {isAdmin && (
                            <button 
                              onClick={() => openDeleteModal(doc.id)}
                              className="p-3 text-rose-400 hover:bg-rose-50 rounded-2xl transition-all" 
                              title="Archive"
                            >
                              <Trash2 size={20} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-20 text-center">
                      <FileIcon size={48} className="mx-auto text-slate-100 mb-4" />
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[3px]">Folder is currently empty</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500 max-w-7xl mx-auto pb-20">
      {!selectedFolder ? (
        <>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">Enterprise Repository</h1>
              <p className="text-slate-500 text-base mt-2">Access organizational knowledge and regulatory documentation.</p>
            </div>
            {isAdmin && (
              <div className="flex items-center gap-3">
                 <div className="p-4 bg-white border border-slate-200 rounded-[24px] shadow-sm flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Storage Status: Nominal</span>
                 </div>
              </div>
            )}
          </div>
          {renderFolderGrid()}
        </>
      ) : (
        renderFileList()
      )}

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-md" onClick={() => setIsUploadModalOpen(false)}></div>
          <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-10 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-teal-50 text-teal-600 rounded-3xl flex items-center justify-center">
                  <Upload size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 leading-tight">Add Document</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Personnel Documentation Unit</p>
                </div>
              </div>
              <button onClick={() => setIsUploadModalOpen(false)} className="p-3 text-slate-400 hover:bg-white hover:text-slate-600 rounded-2xl transition-all shadow-sm">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleUpload} className="p-10 space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Document Name</label>
                <div className="relative group">
                  <input 
                    required
                    autoFocus
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-[24px] outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all text-sm font-bold text-slate-900"
                    placeholder="e.g. Health_Security_Procedures"
                    value={uploadData.name}
                    onChange={e => setUploadData({...uploadData, name: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Evidence Payload</label>
                <div className="border-4 border-dashed border-slate-100 rounded-[32px] p-12 text-center hover:border-teal-500/30 hover:bg-teal-50/30 transition-all group cursor-pointer">
                  <Upload className="mx-auto text-slate-200 group-hover:text-teal-400 transition-colors mb-4" size={48} />
                  <p className="text-sm font-black text-slate-900">Drop files or click to browser</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Maximum file weight: 25MB</p>
                  <input type="file" className="hidden" />
                </div>
              </div>

              <div className="pt-4 flex items-center gap-4">
                <button 
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="flex-1 py-4 rounded-3xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={uploading || !uploadData.name}
                  className="flex-[2] py-4 bg-teal-600 text-white rounded-3xl font-black uppercase tracking-[2px] text-xs hover:bg-teal-700 transition-all shadow-xl shadow-teal-100 flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {uploading ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                  Execute Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setIsDeleteModalOpen(false)}></div>
          <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-10 text-center">
              <div className="w-20 h-20 bg-rose-50 text-rose-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                <AlertTriangle size={40} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4">Delete Document?</h3>
              <p className="text-sm font-medium text-slate-500 leading-relaxed mb-8">
                Are you sure you want to delete this file? This action is permanent and cannot be undone within the enterprise repository.
              </p>
              
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 py-4 rounded-3xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all"
                >
                  Abort
                </button>
                <button 
                  onClick={confirmDelete}
                  disabled={deleting}
                  className="flex-[2] py-4 bg-rose-600 text-white rounded-3xl font-black uppercase tracking-[2px] text-xs hover:bg-rose-700 transition-all shadow-xl shadow-rose-100 flex items-center justify-center gap-2"
                >
                  {deleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                  Confirm Purge
                </button>
              </div>
            </div>
            <div className="bg-slate-50 p-4 flex items-center justify-center gap-2 border-t border-slate-100">
               <ShieldAlert size={14} className="text-rose-400" />
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Administrative Override Required</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Documentation;
