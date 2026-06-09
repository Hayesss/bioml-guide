import { Link } from 'react-router-dom';
import { useData } from '../hooks/useData';
import { Calculator, Leaf, Box, Cpu, BookOpen } from 'lucide-react';
import CodeBlock from '../components/CodeBlock';

interface MathTopic {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  bioAnalogy: string;
  bioAnalogyDetail: string;
  keyConcepts: { name: string; formula: string; description: string; relatedLinks?: { label: string; path: string }[]; codeImpl?: string }[];
  resources: { name: string; type: string; url: string }[];
  mlUsage: string[];
  dlUsage: string[];
  difficulty: string;
}

export default function MathPage() {
  const mathTopics = useData<MathTopic[]>('math');

  if (!mathTopics) return <div className="p-8 text-sm" style={{ color: '#8A8A8A' }}>Loading...</div>;

  return (
    <div className="space-y-16">
      <div>
        <h1 className="text-3xl font-bold mb-3" style={{ color: '#1A1A1A' }}>数学直觉</h1>
        <p className="text-base" style={{ color: '#8A8A8A', maxWidth: 600 }}>
          用生物学直觉理解机器学习背后的数学原理
        </p>
      </div>

      {mathTopics.map((topic) => (
        <section key={topic.id} className="border rounded-lg overflow-hidden" style={{ borderColor: '#E5E5E5' }}>
          <div className="p-6 md:p-8">
            <div className="flex items-center gap-3 mb-2">
              <Calculator size={18} style={{ color: '#1E3A5F' }} />
              <h2 className="text-xl font-bold" style={{ color: '#1A1A1A' }}>{topic.name}</h2>
              <span className="text-xs font-mono" style={{ color: '#8A8A8A' }}>{topic.nameEn}</span>
            </div>
            <p className="text-sm mb-6" style={{ color: '#8A8A8A' }}>{topic.description}</p>

            <div
              className="rounded-lg p-5 mb-6 border"
              style={{ backgroundColor: '#F5F5F0', borderColor: '#EEEEEE' }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Leaf size={14} style={{ color: '#2D5A3D' }} />
                <h3 className="text-sm font-semibold" style={{ color: '#2D5A3D' }}>
                  生物直觉: {topic.bioAnalogy}
                </h3>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: '#4A4A4A' }}>
                {topic.bioAnalogyDetail}
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-4" style={{ color: '#4A4A4A' }}>核心概念</h3>
              <div className="space-y-4">
                {topic.keyConcepts.map((concept) => (
                  <div
                    key={concept.name}
                    className="border rounded-lg p-4"
                    style={{ borderColor: '#EEEEEE' }}
                  >
                    <h4 className="text-sm font-semibold mb-2" style={{ color: '#1A1A1A' }}>{concept.name}</h4>
                    <code className="block px-3 py-2 rounded text-xs mb-2 font-mono" style={{ backgroundColor: '#FAFAFA' }}>
                      {concept.formula}
                    </code>
                    <p className="text-xs" style={{ color: '#8A8A8A' }}>{concept.description}</p>
                    {concept.codeImpl && (
                      <div className="mt-2">
                        <CodeBlock code={concept.codeImpl} label="Python 实现" collapsible />
                      </div>
                    )}
                    {concept.relatedLinks && concept.relatedLinks.length > 0 && (
                      <div className="mt-2 pt-2 border-t" style={{ borderColor: '#EEEEEE' }}>
                        <span className="text-xs" style={{ color: '#A0A0A0' }}>See how this is used in: </span>
                        {concept.relatedLinks.map((link, i) => (
                          <span key={link.path + link.label}>
                            {i > 0 && <span className="text-xs" style={{ color: '#A0A0A0' }}> · </span>}
                            <Link
                              to={link.path}
                              className="text-xs font-medium no-underline hover:underline"
                              style={{ color: '#1E3A5F' }}
                            >
                              {link.label}
                            </Link>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="rounded-lg p-4" style={{ backgroundColor: '#E8EDF2' }}>
                <div className="flex items-center gap-2 mb-3">
                  <Box size={14} style={{ color: '#1E3A5F' }} />
                  <h4 className="text-sm font-semibold" style={{ color: '#1E3A5F' }}>ML应用</h4>
                </div>
                <ul className="space-y-1.5">
                  {topic.mlUsage.map((u) => (
                    <li key={u} className="text-xs flex items-start gap-2" style={{ color: '#4A4A4A' }}>
                      <span style={{ color: '#1E3A5F' }}>•</span> {u}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg p-4" style={{ backgroundColor: '#E8F0E9' }}>
                <div className="flex items-center gap-2 mb-3">
                  <Cpu size={14} style={{ color: '#2D5A3D' }} />
                  <h4 className="text-sm font-semibold" style={{ color: '#2D5A3D' }}>DL应用</h4>
                </div>
                <ul className="space-y-1.5">
                  {topic.dlUsage.map((u) => (
                    <li key={u} className="text-xs flex items-start gap-2" style={{ color: '#4A4A4A' }}>
                      <span style={{ color: '#2D5A3D' }}>•</span> {u}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen size={14} style={{ color: '#8A8A8A' }} />
                <h4 className="text-sm font-semibold" style={{ color: '#4A4A4A' }}>学习资源</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {topic.resources.map((res) => (
                  <a
                    key={res.name}
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs px-3 py-1.5 rounded border no-underline hover:bg-gray-50 transition-colors"
                    style={{ borderColor: '#EEEEEE', color: '#1E3A5F' }}
                  >
                    {res.name} ({res.type})
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      ))}

      <section>
        <h2 className="text-xl font-bold mb-5" style={{ color: '#1A1A1A' }}>数学学习路径总结</h2>
        <div className="border rounded-lg overflow-hidden" style={{ borderColor: '#E5E5E5' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: '#FAFAFA' }}>
                <th className="text-left px-4 py-3 font-semibold" style={{ color: '#1A1A1A' }}>主题</th>
                <th className="text-left px-4 py-3 font-semibold" style={{ color: '#1A1A1A' }}>难度</th>
                <th className="text-left px-4 py-3 font-semibold" style={{ color: '#1A1A1A' }}>建议时间</th>
                <th className="text-left px-4 py-3 font-semibold" style={{ color: '#1A1A1A' }}>关键应用</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: '线性代数', diff: '入门', time: '2周', use: '降维、嵌入、注意力' },
                { name: '微积分', diff: '入门', time: '2周', use: '反向传播、优化' },
                { name: '概率与统计', diff: '入门', time: '2周', use: '贝叶斯、生成模型' },
                { name: '优化', diff: '中级', time: '2周', use: '训练、超参数调优' },
                { name: '信息论', diff: '中级', time: '1周', use: '损失函数、VAE' },
              ].map((row) => (
                <tr key={row.name} className="border-t" style={{ borderColor: '#EEEEEE' }}>
                  <td className="px-4 py-3 font-medium" style={{ color: '#1A1A1A' }}>{row.name}</td>
                  <td className="px-4 py-3">
                    <span
                      className="text-xs px-2 py-0.5 rounded"
                      style={{
                        backgroundColor: row.diff === '入门' ? '#E8F0E9' : '#E8EDF2',
                        color: row.diff === '入门' ? '#2D5A3D' : '#1E3A5F',
                      }}
                    >
                      {row.diff}
                    </span>
                  </td>
                  <td className="px-4 py-3" style={{ color: '#4A4A4A' }}>{row.time}</td>
                  <td className="px-4 py-3" style={{ color: '#4A4A4A' }}>{row.use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="border rounded-lg p-6" style={{ borderColor: '#E5E5E5' }}>
        <h2 className="text-lg font-bold mb-4" style={{ color: '#1A1A1A' }}>资源快速链接</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h3 className="text-sm font-semibold mb-2" style={{ color: '#1E3A5F' }}>视频课程</h3>
            <div className="space-y-1.5">
              {[
                { name: '3Blue1Brown线性代数', url: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab' },
                { name: '3Blue1Brown微积分', url: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDMsr9K-rj53DwVRMYO3t5Yr' },
                { name: 'MIT 18.06 Gilbert Strang', url: 'https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/' },
              ].map((link) => (
                <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer"
                  className="block text-xs no-underline hover:underline" style={{ color: '#4A4A4A' }}>
                  {link.name}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-2" style={{ color: '#1E3A5F' }}>书籍</h3>
            <div className="space-y-1.5">
              {[
                { name: 'MML Book (免费)', url: 'https://mml-book.github.io/' },
                { name: 'ISLR (免费)', url: 'https://www.statlearning.com/' },
                { name: 'Pattern Recognition and ML', url: 'https://www.microsoft.com/en-us/research/publication/pattern-recognition-machine-learning/' },
              ].map((link) => (
                <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer"
                  className="block text-xs no-underline hover:underline" style={{ color: '#4A4A4A' }}>
                  {link.name}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-2" style={{ color: '#1E3A5F' }}>在线工具</h3>
            <div className="space-y-1.5">
              {[
                { name: 'WolframAlpha', url: 'https://www.wolframalpha.com/' },
                { name: 'Matrix Calculator', url: 'https://matrixcalc.org/' },
                { name: 'Desmos Graphing', url: 'https://www.desmos.com/calculator' },
              ].map((link) => (
                <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer"
                  className="block text-xs no-underline hover:underline" style={{ color: '#4A4A4A' }}>
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
