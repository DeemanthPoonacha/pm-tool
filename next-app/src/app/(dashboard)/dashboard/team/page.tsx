import { getAllUsers } from '@/lib/permissions';
import { Header } from '@/components/dashboard/header';
import { 
  Users2, 
  ShieldCheck, 
  UserPlus, 
  Search, 
  Filter,
  MoreVertical,
  Mail,
  Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';

const roleColors: Record<string, string> = {
  admin: 'bg-red-600/10 text-red-500 border-red-600/20',
  client: 'bg-purple-600/10 text-purple-500 border-purple-600/20',
  pm: 'bg-blue-600/10 text-blue-500 border-blue-600/20',
  ba: 'bg-indigo-600/10 text-indigo-500 border-indigo-600/20',
  developer: 'bg-emerald-600/10 text-emerald-500 border-emerald-600/20',
  product_manager: 'bg-amber-600/10 text-amber-500 border-amber-600/20',
  delivery_head: 'bg-orange-600/10 text-orange-500 border-orange-600/20',
};

const roleLabels: Record<string, string> = {
  admin: 'Admin',
  client: 'Client',
  pm: 'Project Manager',
  ba: 'Business Analyst',
  developer: 'Developer',
  product_manager: 'Product Manager',
  delivery_head: 'Delivery Head',
};

export default function TeamPage() {
  const users = getAllUsers();

  const roleStats = users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <>
      <Header title="Team Management" />
      <main className="p-8 max-w-7xl mx-auto w-full space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Organization Team</h2>
            <p className="text-zinc-500 mt-1">Manage user roles, permissions, and directory access.</p>
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20">
            <UserPlus className="w-4 h-4" />
            Invite Member
          </button>
        </div>

        {/* Role Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {Object.entries(roleStats).map(([role, count]) => (
            <div key={role} className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800/50 flex flex-col items-center text-center">
              <span className={cn("text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-lg border mb-3", roleColors[role])}>
                {roleLabels[role] || role}
              </span>
              <span className="text-xl font-bold text-white">{count}</span>
            </div>
          ))}
        </div>

        {/* Team List Table-like UI */}
        <div className="bg-zinc-900/50 rounded-3xl border border-zinc-800/50 overflow-hidden premium-shadow">
          <div className="px-6 py-4 border-b border-zinc-800/50 flex items-center justify-between bg-zinc-900/30">
             <div className="flex items-center gap-4 flex-1">
                <div className="relative max-w-xs w-full">
                   <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                   <input 
                     type="text" 
                     placeholder="Search members..." 
                     className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-1.5 pl-10 pr-4 text-xs text-zinc-300 focus:ring-1 focus:ring-blue-600 outline-none"
                   />
                </div>
                <button className="p-1.5 text-zinc-500 hover:text-white transition-colors">
                   <Filter className="w-4 h-4" />
                </button>
             </div>
             <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{users.length} Total Members</span>
          </div>

          <div className="divide-y divide-zinc-800/50">
            {users.length === 0 ? (
              <div className="p-20 text-center">
                <Users2 className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
                <p className="text-zinc-500 font-medium">No team members found.</p>
              </div>
            ) : (
              users.map(user => (
                <div key={user.id} className="p-4 sm:p-6 flex items-center justify-between hover:bg-zinc-900/50 transition-colors group">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-600/10 border border-white/5">
                      {user.full_name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white text-base">{user.full_name}</h4>
                        {user.role === 'admin' && <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />}
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-zinc-500">
                        <span className="flex items-center gap-1.5"><Mail className="w-3 h-3" /> {user.email}</span>
                        <span className="w-1 h-1 bg-zinc-800 rounded-full" />
                        <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> Joined {new Date(user.created_at || Date.now()).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className={cn("px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-widest border", roleColors[user.role] || 'bg-zinc-800 text-zinc-500 border-zinc-700')}>
                      {roleLabels[user.role] || user.role}
                    </div>
                    <button className="p-2 text-zinc-700 hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                      <MoreVertical className="w-5 h-5" />
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