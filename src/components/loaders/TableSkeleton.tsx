import { Skeleton } from '@/components/ui/skeleton';

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export function TableSkeleton({ rows = 5, columns = 4 }: TableSkeletonProps) {
  return (
    <div className="space-y-2 border border-zinc-800 rounded-lg p-4 bg-zinc-900">
      {/* Header */}
      <div className="flex gap-4 pb-4 border-b border-zinc-800">
        {[...Array(columns)].map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1 bg-zinc-800" />
        ))}
      </div>

      {/* Rows */}
      {[...Array(rows)].map((_, rowIdx) => (
        <div key={rowIdx} className="flex gap-4">
          {[...Array(columns)].map((_, colIdx) => (
            <Skeleton key={colIdx} className="h-10 flex-1 bg-zinc-800" />
          ))}
        </div>
      ))}
    </div>
  );
}
