import { Link } from 'react-router-dom';
import { BookOpen, Microscope, ArrowRight, Dna, Brain, FlaskConical, Layers } from 'lucide-react';
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

interface Application {
  id: string;
  name: string;
  description: string;
  color: string;
  dlMethods: { name: string }[];
}

export default function HomePage() {
  const { data: stages, loading, error } = useData<Stage[]>('roadmap', true);
  const { data: applications } = useData<Application[]>('applications', true);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-sm text-brand-ink-muted">Loading...</div>
      </div>
    );
  }

  if (error || !stages || !applications) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-sm text-brand-error">{error || '加载数据失败'}</div>
      </div>
    );
  }

  return (
    <div className="space-y-20">
      {/* Hero */}
      <section className="text-center py-16">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6 bg-brand-accent-light text-brand-accent">
          <Dna size={13} />
          面向生物信息学研究者的系统学习指南
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-5 text-brand-ink">
          生物信息学中的机器学习与深度学习
        </h1>
        <p className="text-lg max-w-2xl mx-auto mb-12 text-brand-ink-muted" style={{ lineHeight: 1.8 }}>
          从零基础到前沿应用，系统掌握ML/DL在基因组学、蛋白质科学和药物发现中的核心方法与实践技能
        </p>

        {/* 三路径引导入口 — progressive disclosure */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
          <Link
            to="/intro"
            className="group border rounded-xl p-6 text-left no-underline hover:shadow-md transition-all border-brand-accent bg-brand-accent-light/30 hover:bg-brand-accent-light/50"
          >
            <div className="flex items-center gap-2 mb-2">
              <BookOpen size={18} className="text-brand-accent" />
              <span className="text-sm font-semibold text-brand-accent">我是新手</span>
            </div>
            <p className="text-xs text-brand-ink-light mb-3" style={{ lineHeight: 1.6 }}>
              先了解生物信息学是什么、为什么需要ML/DL，以及关键概念扫盲
            </p>
            <span className="text-xs font-medium text-brand-accent group-hover:underline">
              了解背景知识 →
            </span>
          </Link>

          <Link
            to="/roadmap"
            className="group border rounded-xl p-6 text-left no-underline hover:shadow-md transition-all border-brand-border hover:border-brand-accent bg-white"
          >
            <div className="flex items-center gap-2 mb-2">
              <Layers size={18} className="text-brand-ink-light" />
              <span className="text-sm font-semibold text-brand-ink">我有基础</span>
            </div>
            <p className="text-xs text-brand-ink-light mb-3" style={{ lineHeight: 1.6 }}>
              直接进入四阶段学习路径，从基础ML/DL到前沿生物大模型
            </p>
            <span className="text-xs font-medium text-brand-accent group-hover:underline">
              开始系统学习 →
            </span>
          </Link>

          <Link
            to="/applications"
            className="group border rounded-xl p-6 text-left no-underline hover:shadow-md transition-all border-brand-border hover:border-brand-accent bg-white"
          >
            <div className="flex items-center gap-2 mb-2">
              <Microscope size={18} className="text-brand-ink-light" />
              <span className="text-sm font-semibold text-brand-ink">我关心应用</span>
            </div>
            <p className="text-xs text-brand-ink-light mb-3" style={{ lineHeight: 1.6 }}>
              直接探索六大应用方向，了解各领域用什么方法解决什么问题
            </p>
            <span className="text-xs font-medium text-brand-accent group-hover:underline">
              探索应用方向 →
            </span>
          </Link>
        </div>
      </section>

      {/* Stats bar */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-y px-6 rounded-lg border-brand-border-light bg-brand-off-white">
        {[
          { value: '4', label: '学习阶段', icon: Layers },
          { value: '6', label: '应用方向', icon: Microscope },
          { value: '25+', label: '工具库', icon: FlaskConical },
          { value: '20+', label: '学习资源', icon: BookOpen },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <stat.icon size={18} className="mx-auto mb-1.5 text-brand-accent" />
            <div className="text-2xl font-bold text-brand-ink">{stat.value}</div>
            <div className="text-xs mt-0.5 text-brand-ink-muted">{stat.label}</div>
          </div>
        ))}
      </section>

      {/* Stage overview cards — simplified: just summary, no topic detail */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <Layers size={20} className="text-brand-accent" />
          <h2 className="text-2xl font-bold text-brand-ink">四阶段学习路径</h2>
        </div>
        <p className="text-sm text-brand-ink-muted mb-6 max-w-2xl">
          从编程和数学基础到前沿生物大模型，每个阶段覆盖 ML、DL、数学和生物信息学四大维度
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stages.map((stage) => {
            const topicCount =
              stage.mlTopics.length + stage.dlTopics.length + stage.mathTopics.length +
              (stage.bioinfoTopics || []).length;
            return (
            <div
              key={stage.id}
              className="border rounded-lg p-5 hover:shadow-sm transition-shadow border-brand-border bg-white"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-brand-accent-light text-brand-accent">
                  阶段 {stage.id}
                </span>
                <span className="text-xs text-brand-ink-muted">{stage.duration}</span>
              </div>
              <h3 className="text-base font-semibold mb-1.5 text-brand-ink">{stage.name}</h3>
              <p className="text-xs text-brand-ink-muted mb-3" style={{ lineHeight: 1.6 }}>
                {stage.description}
              </p>
              <div className="flex items-center gap-2 text-xs text-brand-ink-muted">
                <span className="px-1.5 py-0.5 rounded bg-brand-off-white border border-brand-border-light">
                  {topicCount} 个专题
                </span>
                <span className="px-1.5 py-0.5 rounded bg-brand-off-white border border-brand-border-light">
                  {stage.tools.length} 个工具
                </span>
                <span className="px-1.5 py-0.5 rounded bg-brand-off-white border border-brand-border-light">
                  {stage.projects.length} 个项目
                </span>
              </div>
            </div>
            );
          })}
        </div>
        <div className="mt-5 text-center">
          <Link
            to="/roadmap"
            className="inline-flex items-center gap-1.5 text-sm font-medium no-underline text-brand-accent"
          >
            查看完整路径，开始逐项学习
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* Application preview cards */}
      <section>
        <div className="flex items-center gap-3 mb-8">
          <Microscope size={20} className="text-brand-accent" />
          <h2 className="text-2xl font-bold text-brand-ink">应用方向</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {applications.map((app) => (
            <div
              key={app.id}
              className="border rounded-lg p-5 hover:shadow-sm transition-shadow border-brand-border bg-white"
              style={{ borderTopWidth: 3, borderTopColor: app.color }}
            >
              <h3 className="text-base font-semibold mb-2 text-brand-ink">
                {app.name}
              </h3>
              <p className="text-sm mb-4 text-brand-ink-muted" style={{ lineHeight: 1.7 }}>
                {app.description}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {app.dlMethods.slice(0, 2).map((m) => (
                  <span
                    key={m.name}
                    className="text-xs px-2 py-0.5 rounded bg-brand-accent-light text-brand-accent"
                  >
                    {m.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link
            to="/applications"
            className="inline-flex items-center gap-1.5 text-sm font-medium no-underline text-brand-accent"
          >
            查看全部应用方向
            <ArrowRight size={14} />
          </Link>
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

      {/* Quick links */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Link
          to="/resources"
          className="border rounded-lg p-5 no-underline hover:shadow-sm transition-shadow border-brand-border"
        >
          <BookOpen size={18} className="mb-2 text-brand-accent" />
          <h3 className="text-sm font-semibold mb-1 text-brand-ink">精选资源库</h3>
          <p className="text-xs text-brand-ink-muted">
            Andrew Ng课程、Fast.ai、D2L、经典书籍和视频教程
          </p>
        </Link>
        <Link
          to="/tools"
          className="border rounded-lg p-5 no-underline hover:shadow-sm transition-shadow border-brand-border"
        >
          <FlaskConical size={18} className="mb-2 text-brand-accent" />
          <h3 className="text-sm font-semibold mb-1 text-brand-ink">工具与环境</h3>
          <p className="text-xs text-brand-ink-muted">
            PyTorch、scikit-learn、ESM-2、AlphaFold2等核心工具安装与配置
          </p>
        </Link>
        <Link
          to="/math"
          className="border rounded-lg p-5 no-underline hover:shadow-sm transition-shadow border-brand-border"
        >
          <Brain size={18} className="mb-2 text-brand-accent" />
          <h3 className="text-sm font-semibold mb-1 text-brand-ink">数学直觉</h3>
          <p className="text-xs text-brand-ink-muted">
            用生物学直觉理解线性代数、微积分、概率和优化
          </p>
        </Link>
      </section>
    </div>
  );
}
