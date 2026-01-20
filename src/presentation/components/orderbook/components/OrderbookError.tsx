interface OrderbookErrorProps {
  error: Error;
}

export function OrderbookError({ error }: OrderbookErrorProps) {
  return (
    <div className="flex h-full items-center justify-center rounded-lg border border-ask bg-ask/5 p-8">
      <div className="text-center">
        <p className="text-lg font-semibold text-ask">Error</p>
        <p className="mt-2 text-sm text-text-secondary">{error.message}</p>
      </div>
    </div>
  );
}
