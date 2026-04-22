import { redirect } from "next/navigation";
import { AppNav } from "@/components/layout/AppNav";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { getProjects, getProjectTeam } from "@/lib/projects";
import Link from "next/link";

const statusColors: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  paused: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  completed: "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-400",
};

async function getStats() {
  const projects = getProjects();
  
  const total = projects.length;
  const active = projects.filter(p => p.status === 'active').length;
  
  const allTasks = await import('@/lib/tasks').then(m => m.getTasks);
  const allChangeRequests = await import('@/lib/changes').then(m => m.getChangeRequests);
  let taskCount = 0;
  let crCount = 0;
  
  for (const proj of projects) {
    const tasks = await import('@/lib/tasks').then(m => m.getTasks(proj.id));
    taskCount += tasks.length;
    const crs = await import('@/lib/changes').then(m => m.getChangeRequests(proj.id));
    crCount += crs.filter(cr => cr.status === 'pending').length;
  }

  return { total, active, taskCount, crCount };
}

export default async function DashboardPage() {
  const projects = getProjects();
  const { total, active, taskCount, crCount } = await getStats();

  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AppNav userName="Mike PM" userEmail="mike@pmtool.com" userRole="pm" />
        <main className="flex-1 overflow-y-auto bg-zinc-50 dark:bg-zinc-950 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div>
              <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                Dashboard
              </h1>
              <p className="text-zinc-600 dark:text-zinc-400 mt-1">
                Overview of your projects and tasks
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Total Projects</p>
                    <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mt-1">{total}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Active Projects</p>
                    <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{active}</p>
                  </div>
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Tasks In Flight</p>
                    <p className="text-3xl font-bold text-amber-600 dark:text-amber-400 mt-1">{taskCount}</p>
                  </div>
                  <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Pending CRs</p>
                    <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-1">{crCount}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800">
              <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  Projects
                </h2>
                <Link href="/dashboard/new-project" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
                  New Project
                </Link>
              </div>
              <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {projects.length === 0 ? (
                  <div className="px-6 py-12 text-center text-zinc-500 dark:text-zinc-500">
                    <p className="text-lg">No projects yet</p>
                    <Link href="/dashboard/new-project" className="text-blue-600 hover:text-blue-500 font-medium mt-2 inline-block">
                      Create your first project
                    </Link>
                  </div>
                ) : (
                  projects.map((project) => (
                    <div key={project.id} className="px-6 py-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm uppercase">
                            {project.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <div>
                            <Link href={`/dashboard/projects/${project.id}`} className="font-medium text-zinc-900 dark:text-zinc-50 hover:text-blue-600 dark:hover:text-blue-400 transition">
                              {project.name}
                            </Link>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-0.5">{project.description?.slice(0, 80)}{project.description?.length ? '...' : ''}</p>
                            <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">
                              Client: {project.client_name}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[project.status] || 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-400'}`}>
                            {project.status}
                          </span>
                          <Link href={`/dashboard/projects/${project.id}/tasks`} className="text-sm text-zinc-600 hover:text-zinc-900 dark:hover:text-zinc-300 transition">
                            View →
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
