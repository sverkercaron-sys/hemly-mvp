export function LoadingState({ text = "Loading..." }: { text?: string }) {
  return <div className="card p-6 text-sm font-semibold text-slate-600">{text}</div>;
}

export function EmptyState({ text }: { text: string }) {
  return <div className="card p-6 text-sm font-semibold text-slate-600">{text}</div>;
}

export function ErrorState({ text }: { text: string }) {
  return <div className="card border-rose-200 bg-rose-50 p-6 text-sm font-semibold text-rose-700">{text}</div>;
}
