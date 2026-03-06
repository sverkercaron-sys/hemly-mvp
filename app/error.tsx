"use client";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <section className="card space-y-3 border-rose-200 bg-rose-50 p-6">
      <h2 className="text-lg font-semibold text-rose-800">Something went wrong</h2>
      <p className="text-sm text-rose-700">{error.message}</p>
      <button onClick={reset} className="button-secondary">
        Retry
      </button>
    </section>
  );
}
