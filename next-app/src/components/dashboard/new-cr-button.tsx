'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { CreateCRModal } from './create-cr-modal';

interface NewCRButtonProps {
  projects: { id: string, name: string }[];
}

export function NewCRButton({ projects }: NewCRButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="flex items-center gap-2">
        <Plus className="w-4 h-4" />
        Raise CR
      </Button>
      <CreateCRModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        projects={projects}
      />
    </>
  );
}
