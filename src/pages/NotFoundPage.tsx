import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <p className="text-6xl font-bold text-brand-border">404</p>
      <p className="text-base text-brand-ink-muted">页面不存在</p>
      <Link
        to="/"
        className="text-sm px-4 py-2 rounded-lg bg-brand-accent text-white no-underline hover:opacity-90 transition-opacity"
      >
        返回首页
      </Link>
    </div>
  );
}
