import { Header } from '@/components/dashboard/header';
import { User, Shield, Bell, Moon, Sun, Laptop } from 'lucide-react';

export default function SettingsPage() {
  return (
    <>
      <Header title="Settings" />
      <main className="p-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Account Settings</h1>
          <p className="text-zinc-500 text-sm mt-1">Manage your profile and application preferences</p>
        </div>

        <div className="space-y-6">
          <section className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
              <User className="w-4 h-4 text-zinc-400" />
              <h2 className="font-semibold text-zinc-900 dark:text-white">Profile Information</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Full Name</label>
                  <input 
                    type="text" 
                    defaultValue="Mike Admin" 
                    className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Email Address</label>
                  <input 
                    type="email" 
                    defaultValue="mike@pmtool.com" 
                    disabled
                    className="w-full px-4 py-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-500 cursor-not-allowed"
                  />
                </div>
              </div>
              <div className="pt-4 flex justify-end">
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-blue-600/20">
                  Save Changes
                </button>
              </div>
            </div>
          </section>

          <section className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
              <Shield className="w-4 h-4 text-zinc-400" />
              <h2 className="font-semibold text-zinc-900 dark:text-white">Security</h2>
            </div>
            <div className="p-6">
              <button className="px-4 py-2 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white text-sm font-medium rounded-lg transition-colors">
                Change Password
              </button>
            </div>
          </section>

          <section className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
              <Moon className="w-4 h-4 text-zinc-400" />
              <h2 className="font-semibold text-zinc-900 dark:text-white">Appearance</h2>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4">
                <button className="flex-1 p-4 border-2 border-blue-600 bg-blue-50 dark:bg-blue-900/10 rounded-xl flex flex-col items-center gap-2 transition-all">
                  <Sun className="w-6 h-6 text-blue-600" />
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Light</span>
                </button>
                <button className="flex-1 p-4 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl flex flex-col items-center gap-2 transition-all">
                  <Moon className="w-6 h-6 text-zinc-400" />
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Dark</span>
                </button>
                <button className="flex-1 p-4 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl flex flex-col items-center gap-2 transition-all">
                  <Laptop className="w-6 h-6 text-zinc-400" />
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">System</span>
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}