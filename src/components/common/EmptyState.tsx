'use client';

import { InboxIcon } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  message: string;
  icon?: React.ReactNode;
}

export function EmptyState({ 
  title = 'No data found', 
  message,
  icon 
}: EmptyStateProps) {
  return (
    <div className="rounded-lg border border-border bg-muted/30 p-12 text-center">
      <div className="flex justify-center mb-4">
        {icon || <InboxIcon className="h-12 w-12 text-muted-foreground" />}
      </div>
      <h3 className="font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
