export default function ProductSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-border overflow-hidden">
      <div className="skeleton-shimmer h-[180px] rounded-t-xl" />
      <div className="px-3.5">
        <div className="skeleton-shimmer h-3.5 w-3/4 rounded mt-3" />
        <div className="skeleton-shimmer h-5 w-1/2 rounded mt-1.5" />
      </div>
      <div className="flex gap-1.5 px-3.5 pt-2.5 pb-3.5">
        <div className="skeleton-shimmer h-8 flex-1 rounded-md" />
        <div className="skeleton-shimmer h-8 flex-1 rounded-md" />
      </div>
    </div>
  );
}
