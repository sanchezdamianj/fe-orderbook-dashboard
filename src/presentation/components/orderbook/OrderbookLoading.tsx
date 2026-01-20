export function OrderbookLoading() {
  return (
    <div className="flex h-full flex-col items-center justify-center rounded-lg border border-border bg-surface p-8">
      <div className="relative">
        <div className="absolute inset-0 h-12 w-12 animate-spin rounded-full border-[3px] border-brand/30 blur-sm" />
        <div className="relative h-12 w-12 animate-spin rounded-full border-[3px] border-brand/20 border-t-brand" />
      </div>
    </div>
  );
}
