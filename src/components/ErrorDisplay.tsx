interface ErrorDisplayProps {
  message?: string;
}

export default function ErrorDisplay({ message = '数据加载失败，请刷新页面重试' }: ErrorDisplayProps) {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="text-center">
        <p className="text-sm text-brand-error mb-2">{message}</p>
        <button
          onClick={() => window.location.reload()}
          className="text-xs px-3 py-1.5 rounded border border-brand-border text-brand-ink-muted hover:bg-brand-off-white transition-colors"
        >
          刷新页面
        </button>
      </div>
    </div>
  );
}
