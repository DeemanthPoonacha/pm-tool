import { getProjects, getProjectTeam } from '@/lib/projects';
import { getTasks } from '@/lib/tasks';
import { getRequirements, getProjectDocuments } from '@/lib/requirement';
import { getChangeRequests } from '@/lib/changes';
import { Header } from '@/components/dashboard/header';
import { 
  FolderKanban, 
  Users2, 
  CheckSquare, 
  FileText, 
  FileEdit, 
  Files,
  Plus,
  ArrowUpRight,
  MoreVertical
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const taskProgress = (tasks: any[]) => {
  if (tasks.length === 0) return 0;
  const completed = tasks.filter(t => t.status === 'done').length;
  return Math.round((completed / tasks.length) * 100);
};

export default function ProjectsPage() {
  const projects = getProjects();

  return (
    <>
      <Header title="Projects" />
      <main className="p-8 max-w-7xl mx-auto w-full space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">All Projects</h2>
            <p className="text-zinc-500 mt-1">Manage and track your active initiatives.</p>
          </div>
          <Link 
            href="/dashboard/projects/new" 
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            New Project
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.length === 0 ? (
            <div className="col-span-full bg-zinc-900/30 rounded-3xl border border-dashed border-zinc-800 p-20 text-center">
              <div className="w-20 h-20 bg-zinc-800/50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FolderKanban className="w-10 h-10 text-zinc-600" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No projects found</h3>
              <p className="text-zinc-500 max-w-xs mx-auto mb-8">Ready to start something new? Create your first project to begin tracking progress.</p>
              <Link 
                href="/dashboard/projects/new" 
                className="text-blue-500 font-bold hover:underline flex items-center justify-center gap-2"
              >
                Create a project <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            projects.map(project => {
              const tasks = getTasks(project.id);
              const progress = taskProgress(tasks);
              const requirements = getRequirements(project.id);
              const crs = getChangeRequests(project.id);
              const docs = getProjectDocuments(project.id);
              const team = getProjectTeam(project.id);
              
              return (
                <div key={project.id} className="bg-zinc-900/50 rounded-3xl border border-zinc-800/50 overflow-hidden hover:border-zinc-700/50 transition-all flex flex-col premium-shadow group">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <Link href={`/dashboard/projects/${project.id}`} className="group/title">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-bold text-white group-hover/title:text-blue-400 transition-colors">{project.name}</h3>
                          <span className={cn(
                            "text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg border",
                            project.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                            project.status === 'completed' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                            project.status === 'on-hold' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                            'bg-zinc-800 text-zinc-500 border-zinc-700'
                          )}>
                            {project.status}
                          </span>
                        </div>
                      </Link>
                      <button className="p-2 text-zinc-600 hover:text-white transition-colors">
                         <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <p className="text-sm text-zinc-500 line-clamp-2 mb-6 h-10">
                      {project.description || 'No description provided for this project.'}
                    </p>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-zinc-500">
                         <span>Overall Progress</span>
                         <span className="text-white">{progress}%</span>
                      </div>
                      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden border border-white/5">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-1000" 
                          style={{width: `${progress}%`}} 
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-auto px-6 py-4 bg-zinc-900/30 border-t border-zinc-800/50">
                    <div className="grid grid-cols-4 gap-2">
                      <Link href={`/dashboard/projects/${project.id}?tab=tasks`} className="flex flex-col items-center p-2 rounded-2xl hover:bg-zinc-800 transition-colors">
                        <CheckSquare className="w-4 h-4 text-indigo-500 mb-1.5" />
                        <span className="text-sm font-bold text-white leading-none">{tasks.length}</span>
                        <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-tighter mt-1">Tasks</span>
                      </Link>
                      <Link href={`/dashboard/projects/${project.id}?tab=requirements`} className="flex flex-col items-center p-2 rounded-2xl hover:bg-zinc-800 transition-colors">
                        <FileText className="w-4 h-4 text-blue-500 mb-1.5" />
                        <span className="text-sm font-bold text-white leading-none">{requirements.length}</span>
                        <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-tighter mt-1">Reqs</span>
                      </Link>
                      <Link href={`/dashboard/projects/${project.id}?tab=changes`} className="flex flex-col items-center p-2 rounded-2xl hover:bg-zinc-800 transition-colors">
                        <FileEdit className="w-4 h-4 text-purple-500 mb-1.5" />
                        <span className="text-sm font-bold text-white leading-none">{crs.length}</span>
                        <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-tighter mt-1">CRs</span>
                      </Link>
                      <Link href={`/dashboard/projects/${project.id}?tab=documents`} className="flex flex-col items-center p-2 rounded-2xl hover:bg-zinc-800 transition-colors">
                        <Files className="w-4 h-4 text-amber-500 mb-1.5" />
                        <span className="text-sm font-bold text-white leading-none">{docs.length}</span>
                        <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-tighter mt-1">Docs</span>
                      </Link>
                    </div>
                  </div>

                  <div className="px-6 py-4 border-t border-zinc-800/50 flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {team.slice(0, 4).map((member, i) => (
                        <div 
                          key={i} 
                          title={`${member.full_name} (${member.project_role})`}
                          className="w-8 h-8 rounded-full border-2 border-zinc-950 bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-400"
                        >
                          {member.full_name.substring(0, 1)}
                        </div>
                      ))}
                      {team.length > 4 && (
                        <div className="w-8 h-8 rounded-full border-2 border-zinc-950 bg-zinc-900 flex items-center justify-center text-[10px] font-bold text-zinc-500">
                          +{team.length - 4}
                        </div>
                      )}
                    </div>
                    <Link href={`/dashboard/projects/${project.id}`} className="text-xs font-bold text-zinc-500 hover:text-white transition-colors flex items-center gap-1 uppercase tracking-widest">
                       View Details <ArrowUpRight className="w-3 h-3" />
                    </Link>
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