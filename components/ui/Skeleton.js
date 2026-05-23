export default function Skeleton({ className = '' }) {
  return (
    <div className={`shimmer bg-white/5 rounded-lg animate-pulse ${className}`} />
  );
}

export function SkeletonCard() {
  return (
    <div className="glass rounded-2xl p-4 space-y-3">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-3 w-24" />
    </div>
  );
}
