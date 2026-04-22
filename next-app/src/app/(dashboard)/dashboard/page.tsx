import { getProjects } from '@/lib/projects';
import { getTasks } from '@/lib/tasks';
import { getRequirements } from '@/lib/requirement';
import { getChangeRequests } from '@/lib/changes';
import { getAllUsers } from '@/lib/permissions';

const taskProgress = (tasks: any[]) => {
  if (tasks.length === 0) return 0;
  const completed = tasks.filter(t => t.status === 'done').length;
  return Math.round((completed / tasks.length) * 100);
};

export function Dashboard() {
  const projects = getProjects();
  
  const totalTasks = getProjects().reduce((sum, p) => sum + getTasks(p.id).length, 0);
  const pendingCRs = getProjects().reduce((sum, p) => sum + getChangeRequests(p.id).filter(cr => cr.status === 'pending').length, 0);
  const totalRequirements = getProjects().reduce((sum, p) => sum + getRequirements(p.id).length, 0);
  
  return (
    <div className="flex h-screen">
      <aside className="w-56 bg-zinc-900 p-4">
        <div className="text-white font-semibold text-lg mb-6">PM Tool</div>
        <nav className="space-y-1">
          <a href="/dashboard" className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-800 text-white text-sm">Dashboard</a>
          <a href="/dashboard/projects" className="flex items-center gap-2 px-3 py-2 rounded-lg text-zinc-400 hover:text-white text-sm">Projects</a>
          <a href="/dashboard/tasks" className="flex items-center gap-2 px-3 py-2 rounded-lg text-zinc-400 hover:text-white text-sm">Tasks</a>
          <a href="/dashboard/requirements" className="flex items-center gap-2 px-3 py-2 rounded-lg text-zinc-400 hover:text-white text-sm">Requirements</a>
          <a href="/dashboard/change-requests" className="flex items-center gap-2 px-3 py-2 rounded-lg text-zinc-400 hover:text-white text-sm">Change Requests</a>
          <a href="/dashboard/documents" className="flex items-center gap-2 px-3 py-2 rounded-lg text-zinc-400 hover:text-white text-sm">Documents</a>
          <a href="/dashboard/notifications" className="flex items-center gap-2 px-3 py-2 rounded-lg text-zinc-400 hover:text-white text-sm">Notifications</a>
          <a href="/dashboard/team" className="flex items-center gap-2 px-3 py-2 rounded-lg text-zinc-400 hover:text-white text-sm">Team</a>
          <a href="/dashboard/settings" className="flex items-center gap-2 px-3 py-2 rounded-lg text-zinc-400 hover:text-white text-sm">Settings</a>
        </nav>
      </aside>
      
      <div className="flex-1 overflow-y-auto">
        <header className="h-14 bg-white border-b border-zinc-200 flex items-center justify-between px-6">
          <div className="text-sm text-zinc-600">Dashboard</div>
          <div className="flex items-center gap-3">
            <span className="text-sm">Mike</span>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">M</div>
          </div>
        </header>
        
        <main className="p-6">
          <div className="grid grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg border border-zinc-200 p-5">
              <div className="text-sm text-zinc-600">Active Projects</div>
              <div className="text-3xl font-bold mt-2 text-blue-600">{projects.filter(p => p.status === 'active').length}</div>
            </div>
            <div className="bg-white rounded-lg border border-zinc-200 p-5">
              <div className="text-sm text-zinc-600">Total Projects</div>
              <div className="text-3xl font-bold mt-2">{projects.length}</div>
            </div>
            <div className="bg-white rounded-lg border border-zinc-200 p-5">
              <div className="text-sm text-zinc-600">Total Tasks</div>
              <div className="text-3xl font-bold mt-2">{totalTasks}</div>
            </div>
            <div className="bg-white rounded-lg border border-zinc-200 p-5">
              <div className="text-sm text-zinc-600">Pending CRs</div>
              <div className="text-3xl font-bold mt-2 text-purple-600">{pendingCRs}</div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-zinc-200">
            <div className="px-5 py-4 border-b border-zinc-200 flex justify-between items-center">
              <h2 className="font-semibold">Projects</h2>
              <a href="/dashboard/projects/new" className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg">+ New Project</a>
            </div>
            <div className="divide-y divide-zinc-200">
              {projects.length === 0 ? (
                <div className="p-12 text-center text-zinc-500">
                  <p>No projects yet</p>
                  <a href="/dashboard/projects/new" className="text-blue-600 mt-2 inline-block">Create your first project</a>
                </div>
              ) : (
                projects.map(project => {
                  const tasks = getTasks(project.id);
                  const progress = taskProgress(tasks);
                  return (
                    <div key={project.id} className="p-5 hover:bg-zinc-50 transition">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-zinc-900">{project.name}</h3>
                          <p className="text-sm text-zinc-600 mt-1">{(project.description || '').slice(0, 100)}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-xs text-zinc-600">{project.client_name || 'No client'}</span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700">{project.status}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{progress}%</div>
                          <div className="w-32 h-2 bg-zinc-200 rounded-full mt-1">
                            <div className="h-2 bg-blue-600 rounded-full" style={{width: `${progress}%`}} />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
