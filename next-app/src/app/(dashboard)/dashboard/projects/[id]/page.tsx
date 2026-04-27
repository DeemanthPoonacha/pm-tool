import { use } from 'react';
import { getProject, getProjectTeam, getProjectWorkflowStages } from '@/lib/projects';
import { getTasks } from '@/lib/tasks';
import { getRequirements, getProjectDocuments } from '@/lib/requirement';
import { getChangeRequests } from '@/lib/changes';
import { getAllUsers } from '@/lib/permissions';
import { Header } from '@/components/dashboard/header';
import { NewTaskButton } from '@/components/dashboard/new-task-button';
import { NewRequirementButton } from '@/components/dashboard/new-requirement-button';
import { NewCRButton } from '@/components/dashboard/new-cr-button';
import { 
  FolderKanban, 
  Users2, 
  CheckSquare, 
  FileText, 
  FileEdit, 
  Files,
  Calendar,
  Clock,
  LayoutDashboard,
  Plus,
  ArrowLeft,
  ChevronRight,
  ShieldAlert,
  MessageSquare,
  Activity,
  FileCode,
  Download
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const project = getProject(id) as any;
  
  if (!project) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-zinc-950 text-white">
        <ShieldAlert className="w-16 h-16 text-zinc-800 mb-4" />
        <h1 className="text-2xl font-bold">Project not found</h1>
        <Link href="/dashboard/projects" className="text-blue-500 mt-4 font-bold hover:underline">Back to Projects</Link>
      </div>
    );
  }

  const team = getProjectTeam(id);
  const tasks = getTasks(id);
  const requirements = getRequirements(id);
  const crs = getChangeRequests(id);
  const docs = getProjectDocuments(id);
  const stages = getProjectWorkflowStages(id);
  const users = getAllUsers();
  const developers = users.filter(u => u.role === 'developer' || u.role === 'pm');

  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const progress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  return (
    <>
      <Header title={`Project: ${project.name}`} />
      <main className="p-8 max-w-7xl mx-auto w-full space-y-8 pb-20">
        {/* Breadcrumbs & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm font-bold text-zinc-500 uppercase tracking-widest">
            <Link href="/dashboard/projects" className="hover:text-white transition-colors">Projects</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-blue-500">{project.name}</span>
          </div>
          <div className="flex items-center gap-3">
             <button className="px-4 py-2 bg-zinc-900 text-zinc-300 text-sm font-bold rounded-xl border border-zinc-800 hover:bg-zinc-800 transition-all">
                Edit Project
             </button>
             <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95">
                <Download className="w-4 h-4" />
                Export Report
             </button>
          </div>
        </div>

        {/* Project Overview Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-zinc-900/50 rounded-3xl border border-zinc-800/50 p-8 flex flex-col gap-6 premium-shadow">
             <div className="flex justify-between items-start">
                <div>
                   <h1 className="text-3xl font-bold text-white mb-4 tracking-tight">{project.name}</h1>
                   <p className="text-zinc-400 leading-relaxed max-w-2xl">
                     {project.description || 'No detailed description provided for this project.'}
                   </p>
                </div>
                <div className={cn(
                  "px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] border",
                  project.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-zinc-800 text-zinc-500 border-zinc-700'
                )}>
                  {project.status}
                </div>
             </div>
             <div className="flex flex-wrap gap-6 mt-2">
                <div className="flex items-center gap-2">
                   <Calendar className="w-4 h-4 text-zinc-500" />
                   <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest leading-none mb-1">Started</span>
                      <span className="text-xs font-bold text-zinc-300">{new Date(project.created_at).toLocaleDateString()}</span>
                   </div>
                </div>
                <div className="flex items-center gap-2">
                   <Users2 className="w-4 h-4 text-zinc-500" />
                   <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest leading-none mb-1">Team Size</span>
                      <span className="text-xs font-bold text-zinc-300">{team.length} Members</span>
                   </div>
                </div>
                <div className="flex items-center gap-2">
                   <ShieldAlert className="w-4 h-4 text-zinc-500" />
                   <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest leading-none mb-1">Priority</span>
                      <span className="text-xs font-bold text-zinc-300">High Priority</span>
                   </div>
                </div>
             </div>
          </div>

          {/* Stats Summary */}
          <div className="bg-zinc-900/50 rounded-3xl border border-zinc-800/50 p-8 flex flex-col justify-between premium-shadow">
             <div className="flex items-center justify-between mb-8">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Total Progress</span>
                <span className="text-xl font-bold text-white">{progress}%</span>
             </div>
             <div className="flex-1 flex flex-col justify-center gap-4">
                <div className="h-4 bg-zinc-800 rounded-full overflow-hidden border border-white/5">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-1000" 
                    style={{width: `${progress}%`}}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mt-2">
                   <div className="flex flex-col">
                      <span className="text-2xl font-bold text-white tracking-tight">{completedTasks}</span>
                      <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Done</span>
                   </div>
                   <div className="flex flex-col">
                      <span className="text-2xl font-bold text-white tracking-tight">{tasks.length - completedTasks}</span>
                      <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Active</span>
                   </div>
                </div>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
           {/* Left Column: Modules */}
           <div className="lg:col-span-3 space-y-12">
              {/* Project Modules */}
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
                   <h3 className="text-lg font-bold text-white uppercase tracking-wider">Project Modules</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Link href={`/dashboard/tasks?project=${id}`} className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800/50 hover:border-blue-600/30 transition-all group overflow-hidden relative">
                     <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <CheckSquare className="w-20 h-20" />
                     </div>
                     <div className="relative z-10">
                        <div className="w-12 h-12 bg-indigo-600/10 rounded-2xl flex items-center justify-center text-indigo-500 mb-4 border border-indigo-600/20">
                          <CheckSquare className="w-6 h-6" />
                        </div>
                        <h4 className="text-lg font-bold text-white mb-1">Tasks</h4>
                        <p className="text-xs text-zinc-500 font-bold mb-4 uppercase tracking-widest">{tasks.length} Assigned</p>
                        <span className="text-xs font-bold text-blue-500 group-hover:underline">Manage Tasks →</span>
                     </div>
                  </Link>

                  <Link href={`/dashboard/requirements?project=${id}`} className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800/50 hover:border-blue-600/30 transition-all group overflow-hidden relative">
                     <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <FileText className="w-20 h-20" />
                     </div>
                     <div className="relative z-10">
                        <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500 mb-4 border border-blue-600/20">
                          <FileText className="w-6 h-6" />
                        </div>
                        <h4 className="text-lg font-bold text-white mb-1">Requirements</h4>
                        <p className="text-xs text-zinc-500 font-bold mb-4 uppercase tracking-widest">{requirements.length} Documents</p>
                        <span className="text-xs font-bold text-blue-500 group-hover:underline">View Docs →</span>
                     </div>
                  </Link>

                  <Link href={`/dashboard/change-requests?project=${id}`} className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800/50 hover:border-blue-600/30 transition-all group overflow-hidden relative">
                     <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <FileEdit className="w-20 h-20" />
                     </div>
                     <div className="relative z-10">
                        <div className="w-12 h-12 bg-purple-600/10 rounded-2xl flex items-center justify-center text-purple-500 mb-4 border border-purple-600/20">
                          <FileEdit className="w-6 h-6" />
                        </div>
                        <h4 className="text-lg font-bold text-white mb-1">Change Requests</h4>
                        <p className="text-xs text-zinc-500 font-bold mb-4 uppercase tracking-widest">{crs.length} Pending</p>
                        <span className="text-xs font-bold text-blue-500 group-hover:underline">Review CRs →</span>
                     </div>
                  </Link>
                </div>
              </div>

              {/* Workflow Pipeline */}
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-6 bg-indigo-600 rounded-full" />
                   <h3 className="text-lg font-bold text-white uppercase tracking-wider">Workflow Pipeline</h3>
                </div>
                <div className="flex flex-wrap gap-4">
                   {stages.map((stage: any, i: number) => (
                     <div key={stage.id} className="flex items-center gap-4 group">
                        <div className="flex flex-col items-center">
                          <div className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center font-bold transition-all border",
                            i === 0 ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20 border-blue-500" : "bg-zinc-900 text-zinc-500 border-zinc-800"
                          )}>
                            {i + 1}
                          </div>
                          <span className={cn(
                            "text-[10px] font-bold uppercase tracking-widest mt-2",
                            i === 0 ? "text-blue-500" : "text-zinc-600"
                          )}>{stage.stage_name}</span>
                        </div>
                        {i < stages.length - 1 && (
                          <ChevronRight className="w-5 h-5 text-zinc-800" />
                        )}
                     </div>
                   ))}
                   <button className="flex flex-col items-center group">
                      <div className="w-12 h-12 rounded-2xl bg-zinc-950 border border-dashed border-zinc-800 flex items-center justify-center text-zinc-600 group-hover:text-white group-hover:border-white transition-all">
                         <Plus className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest mt-2 text-zinc-600">Add Stage</span>
                   </button>
                </div>
              </div>

              {/* Activity Timeline */}
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-6 bg-emerald-600 rounded-full" />
                   <h3 className="text-lg font-bold text-white uppercase tracking-wider">Project Timeline</h3>
                </div>
                <div className="bg-zinc-900/50 rounded-3xl border border-zinc-800/50 p-8 premium-shadow">
                   <div className="flex flex-col gap-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-zinc-800">
                      {[
                        { icon: CheckSquare, color: 'text-indigo-500', bg: 'bg-indigo-500/10', title: 'Task Completed', details: 'Integration of payment gateway by Sarah.', time: '2 hours ago' },
                        { icon: FileText, color: 'text-blue-500', bg: 'bg-blue-500/10', title: 'Requirement Approved', details: 'FRD v2.1 approved by Product Manager.', time: '5 hours ago' },
                        { icon: Plus, color: 'text-emerald-500', bg: 'bg-emerald-600/10', title: 'New Member Added', details: 'John joined as a Senior Backend Developer.', time: '1 day ago' },
                      ].map((item, i) => (
                        <div key={i} className="flex gap-6 relative">
                           <div className={cn("w-6 h-6 rounded-full flex items-center justify-center z-10 ring-4 ring-zinc-950 shadow-lg", item.bg, item.color)}>
                              <item.icon className="w-3.5 h-3.5" />
                           </div>
                           <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                 <h5 className="text-sm font-bold text-white">{item.title}</h5>
                                 <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{item.time}</span>
                              </div>
                              <p className="text-sm text-zinc-500">{item.details}</p>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
           </div>

           {/* Right Column: Quick Actions & Team */}
           <div className="space-y-8">
              <div className="bg-zinc-900/50 rounded-3xl border border-zinc-800/50 p-6 space-y-4 premium-shadow">
                 <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-2">Quick Actions</h4>
                 <NewTaskButton projects={[{id, name: project.name}]} developers={developers} />
                 <NewRequirementButton projects={[{id, name: project.name}]} />
                 <NewCRButton projects={[{id, name: project.name}]} />
              </div>

              <div className="bg-zinc-900/50 rounded-3xl border border-zinc-800/50 p-6 space-y-6 premium-shadow">
                 <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white uppercase tracking-widest">Project Team</h4>
                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{team.length}</span>
                 </div>
                 <div className="space-y-4">
                    {team.map((member, i) => (
                      <div key={i} className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] font-bold text-zinc-500">
                            {member.full_name.charAt(0)}
                         </div>
                         <div>
                            <p className="text-xs font-bold text-white leading-none">{member.full_name}</p>
                            <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-tighter mt-1">{member.project_role}</p>
                         </div>
                      </div>
                    ))}
                 </div>
                 <button className="w-full py-2.5 bg-zinc-950 border border-dashed border-zinc-800 rounded-xl text-[10px] font-bold text-zinc-600 uppercase tracking-widest hover:text-white hover:border-zinc-700 transition-all">
                    Manage Team
                 </button>
              </div>

              <div className="bg-zinc-900/50 rounded-3xl border border-zinc-800/50 p-6 space-y-4 premium-shadow">
                 <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-2">Recent Docs</h4>
                 <div className="space-y-3">
                    {docs.slice(0, 3).map((doc, i) => (
                      <Link key={i} href={`/dashboard/documents`} className="flex items-center gap-3 p-2 rounded-xl hover:bg-zinc-800 transition-colors group">
                         <div className="w-8 h-8 bg-blue-600/10 rounded-lg flex items-center justify-center text-blue-500 border border-blue-600/20">
                            <FileCode className="w-4 h-4" />
                         </div>
                         <div className="min-w-0">
                            <p className="text-xs font-bold text-white truncate group-hover:text-blue-400 transition-colors">{doc.title}</p>
                            <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">{doc.document_type} • v{doc.version}</p>
                         </div>
                      </Link>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </main>
    </>
  );
}
