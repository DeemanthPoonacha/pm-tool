import { getProjects } from '@/lib/projects';
import { getChangeRequests } from '@/lib/changes';
import { Header } from '@/components/dashboard/header';
import { NewCRButton } from '@/components/dashboard/new-cr-button';
import { CRActions } from '@/components/dashboard/cr-actions';
import { 
  FileEdit, 
  AlertCircle, 
  CheckCircle2, 
  XCircle,
  ArrowUpRight,
  ChevronRight,
  MoreVertical,
  Activity,
  Zap
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const statusColors: Record<string, string> = {
  pending: 'bg-amber-600/10 text-amber-500 border-amber-600/20',
  approved: 'bg-emerald-600/10 text-emerald-500 border-emerald-600/20',
  rejected: 'bg-red-600/10 text-red-500 border-red-600/20',
};

export default async function ChangeRequestsPage() {
  const projects = await getProjects();

  const projectsWithCRs = await Promise.all(projects.map(async (project) => {
    const crs = await getChangeRequests(project.id);
    return { ...project, crs };
  }));

  return (
    <>
      <Header title="Change Requests" />
      <main className="p-8 max-w-7xl mx-auto w-full space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Change Control</h2>
            <p className="text-zinc-500 mt-1">Review and manage project scope changes and bug reports.</p>
          </div>
          <NewCRButton projects={projects} />
        </div>

        <div className="space-y-12">
          {projectsWithCRs.length === 0 ? (
            <div className="bg-zinc-900/30 rounded-3xl border border-dashed border-zinc-800 p-20 text-center">
              <h3 className="text-xl font-bold text-white mb-2">No active projects</h3>
              <p className="text-zinc-500 mb-6">Create a project to start managing change requests.</p>
              <Link href="/dashboard/projects" className="text-blue-500 font-bold hover:underline">Go to Projects</Link>
            </div>
          ) : (
            projectsWithCRs.map(project => {
              const crs = project.crs;
              if (crs.length === 0) return null;

              const pending = crs.filter(cr => cr.status === 'pending').length;
              
              return (
                <div key={project.id} className="space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-white text-lg">{project.name}</h3>
                      {pending > 0 && (
                        <span className="bg-amber-600/10 text-amber-500 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-lg border border-amber-600/20 animate-pulse">
                          {pending} Action Required
                        </span>
                      )}
                    </div>
                    <Link href={`/dashboard/projects/${project.id}?tab=changes`} className="text-[10px] font-bold text-zinc-500 hover:text-white uppercase tracking-widest flex items-center gap-1">
                       Full History <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    {crs.map(cr => (
                      <div key={cr.id} className="bg-zinc-900/50 rounded-3xl border border-zinc-800/50 p-6 hover:border-blue-600/30 transition-all group flex items-center gap-8">
                         <Link href={`/dashboard/change-requests/${cr.id}`} className="contents">
                            <div className={cn(
                              "w-12 h-12 rounded-2xl flex items-center justify-center border transition-all shadow-lg",
                              cr.status === 'pending' ? 'bg-amber-600/10 text-amber-500 border-amber-600/20 shadow-amber-600/5' :
                              cr.status === 'approved' ? 'bg-emerald-600/10 text-emerald-500 border-emerald-600/20 shadow-emerald-600/5' :
                              'bg-red-600/10 text-red-500 border-red-600/20 shadow-red-600/5'
                            )}>
                               <FileEdit className="w-6 h-6" />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                               <div className="flex items-center gap-3 mb-1">
                                  <h4 className="font-bold text-white truncate text-base group-hover:text-blue-400 transition-colors">{cr.title}</h4>
                                  <span className={cn("px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-widest border", statusColors[cr.status])}>
                                     {cr.status}
                                  </span>
                               </div>
                               <p className="text-sm text-zinc-500 line-clamp-1 mb-2">
                                  {cr.description || 'No detailed description.'}
                                </p>
                               <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                                  <span className="flex items-center gap-1.5"><Zap className="w-3 h-3" /> Impact: {cr.impact || 'Medium'}</span>
                                  <span className="w-1 h-1 bg-zinc-800 rounded-full" />
                                  <span>By {cr.requested_by_name || 'Client'}</span>
                                  <span className="w-1 h-1 bg-zinc-800 rounded-full" />
                                  <span>{new Date(cr.created_at).toLocaleDateString()}</span>
                               </div>
                            </div>
                         </Link>
                         
                         <div className="flex items-center gap-4">
                            {cr.status === 'pending' && (
                              <div className="flex items-center gap-2">
                                 <CRActions crId={cr.id} />
                              </div>
                            )}
                            <button className="p-2 text-zinc-700 hover:text-white transition-colors">
                               <MoreVertical className="w-5 h-5" />
                            </button>
                         </div>
                      </div>
                    ))}
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