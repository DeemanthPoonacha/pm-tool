'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Label, Input, Textarea, Select } from '@/components/ui/forms';
import { useRouter } from 'next/navigation';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: { id: string, name: string }[];
  developers: { id: string, full_name: string }[];
}

export function CreateTaskModal({ isOpen, onClose, projects, developers }: CreateTaskModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectId: projects[0]?.id || '',
    assignedTo: developers[0]?.id || '',
    createdBy: 'u_admin', // Mocking as admin for now
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.refresh();
        onClose();
        setFormData({ 
          title: '', 
          description: '', 
          projectId: projects[0]?.id || '', 
          assignedTo: developers[0]?.id || '',
          createdBy: 'u_admin'
        });
      }
    } catch (error) {
      console.error('Failed to create task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Task">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Label htmlFor="title">Task Title</Label>
          <Input 
            id="title" 
            required 
            placeholder="e.g. Implement Login Screen"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="projectId">Project</Label>
            <Select 
              id="projectId" 
              required
              value={formData.projectId}
              onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
            >
              {projects.map(project => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="assignedTo">Assign To</Label>
            <Select 
              id="assignedTo" 
              value={formData.assignedTo}
              onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
            >
              <option value="">Unassigned</option>
              {developers.map(dev => (
                <option key={dev.id} value={dev.id}>{dev.full_name}</option>
              ))}
            </Select>
          </div>
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea 
            id="description" 
            placeholder="What needs to be done?"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={isLoading}>Create Task</Button>
        </div>
      </form>
    </Modal>
  );
}
