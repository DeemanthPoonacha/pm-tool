import { getProjects } from '@/lib/projects';
import { getTasks } from '@/lib/tasks';
import { getUsers } from '@/lib/users';
import { Header } from '@/components/dashboard/header';
import { ChevronRight, FolderKanban } from 'lucide-react';
import { NewProjectButton } from '@/components/dashboard/new-project-button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const taskProgress = (tasks: any[]) => {
  if (tasks.length === 0) return 0;
  const completed = tasks.filter(t => t.status === 'done').length;
  return Math.round((completed / tasks.length) * 100);
};

export default function ProjectsPage() {
  const projects = getProjects();
  const clients = getUsers('client');

  return (
    <>
      <Header title="Projects" />
      <main className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">All Projects</h1>
            <p className="text-zinc-500 text-sm mt-1">Manage and track your active projects</p>
          </div>
          <NewProjectButton clients={clients} />
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {projects.length === 0 ? (
              <div className="p-16 text-center">
                <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FolderKanban className="w-8 h-8 text-zinc-400" />
                </div>
                <h3 className="text-lg font-medium text-zinc-900 dark:text-white">No projects yet</h3>
                <p className="text-zinc-500 mt-1 max-w-xs mx-auto">Get started by creating your first project to track tasks and requirements.</p>
                <Link href="/dashboard/projects/new" className="text-blue-600 hover:text-blue-700 font-medium mt-4 inline-block">
                  Create your first project
                </Link>
              </div>
            ) : (
              projects.map(project => {
                const tasks = getTasks(project.id);
                const progress = taskProgress(tasks);
                return (
                  <div key={project.id} className="group p-6 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all cursor-pointer">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {project.name}
                          </h3>
                          <span className={cn(
                            "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider",
                            project.status === 'active' ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400"
                          )}>
                            {project.status}
                          </span>
                        </div>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2 max-w-2xl">
                          {project.description || 'No description provided for this project.'}
                        </p>
                        <div className="flex items-center gap-4 mt-4">
                          <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                            <span className="font-medium text-zinc-700 dark:text-zinc-300">Client:</span>
                            {project.client_name || 'No client'}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                            <span className="font-medium text-zinc-700 dark:text-zinc-300">Team:</span>
                            {project.team_count || 0} members
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-bold text-zinc-900 dark:text-white">{progress}%</span>
                          <span className="text-xs text-zinc-500">Progress</span>
                        </div>
                        <div className="w-40 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-out" 
                            style={{ width: `${progress}%` }} 
                          />
                        </div>
                        <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-zinc-400 mt-4 transition-colors" />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>
    </>
  );
}