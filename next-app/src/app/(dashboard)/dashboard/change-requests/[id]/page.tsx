'use client';

import { use, useState, useEffect } from 'react';
import { Header } from '@/components/dashboard/header';
import { 
  FileEdit, 
  AlertCircle, 
  CheckCircle2, 
  XCircle,
  ChevronRight,
  User,
  Calendar,
  Zap,
  ArrowUpRight,
  ShieldCheck,
  ShieldX,
  MoreVertical,
  ShieldAlert,
  ClipboardList,
  CheckSquare
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

const statusColors: Record<string, string> = {
  pending: 'bg-amber-600/10 text-amber-500 border-amber-600/20',
  approved: 'bg-emerald-600/10 text-emerald-500 border-emerald-600/20',
  rejected: 'bg-red-600/10 text-red-500 border-red-600/20',
};

export default function ChangeRequestDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [cr, setCr] = useState<any>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/change-requests/${id}`);
        if (res.ok) {
          const data = await res.json();
          setCr(data);
        }
      } catch (e) {
        console.error('Failed to fetch CR:', e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleAction = async (action: 'approve' | 'reject') => {
    setIsActionLoading(true);
    try {
      await fetch('/api/change-requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id, 
          action, 
          userId: 'u_admin', 
          impact: action === 'approve' ? 'Medium' : null,
          rejectionReason: action === 'reject' ? 'Not feasible within current timeline' : null
        }),
      });
      // Refresh local data
      const freshRes = await fetch(`/api/change-requests/${id}`);
      const freshData = await freshRes.json();
      setCr(freshData);
    } catch (error) {
      console.error(`Failed to ${action} CR:`, error);
    } finally {
      setIsActionLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-zinc-950 text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!cr) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-zinc-950 text-white">
        <ShieldAlert className="w-16 h-16 text-zinc-800 mb-4" />
        <h1 className="text-2xl font-bold">Change Request not found</h1>
        <Link href="/dashboard/change-requests" className="text-blue-500 mt-4 font-bold hover:underline">Back to Change Requests</Link>
      </div>
    );
  }

  const project = cr.project;
  const linkedTasks = cr.tasks || [];

  return (
    <>
      <Header title={`CR: ${cr.title}`} />
      <main className="p-8 max-w-7xl mx-auto w-full pb-20">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1 space-y-8">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">
              <Link href="/dashboard/projects" className="hover:text-white transition-colors">Projects</Link>
              <ChevronRight className="w-3 h-3" />
              <Link href={`/dashboard/projects/${cr.project_id}`} className="hover:text-white transition-colors">{project?.name || 'Project'}</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-blue-500">Change Request</span>
            </div>

            <div className="bg-zinc-900/50 rounded-3xl border border-zinc-800/50 p-8 premium-shadow">
               <div className="flex justify-between items-start mb-8">
                  <div className="space-y-4">
                     <h1 className="text-3xl font-bold text-white tracking-tight leading-tight">{cr.title}</h1>
                     <div className="flex flex-wrap gap-3">
                        <span className={cn("px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-widest border", statusColors[cr.status])}>
                           {cr.status}
                        </span>
                        <span className="px-3 py-1 bg-zinc-800 text-zinc-400 border border-zinc-700 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                           <Zap className="w-3 h-3 text-amber-500" />
                           {cr.impact || 'Medium Impact'}
                        </span>
                     </div>
                  </div>
                  <button className="p-2 text-zinc-600 hover:text-white transition-colors">
                     <MoreVertical className="w-5 h-5" />
                  </button>
               </div>

               <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-4">
                        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Reason for Change</h3>
                        <p className="text-zinc-300 leading-relaxed bg-zinc-950/50 p-6 rounded-2xl border border-zinc-800/50">
                           {cr.description || 'The client has requested a modification to the current scope. Detailed reasoning is provided in the associated FRD update.'}
                        </p>
                     </div>
                     <div className="space-y-4">
                        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Project Impact Analysis</h3>
                        <div className="bg-zinc-950/50 p-6 rounded-2xl border border-zinc-800/50 space-y-4 text-sm">
                           <div className="flex justify-between">
                              <span className="text-zinc-500">Timeline Impact</span>
                              <span className="text-amber-500 font-bold">+2 Weeks</span>
                           </div>
                           <div className="flex justify-between">
                              <span className="text-zinc-500">Resource Load</span>
                              <span className="text-white font-bold">High</span>
                           </div>
                           <div className="flex justify-between">
                              <span className="text-zinc-500">Complexity</span>
                              <span className="text-white font-bold">Moderate</span>
                           </div>
                        </div>
                     </div>
                  </div>

                  {cr.status === 'rejected' && cr.rejection_reason && (
                    <div className="bg-red-600/10 border border-red-600/20 p-6 rounded-2xl">
                       <h3 className="text-xs font-bold text-red-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                          <XCircle className="w-4 h-4" /> Rejection Reason
                       </h3>
                       <p className="text-sm text-red-200/70">{cr.rejection_reason}</p>
                    </div>
                  )}
               </div>
            </div>

            {/* Linked Tasks */}
            <div className="space-y-6">
               <div className="flex items-center gap-2">
                  <div className="w-1.5 h-6 bg-indigo-600 rounded-full" />
                  <h3 className="text-lg font-bold text-white uppercase tracking-wider">Associated Tasks</h3>
               </div>
               
               <div className="bg-zinc-900/50 rounded-3xl border border-zinc-800/50 overflow-hidden premium-shadow">
                  {linkedTasks.length === 0 ? (
                    <div className="p-12 text-center">
                       <ClipboardList className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
                       <p className="text-zinc-500 font-medium">No tasks currently linked to this change request.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-zinc-800/50">
                       {linkedTasks.map((task: any) => (
                         <div key={task.id} className="p-5 flex items-center justify-between hover:bg-zinc-900/50 transition-colors group">
                            <div className="flex items-center gap-4">
                               <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-500 border border-zinc-700">
                                  <CheckSquare className="w-5 h-5" />
                               </div>
                               <div>
                                  <p className="text-sm font-bold text-white group-hover:text-blue-500 transition-colors">{task.title}</p>
                                  <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{task.status}</span>
                               </div>
                            </div>
                            <Link href={`/dashboard/tasks/${task.id}`} className="p-2 bg-zinc-800 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                               <ArrowUpRight className="w-4 h-4 text-zinc-400" />
                            </Link>
                         </div>
                       ))}
                    </div>
                  )}
               </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-80 space-y-6">
             <div className="bg-zinc-900/50 rounded-3xl border border-zinc-800/50 p-8 space-y-8 premium-shadow">
                <div className="space-y-6">
                   <div>
                      <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-3 block">Requested By</span>
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-orange-600 flex items-center justify-center text-white font-bold shadow-lg shadow-amber-600/10">
                            {(cr.requested_by_name || 'C').charAt(0)}
                         </div>
                         <div>
                            <p className="text-sm font-bold text-white leading-none">{cr.requested_by_name || 'Client Contact'}</p>
                            <p className="text-[10px] font-bold text-zinc-500 mt-1 uppercase tracking-tighter">Key Stakeholder</p>
                         </div>
                      </div>
                   </div>

                   <div className="pt-6 border-t border-zinc-800/50 space-y-4">
                      <div className="flex items-center justify-between">
                         <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Status</span>
                         <span className={cn("px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-widest border", statusColors[cr.status])}>
                            {cr.status}
                         </span>
                      </div>
                      <div className="flex items-center justify-between">
                         <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Requested On</span>
                         <span className="text-xs font-bold text-zinc-400">{new Date(cr.created_at).toLocaleDateString()}</span>
                      </div>
                      {cr.approved_at && (
                        <div className="flex items-center justify-between">
                           <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Reviewed On</span>
                           <span className="text-xs font-bold text-zinc-400">{new Date(cr.approved_at).toLocaleDateString()}</span>
                        </div>
                      )}
                   </div>
                </div>

                <div className="pt-8 border-t border-zinc-800/50 space-y-4">
                   <h4 className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em]">Decision Control</h4>
                   <div className="grid grid-cols-1 gap-2">
                      {cr.status === 'pending' ? (
                        <>
                           <button 
                             disabled={isActionLoading}
                             onClick={() => handleAction('approve')}
                             className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
                           >
                              <ShieldCheck className="w-4 h-4" />
                              Approve Change
                           </button>
                           <button 
                             disabled={isActionLoading}
                             onClick={() => handleAction('reject')}
                             className="w-full py-3 bg-red-600/10 hover:bg-red-600/20 text-red-500 border border-red-600/20 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                           >
                              <ShieldX className="w-4 h-4" />
                              Reject Change
                           </button>
                        </>
                      ) : (
                        <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 text-center">
                           <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Decision Finalized</p>
                        </div>
                      )}
                   </div>
                </div>
             </div>

             {/* Audit History */}
             <div className="bg-zinc-900/50 rounded-3xl border border-zinc-800/50 p-6 premium-shadow">
                <h4 className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-4">Audit History</h4>
                <div className="space-y-4">
                   <div className="flex gap-3">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5" />
                      <div className="text-[10px]">
                         <p className="text-zinc-300 font-bold">Created by Client</p>
                         <p className="text-zinc-600 uppercase mt-0.5">{new Date(cr.created_at).toLocaleDateString()}</p>
                      </div>
                   </div>
                   {cr.approved_at && (
                     <div className="flex gap-3">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5" />
                        <div className="text-[10px]">
                           <p className="text-zinc-300 font-bold">Approved by Admin</p>
                           <p className="text-zinc-600 uppercase mt-0.5">{new Date(cr.approved_at).toLocaleDateString()}</p>
                        </div>
                     </div>
                   )}
                </div>
             </div>
          </div>
        </div>
      </main>
    </>
  );
}
