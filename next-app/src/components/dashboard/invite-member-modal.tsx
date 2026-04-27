'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Label, Input, Select } from '@/components/ui/forms';
import { useRouter } from 'next/navigation';

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ROLES = [
  { value: 'admin', label: 'Admin' },
  { value: 'client', label: 'Client' },
  { value: 'pm', label: 'Project Manager' },
  { value: 'ba', label: 'Business Analyst' },
  { value: 'developer', label: 'Developer' },
  { value: 'product_manager', label: 'Product Manager' },
  { value: 'delivery_head', label: 'Delivery Head' },
];

export function InviteMemberModal({ isOpen, onClose }: InviteMemberModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: 'developer',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.refresh();
        onClose();
        setFormData({ fullName: '', email: '', role: 'developer' });
      }
    } catch (error) {
      console.error('Failed to invite member:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Invite Team Member">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Label htmlFor="fullName">Full Name</Label>
          <Input 
            id="fullName" 
            required 
            placeholder="e.g. Robert Martin"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input 
            id="email" 
            type="email"
            required 
            placeholder="robert@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="role">Role</Label>
          <Select 
            id="role" 
            required
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          >
            {ROLES.map(role => (
              <option key={role.value} value={role.value}>{role.label}</option>
            ))}
          </Select>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={isLoading}>Send Invitation</Button>
        </div>
      </form>
    </Modal>
  );
}
