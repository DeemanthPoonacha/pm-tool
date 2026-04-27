'use client';

import { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface RequirementActionsProps {
  requirementId: string;
}

export function RequirementActions({ requirementId }: RequirementActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async (action: 'approve' | 'reject') => {
    setIsLoading(true);
    try {
      await fetch('/api/requirements', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: requirementId, action, userId: 'u_pdm1' }),
      });
      router.refresh();
    } catch (error) {
      console.error(`Failed to ${action} requirement:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button 
        disabled={isLoading}
        onClick={() => handleAction('approve')}
        className="p-2 text-zinc-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-all" 
        title="Approve"
      >
        <CheckCircle className="w-5 h-5" />
      </button>
      <button 
        disabled={isLoading}
        onClick={() => handleAction('reject')}
        className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all" 
        title="Reject"
      >
        <XCircle className="w-5 h-5" />
      </button>
    </>
  );
}
