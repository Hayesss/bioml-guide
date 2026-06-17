import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../hooks/useData';
import { Search, Layers, Cpu, Calculator, Dna } from 'lucide-react';

interface TopicNode {
  key: string;
  name: string;
  stage: number;
  type: string;
  difficulty: string;
}

interface TopicsData {
  topicOrder: string[];
  topics: TopicNode[];
}

const stageColors: Record<number, string> = { 1: '#1E3A5F', 2: '#2D5A3D', 3: '#5B3A7B', 4: '#8B4513', 5: '#C53030', 6: '#B8860B' };
const stageNames: Record<number, string> = { 1: '基础入门', 2: '核心方法', 3: '进阶架构', 4: '专业应用', 5: '高级专题', 6: '前沿探索' };
const typeIcons: Record<string, React.ReactNode> = {
  ml: <Layers size={11} />,
  dl: <Cpu size={11} />,
  math: <Calculator size={11} />,
  bioinfo: <Dna size={11} />,
};
const typeColors: Record<string, string> = {
  ml: 'bg-brand-accent-light text-brand-accent border-brand-accent/20',
  dl: 'bg-brand-dl-light text-brand-dl border-brand-dl/20',
  math: 'bg-amber-50 text-amber-700 border-amber-200',
  bioinfo: 'bg-purple-50 text-purple-700 border-purple-200',
};

export default function GraphPage() {
  const { data, loading, error } = useData<TopicsData>('topics');
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStage, setFilterStage] = useState<number | null>(null);

  const topics = useMemo(() => {
    if (!data?.topics) return [];
    return data.topics.filter(t => t.key.startsWith('stage-'));
  }, [data]);

  const filtered = useMemo(() => {
    let result = topics;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(t => t.name.toLowerCase().includes(q) || t.key.toLowerCase().includes(q));
    }
    if (filterType !== 'all') {
      result = result.filter(t => t.type === filterType);
    }
    if (filterStage !== null) {
      result = result.filter(t => t.stage === filterStage);
    }
    return result;
  }, [topics, search, filterType, filterStage]);

  const stages = useMemo(() => {
    const s = new Set<number>();
    for (const t of topics) s.add(t.stage);
    return Array.from(s).sort();
  }, [topics]);

  const types = useMemo(() => {
    const s = new Set<string>();
    for (const t of topics) s.add(t.type);
    return Array.from(s).sort();
  }, [topics]);

  const counts = useMemo(() => {
    return { total: topics.length, filtered: filtered.length };
  }, [topics, filtered]);

  if (loading) return <div className="p-8 text-sm text-brand-ink-muted">Loading...</div>;
  if (error || !data) return <div className="p-8 text-sm text-brand-error">{error || '加载失败'}</div>;

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl font-bold mb-3 text-brand-ink">知识图谱总览</h1>
        <p className="text-base text-brand-ink-muted max-w-[700px]">
          所有 ML/DL/数学/生信 专题按阶段和类型组织。点击任意节点跳转到专题详情页
        </p>
      </header>

      {/* Search & Filters */}
      <section>
        <div className="relative mb-4">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-ink-muted" />
          <input
            type="text"
            placeholder="搜索专题名称..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border rounded-lg text-sm outline-none border-brand-border text-brand-ink bg-white"
          />
        </div>

        <div className="flex flex-wrap gap-4">
          {/* Stage filter */}
          <div>
            <span className="text-xs font-medium text-brand-ink-muted block mb-1.5">阶段</span>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setFilterStage(null)}
                className={`px-2.5 py-1 rounded text-xs font-medium border transition-colors ${filterStage === null ? 'bg-brand-accent text-white border-brand-accent' : 'bg-white text-brand-ink-light border-brand-border'}`}
              >
                全部
              </button>
              {stages.map(s => (
                <button
                  key={s}
                  onClick={() => setFilterStage(s)}
                  className={`px-2.5 py-1 rounded text-xs font-medium border transition-colors ${filterStage === s ? 'bg-brand-accent text-white border-brand-accent' : 'bg-white text-brand-ink-light border-brand-border'}`}
                >
                  {stageNames[s] || `阶段${s}`}
                </button>
              ))}
            </div>
          </div>

          {/* Type filter */}
          <div>
            <span className="text-xs font-medium text-brand-ink-muted block mb-1.5">类型</span>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setFilterType('all')}
                className={`px-2.5 py-1 rounded text-xs font-medium border transition-colors ${filterType === 'all' ? 'bg-brand-accent text-white border-brand-accent' : 'bg-white text-brand-ink-light border-brand-border'}`}
              >
                全部
              </button>
              {types.map(t => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`px-2.5 py-1 rounded text-xs font-medium border transition-colors ${filterType === t ? 'bg-brand-accent text-white border-brand-accent' : 'bg-white text-brand-ink-light border-brand-border'}`}
                >
                  {typeIcons[t]} {t === 'ml' ? 'ML' : t === 'dl' ? 'DL' : t === 'math' ? '数学' : '生信'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-3 text-xs text-brand-ink-muted">
          显示 {counts.filtered} / {counts.total} 个专题
        </div>
      </section>

      {/* Graph Grid — organized by stage then type */}
      <div className="space-y-8">
        {filterStage === null ? stages.map(stage => {
          const stageTopics = filtered.filter(t => t.stage === stage);
          if (stageTopics.length === 0) return null;

          // Group by type within stage
          const typeOrder = ['ml', 'dl', 'math', 'bioinfo'];
          const grouped: Record<string, TopicNode[]> = {};
          for (const t of stageTopics) {
            const g = t.type || 'other';
            if (!grouped[g]) grouped[g] = [];
            grouped[g].push(t);
          }

          return (
            <section key={stage}>
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: stageColors[stage] || '#888' }}
                />
                <h2 className="text-lg font-bold text-brand-ink">
                  阶段{stage}：{stageNames[stage] || ''}
                </h2>
                <span className="text-xs text-brand-ink-muted">{stageTopics.length} 个专题</span>
              </div>

              <div className="space-y-4">
                {typeOrder.map(t => {
                  const items = grouped[t];
                  if (!items || items.length === 0) return null;
                  const colors = typeColors[t] || 'bg-gray-50 text-gray-600 border-gray-200';
                  return (
                    <div key={t}>
                      <div className="text-xs font-semibold text-brand-ink-muted mb-2 flex items-center gap-1.5">
                        {typeIcons[t]}
                        {t === 'ml' ? '机器学习' : t === 'dl' ? '深度学习' : t === 'math' ? '数学基础' : '生信流程'}
                        <span className="font-normal text-brand-ink-extra-muted">({items.length})</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1.5">
                        {items.map(topic => (
                          <Link
                            key={topic.key}
                            to={`/learn/${topic.key}`}
                            className={`border rounded-lg px-3 py-2 text-xs no-underline hover:shadow-sm transition-all ${colors}`}
                          >
                            <span className="font-medium">{topic.name}</span>
                            {topic.difficulty !== '中级' && (
                              <span className="ml-1.5 text-[10px] opacity-60">{topic.difficulty}</span>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        }) : (
          /* Flat view when filtering by a single stage */
          <section>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {filtered.map(topic => (
                <Link
                  key={topic.key}
                  to={`/learn/${topic.key}`}
                  className={`border rounded-lg px-3 py-2.5 text-sm no-underline hover:shadow-sm transition-all ${typeColors[topic.type] || 'bg-white'}`}
                >
                  <div className="font-medium">{topic.name}</div>
                  <div className="text-[10px] mt-1 opacity-60">
                    阶段{topic.stage} · {topic.difficulty}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-sm text-brand-ink-muted">
          没有匹配的专题，试试调整筛选条件
        </div>
      )}
    </div>
  );
}
