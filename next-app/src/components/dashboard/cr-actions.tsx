'use client';

import { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CRActionsProps {
  crId: string;
}

export function CRActions({ crId }: CRActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async (action: 'approve' | 'reject') => {
    setIsLoading(true);
    try {
      await fetch('/api/change-requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: crId, 
          action, 
          userId: 'u_pm1',
          impact: action === 'approve' ? 'Medium' : null,
          rejectionReason: action === 'reject' ? 'Out of scope for current sprint' : null
        }),
      });
      router.refresh();
    } catch (error) {
      console.error(`Failed to ${action} CR:`, error);
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
