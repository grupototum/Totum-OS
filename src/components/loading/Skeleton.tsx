interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
}

export function Skeleton({
  className = 'h-12 w-full',
  variant = 'rectangular',
}: SkeletonProps) {
  const baseClasses = 'bg-zinc-800 animate-pulse rounded';

  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full aspect-square',
    rectangular: 'rounded',
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      aria-busy="true"
      aria-label="Loading..."
    />
  );
}

export { Skeleton as default };
