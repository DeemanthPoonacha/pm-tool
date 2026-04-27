'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { CreateCRModal } from './create-cr-modal';

export function NewCRButton({ projects }: { projects: { id: string, name: string }[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)} 
        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95"
      >
        <Plus className="w-4 h-4" />
        New Change Request
      </button>
      <CreateCRModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        projects={projects} 
      />
    </>
  );
}
