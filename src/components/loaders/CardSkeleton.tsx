import { Skeleton } from '@/components/ui/skeleton';

export function CardSkeleton() {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 space-y-4">
      <Skeleton className="h-4 w-3/4 bg-zinc-800" />
      <Skeleton className="h-3 w-1/2 bg-zinc-800" />
      <div className="space-y-2">
        <Skeleton className="h-3 w-full bg-zinc-800" />
        <Skeleton className="h-3 w-5/6 bg-zinc-800" />
      </div>
    </div>
  );
}
