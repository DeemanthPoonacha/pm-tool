'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Label, Input, Textarea, Select } from '@/components/ui/forms';
import { useRouter } from 'next/navigation';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  clients: { id: string, full_name: string }[];
}

export function CreateProjectModal({ isOpen, onClose, clients }: CreateProjectModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    clientId: clients[0]?.id || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.refresh();
        onClose();
        setFormData({ name: '', description: '', clientId: clients[0]?.id || '' });
      }
    } catch (error) {
      console.error('Failed to create project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Project">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Label htmlFor="name">Project Name</Label>
          <Input 
            id="name" 
            required 
            placeholder="e.g. Mobile App Redesign"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="clientId">Client</Label>
          <Select 
            id="clientId" 
            required
            value={formData.clientId}
            onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
          >
            {clients.map(client => (
              <option key={client.id} value={client.id}>{client.full_name}</option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea 
            id="description" 
            placeholder="Describe the project goals and scope..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={isLoading}>Create Project</Button>
        </div>
      </form>
    </Modal>
  );
}
