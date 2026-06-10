import { Link } from 'react-router-dom';
import { useData } from '../hooks/useData';
import { Microscope, FlaskConical, BookOpen, Database } from 'lucide-react';
import CodeBlock from '../components/CodeBlock';

interface DecisionGuidance {
  summary: string;
  rules: { when: string; use: string; why: string }[];
}

interface Application {
  id: string;
  name: string;
  description: string;
  color: string;
  decisionGuidance?: DecisionGuidance;
  mlMethods: { name: string; description: string; tools: string[]; codeSnippet?: string }[];
  dlMethods: { name: string; description: string; tools: string[]; codeSnippet?: string }[];
  datasets: { name: string; description: string; size: string }[];
  keyPapers: { title: string; authors: string; year: number; venue: string; url: string }[];
  gettingStarted: string[];
}

export default function ApplicationsPage() {
  const { data: applications, loading, error } = useData<Application[]>('applications');

  if (loading) return <div className="p-8 text-sm text-brand-ink-muted">Loading...</div>;
  if (error || !applications) return <div className="p-8 text-sm text-brand-error">{error || '加载数据失败'}</div>;

  return (
    <div className="space-y-16">
      <div>
        <h1 className="text-3xl font-bold mb-3 text-brand-ink">应用方向</h1>
        <p className="text-base text-brand-ink-muted max-w-[600px]">
          机器学习与深度学习在生物信息学六大核心领域的应用方法、工具与数据集
        </p>
      </div>

      {applications.map((app) => (
        <section key={app.id} className="border rounded-lg overflow-hidden border-brand-border">
          <div className="h-1" style={{ backgroundColor: app.color }} />

          <div className="p-6 md:p-8">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: app.color + '15' }}
              >
                <Microscope size={16} style={{ color: app.color }} />
              </div>
              <h2 className="text-xl font-bold text-brand-ink">{app.name}</h2>
            </div>
            <p className="text-sm mb-4 max-w-3xl text-brand-ink-muted" style={{ lineHeight: 1.7 }}>
              {app.description}
            </p>

            {app.decisionGuidance && (
              <div className="mb-6 border rounded-lg overflow-hidden" style={{ borderColor: app.color + '30' }}>
                <div className="px-4 py-2" style={{ backgroundColor: app.color + '10', borderBottom: '1px solid ' + app.color + '20' }}>
                  <span className="text-xs font-semibold" style={{ color: app.color }}>ML 还是 DL？决策指南</span>
                </div>
                <div className="p-4">
                  <p className="text-xs mb-3 text-brand-ink-light">
                    {app.decisionGuidance.summary}
                  </p>
                  <div className="space-y-2">
                    {app.decisionGuidance.rules.map((rule, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs">
                        <span className="shrink-0 mt-0.5 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: app.color }} />
                        <span>
                          <span className="font-medium text-brand-ink">{rule.when}</span>
                          {' → '}
                          <span className="font-mono font-medium" style={{ color: app.color }}>{rule.use}</span>
                          <span className="text-brand-ink-extra-muted"> ({rule.why})</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <FlaskConical size={14} className="text-brand-accent" />
                  <h3 className="text-sm font-semibold text-brand-accent">机器学习方法</h3>
                </div>
                <div className="space-y-3">
                  {app.mlMethods.map((m) => (
                    <div key={m.name} className="border rounded-lg p-3 border-brand-border-light">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="font-medium text-sm text-brand-ink">{m.name}</span>
                        <div className="flex gap-1">
                          {m.tools.map((t) => (
                            <Link key={t} to="/tools" className="text-xs px-1.5 py-0.5 rounded font-mono no-underline hover:underline bg-brand-accent-light text-brand-accent">{t}</Link>
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-brand-ink-medium" style={{ lineHeight: 1.6 }}>{m.description}</p>
                      {m.codeSnippet && (
                        <div className="mt-2">
                          <CodeBlock code={m.codeSnippet} label="Code Example" collapsible />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen size={14} className="text-brand-dl" />
                  <h3 className="text-sm font-semibold text-brand-dl">深度学习方法</h3>
                </div>
                <div className="space-y-3">
                  {app.dlMethods.map((m) => (
                    <div key={m.name} className="border rounded-lg p-3 border-brand-border-light">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="font-medium text-sm text-brand-ink">{m.name}</span>
                        <div className="flex gap-1">
                          {m.tools.map((t) => (
                            <Link key={t} to="/tools" className="text-xs px-1.5 py-0.5 rounded font-mono no-underline hover:underline bg-brand-dl-light text-brand-dl">{t}</Link>
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-brand-ink-medium" style={{ lineHeight: 1.6 }}>{m.description}</p>
                      {m.codeSnippet && (
                        <div className="mt-2">
                          <CodeBlock code={m.codeSnippet} label="Code Example" collapsible />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center gap-2 mb-3">
                <Database size={14} className="text-brand-ink-muted" />
                <h3 className="text-sm font-semibold text-brand-ink-light">常用数据集</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {app.datasets.map((ds) => (
                  <div
                    key={ds.name}
                    className="border rounded-lg p-3 flex items-start justify-between border-brand-border-light"
                  >
                    <div>
                      <h4 className="text-sm font-medium text-brand-ink">{ds.name}</h4>
                      <p className="text-xs mt-0.5 text-brand-ink-muted">{ds.description}</p>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded shrink-0 ml-3 bg-brand-accent-light text-brand-accent">
                      {ds.size}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-semibold mb-3 text-brand-ink-light">关键论文</h3>
              <div className="space-y-3">
                {app.keyPapers.map((paper) => (
                  <div key={paper.title} className="border rounded-lg p-4 border-brand-border-light">
                    <a
                      href={paper.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium no-underline hover:underline text-brand-accent"
                    >
                      {paper.title}
                    </a>
                    <p className="text-xs mt-1 text-brand-ink-muted">
                      {paper.authors} · {paper.year} · {paper.venue}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-lg p-4 bg-brand-off-white">
              <h3 className="text-sm font-semibold mb-3 text-brand-ink-light">入门步骤</h3>
              <div className="space-y-2">
                {app.gettingStarted.map((step, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <span
                      className="flex items-center justify-center w-5 h-5 rounded-full text-xs font-medium shrink-0 mt-0.5 text-white"
                      style={{ backgroundColor: app.color }}
                    >
                      {i + 1}
                    </span>
                    <span className="text-sm text-brand-ink-light">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
