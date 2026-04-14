import { Skeleton } from '@/components/ui/skeleton';

export function PanelSkeleton() {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6 space-y-6">
      {/* Title */}
      <Skeleton className="h-7 w-48 bg-zinc-800" />

      {/* Tabs */}
      <div className="flex gap-2 border-b border-zinc-800">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-24 bg-zinc-800" />
        ))}
      </div>

      {/* Content */}
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-32 bg-zinc-800" />
            <Skeleton className="h-10 w-full bg-zinc-800" />
          </div>
        ))}
      </div>
    </div>
  );
}
