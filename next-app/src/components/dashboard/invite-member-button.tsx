'use client';

import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { InviteMemberModal } from './invite-member-modal';

export function InviteMemberButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)} 
        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95"
      >
        <UserPlus className="w-4 h-4" />
        Invite Member
      </button>
      <InviteMemberModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
      />
    </>
  );
}
