import React from 'react';

interface SkeletonProps {
  className?: string;
  lines?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => (
  <div className={`shimmer-bg bg-white/5 rounded-lg ${className}`} />
);

export const CardSkeleton: React.FC = () => (
  <div className="glass-card p-6 space-y-4 animate-pulse">
    <Skeleton className="h-4 w-2/3" />
    <Skeleton className="h-8 w-1/2" />
    <Skeleton className="h-3 w-full" />
    <Skeleton className="h-3 w-3/4" />
  </div>
);

export const DashboardSkeleton: React.FC = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => <CardSkeleton key={i} />)}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="glass-card p-6 h-64 animate-pulse">
        <Skeleton className="h-4 w-1/3 mb-4" />
        <Skeleton className="h-full" />
      </div>
      <div className="glass-card p-6 h-64 animate-pulse">
        <Skeleton className="h-4 w-1/3 mb-4" />
        <Skeleton className="h-full" />
      </div>
    </div>
  </div>
);

const LoadingSkeleton = { Skeleton, CardSkeleton, DashboardSkeleton };
export default LoadingSkeleton;
