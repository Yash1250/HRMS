
import React from 'react';
import { Search, Menu, LogOut, Globe, Settings } from 'lucide-react';
import { User } from '../types';
import NotificationDropdown from './NotificationDropdown';

interface NavbarProps {
  user: User;
  onLogout: () => void;
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout, toggleSidebar }) => {
  return (
    <header className="h-24 bg-white border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-40 shadow-sm">
      <div className="flex items-center gap-6">
        <button 
          onClick={toggleSidebar}
          className="lg:hidden p-3 text-slate-500 hover:bg-slate-50 rounded-2xl transition-colors"
        >
          <Menu size={24} />
        </button>
        <div className="hidden md:flex items-center gap-3 bg-slate-50 border border-slate-200 px-5 py-3 rounded-2xl w-[420px] group focus-within:ring-4 focus-within:ring-teal-500/10 focus-within:border-teal-500/50 transition-all">
          <Search size={18} className="text-slate-400 group-focus-within:text-teal-600" />
          <input 
            type="text" 
            placeholder="Search global directory, tasks, or files..." 
            className="bg-transparent border-none outline-none text-sm w-full text-slate-700 font-medium placeholder:text-slate-400"
          />
          <span className="text-[10px] font-bold text-slate-300 bg-white px-1.5 py-0.5 rounded border border-slate-100">⌘K</span>
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-8">
        <div className="flex items-center gap-1 md:gap-3">
          <NotificationDropdown user={user} />
          <button className="p-3 text-slate-400 hover:bg-slate-50 rounded-2xl transition-colors group">
            <Globe size={22} className="group-hover:text-indigo-600" />
          </button>
          <button className="p-3 text-slate-400 hover:bg-slate-50 rounded-2xl transition-colors group">
            <Settings size={22} className="group-hover:text-indigo-600" />
          </button>
        </div>

        <div className="h-10 w-px bg-slate-100 hidden md:block"></div>

        <div className="flex items-center gap-4 pl-2">
          <div className="hidden xl:block text-right">
            <p className="text-sm font-black text-slate-900 leading-none">{user.name}</p>
            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{user.designation}</p>
          </div>
          <div className="relative flex items-center gap-3 group cursor-pointer p-1.5 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-colors pr-4">
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-11 h-11 rounded-xl object-cover ring-2 ring-white shadow-sm"
            />
            <button 
              onClick={onLogout}
              className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
