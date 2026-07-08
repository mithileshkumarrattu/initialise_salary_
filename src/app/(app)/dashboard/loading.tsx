export default function DashboardLoading() {
  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-6xl mx-auto animate-pulse">
      {/* Header Skeleton */}
      <div>
        <div className="h-8 bg-muted rounded w-1/4 mb-2"></div>
        <div className="h-4 bg-muted rounded w-1/6"></div>
      </div>

      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-2xl h-48"></div>
        <div className="bg-card border border-border rounded-2xl h-48"></div>
        <div className="bg-card border border-border rounded-2xl h-48"></div>
      </div>

      {/* Main Content Skeleton */}
      <div className="bg-card border border-border rounded-2xl h-64"></div>
    </div>
  );
}
