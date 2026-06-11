import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Microscope, Library, Wrench, Sigma, Zap, Menu, X, Search, Dna } from 'lucide-react';

const navItems = [
  { path: '/roadmap', label: '学习路径', icon: BookOpen },
  { path: '/ngs', label: '生信NGS', icon: Dna },
  { path: '/applications', label: '应用方向', icon: Microscope },
  { path: '/resources', label: '资源库', icon: Library },
  { path: '/tools', label: '工具', icon: Wrench },
  { path: '/math', label: '数学直觉', icon: Sigma },
  { path: '/cheatsheet', label: '速查', icon: Zap },
];

interface NavbarProps {
  onSearch?: () => void;
}

export default function Navbar({ onSearch }: NavbarProps) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-brand-border" style={{ height: 56 }}>
      <div className="max-w-[1100px] mx-auto px-6 flex items-center justify-between h-full">
        <Link
          to="/home"
          className="font-semibold text-base no-underline text-brand-ink"
        >
          BioML Guide
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="relative flex items-center gap-1.5 text-sm font-medium no-underline transition-colors"
                style={{ color: active ? '#1E3A5F' : '#4A4A4A' }}
              >
                <item.icon size={15} />
                {item.label}
                {active && (
                  <span className="absolute -bottom-4 left-0 right-0 h-0.5 bg-brand-accent" />
                )}
              </Link>
            );
          })}
          <button
            onClick={onSearch}
            className="flex items-center gap-1.5 text-sm border rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors text-brand-ink-muted border-brand-border"
          >
            <Search size={14} />
            <span className="hidden lg:inline">搜索</span>
            <kbd className="hidden lg:inline text-xs px-1 py-0.5 rounded border font-mono ml-1 border-brand-border bg-brand-off-white">
              Ctrl+K
            </kbd>
          </button>
        </div>

        <button
          className="md:hidden p-1 text-brand-ink-light"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-b px-6 py-4 space-y-3 border-brand-border">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center gap-2 py-1.5 text-sm font-medium no-underline"
                style={{ color: active ? '#1E3A5F' : '#4A4A4A' }}
                onClick={() => setMobileOpen(false)}
              >
                <item.icon size={15} />
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
