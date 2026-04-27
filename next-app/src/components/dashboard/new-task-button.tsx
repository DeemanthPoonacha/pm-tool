'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { CreateTaskModal } from './create-task-modal';

interface NewTaskButtonProps {
  projects: { id: string, name: string }[];
  developers: { id: string, full_name: string }[];
  variant?: 'primary' | 'ghost';
}

export function NewTaskButton({ projects, developers, variant = 'primary' }: NewTaskButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)} 
        className={variant === 'primary' 
          ? "flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95"
          : "flex items-center gap-2 px-4 py-2 bg-zinc-900 text-zinc-400 border border-zinc-800 rounded-xl hover:text-white transition-colors"
        }
      >
        <Plus className="w-4 h-4" />
        New Task
      </button>
      <CreateTaskModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        projects={projects} 
        developers={developers}
      />
    </>
  );
}
