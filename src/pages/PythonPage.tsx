import { Link } from 'react-router-dom';
import { useData } from '../hooks/useData';
import { BookOpen, Code, BarChart3, ArrowRight } from 'lucide-react';

interface PythonSection {
  type: string;
  title: string;
  content?: string;
  code?: string;
}

interface PythonChapter {
  key: string;
  chapter: number;
  name: string;
  difficulty: string;
  sections: PythonSection[];
}

interface PythonCategory {
  id: string;
  name: string;
  description: string;
  difficulty: string;
  chapters: PythonChapter[];
}

interface PythonTopicsData {
  categories: PythonCategory[];
}

const catIcons: Record<string, React.ReactNode> = {
  basics: <Code size={18} />,
  intermediate: <BookOpen size={18} />,
  visualization: <BarChart3 size={18} />,
};
const catColors: Record<string, string> = {
  basics: '#1E3A5F',
  intermediate: '#2D5A3D',
  visualization: '#C53030',
};
const catBorders: Record<string, string> = {
  basics: 'border-l-brand-accent',
  intermediate: 'border-l-brand-dl',
  visualization: 'border-l-brand-error',
};

export default function PythonPage() {
  const { data, loading, error } = useData<PythonTopicsData>('pythonTopics');

  if (loading) return <div className="p-8 text-sm text-brand-ink-muted">Loading...</div>;
  if (error || !data) return <div className="p-8 text-sm text-brand-error">{error || '加载失败'}</div>;

  const total = data.categories.reduce((s, c) => s + c.chapters.length, 0);

  return (
    <div className="space-y-14">
      <header>
        <h1 className="text-3xl font-bold mb-3 text-brand-ink">Python 编程</h1>
        <p className="text-base text-brand-ink-muted max-w-[700px]">
          基于《Python编程：从入门到实践（第3版）》，提炼与生物信息学最相关的 {total} 章核心内容。
          每个专题包含概念总结 + 生信场景代码 + ML/DL 连接
        </p>
      </header>

      {data.categories.map((cat) => (
        <section key={cat.id}>
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: catColors[cat.id] + '15' }}
            >
              <span style={{ color: catColors[cat.id] }}>{catIcons[cat.id]}</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-brand-ink">{cat.name}</h2>
              <p className="text-xs text-brand-ink-muted">
                {cat.description} · {cat.chapters.length} 章 · {cat.difficulty}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {cat.chapters.map((ch) => (
              <Link
                key={ch.key}
                to={`/python/${ch.key}`}
                className={`border rounded-lg p-4 no-underline hover:shadow-sm transition-all border-brand-border bg-white border-l-2 ${catBorders[cat.id]} hover:border-l-4`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-mono font-medium text-brand-ink-muted">第{ch.chapter}章</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                    ch.difficulty === '入门' ? 'bg-brand-dl-light text-brand-dl' : 'bg-brand-accent-light text-brand-accent'
                  }`}>
                    {ch.difficulty}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-brand-ink mb-1">{ch.name}</h3>
                <span className="text-xs text-brand-ink-muted flex items-center gap-1">
                  进入学习 <ArrowRight size={11} />
                </span>
              </Link>
            ))}
          </div>
        </section>
      ))}

      {/* Cross-link to BioML */}
      <div className="border rounded-lg p-5 bg-brand-off-white border-brand-border-light text-center">
        <p className="text-sm text-brand-ink-light mb-3">
          学完Python基础后，可以开始探索ML/DL在生信中的应用
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link to="/roadmap" className="text-xs font-medium text-brand-accent hover:underline no-underline">
            学习路径 →
          </Link>
          <Link to="/graph" className="text-xs font-medium text-brand-accent hover:underline no-underline">
            知识图谱 →
          </Link>
          <Link to="/ngs" className="text-xs font-medium text-brand-accent hover:underline no-underline">
            生信NGS流程 →
          </Link>
        </div>
      </div>
    </div>
  );
}
