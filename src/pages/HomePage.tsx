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
}

interface Application {
  id: string;
  name: string;
  description: string;
  color: string;
  dlMethods: { name: string }[];
}

export default function HomePage() {
  const { data: stages, loading, error } = useData<Stage[]>('roadmap');
  const { data: applications } = useData<Application[]>('applications');

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
        <p className="text-lg max-w-2xl mx-auto mb-8 text-brand-ink-muted" style={{ lineHeight: 1.8 }}>
          从零基础到前沿应用，系统掌握ML/DL在基因组学、蛋白质科学和药物发现中的核心方法与实践技能
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            to="/intro"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white no-underline bg-brand-accent"
          >
            <BookOpen size={15} />
            了解背景知识
            <ArrowRight size={14} />
          </Link>
          <Link
            to="/roadmap"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium no-underline border border-brand-border text-brand-ink-light"
          >
            开始学习
          </Link>
          <Link
            to="/applications"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium no-underline border border-brand-border text-brand-ink-light"
          >
            <Microscope size={15} />
            应用方向
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

      {/* Stage overview cards */}
      <section>
        <div className="flex items-center gap-3 mb-8">
          <Layers size={20} className="text-brand-accent" />
          <h2 className="text-2xl font-bold text-brand-ink">学习路径概览</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {stages.map((stage) => (
            <div
              key={stage.id}
              className="border rounded-lg p-6 hover:shadow-sm transition-shadow border-brand-border bg-white"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-brand-accent-light text-brand-accent">
                  阶段 {stage.id}
                </span>
                <span className="text-xs text-brand-ink-muted">{stage.duration}</span>
              </div>
              <h3 className="text-lg font-semibold mb-1 text-brand-ink">
                {stage.name}
              </h3>
              <p className="text-xs mb-3 text-brand-ink-muted">{stage.nameEn}</p>
              <p className="text-sm mb-4 text-brand-ink-light" style={{ lineHeight: 1.7 }}>
                {stage.description}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {stage.mlTopics.slice(0, 3).map((topic) => (
                  <span
                    key={topic.name}
                    className="text-xs px-2 py-0.5 rounded border border-brand-border-light text-brand-ink-muted"
                  >
                    {topic.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link
            to="/roadmap"
            className="inline-flex items-center gap-1.5 text-sm font-medium no-underline text-brand-accent"
          >
            查看完整学习路径
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
        <div className="flex items-center gap-3 mb-6">
          <Brain size={20} className="text-brand-accent" />
          <h2 className="text-2xl font-bold text-brand-ink">来测一下？</h2>
          <span className="text-xs text-brand-ink-muted">5道生物信息学ML/DL基础题</span>
        </div>
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
