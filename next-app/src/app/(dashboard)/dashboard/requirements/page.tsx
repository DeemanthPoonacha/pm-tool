import { getProjects } from '@/lib/projects';
import { getRequirements } from '@/lib/requirement';
import { Header } from '@/components/dashboard/header';
import { FileText, Clock } from 'lucide-react';
import { NewRequirementButton } from '@/components/dashboard/new-requirement-button';
import { RequirementActions } from '@/components/dashboard/requirement-actions';
import { cn } from '@/lib/utils';

export default function RequirementsPage() {
  const projects = getProjects();

  return (
    <>
      <Header title="Requirements" />
      <main className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Requirements</h1>
            <p className="text-zinc-500 text-sm mt-1">Manage project requirements and sign-offs</p>
          </div>
          <NewRequirementButton projects={projects} />
        </div>

        <div className="space-y-8">
          {projects.length === 0 ? (
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-16 text-center shadow-sm">
              <p className="text-zinc-500">No projects yet.</p>
            </div>
          ) : (
            projects.map((project) => {
              const requirements = getRequirements(project.id);
              return (
                <div key={project.id} className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm transition-all hover:shadow-md">
                  <div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
                    <h3 className="font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-500" />
                      {project.name}
                    </h3>
                    <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-0.5 rounded-full font-medium">
                      {requirements.length} Documents
                    </span>
                  </div>
                  <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {requirements.length === 0 ? (
                      <div className="p-8 text-center text-zinc-500 text-sm italic">
                        No requirements documents found for this project.
                      </div>
                    ) : (
                      requirements.map((req) => (
                        <div key={req.id} className="p-6 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors flex items-center justify-between gap-6">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3">
                              <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">
                                {req.title}
                              </p>
                              <span className={cn(
                                "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider",
                                req.status === 'approved' ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                                req.status === 'rejected' ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                                "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                              )}>
                                {req.status}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 mt-2">
                              <span className="text-xs text-zinc-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Version {req.version}
                              </span>
                              <span className="text-xs text-zinc-500">
                                Created by <span className="font-medium text-zinc-700 dark:text-zinc-300">{req.created_by_name || 'Unknown'}</span>
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {req.status === 'draft' && (
                              <RequirementActions requirementId={req.id} />
                            )}
                            <button className="px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded-lg transition-all border border-blue-200 dark:border-blue-800">
                              View Details
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