'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { CreateTaskModal } from './create-task-modal';

interface NewTaskButtonProps {
  projects: { id: string, name: string }[];
  developers: { id: string, full_name: string }[];
}

export function NewTaskButton({ projects, developers }: NewTaskButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="flex items-center gap-2">
        <Plus className="w-4 h-4" />
        New Task
      </Button>
      <CreateTaskModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        projects={projects} 
        developers={developers}
      />
    </>
  );
}
