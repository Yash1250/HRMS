
import React, { useState, useEffect } from 'react';
import { Bell, Check, Clock, Info } from 'lucide-react';
import { api } from '../mockApi';
import { AppNotification, User } from '../types';

interface NotificationDropdownProps {
  user: User;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    // Initial fetch
    fetchNotifications();
    
    // Polling mechanism (every 30 seconds as requested)
    const interval = setInterval(fetchNotifications, 30000); 
    
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await api.getNotifications(user.id);
      setNotifications(data);
    } catch (err) {
      console.error("Failed to sync notifications", err);
    }
  };

  const markRead = async () => {
    try {
      await api.markNotificationsRead(user.id);
      await fetchNotifications();
    } catch (err) {
      console.error("Failed to mark notifications as read", err);
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => { 
          setIsOpen(!isOpen); 
          if(!isOpen && unreadCount > 0) markRead(); 
        }}
        className={`p-3 rounded-2xl relative transition-colors group ${isOpen ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:bg-slate-50'}`}
      >
        <Bell size={22} className={isOpen ? 'text-indigo-600' : 'group-hover:text-indigo-600'} />
        {unreadCount > 0 && (
          <span className="absolute top-2.5 right-2.5 w-4 h-4 bg-rose-500 border-2 border-white rounded-full flex items-center justify-center text-[8px] font-black text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 mt-4 w-80 md:w-96 bg-white rounded-3xl shadow-2xl border border-slate-100 z-50 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Global Alerts</h3>
              <button 
                onClick={markRead}
                className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline"
              >
                Clear All
              </button>
            </div>

            <div className="max-h-[400px] overflow-y-auto divide-y divide-slate-50 custom-scrollbar">
              {notifications.length > 0 ? (
                notifications.map((notif) => (
                  <div key={notif.id} className={`p-5 hover:bg-slate-50 transition-colors flex gap-4 ${!notif.isRead ? 'bg-indigo-50/30' : ''}`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm
                      ${notif.type === 'LEAVE_SUBMITTED' ? 'bg-amber-100 text-amber-600' : 
                        notif.type === 'LEAVE_STATUS_CHANGED' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}>
                      {notif.type === 'LEAVE_SUBMITTED' ? <Clock size={18} /> : 
                       notif.type === 'LEAVE_STATUS_CHANGED' ? <Check size={18} /> : <Info size={18} />}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-slate-800 leading-relaxed">{notif.message}</p>
                      <p className="text-[10px] text-slate-400 mt-1 font-bold uppercase tracking-wider">
                        {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(notif.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center">
                  <Bell size={32} className="mx-auto text-slate-200 mb-3" />
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No active notifications</p>
                </div>
              )}
            </div>
            
            <div className="p-4 bg-slate-50/50 border-t border-slate-50 text-center">
               <button className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] hover:text-indigo-600 transition-colors">
                 View All System Logs
               </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationDropdown;
