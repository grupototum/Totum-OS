interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

export function LoadingSpinner({ size = 'md', message }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4" role="status" aria-live="polite">
      <div
        className={`${sizeClasses[size]} border-4 border-border border-t-accent rounded-full animate-spin`}
        aria-hidden="true"
      />
      {message && <p className="text-muted-foreground text-sm">{message}</p>}
    </div>
  );
}
