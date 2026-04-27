'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Label, Input, Textarea, Select } from '@/components/ui/forms';
import { useRouter } from 'next/navigation';

interface CreateCRModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: { id: string, name: string }[];
}

export function CreateCRModal({ isOpen, onClose, projects }: CreateCRModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectId: projects[0]?.id || '',
    requestedBy: 'u_client1', // Mocking as Client
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/change-requests', {
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
          requestedBy: 'u_client1'
        });
      }
    } catch (error) {
      console.error('Failed to raise CR:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Raise Change Request">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Label htmlFor="title">CR Title</Label>
          <Input 
            id="title" 
            required 
            placeholder="e.g. Add Dark Mode Support"
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
          <Label htmlFor="description">Reason for Change</Label>
          <Textarea 
            id="description" 
            placeholder="Why is this change needed and what is the expected outcome?"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={isLoading}>Raise CR</Button>
        </div>
      </form>
    </Modal>
  );
}
