import { getProjects } from '@/lib/projects';
import { getTasks } from '@/lib/tasks';
import { getChangeRequests, getAuditLogs } from '@/lib/changes';
import { getAllUsers } from '@/lib/permissions';
import { Header } from '@/components/dashboard/header';
import { NewProjectButton } from '@/components/dashboard/new-project-button';
import { 
  FolderKanban, 
  CheckSquare, 
  FileEdit, 
  Activity,
  ArrowUpRight,
  TrendingUp,
  Clock,
  LayoutDashboard
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function DashboardOverview() {
  const projects = getProjects();
  const auditLogs = getAuditLogs() as any[];
  const users = getAllUsers();
  const clients = users.filter(u => u.role === 'client');
  
  // Aggregate stats
  const totalProjects = projects.length;
  const activeTasks = projects.reduce((acc, p) => {
    const tasks = getTasks(p.id);
    return acc + tasks.filter(t => t.status === 'todo' || t.status === 'in-progress').length;
  }, 0);
  const pendingCRs = projects.reduce((acc, p) => {
    const crs = getChangeRequests(p.id);
    return acc + crs.filter(cr => cr.status === 'pending').length;
  }, 0);
  
  const stats = [
    { name: 'Total Projects', value: totalProjects, icon: FolderKanban, color: 'text-blue-500', bg: 'bg-blue-600/10', border: 'border-blue-600/20' },
    { name: 'Active Tasks', value: activeTasks, icon: CheckSquare, color: 'text-indigo-500', bg: 'bg-indigo-600/10', border: 'border-indigo-600/20' },
    { name: 'Pending CRs', value: pendingCRs, icon: FileEdit, color: 'text-purple-500', bg: 'bg-purple-600/10', border: 'border-purple-600/20' },
    { name: 'System Activity', value: auditLogs.length, icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-600/10', border: 'border-emerald-600/20' },
  ];

  return (
    <>
      <Header title="Dashboard Overview" />
      <main className="p-8 space-y-8 max-w-7xl mx-auto w-full">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Welcome back, Mike</h2>
            <p className="text-zinc-500 mt-1">Here's what's happening with your projects today.</p>
          </div>
          <div className="flex items-center gap-3">
             <NewProjectButton clients={clients} />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800/50 hover:border-zinc-700/50 transition-all group premium-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={cn("p-2.5 rounded-2xl border", stat.bg, stat.border)}>
                  <stat.icon className={cn("w-5 h-5", stat.color)} />
                </div>
                <TrendingUp className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-white tracking-tight">{stat.value}</span>
                <span className="text-sm font-bold text-zinc-500 uppercase tracking-widest mt-1">{stat.name}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Projects Health */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
                <h3 className="text-lg font-bold text-white">Project Health</h3>
              </div>
              <Link href="/dashboard/projects" className="text-xs font-bold text-blue-500 hover:text-blue-400 uppercase tracking-widest flex items-center gap-1 transition-colors">
                View all projects <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid gap-4">
              {projects.length === 0 ? (
                <div className="bg-zinc-900/30 p-12 rounded-3xl border border-dashed border-zinc-800 text-center">
                   <p className="text-zinc-500 font-medium">No active projects to monitor.</p>
                   <div className="mt-4">
                      <NewProjectButton clients={clients} />
                   </div>
                </div>
              ) : (
                projects.slice(0, 4).map(project => {
                  const tasks = getTasks(project.id);
                  const completed = tasks.filter(t => t.status === 'done').length;
                  const progress = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;
                  
                  return (
                    <Link 
                      key={project.id} 
                      href={`/dashboard/projects/${project.id}`}
                      className="bg-zinc-900/50 p-5 rounded-3xl border border-zinc-800/50 flex items-center gap-5 group hover:bg-zinc-900 transition-all hover:border-zinc-700/50"
                    >
                      <div className="w-14 h-14 bg-zinc-800/50 rounded-2xl flex items-center justify-center font-bold text-zinc-500 group-hover:text-blue-500 group-hover:bg-blue-600/10 transition-all border border-zinc-800">
                        {project.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-base font-bold text-white truncate">{project.name}</h4>
                          <span className="text-xs font-bold text-zinc-500">{progress}%</span>
                        </div>
                        <div className="relative h-2 bg-zinc-800 rounded-full overflow-hidden border border-white/5">
                          <div 
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-1000 ease-out" 
                            style={{ width: `${progress}%` }} 
                          />
                        </div>
                      </div>
                      <div className="p-2 rounded-xl bg-zinc-800/50 opacity-0 group-hover:opacity-100 transition-opacity">
                         <ArrowUpRight className="w-4 h-4 text-zinc-400" />
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-6 bg-indigo-600 rounded-full" />
              <h3 className="text-lg font-bold text-white">Recent Activity</h3>
            </div>
            <div className="bg-zinc-900/50 rounded-3xl border border-zinc-800/50 overflow-hidden premium-shadow">
              <div className="divide-y divide-zinc-800/50">
                {auditLogs.length === 0 ? (
                  <div className="p-12 text-center text-zinc-600 text-sm font-medium">
                    No recent activity.
                  </div>
                ) : (
                  auditLogs.slice(0, 6).map((log) => (
                    <div key={log.id} className="p-5 flex gap-4 hover:bg-zinc-900 transition-colors group cursor-pointer">
                      <div className={cn(
                        "mt-1 w-2.5 h-2.5 rounded-full shrink-0 shadow-lg",
                        log.action === 'CREATE' ? "bg-emerald-500 shadow-emerald-500/20" : 
                        log.action === 'APPROVE' ? "bg-blue-500 shadow-blue-500/20" : "bg-zinc-600 shadow-zinc-600/20"
                      )} />
                      <div className="flex-1">
                        <p className="text-sm text-zinc-300 font-medium group-hover:text-white transition-colors">
                          {log.details}
                        </p>
                        <div className="flex items-center gap-3 mt-1.5">
                          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(log.created_at).toLocaleDateString()}
                          </p>
                          <span className="w-1 h-1 bg-zinc-800 rounded-full" />
                          <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-wider">
                            {log.action}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {auditLogs.length > 0 && (
                <Link href="/dashboard/notifications" className="block w-full py-4 bg-zinc-900/50 hover:bg-zinc-900 text-[10px] font-bold text-zinc-500 hover:text-zinc-300 uppercase tracking-[0.2em] transition-all border-t border-zinc-800/50 text-center">
                   View Full Activity Log
                </Link>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
