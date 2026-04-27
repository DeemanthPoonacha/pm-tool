'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { CreateRequirementModal } from './create-requirement-modal';

interface NewRequirementButtonProps {
  projects: { id: string, name: string }[];
}

export function NewRequirementButton({ projects }: NewRequirementButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="flex items-center gap-2">
        <Plus className="w-4 h-4" />
        New Requirement
      </Button>
      <CreateRequirementModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        projects={projects}
      />
    </>
  );
}
