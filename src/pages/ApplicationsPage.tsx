import { useData } from '../hooks/useData';
import { Microscope, FlaskConical, BookOpen, Database } from 'lucide-react';

interface Application {
  id: string;
  name: string;
  description: string;
  color: string;
  mlMethods: { name: string; description: string; tools: string[] }[];
  dlMethods: { name: string; description: string; tools: string[] }[];
  datasets: { name: string; description: string; size: string }[];
  keyPapers: { title: string; authors: string; year: number; venue: string; url: string }[];
  gettingStarted: string[];
}

export default function ApplicationsPage() {
  const applications = useData<Application[]>('applications');

  if (!applications) return <div className="p-8 text-sm" style={{ color: '#8A8A8A' }}>Loading...</div>;

  return (
    <div className="space-y-16">
      <div>
        <h1 className="text-3xl font-bold mb-3" style={{ color: '#1A1A1A' }}>应用方向</h1>
        <p className="text-base" style={{ color: '#8A8A8A', maxWidth: 600 }}>
          机器学习与深度学习在生物信息学六大核心领域的应用方法、工具与数据集
        </p>
      </div>

      {applications.map((app) => (
        <section key={app.id} className="border rounded-lg overflow-hidden" style={{ borderColor: '#E5E5E5' }}>
          <div className="h-1" style={{ backgroundColor: app.color }} />

          <div className="p-6 md:p-8">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: app.color + '15' }}
              >
                <Microscope size={16} style={{ color: app.color }} />
              </div>
              <h2 className="text-xl font-bold" style={{ color: '#1A1A1A' }}>{app.name}</h2>
            </div>
            <p className="text-sm mb-8 max-w-3xl" style={{ color: '#8A8A8A', lineHeight: 1.7 }}>
              {app.description}
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <FlaskConical size={14} style={{ color: '#1E3A5F' }} />
                  <h3 className="text-sm font-semibold" style={{ color: '#1E3A5F' }}>机器学习方法</h3>
                </div>
                <div className="space-y-3">
                  {app.mlMethods.map((m) => (
                    <div key={m.name} className="border rounded-lg p-3" style={{ borderColor: '#EEEEEE' }}>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="font-medium text-sm" style={{ color: '#1A1A1A' }}>{m.name}</span>
                        <div className="flex gap-1">
                          {m.tools.map((t) => (
                            <span key={t} className="text-xs px-1.5 py-0.5 rounded font-mono" style={{ backgroundColor: '#E8EDF2', color: '#1E3A5F' }}>{t}</span>
                          ))}
                        </div>
                      </div>
                      <p className="text-xs" style={{ color: '#6A6A6A', lineHeight: 1.6 }}>{m.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen size={14} style={{ color: '#2D5A3D' }} />
                  <h3 className="text-sm font-semibold" style={{ color: '#2D5A3D' }}>深度学习方法</h3>
                </div>
                <div className="space-y-3">
                  {app.dlMethods.map((m) => (
                    <div key={m.name} className="border rounded-lg p-3" style={{ borderColor: '#EEEEEE' }}>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="font-medium text-sm" style={{ color: '#1A1A1A' }}>{m.name}</span>
                        <div className="flex gap-1">
                          {m.tools.map((t) => (
                            <span key={t} className="text-xs px-1.5 py-0.5 rounded font-mono" style={{ backgroundColor: '#E8F0E9', color: '#2D5A3D' }}>{t}</span>
                          ))}
                        </div>
                      </div>
                      <p className="text-xs" style={{ color: '#6A6A6A', lineHeight: 1.6 }}>{m.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center gap-2 mb-3">
                <Database size={14} style={{ color: '#8A8A8A' }} />
                <h3 className="text-sm font-semibold" style={{ color: '#4A4A4A' }}>常用数据集</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {app.datasets.map((ds) => (
                  <div
                    key={ds.name}
                    className="border rounded-lg p-3 flex items-start justify-between"
                    style={{ borderColor: '#EEEEEE' }}
                  >
                    <div>
                      <h4 className="text-sm font-medium" style={{ color: '#1A1A1A' }}>{ds.name}</h4>
                      <p className="text-xs mt-0.5" style={{ color: '#8A8A8A' }}>{ds.description}</p>
                    </div>
                    <span
                      className="text-xs px-2 py-0.5 rounded shrink-0 ml-3"
                      style={{ backgroundColor: '#E8EDF2', color: '#1E3A5F' }}
                    >
                      {ds.size}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-semibold mb-3" style={{ color: '#4A4A4A' }}>关键论文</h3>
              <div className="space-y-3">
                {app.keyPapers.map((paper) => (
                  <div key={paper.title} className="border rounded-lg p-4" style={{ borderColor: '#EEEEEE' }}>
                    <a
                      href={paper.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium no-underline hover:underline"
                      style={{ color: '#1E3A5F' }}
                    >
                      {paper.title}
                    </a>
                    <p className="text-xs mt-1" style={{ color: '#8A8A8A' }}>
                      {paper.authors} · {paper.year} · {paper.venue}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-lg p-4" style={{ backgroundColor: '#FAFAFA' }}>
              <h3 className="text-sm font-semibold mb-3" style={{ color: '#4A4A4A' }}>入门步骤</h3>
              <div className="space-y-2">
                {app.gettingStarted.map((step, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <span
                      className="flex items-center justify-center w-5 h-5 rounded-full text-xs font-medium shrink-0 mt-0.5"
                      style={{ backgroundColor: app.color, color: 'white' }}
                    >
                      {i + 1}
                    </span>
                    <span className="text-sm" style={{ color: '#4A4A4A' }}>{step}</span>
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
