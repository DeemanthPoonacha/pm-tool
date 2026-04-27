import { use } from 'react';
import { getRequirement, getRequirementVersions } from '@/lib/requirement';
import { getProject } from '@/lib/projects';
import { Header } from '@/components/dashboard/header';
import { 
  FileText, 
  History, 
  CheckCircle2, 
  AlertCircle,
  ChevronRight,
  User,
  Calendar,
  Layers,
  FileCode,
  ArrowUpRight,
  ShieldCheck,
  ShieldX,
  MoreVertical,
  ShieldAlert
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const statusColors: Record<string, string> = {
  draft: 'bg-zinc-800 text-zinc-500 border-zinc-700',
  review: 'bg-amber-600/10 text-amber-500 border-amber-600/20',
  approved: 'bg-emerald-600/10 text-emerald-500 border-emerald-600/20',
  rejected: 'bg-red-600/10 text-red-500 border-red-600/20',
};

export default function RequirementDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const requirement = getRequirement(id) as any;
  
  if (!requirement) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-zinc-950 text-white">
        <ShieldAlert className="w-16 h-16 text-zinc-800 mb-4" />
        <h1 className="text-2xl font-bold">Requirement not found</h1>
        <Link href="/dashboard/requirements" className="text-blue-500 mt-4 font-bold hover:underline">Back to Requirements</Link>
      </div>
    );
  }

  const project = getProject(requirement.project_id) as any;
  const versions = getRequirementVersions(id);

  return (
    <>
      <Header title={`Requirement: ${requirement.title}`} />
      <main className="p-8 max-w-7xl mx-auto w-full pb-20">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1 space-y-8">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">
              <Link href="/dashboard/projects" className="hover:text-white transition-colors">Projects</Link>
              <ChevronRight className="w-3 h-3" />
              <Link href={`/dashboard/projects/${requirement.project_id}`} className="hover:text-white transition-colors">{project?.name || 'Project'}</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-blue-500">Requirement Specs</span>
            </div>

            <div className="bg-zinc-900/50 rounded-3xl border border-zinc-800/50 p-8 premium-shadow">
               <div className="flex justify-between items-start mb-8">
                  <div className="space-y-4">
                     <h1 className="text-3xl font-bold text-white tracking-tight leading-tight">{requirement.title}</h1>
                     <div className="flex flex-wrap gap-3">
                        <span className={cn("px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-widest border", statusColors[requirement.status])}>
                           {requirement.status}
                        </span>
                        <span className="px-3 py-1 bg-zinc-800 text-zinc-400 border border-zinc-700 rounded-xl text-[10px] font-bold uppercase tracking-widest">
                           Version {requirement.version}.0
                        </span>
                        <span className="px-3 py-1 bg-blue-600/10 text-blue-500 border border-blue-600/20 rounded-xl text-[10px] font-bold uppercase tracking-widest">
                           FRD Document
                        </span>
                     </div>
                  </div>
                  <button className="p-2 text-zinc-600 hover:text-white transition-colors">
                     <MoreVertical className="w-5 h-5" />
                  </button>
               </div>

               <div className="space-y-8">
                  <div>
                     <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Content Specification</h3>
                     <div className="bg-zinc-950/50 p-8 rounded-3xl border border-zinc-800/50 min-h-[400px]">
                        <div className="prose prose-invert max-w-none">
                           <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">
                              {requirement.content || 'The detailed content for this requirement is currently being drafted by the Business Analyst. Please check back later for full specifications.'}
                           </p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Version History */}
            <div className="space-y-6">
               <div className="flex items-center gap-2">
                  <div className="w-1.5 h-6 bg-amber-600 rounded-full" />
                  <h3 className="text-lg font-bold text-white uppercase tracking-wider">Version History</h3>
               </div>
               
               <div className="bg-zinc-900/50 rounded-3xl border border-zinc-800/50 overflow-hidden premium-shadow">
                  <div className="divide-y divide-zinc-800/50">
                    {versions.map((v: any) => (
                      <div key={v.id} className="p-5 flex items-center justify-between hover:bg-zinc-900/50 transition-colors">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-500 font-bold border border-zinc-700">
                               v{v.version}
                            </div>
                            <div>
                               <p className="text-sm font-bold text-white">Version {v.version}.0 Release</p>
                               <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mt-0.5">Updated by {v.created_by_name || 'System'}</p>
                            </div>
                         </div>
                         <div className="flex items-center gap-6">
                            <span className="text-xs font-bold text-zinc-500">{new Date(v.created_at).toLocaleDateString()}</span>
                            <button className="text-xs font-bold text-blue-500 hover:underline">View Snapshot</button>
                         </div>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          </div>

          {/* Meta Sidebar */}
          <div className="w-full lg:w-80 space-y-6">
             <div className="bg-zinc-900/50 rounded-3xl border border-zinc-800/50 p-8 space-y-8 premium-shadow">
                <div className="space-y-6">
                   <div>
                      <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-3 block">Author</span>
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-600/10">
                            {(requirement.created_by_name || 'B').charAt(0)}
                         </div>
                         <div>
                            <p className="text-sm font-bold text-white leading-none">{requirement.created_by_name || 'Business Analyst'}</p>
                            <p className="text-[10px] font-bold text-zinc-500 mt-1 uppercase tracking-tighter">Senior Analyst</p>
                         </div>
                      </div>
                   </div>

                   <div className="pt-6 border-t border-zinc-800/50 space-y-4">
                      <div className="flex items-center justify-between">
                         <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Status</span>
                         <span className={cn("px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-widest border", statusColors[requirement.status])}>
                            {requirement.status}
                         </span>
                      </div>
                      <div className="flex items-center justify-between">
                         <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Sign-off</span>
                         <span className="text-[10px] font-bold text-zinc-400">{requirement.approved_at ? 'Completed' : 'Pending Approval'}</span>
                      </div>
                      {requirement.approved_by && (
                        <div className="flex items-center justify-between">
                           <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Approver</span>
                           <span className="text-xs font-bold text-emerald-500">{requirement.approved_by}</span>
                        </div>
                      )}
                   </div>
                </div>

                <div className="pt-8 border-t border-zinc-800/50 space-y-4">
                   <h4 className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em]">Approval Workflow</h4>
                   <div className="grid grid-cols-1 gap-2">
                      {requirement.status === 'review' ? (
                        <>
                           <button className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2">
                              <ShieldCheck className="w-4 h-4" />
                              Approve Specification
                           </button>
                           <button className="w-full py-3 bg-red-600/10 hover:bg-red-600/20 text-red-500 border border-red-600/20 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2">
                              <ShieldX className="w-4 h-4" />
                              Request Changes
                           </button>
                        </>
                      ) : (
                        <button className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all border border-zinc-700 flex items-center justify-center gap-2">
                           <FileCode className="w-4 h-4" />
                           Edit Draft
                        </button>
                      )}
                   </div>
                </div>
             </div>

             {/* Traceability Link Placeholder */}
             <div className="bg-zinc-900/50 rounded-3xl border border-zinc-800/50 p-6 premium-shadow">
                <div className="flex items-center justify-between mb-4">
                   <h4 className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest leading-none">Linked Tasks</h4>
                   <ArrowUpRight className="w-4 h-4 text-zinc-500" />
                </div>
                <div className="space-y-3">
                   <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800/50">
                      <p className="text-xs font-bold text-white mb-1">Implement Login API</p>
                      <span className="text-[9px] font-bold text-zinc-600 uppercase">Task #421 • IN PROGRESS</span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </main>
    </>
  );
}
