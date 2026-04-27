import { getProjects } from '@/lib/projects';
import { getRequirements, getRequirementVersions } from '@/lib/requirement';
import { Header } from '@/components/dashboard/header';
import { NewRequirementButton } from '@/components/dashboard/new-requirement-button';
import { RequirementActions } from '@/components/dashboard/requirement-actions';
import { 
  FileText, 
  History, 
  CheckCircle2, 
  AlertCircle,
  ArrowUpRight,
  ChevronRight,
  MoreVertical,
  Layers
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const statusColors: Record<string, string> = {
  draft: 'bg-zinc-800 text-zinc-500 border-zinc-700',
  review: 'bg-amber-600/10 text-amber-500 border-amber-600/20',
  approved: 'bg-emerald-600/10 text-emerald-500 border-emerald-600/20',
  rejected: 'bg-red-600/10 text-red-500 border-red-600/20',
};

export default async function RequirementsPage() {
  const projects = await getProjects();

  const projectsWithRequirements = await Promise.all(projects.map(async (project) => {
    const requirements = await getRequirements(project.id);
    const requirementsWithVersions = await Promise.all(requirements.map(async (req) => {
      const versions = await getRequirementVersions(req.id);
      return { ...req, versions };
    }));
    return { ...project, requirements: requirementsWithVersions };
  }));

  return (
    <>
      <Header title="Requirements" />
      <main className="p-8 max-w-7xl mx-auto w-full space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Requirement Management</h2>
            <p className="text-zinc-500 mt-1">Formal documentation and approval workflows for BRDs and FRDs.</p>
          </div>
          <NewRequirementButton projects={projects} />
        </div>

        <div className="space-y-12">
          {projectsWithRequirements.length === 0 ? (
            <div className="bg-zinc-900/30 rounded-3xl border border-dashed border-zinc-800 p-20 text-center">
              <h3 className="text-xl font-bold text-white mb-2">No active projects</h3>
              <p className="text-zinc-500 mb-6">Create a project to start managing requirements.</p>
              <Link href="/dashboard/projects" className="text-blue-500 font-bold hover:underline">Go to Projects</Link>
            </div>
          ) : (
            projectsWithRequirements.map(project => {
              const requirements = project.requirements;
              if (requirements.length === 0) return null;

              return (
                <div key={project.id} className="space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-white text-lg">{project.name}</h3>
                      <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em]">{requirements.length} Documents</span>
                    </div>
                    <Link href={`/dashboard/projects/${project.id}?tab=requirements`} className="text-[10px] font-bold text-zinc-500 hover:text-white uppercase tracking-widest flex items-center gap-1">
                       Project Workspace <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {requirements.map(req => {
                      const versions = req.versions;
                      return (
                        <div key={req.id} className="bg-zinc-900/50 rounded-3xl border border-zinc-800/50 p-6 hover:border-blue-600/30 transition-all group premium-shadow flex flex-col">
                           <div className="flex justify-between items-start mb-4">
                              <Link href={`/dashboard/requirements/${req.id}`} className="flex items-center gap-3">
                                 <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-500 border border-blue-600/20">
                                    <FileText className="w-5 h-5" />
                                 </div>
                                 <div>
                                    <h4 className="font-bold text-white group-hover:text-blue-400 transition-colors">{req.title}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                       <span className={cn("px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-widest border", statusColors[req.status])}>
                                          {req.status}
                                       </span>
                                       <span className="text-[10px] font-bold text-zinc-600">v{req.version}</span>
                                    </div>
                                 </div>
                              </Link>
                              <div className="flex items-center gap-1">
                                 {req.status === 'review' && (
                                   <RequirementActions requirementId={req.id} />
                                 )}
                                 <button className="p-2 text-zinc-700 hover:text-white transition-colors">
                                    <MoreVertical className="w-5 h-5" />
                                 </button>
                              </div>
                           </div>
                           
                           <Link href={`/dashboard/requirements/${req.id}`} className="block flex-1 mb-6">
                              <p className="text-sm text-zinc-500 line-clamp-2">
                                 {req.content || 'No content preview available for this requirement.'}
                              </p>
                           </Link>
                           
                           <div className="flex items-center justify-between pt-4 border-t border-zinc-800/50">
                              <div className="flex items-center gap-4">
                                 <div className="flex items-center gap-1.5 text-zinc-600" title="Version History">
                                    <History className="w-3.5 h-3.5" />
                                    <span className="text-[10px] font-bold">{versions.length}</span>
                                 </div>
                                 <div className="flex items-center gap-1.5 text-zinc-600">
                                    <Layers className="w-3.5 h-3.5" />
                                    <span className="text-[10px] font-bold">FRD</span>
                                 </div>
                              </div>
                              <div className="flex items-center gap-2">
                                 <div className="text-right">
                                    <p className="text-[10px] font-bold text-zinc-400 leading-none">{req.created_by_name || 'System'}</p>
                                    <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-tighter mt-1">{new Date(req.created_at).toLocaleDateString()}</p>
                                 </div>
                                 <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] font-bold text-zinc-500">
                                    {(req.created_by_name || 'S').substring(0, 1)}
                                 </div>
                              </div>
                           </div>
                        </div>
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