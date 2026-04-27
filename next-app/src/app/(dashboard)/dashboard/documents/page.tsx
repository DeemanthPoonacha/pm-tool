import { getProjects } from '@/lib/projects';
import { getProjectDocuments } from '@/lib/requirement';

const docTypeColors: Record<string, string> = {
  BRD: 'bg-purple-100 text-purple-700',
  FRD: 'bg-indigo-100 text-indigo-700',
  architecture: 'bg-blue-100 text-blue-700',
  infrastructure: 'bg-cyan-100 text-cyan-700',
  other: 'bg-zinc-100 text-zinc-700',
};

export default function DocumentsPage() {
  const projects = getProjects();

  return (
    <div className="flex h-screen">
      <aside className="w-56 bg-zinc-900 p-4">
        <div className="text-white font-semibold text-lg mb-6">PM Tool</div>
        <nav className="space-y-1">
          <a href="/dashboard" className="flex items-center gap-2 px-3 py-2 rounded-lg text-zinc-400 hover:text-white text-sm">Dashboard</a>
          <a href="/dashboard/projects" className="flex items-center gap-2 px-3 py-2 rounded-lg text-zinc-400 hover:text-white text-sm">Projects</a>
          <a href="/dashboard/tasks" className="flex items-center gap-2 px-3 py-2 rounded-lg text-zinc-400 hover:text-white text-sm">Tasks</a>
          <a href="/dashboard/requirements" className="flex items-center gap-2 px-3 py-2 rounded-lg text-zinc-400 hover:text-white text-sm">Requirements</a>
          <a href="/dashboard/change-requests" className="flex items-center gap-2 px-3 py-2 rounded-lg text-zinc-400 hover:text-white text-sm">Change Requests</a>
          <a href="/dashboard/documents" className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-800 text-white text-sm">Documents</a>
          <a href="/dashboard/notifications" className="flex items-center gap-2 px-3 py-2 rounded-lg text-zinc-400 hover:text-white text-sm">Notifications</a>
          <a href="/dashboard/team" className="flex items-center gap-2 px-3 py-2 rounded-lg text-zinc-400 hover:text-white text-sm">Team</a>
          <a href="/dashboard/settings" className="flex items-center gap-2 px-3 py-2 rounded-lg text-zinc-400 hover:text-white text-sm">Settings</a>
        </nav>
      </aside>

      <div className="flex-1 overflow-y-auto">
        <header className="h-14 bg-white border-b border-zinc-200 flex items-center justify-between px-6">
          <div className="text-sm text-zinc-600">Documents</div>
          <div className="flex items-center gap-3">
            <span className="text-sm">Mike</span>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">M</div>
          </div>
        </header>

        <main className="p-6">
          <h1 className="text-2xl font-semibold mb-6">Documents</h1>

          <div className="space-y-6">
            {projects.length === 0 ? (
              <div className="bg-white rounded-lg border border-zinc-200 p-12 text-center">
                <p className="text-zinc-500">No projects yet</p>
                <a href="/dashboard/projects/new" className="text-blue-600 mt-2 inline-block">Create a project first</a>
              </div>
            ) : (
              projects.map(project => {
                const docs = getProjectDocuments(project.id);
                const brd = docs.filter(d => d.document_type === 'BRD').length;
                const frd = docs.filter(d => d.document_type === 'FRD').length;
                const other = docs.filter(d => d.document_type !== 'BRD' && d.document_type !== 'FRD').length;
                
                return (
                  <div key={project.id} className="bg-white rounded-lg border border-zinc-200 overflow-hidden">
                    <div className="px-5 py-3 bg-zinc-50 border-b border-zinc-200">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold">{project.name}</h3>
                          <p className="text-xs text-zinc-500">{docs.length} documents</p>
                        </div>
                        <div className="flex gap-3 text-xs">
                          <span className="text-purple-600">{brd} BRD</span>
                          <span className="text-indigo-600">{frd} FRD</span>
                          <span className="text-zinc-500">{other} other</span>
                        </div>
                      </div>
                    </div>
                    
                    {docs.length === 0 ? (
                      <div className="p-8 text-center text-zinc-500">
                        No documents for this project
                      </div>
                    ) : (
                      <div className="divide-y divide-zinc-100">
                        {docs.map(doc => (
                          <div key={doc.id} className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{doc.title}</span>
                                  <span className={`text-xs px-2 py-0.5 rounded-full ${docTypeColors[doc.document_type] || 'bg-zinc-100 text-zinc-700'}`}>
                                    {doc.document_type}
                                  </span>
                                  <span className="text-xs text-zinc-500">v{doc.version}</span>
                                </div>
                                <div className="text-sm text-zinc-500 mt-1">
                                  {doc.file_name && <span>File: {doc.file_name}</span>}
                                </div>
                                <div className="flex items-center gap-4 mt-2 text-xs text-zinc-500">
                                  <span>Uploaded by: {doc.uploaded_by_name || 'Unknown'}</span>
                                  {doc.file_size && <span>Size: {(doc.file_size / 1024).toFixed(1)} KB</span>}
                                  <span>Created: {new Date(doc.created_at).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </main>
      </div>
    </div>
  );
}