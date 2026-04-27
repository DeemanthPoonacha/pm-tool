'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { CreateProjectModal } from './create-project-modal';

export function NewProjectButton({ clients }: { clients: { id: string, full_name: string }[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)} 
        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95"
      >
        <Plus className="w-4 h-4" />
        New Project
      </button>
      <CreateProjectModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        clients={clients} 
      />
    </>
  );
}
