
import React, { useState, useEffect } from 'react';
import { api } from '../mockApi';
import { CompanySettings } from '../types';
import { Settings as SettingsIcon, Shield, Bell, Save, CheckCircle, Globe, Clock } from 'lucide-react';

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'notifications'>('general');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.getSettings().then(setSettings);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    await api.updateSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (!settings) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Configuration</h1>
        <p className="text-slate-500 text-sm mt-1">Manage global HR preferences and security protocols.</p>
      </div>

      <div className="flex gap-1 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm w-fit">
        {[
          { id: 'general', label: 'General', icon: SettingsIcon },
          { id: 'security', label: 'Security', icon: Shield },
          { id: 'notifications', label: 'Notifications', icon: Bell },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all
              ${activeTab === tab.id ? 'bg-indigo-900 text-white shadow-lg shadow-indigo-100' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
        <form onSubmit={handleSave} className="p-10 space-y-8">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Globe size={14} className="text-indigo-600" /> Company Identity
                  </label>
                  <input 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 font-bold text-slate-700"
                    value={settings.companyName}
                    onChange={e => setSettings({...settings, companyName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Clock size={14} className="text-indigo-600" /> Default Timezone
                  </label>
                  <select 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 font-bold text-slate-700 appearance-none"
                    value={settings.timezone}
                    onChange={e => setSettings({...settings, timezone: e.target.value})}
                  >
                    <option>UTC-08:00 (PST)</option>
                    <option>UTC-05:00 (EST)</option>
                    <option>UTC+00:00 (GMT)</option>
                    <option>UTC+01:00 (CET)</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fiscal Calendar Start</label>
                <div className="flex gap-3">
                  {['January', 'April', 'July'].map(month => (
                    <button
                      key={month}
                      type="button"
                      onClick={() => setSettings({...settings, fiscalYearStart: month})}
                      className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest border-2 transition-all
                        ${settings.fiscalYearStart === month ? 'bg-indigo-50 border-indigo-600 text-indigo-900' : 'bg-white border-slate-100 text-slate-400'}`}
                    >
                      {month}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6 py-10 text-center">
               <Shield size={48} className="mx-auto text-indigo-100" />
               <p className="text-slate-500 font-medium">Security settings are managed by the Global IT Admin console.</p>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <p className="text-sm font-bold text-slate-900">Email Alerts</p>
                  <p className="text-xs text-slate-400">Receive system-wide payroll and leave alerts.</p>
                </div>
                <button 
                  type="button"
                  onClick={() => setSettings({...settings, notificationsEnabled: !settings.notificationsEnabled})}
                  className={`w-12 h-6 rounded-full transition-all relative ${settings.notificationsEnabled ? 'bg-teal-500' : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.notificationsEnabled ? 'right-1' : 'left-1'}`}></div>
                </button>
              </div>
            </div>
          )}

          <div className="pt-8 border-t border-slate-50 flex items-center justify-between">
             <div className={`flex items-center gap-2 text-emerald-600 font-bold text-sm transition-opacity ${saved ? 'opacity-100' : 'opacity-0'}`}>
                <CheckCircle size={18} />
                Changes committed to cloud.
             </div>
             <button 
               type="submit"
               className="flex items-center gap-2 bg-indigo-900 text-white px-8 py-3.5 rounded-2xl font-black uppercase tracking-[2px] text-xs hover:bg-indigo-950 transition-all shadow-xl shadow-indigo-100"
             >
               <Save size={18} />
               Save Preferences
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
