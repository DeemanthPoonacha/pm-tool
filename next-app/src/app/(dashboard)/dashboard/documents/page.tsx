import { getProjects } from '@/lib/projects';
import { getProjectDocuments } from '@/lib/requirement';
import { Header } from '@/components/dashboard/header';
import { Plus, File, ExternalLink, Download, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DocumentsPage() {
  const projects = getProjects();

  return (
    <>
      <Header title="Documents" />
      <main className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Project Documents</h1>
            <p className="text-zinc-500 text-sm mt-1">Centralized repository for all project assets and documentation</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-blue-600/20">
            <Plus className="w-4 h-4" />
            Upload File
          </button>
        </div>

        <div className="space-y-6">
          {projects.length === 0 ? (
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-16 text-center shadow-sm">
              <p className="text-zinc-500">No projects yet.</p>
            </div>
          ) : (
            projects.map((project) => {
              const docs = getProjectDocuments(project.id);
              return (
                <div key={project.id} className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
                  <div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
                    <h3 className="font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                      <File className="w-4 h-4 text-orange-500" />
                      {project.name}
                    </h3>
                    <span className="text-xs text-zinc-500 font-medium">{docs.length} Files</span>
                  </div>
                  <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {docs.length === 0 ? (
                      <div className="p-8 text-center text-zinc-500 text-sm">
                        No documents uploaded for this project
                      </div>
                    ) : (
                      docs.map((doc) => (
                        <div key={doc.id} className="p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors flex items-center justify-between gap-4 group">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                              <File className="w-5 h-5 text-zinc-500 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-zinc-900 dark:text-white">{doc.title}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-bold uppercase tracking-wider">
                                  {doc.document_type}
                                </span>
                                <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  v{doc.version}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right hidden sm:block">
                              <p className="text-[10px] text-zinc-500">Uploaded by</p>
                              <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">{doc.uploaded_by_name || 'Unknown'}</p>
                            </div>
                            <div className="flex items-center gap-1">
                              <button className="p-2 text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                <Download className="w-4 h-4" />
                              </button>
                              <button className="p-2 text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                <ExternalLink className="w-4 h-4" />
                              </button>
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