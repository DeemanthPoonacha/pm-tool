'use client';

import { use, useState } from 'react';
import { getTask, getTaskComments } from '@/lib/tasks';
import { getProject } from '@/lib/projects';
import { Header } from '@/components/dashboard/header';
import { 
  CheckSquare, 
  Clock, 
  MessageSquare, 
  AlertCircle,
  ChevronRight,
  User,
  Calendar,
  Tag,
  Paperclip,
  Send,
  MoreVertical,
  ShieldAlert
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

const statusColors: Record<string, string> = {
  todo: 'bg-zinc-800 text-zinc-400 border-zinc-700',
  in_progress: 'bg-blue-600/10 text-blue-500 border-blue-600/20',
  done: 'bg-emerald-600/10 text-emerald-500 border-emerald-600/20',
  blocked: 'bg-red-600/10 text-red-500 border-red-600/20',
};

const priorityColors: Record<string, string> = {
  high: 'text-red-500 bg-red-500/10 border-red-500/20',
  medium: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
  low: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
};

export default function TaskDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  
  const task = getTask(id);
  
  if (!task) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-zinc-950 text-white">
        <ShieldAlert className="w-16 h-16 text-zinc-800 mb-4" />
        <h1 className="text-2xl font-bold">Task not found</h1>
        <Link href="/dashboard/tasks" className="text-blue-500 mt-4 font-bold hover:underline">Back to Tasks</Link>
      </div>
    );
  }

  const project = getProject(task.project_id) as any;
  const comments = getTaskComments(id);

  const handleUpdateStatus = async (status: string) => {
    setIsLoading(true);
    try {
      await fetch('/api/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: task.id, status }),
      });
      router.refresh();
    } catch (error) {
      console.error('Failed to update task status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostComment = async () => {
    if (!commentContent.trim()) return;
    setIsLoading(true);
    try {
      await fetch('/api/tasks/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          taskId: task.id, 
          userId: 'u_admin', // Mocking as admin
          content: commentContent 
        }),
      });
      setCommentContent('');
      router.refresh();
    } catch (error) {
      console.error('Failed to post comment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header title={`Task: ${task.title}`} />
      <main className="p-8 max-w-7xl mx-auto w-full pb-20">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Task Content */}
          <div className="flex-1 space-y-8">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">
              <Link href="/dashboard/projects" className="hover:text-white transition-colors">Projects</Link>
              <ChevronRight className="w-3 h-3" />
              <Link href={`/dashboard/projects/${task.project_id}`} className="hover:text-white transition-colors">{project?.name || 'Project'}</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-blue-500">Task Details</span>
            </div>

            <div className="bg-zinc-900/50 rounded-3xl border border-zinc-800/50 p-8 premium-shadow">
               <div className="flex justify-between items-start mb-6">
                  <div className="space-y-4">
                     <h1 className="text-3xl font-bold text-white tracking-tight leading-tight">{task.title}</h1>
                     <div className="flex flex-wrap gap-3">
                        <span className={cn("px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-widest border", statusColors[task.status])}>
                           {task.status.replace('_', ' ')}
                        </span>
                        <span className={cn("px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-widest border", priorityColors[task.priority])}>
                           {task.priority} Priority
                        </span>
                     </div>
                  </div>
                  <button className="p-2 text-zinc-600 hover:text-white transition-colors">
                     <MoreVertical className="w-5 h-5" />
                  </button>
               </div>

               <div className="space-y-6">
                  <div>
                     <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Description</h3>
                     <p className="text-zinc-300 leading-relaxed bg-zinc-950/50 p-6 rounded-2xl border border-zinc-800/50">
                        {task.description || 'No detailed description provided for this task.'}
                     </p>
                  </div>
               </div>
            </div>

            {/* Comments Section */}
            <div className="space-y-6">
               <div className="flex items-center gap-2">
                  <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
                  <h3 className="text-lg font-bold text-white uppercase tracking-wider">Comments & Collaboration</h3>
               </div>
               
               <div className="bg-zinc-900/50 rounded-3xl border border-zinc-800/50 p-8 space-y-8 premium-shadow">
                  {comments.length === 0 ? (
                    <div className="text-center py-12">
                       <MessageSquare className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
                       <p className="text-zinc-500 font-medium">No comments yet. Start the conversation!</p>
                    </div>
                  ) : (
                    <div className="space-y-8">
                       {comments.map((comment) => (
                         <div key={comment.id} className="flex gap-4">
                            <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-white font-bold border border-zinc-700">
                               {comment.full_name.charAt(0)}
                            </div>
                            <div className="flex-1 space-y-2">
                               <div className="flex items-center justify-between">
                                  <span className="text-sm font-bold text-white">{comment.full_name}</span>
                                  <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{new Date(comment.created_at).toLocaleDateString()}</span>
                               </div>
                               <div className="bg-zinc-950/50 p-4 rounded-2xl border border-zinc-800/50 text-sm text-zinc-300">
                                  {comment.content}
                                </div>
                            </div>
                         </div>
                       ))}
                    </div>
                  )}

                  <div className="pt-6 border-t border-zinc-800/50">
                     <div className="relative">
                        <textarea 
                           value={commentContent}
                           onChange={(e) => setCommentContent(e.target.value)}
                           placeholder="Type your message..." 
                           className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 pr-16 text-sm text-zinc-300 focus:ring-2 focus:ring-blue-600 outline-none min-h-[100px] transition-all"
                        />
                        <button 
                          disabled={isLoading || !commentContent.trim()}
                          onClick={handlePostComment}
                          className="absolute bottom-4 right-4 p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
                        >
                           <Send className="w-5 h-5" />
                        </button>
                     </div>
                  </div>
               </div>
            </div>
          </div>

          {/* Sidebar Meta Info */}
          <div className="w-full lg:w-80 space-y-6">
             <div className="bg-zinc-900/50 rounded-3xl border border-zinc-800/50 p-6 space-y-6 premium-shadow">
                <div className="space-y-4">
                   <div className="flex items-center justify-between group">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Assignee</span>
                      <div className="flex items-center gap-2">
                         <span className="text-xs font-bold text-white">{task.assigned_name || 'Unassigned'}</span>
                         <div className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] font-bold text-zinc-500">
                            {task.assigned_name ? task.assigned_name.charAt(0) : '?'}
                         </div>
                      </div>
                   </div>
                   <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Due Date</span>
                      <div className="flex items-center gap-2 text-zinc-300">
                         <Calendar className="w-3.5 h-3.5" />
                         <span className="text-xs font-bold">{task.due_date ? new Date(task.due_date).toLocaleDateString() : 'None'}</span>
                      </div>
                   </div>
                   <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Stage</span>
                      <span className="text-xs font-bold text-blue-500">{task.workflow_stage || 'Backlog'}</span>
                   </div>
                </div>

                <div className="pt-6 border-t border-zinc-800/50 space-y-4">
                   <h4 className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em]">Quick Actions</h4>
                   <div className="grid grid-cols-1 gap-2">
                      <button 
                        disabled={isLoading}
                        onClick={() => handleUpdateStatus('in_progress')}
                        className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-xl transition-all border border-zinc-700 disabled:opacity-50"
                      >
                         Mark In Progress
                      </button>
                      <button 
                        disabled={isLoading}
                        onClick={() => handleUpdateStatus('blocked')}
                        className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-xl transition-all border border-zinc-700 disabled:opacity-50"
                      >
                         Mark as Blocked
                      </button>
                      <button 
                        disabled={isLoading}
                        onClick={() => handleUpdateStatus('done')}
                        className="w-full py-2.5 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-500 text-xs font-bold rounded-xl transition-all border border-emerald-600/20 disabled:opacity-50"
                      >
                         Complete Task
                      </button>
                   </div>
                </div>
             </div>

             <div className="bg-zinc-900/50 rounded-3xl border border-zinc-800/50 p-6 premium-shadow">
                <div className="flex items-center justify-between mb-4">
                   <h4 className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest leading-none">Attachments</h4>
                   <Plus className="w-4 h-4 text-zinc-500 cursor-pointer hover:text-white" />
                </div>
                <div className="text-center py-6 border border-dashed border-zinc-800 rounded-2xl">
                   <Paperclip className="w-8 h-8 text-zinc-800 mx-auto mb-2" />
                   <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">No files attached</p>
                </div>
             </div>
          </div>
        </div>
      </main>
    </>
  );
}
