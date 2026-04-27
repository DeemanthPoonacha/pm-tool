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
  BellOff
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function NotificationsPage() {
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
             <button className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-zinc-300 text-sm font-bold rounded-xl border border-zinc-800 hover:bg-zinc-800 transition-all">
                <Check className="w-4 h-4" />
                Mark all as read
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Notifications List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-zinc-900/50 rounded-3xl border border-zinc-800/50 overflow-hidden premium-shadow">
               <div className="p-12 text-center flex flex-col items-center justify-center">
                  <div className="w-20 h-20 bg-zinc-800/50 rounded-2xl flex items-center justify-center mb-6 border border-zinc-800">
                     <BellOff className="w-10 h-10 text-zinc-600" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">No new notifications</h3>
                  <p className="text-zinc-500 max-w-xs mx-auto mb-8">You're all caught up! We'll alert you when something important happens in your workspace.</p>
               </div>
               
               {/* Example of what a notification might look like */}
               <div className="divide-y divide-zinc-800/50">
                  {[
                    { type: 'task', title: 'New Task Assigned', desc: 'You have been assigned to "Integrate Auth Module" in Project Phoenix.', time: '2 mins ago', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                    { type: 'cr', title: 'Change Request Approved', desc: 'CR #104 has been approved by the Delivery Head.', time: '1 hour ago', icon: Info, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                    { type: 'alert', title: 'Deadline Approaching', desc: 'UAT Sign-off for Project Apollo is due in 24 hours.', time: '5 hours ago', icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
                  ].map((item, i) => (
                    <div key={i} className="p-6 flex gap-4 hover:bg-zinc-900/50 transition-colors group cursor-pointer opacity-40 hover:opacity-100">
                       <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center border transition-all", item.bg, "border-white/5")}>
                          <item.icon className={cn("w-5 h-5", item.color)} />
                       </div>
                       <div className="flex-1">
                          <div className="flex justify-between items-start">
                             <h4 className="text-sm font-bold text-white mb-1">{item.title}</h4>
                             <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{item.time}</span>
                          </div>
                          <p className="text-sm text-zinc-500 leading-relaxed">{item.desc}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          {/* Settings Sidebar */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
               <Settings className="w-4 h-4 text-zinc-500" />
               <h3 className="text-sm font-bold text-white uppercase tracking-widest">Notification Preferences</h3>
            </div>
            <div className="bg-zinc-900/50 rounded-3xl border border-zinc-800/50 p-6 space-y-4 premium-shadow">
               {[
                 { label: 'Task Assignments', desc: 'When you are assigned or mentioned.' },
                 { label: 'Project Updates', desc: 'Status changes and major milestones.' },
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
               <button className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-xl transition-all border border-zinc-700 mt-4">
                  Save Preferences
               </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}