import { getProjects } from '@/lib/projects';
import { getTasks } from '@/lib/tasks';
import { getChangeRequests, getAuditLogs } from '@/lib/changes';
import { Header } from '@/components/dashboard/header';
import { 
  FolderKanban, 
  CheckSquare, 
  FileEdit, 
  Activity,
  ArrowUpRight,
  TrendingUp,
  Clock,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function DashboardOverview() {
  const projects = getProjects();
  const auditLogs = getAuditLogs() as any[];
  
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
    { name: 'Total Projects', value: totalProjects, icon: FolderKanban, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { name: 'Active Tasks', value: activeTasks, icon: CheckSquare, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30' },
    { name: 'Pending CRs', value: pendingCRs, icon: FileEdit, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30' },
    { name: 'System Activity', value: auditLogs.length, icon: Activity, color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-900/30' },
  ];

  return (
    <>
      <Header title="Overview" />
      <main className="p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={cn("p-2 rounded-xl", stat.bg)}>
                  <stat.icon className={cn("w-5 h-5", stat.color)} />
                </div>
                <TrendingUp className="w-4 h-4 text-zinc-400" />
              </div>
              <p className="text-2xl font-bold text-zinc-900 dark:text-white">{stat.value}</p>
              <p className="text-sm text-zinc-500 mt-1">{stat.name}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Projects Health */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Project Health</h2>
              <Link href="/dashboard/projects" className="text-sm text-blue-600 hover:underline flex items-center gap-1 font-medium">
                View all <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid gap-4">
              {projects.length === 0 ? (
                <div className="bg-white dark:bg-zinc-900 p-12 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700 text-center">
                   <p className="text-zinc-500">No active projects to monitor.</p>
                </div>
              ) : (
                projects.slice(0, 3).map(project => {
                  const tasks = getTasks(project.id);
                  const completed = tasks.filter(t => t.status === 'done').length;
                  const progress = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;
                  
                  return (
                    <div key={project.id} className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex items-center gap-4 group">
                      <div className="w-12 h-12 bg-zinc-50 dark:bg-zinc-800 rounded-xl flex items-center justify-center font-bold text-zinc-400 group-hover:text-blue-500 transition-colors">
                        {project.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-zinc-900 dark:text-white truncate">{project.name}</h4>
                        <div className="flex items-center gap-3 mt-1">
                          <div className="flex-1 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-600 rounded-full transition-all duration-500" 
                              style={{ width: `${progress}%` }} 
                            />
                          </div>
                          <span className="text-xs font-medium text-zinc-500">{progress}%</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Recent Activity</h2>
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {auditLogs.length === 0 ? (
                  <div className="p-8 text-center text-zinc-500 text-sm">
                    No recent activity.
                  </div>
                ) : (
                  auditLogs.slice(0, 6).map((log) => (
                    <div key={log.id} className="p-4 flex gap-3">
                      <div className={cn(
                        "mt-1 w-2 h-2 rounded-full shrink-0",
                        log.action === 'CREATE' ? "bg-green-500" : 
                        log.action === 'APPROVE' ? "bg-blue-500" : "bg-zinc-400"
                      )} />
                      <div>
                        <p className="text-sm text-zinc-900 dark:text-white font-medium">
                          {log.details}
                        </p>
                        <p className="text-xs text-zinc-500 mt-0.5 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(log.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
