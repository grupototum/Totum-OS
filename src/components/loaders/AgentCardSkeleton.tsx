import { Skeleton } from '@/components/ui/skeleton';

export function AgentCardSkeleton() {
  return (
    <div className="rounded-lg border border-zinc-800 bg-gradient-to-br from-zinc-900 to-black p-6 space-y-4">
      {/* Header with avatar and title */}
      <div className="flex items-start gap-3">
        <Skeleton className="h-12 w-12 rounded-lg bg-zinc-800" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-32 bg-zinc-800" />
          <Skeleton className="h-3 w-24 bg-zinc-700" />
        </div>
      </div>

      {/* Status badge */}
      <Skeleton className="h-6 w-20 rounded-full bg-zinc-800" />

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-1">
            <Skeleton className="h-3 w-12 bg-zinc-800" />
            <Skeleton className="h-4 w-16 bg-zinc-700" />
          </div>
        ))}
      </div>

      {/* Footer button area */}
      <Skeleton className="h-10 w-full rounded-md bg-zinc-800" />
    </div>
  );
}
