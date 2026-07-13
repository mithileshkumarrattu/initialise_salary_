'use client';

import { AlertCircle, RotateCcw } from 'lucide-react';

interface ErrorFallbackProps {
  message: string;
  onRetry?: () => void;
  title?: string;
}

export function ErrorFallback({ message, onRetry, title = 'Error' }: ErrorFallbackProps) {
  return (
    <div className="rounded-lg border border-error/20 bg-error/5 p-6">
      <div className="flex items-start gap-4">
        <AlertCircle className="h-5 w-5 text-error flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{message}</p>
          {onRetry && (
            <button 
              onClick={onRetry} 
              className="mt-4 flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium border border-border rounded-lg bg-background hover:bg-muted text-foreground transition"
            >
              <RotateCcw className="h-4 w-4" />
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
