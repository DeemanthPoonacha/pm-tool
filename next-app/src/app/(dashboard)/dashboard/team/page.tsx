import { getAllUsers } from '@/lib/permissions';
import { Header } from '@/components/dashboard/header';
import { Mail, Shield, MoreVertical } from 'lucide-react';
import { InviteMemberButton } from '@/components/dashboard/invite-member-button';
import { cn } from '@/lib/utils';

export default function TeamPage() {
  const users = getAllUsers();

  return (
    <>
      <Header title="Team" />
      <main className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Team Members</h1>
            <p className="text-zinc-500 text-sm mt-1">Manage users and assign roles across the organization</p>
          </div>
          <InviteMemberButton />
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-x divide-y divide-zinc-100 dark:divide-zinc-800">
            {users.length === 0 ? (
              <div className="p-16 text-center col-span-full">
                <p className="text-zinc-500">No team members found.</p>
              </div>
            ) : (
              users.map(user => (
                <div key={user.id} className="p-6 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-all flex flex-col justify-between group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-700 rounded-xl flex items-center justify-center text-zinc-600 dark:text-zinc-300 font-bold text-lg border border-zinc-200 dark:border-zinc-700 shadow-sm">
                      {user.full_name.charAt(0)}
                    </div>
                    <button className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                  <div>
                    <h3 className="font-bold text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {user.full_name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500 mt-1">
                      <Mail className="w-3 h-3" />
                      {user.email}
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                    <span className={cn(
                      "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1",
                      user.role === 'admin' ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                      user.role === 'pm' ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                      "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400"
                    )}>
                      <Shield className="w-2.5 h-2.5" />
                      {user.role}
                    </span>
                    <button className="text-[10px] font-bold text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors uppercase tracking-widest">
                      Edit Role
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </>
  );
}