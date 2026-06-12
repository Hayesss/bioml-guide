interface LoadingSpinnerProps {
  text?: string;
}

export default function LoadingSpinner({ text = '加载中...' }: LoadingSpinnerProps) {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="flex items-center gap-3 text-brand-ink-muted">
        <span className="w-5 h-5 border-2 border-brand-border border-t-brand-accent rounded-full animate-spin" />
        <span className="text-sm">{text}</span>
      </div>
    </div>
  );
}
