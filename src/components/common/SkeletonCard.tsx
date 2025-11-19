export function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-lg border border-border bg-background p-4">
      <div className="flex items-start gap-3">
        <div className="mt-1.5 h-2 w-2 rounded-full bg-muted" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 rounded bg-muted" />
          <div className="h-3 w-full rounded bg-muted" />
          <div className="h-3 w-1/2 rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}

