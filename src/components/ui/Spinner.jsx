import { cn } from '../../lib/utils';

export function Spinner({ size = 'md', className }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-current border-t-transparent text-brand-500',
        sizes[size],
        className
      )}
    />
  );
}

export function LoadingScreen({ message = 'Loading...' }) {
  return (
    <div className="fixed inset-0 bg-dark-950 flex flex-col items-center justify-center z-50">
      <div className="relative">
        {/* Outer glow */}
        <div className="absolute inset-0 animate-pulse">
          <div className="w-16 h-16 rounded-full bg-brand-500/20 blur-xl" />
        </div>

        {/* Spinner */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-dark-700" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-brand-500 animate-spin" />
        </div>
      </div>

      <p className="mt-6 text-gray-400 animate-pulse">{message}</p>
    </div>
  );
}

export function LoadingDots() {
  return (
    <span className="inline-flex gap-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-current animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  );
}

export function Skeleton({ className }) {
  return (
    <div
      className={cn(
        'animate-pulse bg-dark-600 rounded',
        className
      )}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="card p-6 space-y-4">
      <Skeleton className="h-10 w-10 rounded-xl" />
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}
