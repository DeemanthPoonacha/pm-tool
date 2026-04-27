'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { CreateProjectModal } from './create-project-modal';

export function NewProjectButton({ clients }: { clients: { id: string, full_name: string }[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="flex items-center gap-2">
        <Plus className="w-4 h-4" />
        New Project
      </Button>
      <CreateProjectModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        clients={clients} 
      />
    </>
  );
}
