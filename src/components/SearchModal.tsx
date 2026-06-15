import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

interface SearchItem {
  label: string;
  snippet: string;
  path: string;
  category: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onToggle?: () => void;
}

// Simple fuzzy match: checks if all query chars appear in order (case-insensitive)
function fuzzyMatch(text: string, query: string): boolean {
  const t = text.toLowerCase();
  const q = query.toLowerCase();
  let qi = 0;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) qi++;
  }
  return qi === q.length;
}

function buildIndex(
  tools: { name: string; description?: string }[],
  resources: { name: string; author: string; type: string; level: string }[],
  roadmapStages: { id: number; name: string; description?: string; mlTopics?: { name: string; description?: string }[]; dlTopics?: { name: string; description?: string }[]; mathTopics?: { name: string; description?: string }[]; bioinfoTopics?: { name: string; description?: string }[]; projects?: { name: string; description?: string }[] }[],
  applications: { name: string; description?: string; mlMethods?: { name: string }[]; dlMethods?: { name: string }[]; datasets?: { name: string; description?: string; size: string }[] }[],
  mathTopics: { name: string; description?: string; keyConcepts?: { name: string; description?: string }[] }[],
  topics: { key: string; name: string; type?: string; stage?: number; sections?: { type: string; title: string; content?: string }[] }[],
): SearchItem[] {
  const items: SearchItem[] = [];

  // Build category labels from topic type
  const typeCategory: Record<string, string> = {
    ml: 'ML专题',
    dl: 'DL专题',
    math: '数学专题',
    bioinfo: '生信专题',
    ngs: 'NGS流程',
  };

  for (const topic of topics) {
    const cat = typeCategory[topic.type || ''] || '学习专题';
    items.push({
      label: topic.name,
      snippet: (topic.sections || []).find(s => s.content)?.content?.replace(/<[^>]*>/g, '').slice(0, 80) || `阶段${topic.stage || '?'} · ${cat}`,
      path: `/learn/${topic.key}`,
      category: cat,
    });
    // Also index section titles so users can find specific sections
    for (const section of topic.sections || []) {
      if (section.title && section.title !== topic.name) {
        items.push({
          label: `${topic.name} › ${section.title}`,
          snippet: section.content?.replace(/<[^>]*>/g, '').slice(0, 80) || '',
          path: `/learn/${topic.key}`,
          category: '专题小节',
        });
      }
    }
  }

  for (const tool of tools) {
    items.push({
      label: tool.name,
      snippet: tool.description?.slice(0, 80) || '',
      path: '/tools',
      category: '工具',
    });
  }

  for (const res of resources) {
    items.push({
      label: res.name,
      snippet: `${res.author} · ${res.type} · ${res.level}`,
      path: '/resources',
      category: '资源',
    });
  }

  for (const stage of roadmapStages) {
    items.push({
      label: `阶段${stage.id}: ${stage.name}`,
      snippet: stage.description || '',
      path: '/roadmap',
      category: '学习路径',
    });
    for (const t of stage.mlTopics || []) {
      items.push({
        label: t.name,
        snippet: t.description?.slice(0, 80) || '',
        path: '/roadmap',
        category: 'ML概念',
      });
    }
    for (const t of stage.dlTopics || []) {
      items.push({
        label: t.name,
        snippet: t.description?.slice(0, 80) || '',
        path: '/roadmap',
        category: 'DL概念',
      });
    }
    for (const t of stage.mathTopics || []) {
      items.push({
        label: t.name,
        snippet: t.description?.slice(0, 80) || '',
        path: '/roadmap',
        category: '数学',
      });
    }
    for (const t of stage.bioinfoTopics || []) {
      items.push({
        label: t.name,
        snippet: t.description?.slice(0, 80) || '',
        path: '/ngs',
        category: '生信流程',
      });
    }
    for (const p of stage.projects || []) {
      items.push({
        label: p.name,
        snippet: p.description || '',
        path: '/roadmap',
        category: '项目',
      });
    }
  }

  for (const app of applications) {
    items.push({
      label: app.name,
      snippet: app.description?.slice(0, 80) || '',
      path: '/applications',
      category: '应用方向',
    });
    for (const m of app.mlMethods || []) {
      items.push({
        label: m.name,
        snippet: `ML方法 · ${app.name}`,
        path: '/applications',
        category: 'ML方法',
      });
    }
    for (const m of app.dlMethods || []) {
      items.push({
        label: m.name,
        snippet: `DL方法 · ${app.name}`,
        path: '/applications',
        category: 'DL方法',
      });
    }
    for (const ds of app.datasets || []) {
      items.push({
        label: ds.name,
        snippet: `${ds.description} (${ds.size})`,
        path: '/applications',
        category: '数据集',
      });
    }
  }

  for (const topic of mathTopics) {
    items.push({
      label: topic.name,
      snippet: topic.description?.slice(0, 80) || '',
      path: '/math',
      category: '数学直觉',
    });
    for (const c of topic.keyConcepts || []) {
      items.push({
        label: c.name,
        snippet: c.description?.slice(0, 80) || '',
        path: '/math',
        category: '数学概念',
      });
    }
  }

  return items;
}

export default function SearchModal({ isOpen, onClose, onToggle }: SearchModalProps) {
  const [inputValue, setInputValue] = useState('');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchItem[]>([]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [index, setIndex] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Debounce input value → query (200ms)
  useEffect(() => {
    const timer = setTimeout(() => setQuery(inputValue), 200);
    return () => clearTimeout(timer);
  }, [inputValue]);

  // Load search index on first open (fetch-on-demand, intentional pattern)
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (isOpen && index.length === 0 && !loading) {
      setLoading(true);
      Promise.all([
        fetch(`${import.meta.env.BASE_URL}data/tools.json`).then(r => r.json()),
        fetch(`${import.meta.env.BASE_URL}data/resources.json`).then(r => r.json()),
        fetch(`${import.meta.env.BASE_URL}data/roadmap.json`).then(r => r.json()),
        fetch(`${import.meta.env.BASE_URL}data/applications.json`).then(r => r.json()),
        fetch(`${import.meta.env.BASE_URL}data/math.json`).then(r => r.json()),
        fetch(`${import.meta.env.BASE_URL}data/topics.json`).then(r => r.json()),
      ])
        .then(([toolsData, resourcesData, roadmapData, appData, mathData, topicsData]) => {
          const idx = buildIndex(
            toolsData.tools || [],
            resourcesData.resources || [],
            roadmapData.stages || [],
            appData.applications || [],
            mathData.mathTopics || [],
            topicsData.topics || [],
          );
          setIndex(idx);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [isOpen, index.length, loading]);

  // Search (dependent state update, intentional pattern)
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const q = query.trim();
    const matched = index
      .filter(item => fuzzyMatch(item.label, q) || fuzzyMatch(item.snippet, q) || fuzzyMatch(item.category, q))
      .slice(0, 15);
    setResults(matched);
    setSelectedIdx(0);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [query, index]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        onToggle?.();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose, onToggle]);

  // Auto-focus and reset on open (intentionally in effect for focus timing)
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setResults([]);
      setSelectedIdx(0);
    }
  }, [isOpen]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const navigateTo = useCallback(
    (item: SearchItem) => {
      onClose();
      navigate(item.path);
    },
    [navigate, onClose],
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIdx(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIdx(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIdx]) {
      navigateTo(results[selectedIdx]);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/30" />
      <div
        className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border overflow-hidden border-brand-border"
        onClick={e => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-brand-border-light">
          <Search size={17} className="text-brand-ink-muted" />
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="搜索工具、方法、概念..."
            className="flex-1 bg-transparent text-sm outline-none text-brand-ink"
          />
          <kbd className="hidden sm:inline text-xs px-1.5 py-0.5 rounded border font-mono border-brand-border text-brand-ink-muted bg-brand-off-white">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto">
          {loading && (
            <div className="px-4 py-8 text-center text-sm text-brand-ink-muted">
              正在加载索引...
            </div>
          )}
          {!loading && query && results.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-brand-ink-muted">
              没有找到匹配的结果
            </div>
          )}
          {!loading && !query && (
            <div className="px-4 py-8 text-center text-sm text-brand-ink-muted">
              输入关键词搜索全站内容
            </div>
          )}
          {results.map((item, i) => (
            <button
              key={`${item.category}-${item.label}`}
              className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${i === selectedIdx ? 'bg-brand-off-white' : ''}`}
              onClick={() => navigateTo(item)}
              onMouseEnter={() => setSelectedIdx(i)}
            >
              <span className="text-xs px-1.5 py-0.5 rounded shrink-0 mt-0.5 bg-brand-accent-light text-brand-accent">
                {item.category}
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium truncate text-brand-ink">
                  {item.label}
                </div>
                {item.snippet && (
                  <div className="text-xs mt-0.5 truncate text-brand-ink-muted">
                    {item.snippet}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4 px-4 py-2 border-t text-xs border-brand-border-light text-brand-ink-muted">
          <span>↑↓ 导航</span>
          <span>↵ 选择</span>
          <span>Esc 关闭</span>
        </div>
      </div>
    </div>
  );
}
