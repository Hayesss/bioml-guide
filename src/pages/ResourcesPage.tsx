import { useState } from 'react';
import { useData } from '../hooks/useData';
import { Search, Filter } from 'lucide-react';

interface Resource {
  id: string;
  name: string;
  author: string;
  category: string;
  level: string;
  cost: string;
  type: string;
  description: string;
  url: string;
  tags: string[];
}

interface ResourcesData {
  categories: string[];
  levels: string[];
  costs: string[];
  resources: Resource[];
}

export default function ResourcesPage() {
  const { data, loading, error } = useData<ResourcesData>('resources');
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('全部');
  const [level, setLevel] = useState('全部');
  const [cost, setCost] = useState('全部');

  if (loading) return <div className="p-8 text-sm text-brand-ink-muted">Loading...</div>;
  if (error || !data) return <div className="p-8 text-sm text-brand-error">{error || '加载数据失败'}</div>;

  const { categories, levels, costs, resources } = data;

  const filtered = resources.filter((r) => {
    if (cat !== '全部' && r.category !== cat) return false;
    if (level !== '全部' && r.level !== level) return false;
    if (cost !== '全部' && r.cost !== cost) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        r.name.toLowerCase().includes(q) ||
        r.author.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold mb-3 text-brand-ink">资源库</h1>
        <p className="text-base text-brand-ink-muted">
          精选课程、书籍、论文和视频教程，覆盖ML/DL全学习路径
        </p>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-ink-muted" />
        <input
          type="text"
          placeholder="搜索资源名称、作者或关键词..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 border rounded-lg text-sm outline-none border-brand-border text-brand-ink bg-white"
        />
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Filter size={12} className="text-brand-ink-muted" />
            <span className="text-xs font-medium text-brand-ink-muted">分类</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border"
                style={{
                  backgroundColor: cat === c ? '#1E3A5F' : '#FFFFFF',
                  color: cat === c ? 'white' : '#4A4A4A',
                  borderColor: cat === c ? '#1E3A5F' : '#E5E5E5',
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-6">
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Filter size={12} className="text-brand-ink-muted" />
              <span className="text-xs font-medium text-brand-ink-muted">难度</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {levels.map((l) => (
                <button
                  key={l}
                  onClick={() => setLevel(l)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border"
                  style={{
                    backgroundColor: level === l ? '#1E3A5F' : '#FFFFFF',
                    color: level === l ? 'white' : '#4A4A4A',
                    borderColor: level === l ? '#1E3A5F' : '#E5E5E5',
                  }}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Filter size={12} className="text-brand-ink-muted" />
              <span className="text-xs font-medium text-brand-ink-muted">费用</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {costs.map((c) => (
                <button
                  key={c}
                  onClick={() => setCost(c)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border"
                  style={{
                    backgroundColor: cost === c ? '#1E3A5F' : '#FFFFFF',
                    color: cost === c ? 'white' : '#4A4A4A',
                    borderColor: cost === c ? '#1E3A5F' : '#E5E5E5',
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="text-xs text-brand-ink-muted">
        共 {filtered.length} 个资源
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((r) => (
          <div
            key={r.id}
            className="border rounded-lg p-5 hover:shadow-sm transition-shadow border-brand-border"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded font-medium bg-brand-accent-light text-brand-accent">
                  {r.category}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-brand-off-white text-brand-ink-muted">
                  {r.level}
                </span>
              </div>
              <span
                className="text-xs px-2 py-0.5 rounded"
                style={{
                  backgroundColor: r.cost === '免费' ? '#E8F0E9' : '#F5F5F0',
                  color: r.cost === '免费' ? '#2D5A3D' : '#8A8A8A',
                }}
              >
                {r.cost}
              </span>
            </div>
            <h3 className="text-sm font-semibold mb-1 text-brand-ink">
              <a href={r.url} target="_blank" rel="noopener noreferrer" className="no-underline hover:underline text-brand-accent">
                {r.name}
              </a>
            </h3>
            <p className="text-xs mb-2 text-brand-ink-muted">{r.author}</p>
            <p className="text-sm mb-3 text-brand-ink-light" style={{ lineHeight: 1.7 }}>
              {r.description}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {r.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded border border-brand-border-light text-brand-ink-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-sm text-brand-ink-muted">没有找到匹配的资源</p>
        </div>
      )}

      <section className="border rounded-lg p-6 border-brand-border">
        <h2 className="text-lg font-bold mb-5 text-brand-ink">学习路径推荐</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-lg p-5 bg-brand-accent-light">
            <h3 className="text-sm font-semibold mb-3 text-brand-accent">机器学习路径</h3>
            <ol className="space-y-2">
              {[
                'Andrew Ng 机器学习课程 (建立基础概念)',
                'ISLR 统计学习导论 (理论+实践)',
                'scikit-learn 官方文档 (工具熟练)',
                'Hands-On ML 第1部分 (ML项目实战)',
                'XGBoost + SHAP (高级工具)',
              ].map((step, i) => (
                <li key={i} className="text-sm flex items-start gap-2 text-brand-ink-light">
                  <span className="font-mono text-xs font-medium mt-0.5 text-brand-accent">{i + 1}.</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-lg p-5 bg-brand-dl-light">
            <h3 className="text-sm font-semibold mb-3 text-brand-dl">深度学习路径</h3>
            <ol className="space-y-2">
              {[
                '3Blue1Brown 神经网络系列 (建立直觉)',
                'Fast.ai Part 1 (快速实践)',
                'D2L 动手学深度学习 (系统学习)',
                'Stanford CS231n (CNN深入理解)',
                'Hugging Face NLP Course (Transformer)',
              ].map((step, i) => (
                <li key={i} className="text-sm flex items-start gap-2 text-brand-ink-light">
                  <span className="font-mono text-xs font-medium mt-0.5 text-brand-dl">{i + 1}.</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </div>
  );
}
