import { getProjects } from '@/lib/projects';
import { getTasks } from '@/lib/tasks';
import { getUsers } from '@/lib/users';
import { Header } from '@/components/dashboard/header';
import { CheckCircle2, Circle, Clock } from 'lucide-react';
import { NewTaskButton } from '@/components/dashboard/new-task-button';
import { cn } from '@/lib/utils';

export default function TasksPage() {
  const projects = getProjects();
  const developers = getUsers('developer');

  return (
    <>
      <Header title="Tasks" />
      <main className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Task Management</h1>
            <p className="text-zinc-500 text-sm mt-1">Monitor and assign tasks across projects</p>
          </div>
          <NewTaskButton projects={projects} developers={developers} />
        </div>

        <div className="space-y-6">
          {projects.length === 0 ? (
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-16 text-center shadow-sm">
              <p className="text-zinc-500">No projects yet. Create a project to start managing tasks.</p>
            </div>
          ) : (
            projects.map((project) => {
              const tasks = getTasks(project.id);
              return (
                <div key={project.id} className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
                  <div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
                    <h3 className="font-semibold text-zinc-900 dark:text-white">{project.name}</h3>
                    <span className="text-xs text-zinc-500 font-medium">{tasks.length} Tasks</span>
                  </div>
                  <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {tasks.length === 0 ? (
                      <div className="p-8 text-center text-zinc-500 text-sm">
                        No tasks for this project
                      </div>
                    ) : (
                      tasks.map((task) => (
                        <div key={task.id} className="p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors flex items-center justify-between gap-4 group">
                          <div className="flex items-center gap-3">
                            {task.status === 'done' ? (
                              <CheckCircle2 className="w-5 h-5 text-green-500" />
                            ) : task.status === 'in-progress' ? (
                              <Clock className="w-5 h-5 text-blue-500" />
                            ) : (
                              <Circle className="w-5 h-5 text-zinc-300 dark:text-zinc-600" />
                            )}
                            <div>
                              <p className={cn(
                                "text-sm font-medium transition-colors",
                                task.status === 'done' ? "text-zinc-400 line-through" : "text-zinc-900 dark:text-white"
                              )}>
                                {task.title}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={cn(
                                  "text-[10px] px-1.5 py-0.5 rounded font-bold uppercase",
                                  task.priority === 'high' ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                                  task.priority === 'medium' ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                                  "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                )}>
                                  {task.priority}
                                </span>
                                {task.due_date && (
                                  <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {new Date(task.due_date).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">{task.assigned_name || 'Unassigned'}</p>
                              <p className="text-[10px] text-zinc-500">Assignee</p>
                            </div>
                            <div className="w-8 h-8 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center text-[10px] font-bold text-zinc-500 border border-zinc-200 dark:border-zinc-700">
                              {(task.assigned_name || '?')[0].toUpperCase()}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </>
  );
}