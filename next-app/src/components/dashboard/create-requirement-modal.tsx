'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Label, Input, Textarea, Select } from '@/components/ui/forms';
import { useRouter } from 'next/navigation';

interface CreateRequirementModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: { id: string, name: string }[];
}

export function CreateRequirementModal({ isOpen, onClose, projects }: CreateRequirementModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    projectId: projects[0]?.id || '',
    createdBy: 'u_ba1', // Mocking as BA
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/requirements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.refresh();
        onClose();
        setFormData({ 
          title: '', 
          content: '', 
          projectId: projects[0]?.id || '', 
          createdBy: 'u_ba1'
        });
      }
    } catch (error) {
      console.error('Failed to create requirement:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Requirement">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Label htmlFor="title">Requirement Title</Label>
          <Input 
            id="title" 
            required 
            placeholder="e.g. User Authentication Flow"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>
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
          <Label htmlFor="content">Requirement Content</Label>
          <Textarea 
            id="content" 
            placeholder="Define the functional and non-functional requirements..."
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={isLoading}>Create Requirement</Button>
        </div>
      </form>
    </Modal>
  );
}
