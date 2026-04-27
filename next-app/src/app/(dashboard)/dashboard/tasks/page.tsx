'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/dashboard/header';
import { NewTaskButton } from '@/components/dashboard/new-task-button';
import { 
  CheckSquare, 
  Clock, 
  MessageSquare, 
  AlertCircle,
  Filter,
  Search,
  MoreVertical,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const statusColors: Record<string, string> = {
  todo: 'bg-zinc-800 text-zinc-400 border-zinc-700',
  in_progress: 'bg-blue-600/10 text-blue-500 border-blue-600/20',
  done: 'bg-emerald-600/10 text-emerald-500 border-emerald-600/20',
  blocked: 'bg-red-600/10 text-red-500 border-red-600/20',
};

const priorityColors: Record<string, string> = {
  high: 'text-red-500',
  medium: 'text-amber-500',
  low: 'text-emerald-500',
};

export default function TasksPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [developers, setDevelopers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projRes, taskRes, userRes] = await Promise.all([
          fetch('/api/projects'),
          fetch('/api/tasks'),
          fetch('/api/users')
        ]);
        
        const [projData, taskData, userData] = await Promise.all([
          projRes.json(),
          taskRes.json(),
          userRes.json()
        ]);
        
        setProjects(projData);
        setTasks(taskData);
        setDevelopers(userData.filter((u: any) => u.role === 'developer' || u.role === 'pm'));
      } catch (e) {
        console.error('Failed to fetch data:', e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Header title="Tasks" />
      <main className="p-8 max-w-7xl mx-auto w-full space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Work Management</h2>
            <p className="text-zinc-500 mt-1">Track and manage all tasks across your projects.</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="relative hidden sm:block">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter tasks..." 
                  className="bg-zinc-900 border border-zinc-800 rounded-xl py-2 pl-10 pr-4 text-sm text-zinc-300 focus:ring-2 focus:ring-blue-600 outline-none w-64"
                />
             </div>
             <button className="p-2 bg-zinc-900 text-zinc-400 border border-zinc-800 rounded-xl hover:text-white transition-colors">
                <Filter className="w-5 h-5" />
             </button>
             {!isLoading && <NewTaskButton projects={projects} developers={developers} />}
          </div>
        </div>

        <div className="space-y-8">
          {isLoading ? (
            <div className="flex justify-center py-20">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : projects.length === 0 ? (
            <div className="bg-zinc-900/30 rounded-3xl border border-dashed border-zinc-800 p-20 text-center">
              <h3 className="text-xl font-bold text-white mb-2">No active projects</h3>
              <p className="text-zinc-500 mb-6">Create a project to start assigning tasks.</p>
              <Link href="/dashboard/projects" className="text-blue-500 font-bold hover:underline">Go to Projects</Link>
            </div>
          ) : (
            projects.map(project => {
              const projectTasks = filteredTasks.filter(t => t.project_id === project.id);
              if (projectTasks.length === 0 && searchQuery) return null;
              if (projectTasks.length === 0 && !searchQuery) return null;

              return (
                <div key={project.id} className="space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center text-[10px] font-bold text-zinc-500 border border-zinc-800">
                        {project.name.substring(0, 2).toUpperCase()}
                      </div>
                      <h3 className="font-bold text-white">{project.name}</h3>
                      <span className="text-xs font-bold text-zinc-600 uppercase tracking-widest">{projectTasks.length}</span>
                    </div>
                    <Link href={`/dashboard/projects/${project.id}?tab=tasks`} className="text-[10px] font-bold text-zinc-500 hover:text-white uppercase tracking-[0.2em] transition-colors">
                       Manage Project Tasks
                    </Link>
                  </div>
                  
                  <div className="bg-zinc-900/50 rounded-3xl border border-zinc-800/50 overflow-hidden premium-shadow divide-y divide-zinc-800/50">
                    {projectTasks.map(task => {
                      return (
                        <Link 
                          key={task.id} 
                          href={`/dashboard/tasks/${task.id}`}
                          className="p-5 hover:bg-zinc-900/80 transition-all group flex items-center gap-6"
                        >
                           <div className={cn(
                             "w-10 h-10 rounded-2xl flex items-center justify-center border transition-colors",
                             task.status === 'done' ? "bg-emerald-600/10 border-emerald-600/20 text-emerald-500" : "bg-zinc-800 border-zinc-700 text-zinc-500 group-hover:border-blue-600/30 group-hover:text-blue-500"
                           )}>
                              <CheckSquare className="w-5 h-5" />
                           </div>
                           
                           <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-1">
                                 <h4 className="font-bold text-white truncate group-hover:text-blue-400 transition-colors">{task.title}</h4>
                                 <div className={cn(
                                   "w-1.5 h-1.5 rounded-full",
                                   task.priority === 'high' ? 'bg-red-500' :
                                   task.priority === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'
                                 )} />
                              </div>
                              <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                                 <span className={cn("text-zinc-500", priorityColors[task.priority])}>{task.priority} Priority</span>
                                 <span className="w-1 h-1 bg-zinc-800 rounded-full" />
                                 <span>{task.workflow_stage || 'Backlog'}</span>
                                 <span className="w-1 h-1 bg-zinc-800 rounded-full" />
                                 <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}</span>
                              </div>
                           </div>

                           <div className="flex items-center gap-6">
                              <div className="flex items-center gap-4">
                                 <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] font-bold text-zinc-500" title={task.assigned_name || 'Unassigned'}>
                                    {task.assigned_name ? task.assigned_name.substring(0, 1) : '?'}
                                 </div>
                              </div>
                              <div className={cn(
                                "px-3 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-widest",
                                statusColors[task.status]
                              )}>
                                 {task.status.replace('_', ' ')}
                              </div>
                              <button className="p-2 text-zinc-700 hover:text-white transition-colors" onClick={(e) => { e.preventDefault(); }}>
                                 <MoreVertical className="w-5 h-5" />
                              </button>
                           </div>
                        </Link>
                      );
                    })}
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