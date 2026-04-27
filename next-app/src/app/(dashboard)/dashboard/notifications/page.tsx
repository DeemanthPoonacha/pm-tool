'use client';

import { useState } from 'react';
import { Header } from '@/components/dashboard/header';
import { 
  Bell, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  Clock, 
  MoreVertical, 
  Check, 
  Settings, 
  BellOff,
  CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function NotificationsPage() {
  const [isSaved, setIsSaved] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'task', title: 'New Task Assigned', desc: 'You have been assigned to "Integrate Auth Module" in Project Phoenix.', time: '2 mins ago', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10', read: false },
    { id: 2, type: 'cr', title: 'Change Request Approved', desc: 'CR #104 has been approved by the Delivery Head.', time: '1 hour ago', icon: Info, color: 'text-blue-500', bg: 'bg-blue-500/10', read: false },
    { id: 3, type: 'alert', title: 'Deadline Approaching', desc: 'UAT Sign-off for Project Apollo is due in 24 hours.', time: '5 hours ago', icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-500/10', read: true },
  ]);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleSavePreferences = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <>
      <Header title="Notifications" />
      <main className="p-8 max-w-7xl mx-auto w-full space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Stay Updated</h2>
            <p className="text-zinc-500 mt-1">Real-time alerts and updates from your active projects.</p>
          </div>
          <div className="flex items-center gap-3">
             <button 
               onClick={markAllRead}
               className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-zinc-300 text-sm font-bold rounded-xl border border-zinc-800 hover:bg-zinc-800 transition-all active:scale-95"
             >
                <Check className="w-4 h-4" />
                Mark all as read
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Notifications List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-zinc-900/50 rounded-3xl border border-zinc-800/50 overflow-hidden premium-shadow">
               {notifications.length === 0 ? (
                 <div className="p-20 text-center flex flex-col items-center justify-center">
                    <div className="w-20 h-20 bg-zinc-800/50 rounded-2xl flex items-center justify-center mb-6 border border-zinc-800">
                       <BellOff className="w-10 h-10 text-zinc-600" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No new notifications</h3>
                    <p className="text-zinc-500 max-w-xs mx-auto">You're all caught up! We'll alert you when something important happens.</p>
                 </div>
               ) : (
                 <div className="divide-y divide-zinc-800/50">
                    {notifications.map((item) => (
                      <div 
                        key={item.id} 
                        className={cn(
                          "p-6 flex gap-4 hover:bg-zinc-900/50 transition-all group cursor-pointer",
                          item.read ? "opacity-50" : "opacity-100 bg-blue-600/[0.02]"
                        )}
                      >
                         <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center border transition-all", item.bg, "border-white/5 shadow-lg shadow-black/20")}>
                            <item.icon className={cn("w-5 h-5", item.color)} />
                         </div>
                         <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                               <h4 className="text-sm font-bold text-white mb-1">{item.title}</h4>
                               <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{item.time}</span>
                            </div>
                            <p className="text-sm text-zinc-500 leading-relaxed truncate">{item.desc}</p>
                         </div>
                         <div className="flex flex-col items-end gap-2">
                            {!item.read && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                            <button className="p-2 text-zinc-700 hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                               <MoreVertical className="w-5 h-5" />
                            </button>
                         </div>
                      </div>
                    ))}
                 </div>
               )}
            </div>
          </div>

          {/* Settings Sidebar */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
               <Settings className="w-4 h-4 text-zinc-500" />
               <h3 className="text-sm font-bold text-white uppercase tracking-widest">Preferences</h3>
            </div>
            <div className="bg-zinc-900/50 rounded-3xl border border-zinc-800/50 p-6 space-y-4 premium-shadow">
               {[
                 { label: 'Task Assignments', desc: 'When you are assigned or mentioned.' },
                 { label: 'Project Updates', desc: 'Status changes and milestones.' },
                 { label: 'Requirement Reviews', desc: 'Approval requests and document updates.' },
                 { label: 'CR Updates', desc: 'Decisions on change requests.' },
               ].map((pref, i) => (
                 <label key={i} className="flex items-start gap-3 p-4 bg-zinc-950/50 rounded-2xl border border-zinc-800/50 cursor-pointer hover:border-zinc-700 transition-all group">
                    <div className="relative flex items-center mt-1">
                       <input type="checkbox" defaultChecked={i < 2} className="w-5 h-5 rounded-lg border-zinc-800 bg-zinc-900 text-blue-600 focus:ring-offset-zinc-950" />
                    </div>
                    <div>
                       <p className="text-xs font-bold text-white mb-1 group-hover:text-blue-500 transition-colors">{pref.label}</p>
                       <p className="text-[10px] text-zinc-500 font-medium leading-tight">{pref.desc}</p>
                    </div>
                 </label>
               ))}
               <button 
                 onClick={handleSavePreferences}
                 className={cn(
                   "w-full py-3 text-xs font-bold rounded-xl transition-all border mt-4 flex items-center justify-center gap-2",
                   isSaved ? "bg-emerald-600 text-white border-emerald-500" : "bg-zinc-800 hover:bg-zinc-700 text-white border-zinc-700"
                 )}
               >
                  {isSaved ? <><CheckCircle className="w-4 h-4" /> Preferences Saved</> : 'Save Preferences'}
               </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}