'use client';

import { useState } from 'react';
import { Header } from '@/components/dashboard/header';
import { 
  User, 
  Shield, 
  Bell, 
  BarChart3, 
  Settings as SettingsIcon,
  Info,
  ShieldCheck,
  Mail,
  Zap,
  Clock,
  Save,
  Lock,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Mocking user data and stats since we're on client side now
  const currentUser = {
    full_name: 'Mike Johnson',
    email: 'mike@pmtool.com',
    role: 'pm'
  };

  const handleSave = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }, 800);
  };

  return (
    <>
      <Header title="Account Settings" />
      <main className="p-8 max-w-7xl mx-auto w-full space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Preferences & Security</h2>
            <p className="text-zinc-500 mt-1">Manage your profile, notification settings, and system preferences.</p>
          </div>
          <button 
            onClick={handleSave}
            disabled={isLoading}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-50",
              isSaved ? "bg-emerald-600 text-white shadow-emerald-600/20" : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20"
            )}
          >
            {isSaved ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Changes Saved
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {isLoading ? 'Saving...' : 'Save Changes'}
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <div className="bg-zinc-900/50 rounded-3xl border border-zinc-800/50 p-8 space-y-8 premium-shadow">
            <div className="flex items-center gap-2">
               <User className="w-4 h-4 text-blue-500" />
               <h3 className="text-xs font-bold text-white uppercase tracking-widest">Personal Profile</h3>
            </div>
            
            <div className="flex flex-col items-center text-center">
               <div className="w-24 h-24 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center text-white text-3xl font-bold shadow-2xl shadow-blue-600/20 mb-4 border-2 border-white/10 relative group">
                  {(currentUser?.full_name || 'U').charAt(0)}
                  <div className="absolute inset-0 bg-black/40 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                     <span className="text-[10px] font-bold uppercase tracking-widest text-white">Change</span>
                  </div>
               </div>
               <h4 className="text-lg font-bold text-white">{currentUser?.full_name}</h4>
               <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-1">{currentUser?.role || 'Member'}</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative">
                   <User className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
                   <input type="text" defaultValue={currentUser?.full_name || ''} className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-3 pl-12 pr-4 text-sm text-zinc-300 focus:ring-1 focus:ring-blue-600 outline-none transition-all" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative">
                   <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
                   <input type="email" defaultValue={currentUser?.email || ''} className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-3 pl-12 pr-4 text-sm text-zinc-500 cursor-not-allowed" disabled />
                </div>
              </div>
            </div>
          </div>

          {/* Stats & Security */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {/* Stats Card */}
               <div className="bg-zinc-900/50 rounded-3xl border border-zinc-800/50 p-8 space-y-6 premium-shadow">
                  <div className="flex items-center gap-2">
                     <BarChart3 className="w-4 h-4 text-indigo-500" />
                     <h3 className="text-xs font-bold text-white uppercase tracking-widest">Platform Activity</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                     {[
                       { label: 'Projects', value: 12 },
                       { label: 'Active Tasks', value: 48 },
                       { label: 'Reqs', value: 24 },
                       { label: 'CRs', value: 8 },
                     ].map((s, i) => (
                       <div key={i} className="flex flex-col">
                          <span className="text-2xl font-bold text-white tracking-tight">{s.value}</span>
                          <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{s.label}</span>
                       </div>
                     ))}
                  </div>
               </div>

               {/* Preferences Card */}
               <div className="bg-zinc-900/50 rounded-3xl border border-zinc-800/50 p-8 space-y-6 premium-shadow">
                  <div className="flex items-center gap-2">
                     <Bell className="w-4 h-4 text-amber-500" />
                     <h3 className="text-xs font-bold text-white uppercase tracking-widest">Alert Preferences</h3>
                  </div>
                  <div className="space-y-3">
                     {[
                       { label: 'Email Notifications', checked: true },
                       { label: 'Task Assignments', checked: true },
                       { label: 'Security Alerts', checked: true },
                     ].map((pref, i) => (
                       <label key={i} className="flex items-center justify-between p-3 bg-zinc-950/50 rounded-xl border border-zinc-800/50 cursor-pointer hover:border-zinc-700 transition-all">
                          <span className="text-xs font-bold text-zinc-400">{pref.label}</span>
                          <input type="checkbox" defaultChecked={pref.checked} className="w-4 h-4 rounded border-zinc-800 bg-zinc-900 text-blue-600 focus:ring-offset-zinc-950" />
                       </label>
                     ))}
                  </div>
               </div>
            </div>

            {/* Security Section */}
            <div className="bg-zinc-900/50 rounded-3xl border border-zinc-800/50 p-8 space-y-6 premium-shadow">
               <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-500" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-widest">Security & Privacy</h3>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                     <p className="text-sm text-zinc-500 leading-relaxed">Update your password regularly to ensure your account remains secure and compliant with enterprise standards.</p>
                     <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-xl border border-zinc-700 transition-all">
                        Update Password
                     </button>
                  </div>
                  <div className="bg-zinc-950/50 p-6 rounded-2xl border border-zinc-800/50 flex items-center gap-4">
                     <div className="w-10 h-10 bg-emerald-600/10 rounded-xl flex items-center justify-center text-emerald-500 border border-emerald-600/20">
                        <ShieldCheck className="w-5 h-5" />
                     </div>
                     <div>
                        <p className="text-xs font-bold text-white">2FA is Enabled</p>
                        <p className="text-[10px] text-zinc-600 font-medium mt-0.5">Your account is highly secure.</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* System Info */}
        <div className="bg-zinc-900/30 rounded-3xl border border-dashed border-zinc-800/50 p-8 flex flex-col items-center justify-center text-center">
           <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center text-zinc-600 font-bold border border-zinc-800">P</div>
              <span className="text-sm font-bold text-zinc-500 tracking-tight">PM Tool Enterprise</span>
           </div>
           <p className="text-xs text-zinc-600 font-bold uppercase tracking-[0.2em]">Version 2.0.4-STABLE • Enterprise License</p>
           <p className="text-[10px] text-zinc-700 mt-2 font-medium">© 2026 PM Tooling Systems. All rights reserved.</p>
        </div>
      </main>
    </>
  );
}