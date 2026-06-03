import React from 'react';
import { CreatedBy } from '../types';
import { getUserColor, getInitials } from '../lib/user-display';
import { cn } from '../lib/utils';

export function UserBadge({ user, label, className }: {
  user?: CreatedBy | null;
  label?: string;
  className?: string;
}) {
  if (!user) return null;

  const color = getUserColor(user.email);
  const initials = getInitials(user.email);

  return (
    <div className={cn('flex items-center gap-1.5 text-[10px] text-elegant-dim', className)}>
      {label && <span>{label}:</span>}
      <div
        className="w-4 h-4 rounded-full flex items-center justify-center text-[7px] font-bold text-white"
        style={{ backgroundColor: color }}
        title={user.email}
      >
        {initials}
      </div>
      <span className="truncate max-w-[100px]">{user.email.split('@')[0]}</span>
    </div>
  );
}
