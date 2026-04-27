import { getProjects } from '@/lib/projects';
import { getChangeRequests } from '@/lib/changes';
import { Header } from '@/components/dashboard/header';
import { GitPullRequest, Clock } from 'lucide-react';
import { NewCRButton } from '@/components/dashboard/new-cr-button';
import { CRActions } from '@/components/dashboard/cr-actions';
import { cn } from '@/lib/utils';

export default function ChangeRequestsPage() {
  const projects = getProjects();

  return (
    <>
      <Header title="Change Requests" />
      <main className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Change Requests</h1>
            <p className="text-zinc-500 text-sm mt-1">Track and approve modifications to project scope</p>
          </div>
          <NewCRButton projects={projects} />
        </div>

        <div className="space-y-8">
          {projects.length === 0 ? (
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-16 text-center">
              <p className="text-zinc-500">No projects yet.</p>
            </div>
          ) : (
            projects.map((project) => {
              const crs = getChangeRequests(project.id);
              return (
                <div key={project.id} className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm transition-all hover:shadow-md">
                  <div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
                    <h3 className="font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                      <GitPullRequest className="w-4 h-4 text-purple-500" />
                      {project.name}
                    </h3>
                    <span className="text-xs text-zinc-500 font-medium">
                      {crs.length} Requests
                    </span>
                  </div>
                  <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {crs.length === 0 ? (
                      <div className="p-8 text-center text-zinc-500 text-sm italic">
                        No active change requests for this project.
                      </div>
                    ) : (
                      crs.map((cr) => (
                        <div key={cr.id} className="p-6 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors flex items-center justify-between gap-6">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3">
                              <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">
                                {cr.title}
                              </p>
                              <span className={cn(
                                "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider",
                                cr.status === 'approved' ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                                cr.status === 'rejected' ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                                "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                              )}>
                                {cr.status}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 mt-2">
                              <span className="text-xs text-zinc-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Requested by <span className="font-medium text-zinc-700 dark:text-zinc-300">{cr.requested_by_name || 'Unknown'}</span>
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {cr.status === 'pending' && (
                              <CRActions crId={cr.id} />
                            )}
                            <button className="px-3 py-1.5 text-xs font-medium text-purple-600 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-900/20 rounded-lg transition-all border border-purple-200 dark:border-purple-800">
                              Details
                            </button>
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