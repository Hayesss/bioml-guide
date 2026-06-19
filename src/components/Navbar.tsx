import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Microscope, Library, Wrench, Sigma, Zap, Menu, X, Search, Dna, Glasses } from 'lucide-react';

const navGroups = [
  {
    items: [
      { path: '/roadmap', label: '路径', icon: BookOpen },
      { path: '/ngs', label: 'NGS', icon: Dna },
      { path: '/applications', label: '应用', icon: Microscope },
      { path: '/intro', label: '背景', icon: Glasses },
    ],
  },
  {
    items: [
      { path: '/math', label: '数学', icon: Sigma },
      { path: '/tools', label: '工具', icon: Wrench },
      { path: '/resources', label: '资源', icon: Library },
      { path: '/cheatsheet', label: '速查', icon: Zap },
    ],
  },
];

interface NavbarProps {
  onSearch?: () => void;
}

export default function Navbar({ onSearch }: NavbarProps) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-14 bg-white border-b border-brand-border">
      <div className="max-w-[1100px] mx-auto px-6 flex items-center justify-between h-full">
        <Link
          to="/"
          className="font-semibold text-base no-underline text-brand-ink"
        >
          BioML Guide
        </Link>

        <div className="hidden md:flex items-center gap-2">
          {navGroups.map((group, gi) => (
            <div key={gi} className="flex items-center gap-2">
              {gi > 0 && (
                <div className="w-px h-4 bg-brand-border-light" />
              )}
              {group.items.map((item) => {
                const active = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative flex items-center gap-1 text-[11px] font-medium no-underline transition-colors whitespace-nowrap ${active ? 'text-brand-accent' : 'text-brand-ink-light'}`}
                  >
                    <item.icon size={12} />
                    {item.label}
                    {active && (
                      <span className="absolute -bottom-4 left-0 right-0 h-0.5 bg-brand-accent" />
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
          <div className="w-px h-4 bg-brand-border-light" />
          <button
            onClick={onSearch}
            className="flex items-center gap-1 text-[11px] border rounded-md px-2 py-1.5 hover:bg-gray-50 transition-colors text-brand-ink-muted border-brand-border whitespace-nowrap"
          >
            <Search size={12} />
            搜索
            <kbd className="hidden lg:inline text-[10px] px-1 py-0.5 rounded border font-mono border-brand-border bg-brand-off-white">
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
          {navGroups.map((group, gi) => (
            <div key={gi}>
              {gi > 0 && <div className="border-t border-brand-border-light pt-3 mt-3" />}
              <div className="space-y-3">
                {group.items.map((item) => {
                  const active = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-2 py-1.5 text-sm font-medium no-underline ${active ? 'text-brand-accent' : 'text-brand-ink-light'}`}
                      onClick={() => setMobileOpen(false)}
                    >
                      <item.icon size={15} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
          <div className="pt-2 border-t border-brand-border-light">
            <button
              onClick={() => { setMobileOpen(false); onSearch?.(); }}
              className="flex items-center gap-2 py-1.5 text-sm font-medium text-brand-ink-light w-full text-left"
            >
              <Search size={15} />
              搜索
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
