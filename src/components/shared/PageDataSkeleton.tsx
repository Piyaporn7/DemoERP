import { Skeleton } from "@/components/ui/skeleton";

interface PageDataSkeletonProps {
  rows?: number;
}

export function PageDataSkeleton({ rows = 6 }: PageDataSkeletonProps) {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-96" />
      <div className="space-y-2">
        {Array.from({ length: rows }, (_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    </div>
  );
}
