import { getAllUsers } from "@/lib/permissions";
import Link from "next/link";
import { Header } from "@/components/dashboard/header";
import { ArrowLeft, Save } from "lucide-react";

export default function NewProjectPage() {
  const clients = getAllUsers().filter(u => u.role === 'client');
  const allTeam = getAllUsers().filter(u => u.role !== 'admin');

  return (
    <>
      <Header title="Create Project" />
      <main className="p-8">
        <div className="max-w-3xl mx-auto">
          <Link href="/dashboard" className="flex items-center gap-2 text-sm text-zinc-500 hover:text-blue-600 mb-6 transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>
          
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-zinc-100 dark:border-zinc-800">
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">New Project</h1>
              <p className="text-zinc-500 text-sm mt-1">Fill in the details to initialize a new project workspace.</p>
            </div>
            
            <form action="/api/projects" method="post" className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Project Name *</label>
                    <input 
                      name="name" 
                      type="text" 
                      required 
                      className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all" 
                      placeholder="e.g. Q2 Marketing Campaign" 
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Client *</label>
                    <select 
                      name="clientId" 
                      required 
                      className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all appearance-none"
                    >
                      <option value="">Select a client...</option>
                      {clients.map(client => (
                        <option key={client.id} value={client.id}>{client.full_name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Description</label>
                    <textarea 
                      name="description" 
                      rows={5} 
                      className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all resize-none" 
                      placeholder="Describe the project goals and scope..." 
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Assign Team Members</label>
                  <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {allTeam.map(user => (
                      <label key={user.id} className="flex items-center gap-4 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 hover:border-blue-200 dark:hover:border-blue-900 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 cursor-pointer transition-all group">
                        <input type="checkbox" name="team" value={user.id} className="w-5 h-5 rounded-md border-zinc-300 dark:border-zinc-700 text-blue-600 focus:ring-blue-600 bg-white dark:bg-zinc-800" />
                        <div className="flex-1">
                          <p className="text-sm font-bold text-zinc-900 dark:text-white">{user.full_name}</p>
                          <p className="text-[10px] text-zinc-500 uppercase font-semibold tracking-widest">{user.role}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-4">
                <button type="submit" className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2">
                  <Save className="w-4 h-4" />
                  Create Project
                </button>
                <Link href="/dashboard" className="flex-1 py-3 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 font-bold rounded-xl transition-all hover:bg-zinc-50 dark:hover:bg-zinc-800 text-center">
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
