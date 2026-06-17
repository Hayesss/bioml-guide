import { Link } from 'react-router-dom';
import { BookOpen, Microscope, Dna, Brain, FlaskConical, Layers, Search, Calculator, Wrench, Library } from 'lucide-react';
import Quiz from '../components/Quiz';
import { useData } from '../hooks/useData';

interface Stage {
  id: number;
  name: string;
  nameEn: string;
  duration: string;
  description: string;
  mlTopics: { name: string; description: string }[];
  dlTopics: { name: string; description: string }[];
  mathTopics: { name: string; description: string; mathId?: string }[];
  bioinfoTopics?: { name: string; description: string }[];
  tools: string[];
  projects: { name: string; description: string; starterCode?: string }[];
}


const hubCategories = [
  { path: '/roadmap', label: '学习路径', sub: 'ML/DL/Math四阶段', icon: Layers, color: '#1E3A5F', bg: 'bg-brand-accent-light' },
  { path: '/ngs', label: '生信NGS流程', sub: '单细胞·Bulk·空间', icon: Dna, color: '#2D5A3D', bg: 'bg-brand-dl-light' },
  { path: '/applications', label: '应用方向', sub: '六大前沿领域', icon: Microscope, color: '#5B3A7B', bg: 'bg-purple-50' },
  { path: '/math', label: '数学直觉', sub: '生物类比理解数学', icon: Calculator, color: '#8B4513', bg: 'bg-amber-50' },
  { path: '/tools', label: '工具库', sub: '25+框架与平台', icon: Wrench, color: '#C53030', bg: 'bg-red-50' },
  { path: '/resources', label: '学习资源', sub: '课程·书籍·论文', icon: Library, color: '#4A6741', bg: 'bg-green-50' },
  { path: '/cheatsheet', label: '速查表', sub: '代码片段快速复制', icon: FlaskConical, color: '#6B4C8B', bg: 'bg-indigo-50' },
  { path: '/intro', label: '背景知识', sub: '生信×ML/DL概览', icon: BookOpen, color: '#B8860B', bg: 'bg-yellow-50' },
];

export default function HomePage() {
  const { data: stages, loading, error } = useData<Stage[]>('roadmap', true);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-sm text-brand-ink-muted">Loading...</div>
      </div>
    );
  }

  if (error || !stages) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-sm text-brand-error">{error || '加载数据失败'}</div>
      </div>
    );
  }

  // Compute topic counts
  let totalTopics = 0;
  for (const s of stages) {
    totalTopics += s.mlTopics.length + s.dlTopics.length + s.mathTopics.length + (s.bioinfoTopics || []).length;
  }

  const handleSearchClick = () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, metaKey: true, key: 'k', bubbles: true }));
  };

  return (
    <div className="space-y-16">
      {/* Hero — Knowledge Graph Hub */}
      <section className="text-center py-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6 bg-brand-accent-light text-brand-accent">
          <Dna size={13} />
          生信 × 机器学习 · 深度学习 知识图谱
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-brand-ink">
          生物信息学中的机器学习与深度学习
        </h1>
        <p className="text-base max-w-xl mx-auto mb-8 text-brand-ink-muted" style={{ lineHeight: 1.7 }}>
          {stages.length}个阶段 · {totalTopics}+个专题 · 45个算法 · 78个集成工具 — 按需检索，自由探索
        </p>

        {/* Central search prompt */}
        <button
          onClick={handleSearchClick}
          className="inline-flex items-center gap-3 px-5 py-3 rounded-xl border-2 border-brand-border hover:border-brand-accent bg-white shadow-sm hover:shadow-md transition-all max-w-lg w-full text-left"
        >
          <Search size={18} className="text-brand-ink-muted shrink-0" />
          <span className="text-sm text-brand-ink-muted flex-1">搜索概念、方法、工具、专题...</span>
          <kbd className="text-xs px-1.5 py-0.5 rounded border font-mono border-brand-border text-brand-ink-muted bg-brand-off-white shrink-0">
            Ctrl+K
          </kbd>
        </button>
      </section>

      {/* Category Hub Grid */}
      <section>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {hubCategories.map((cat) => (
            <Link
              key={cat.path}
              to={cat.path}
              className="border rounded-xl p-4 no-underline hover:shadow-md transition-all border-brand-border bg-white hover:border-brand-accent group"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center mb-2.5"
                style={{ backgroundColor: cat.color + '15' }}
              >
                <cat.icon size={16} style={{ color: cat.color }} />
              </div>
              <div className="text-sm font-semibold mb-0.5 text-brand-ink group-hover:text-brand-accent transition-colors">
                {cat.label}
              </div>
              <div className="text-xs text-brand-ink-muted">{cat.sub}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Stage overview — compact strip */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-brand-ink">学习路径概览</h2>
          <Link to="/roadmap" className="text-xs font-medium text-brand-accent hover:underline no-underline">
            完整路径 →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {stages.map((stage) => (
            <Link
              key={stage.id}
              to="/roadmap"
              className="border rounded-lg px-4 py-3 no-underline hover:shadow-sm transition-shadow border-brand-border bg-white"
            >
              <div className="text-xs font-mono font-medium text-brand-accent mb-1">阶段 {stage.id}</div>
              <div className="text-sm font-semibold text-brand-ink">{stage.name}</div>
              <div className="text-xs text-brand-ink-muted mt-0.5">{stage.duration}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* ML vs DL comparison */}
      <section>
        <div className="flex items-center gap-3 mb-8">
          <Brain size={20} className="text-brand-accent" />
          <h2 className="text-2xl font-bold text-brand-ink">机器学习 vs 深度学习</h2>
        </div>
        <div className="border rounded-lg overflow-hidden border-brand-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-brand-off-white">
                <th className="text-left px-4 py-3 font-semibold text-brand-ink">维度</th>
                <th className="text-left px-4 py-3 font-semibold text-brand-accent">机器学习 (ML)</th>
                <th className="text-left px-4 py-3 font-semibold text-brand-dl">深度学习 (DL)</th>
              </tr>
            </thead>
            <tbody>
              {[
                { dim: '特征工程', ml: '需要手工设计特征 (k-mer, 物理化学描述符)', dl: '自动学习特征表示 (端到端学习)' },
                { dim: '数据需求', ml: '中小规模数据即可表现良好', dl: '通常需要大规模数据，但预训练模型减少需求' },
                { dim: '可解释性', ml: '较高 (特征重要性、决策路径)', dl: '较低 (黑箱，需借助注意力或SHAP)' },
                { dim: '计算需求', ml: '较低，CPU即可', dl: '较高，通常需要GPU' },
                { dim: '生物信息学应用', ml: '变异注释、表达分类、分子性质预测', dl: '蛋白质结构、基因表达预测、分子生成' },
                { dim: '代表算法', ml: '随机森林、SVM、XGBoost、逻辑回归', dl: 'CNN、RNN、Transformer、VAE、GAN' },
                { dim: '典型工具', ml: 'scikit-learn, XGBoost, SHAP', dl: 'PyTorch, TensorFlow, HuggingFace' },
              ].map((row) => (
                <tr key={row.dim} className="border-t border-brand-border-light">
                  <td className="px-4 py-3 font-medium text-brand-ink-light">{row.dim}</td>
                  <td className="px-4 py-3 text-brand-ink-light">{row.ml}</td>
                  <td className="px-4 py-3 text-brand-ink-light">{row.dl}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Self-assessment quiz */}
      <section>
        <div className="flex items-center gap-3 mb-3">
          <Brain size={20} className="text-brand-accent" />
          <h2 className="text-2xl font-bold text-brand-ink">自测一下</h2>
        </div>
        <p className="text-sm text-brand-ink-muted mb-5">
          建议先完成背景知识和阶段1的学习再来挑战。这些题目覆盖生信ML/DL的实战场景
        </p>
        <Quiz />
      </section>

    </div>
  );
}
