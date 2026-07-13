'use client';

export function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-12 w-full rounded-lg bg-muted animate-pulse" />
      <div className="h-12 w-full rounded-lg bg-muted animate-pulse" />
      <div className="h-12 w-full rounded-lg bg-muted animate-pulse" />
      <div className="h-12 w-full rounded-lg bg-muted animate-pulse" />
    </div>
  );
}

export function LoadingCard() {
  return (
    <div className="rounded-lg border border-border bg-card p-6 space-y-4">
      <div className="h-6 w-1/3 rounded bg-muted animate-pulse" />
      <div className="h-4 w-full rounded bg-muted animate-pulse" />
      <div className="h-4 w-2/3 rounded bg-muted animate-pulse" />
    </div>
  );
}

export function LoadingTable() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-10 w-full rounded bg-muted animate-pulse" />
      ))}
    </div>
  );
}
