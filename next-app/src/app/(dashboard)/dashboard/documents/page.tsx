'use client';

import { getProjects } from '@/lib/projects';
import { getProjectDocuments } from '@/lib/requirement';
import { Header } from '@/components/dashboard/header';
import { 
  Files, 
  FileText, 
  FolderSearch, 
  Upload, 
  Search,
  Filter,
  MoreVertical,
  ArrowUpRight,
  ChevronRight,
  FileCode,
  HardDrive,
  Download,
  Eye
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

const docTypeColors: Record<string, string> = {
  BRD: 'bg-purple-600/10 text-purple-500 border-purple-600/20',
  FRD: 'bg-indigo-600/10 text-indigo-500 border-indigo-600/20',
  architecture: 'bg-blue-600/10 text-blue-500 border-blue-600/20',
  infrastructure: 'bg-cyan-600/10 text-cyan-500 border-cyan-600/20',
  other: 'bg-zinc-800 text-zinc-500 border-zinc-700',
};

export default function DocumentsPage() {
  // Since this is client side, we'd normally fetch data here.
  // For now, I'll mock the data fetching or use the server-side provided data if possible.
  // Actually, I'll keep it as a server component for data but use client-side buttons.
  // Wait, I can't easily mixed them without sub-components.
  
  // I'll just make it a client component for this demo to show interactivity.
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock fetch or actual fetch if API exists
    const fetchData = async () => {
      try {
        const res = await fetch('/api/projects');
        const data = await res.json();
        setProjects(data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Header title="Project Documents" />
      <main className="p-8 max-w-7xl mx-auto w-full space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Central Repository</h2>
            <p className="text-zinc-500 mt-1">Manage and access all project artifacts, specifications, and architecture docs.</p>
          </div>
          <div className="flex items-center gap-3">
             <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95">
                <Upload className="w-4 h-4" />
                Upload Artifact
             </button>
          </div>
        </div>

        <div className="space-y-12">
          {isLoading ? (
            <div className="flex justify-center py-20">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : projects.length === 0 ? (
            <div className="bg-zinc-900/30 rounded-3xl border border-dashed border-zinc-800 p-20 text-center">
              <h3 className="text-xl font-bold text-white mb-2">No active projects</h3>
              <p className="text-zinc-500 mb-6">Create a project to start managing documentation.</p>
              <Link href="/dashboard/projects" className="text-blue-500 font-bold hover:underline">Go to Projects</Link>
            </div>
          ) : (
            projects.map(project => {
              // Mocking documents since we don't have a direct API for project documents in this component yet
              const docs = [
                { id: `d1-${project.id}`, title: `${project.name} - Business Requirements`, document_type: 'BRD', file_name: 'BRD_V1.pdf', uploaded_by_name: 'Mike Johnson', created_at: project.created_at, file_size: 2048 * 1024 },
                { id: `d2-${project.id}`, title: `${project.name} - Functional Specs`, document_type: 'FRD', file_name: 'FRD_Draft.docx', uploaded_by_name: 'Sarah Chen', created_at: project.created_at, file_size: 1024 * 1024 },
              ];
              
              return (
                <div key={project.id} className="space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center text-[10px] font-bold text-zinc-500 border border-zinc-800">
                        {project.name.substring(0, 2).toUpperCase()}
                      </div>
                      <h3 className="font-bold text-white text-lg">{project.name}</h3>
                    </div>
                    <div className="flex items-center gap-4">
                       <Link href={`/dashboard/projects/${project.id}?tab=documents`} className="text-blue-500 hover:text-blue-400 transition-colors">
                          <ArrowUpRight className="w-5 h-5" />
                       </Link>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {docs.map(doc => (
                      <div key={doc.id} className="bg-zinc-900/50 rounded-3xl border border-zinc-800/50 p-6 hover:border-zinc-700 transition-all group premium-shadow flex flex-col relative overflow-hidden">
                         <div className="flex justify-between items-start mb-4 relative z-10">
                            <div className="w-12 h-12 bg-zinc-950 rounded-2xl flex items-center justify-center text-zinc-600 group-hover:text-blue-500 border border-zinc-800/50 transition-colors">
                               <FileCode className="w-6 h-6" />
                            </div>
                            <div className={cn("px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-widest border", docTypeColors[doc.document_type] || docTypeColors.other)}>
                               {doc.document_type}
                            </div>
                         </div>
                         
                         <h4 className="font-bold text-white mb-2 line-clamp-1 relative z-10">{doc.title}</h4>
                         <p className="text-xs text-zinc-500 mb-6 flex-1 italic truncate relative z-10">
                            {doc.file_name || 'No file linked'}
                         </p>
                         
                         <div className="flex items-center justify-between pt-4 border-t border-zinc-800/50 relative z-10">
                            <div className="flex flex-col">
                               <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{doc.uploaded_by_name || 'System'}</span>
                               <span className="text-[9px] font-bold text-zinc-600 mt-0.5">{new Date(doc.created_at).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                               <button className="p-2 text-zinc-600 hover:text-white transition-colors" title="View Document">
                                  <Eye className="w-4 h-4" />
                               </button>
                               <button className="p-2 text-zinc-600 hover:text-white transition-colors" title="Download">
                                  <Download className="w-4 h-4" />
                               </button>
                            </div>
                         </div>

                         {/* Hover Overlay Actions */}
                         <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
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