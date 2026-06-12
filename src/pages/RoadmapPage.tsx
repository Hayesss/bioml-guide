import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../hooks/useData';
import { useProgress } from '../hooks/useProgress';
import { Box, Cpu, Calculator, Code, ChevronDown, ChevronUp, Check, RefreshCw, Dna } from 'lucide-react';
import CodeBlock from '../components/CodeBlock';

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
  resources: { name: string; type: string }[];
}

export default function RoadmapPage() {
  const { data: stages, loading, error } = useData<Stage[]>('roadmap', true);
  const { data: topicsData } = useData<{topics: {key:string;name:string}[]}>('topics');
  const [openStage, setOpenStage] = useState<number | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { isTopicDone, toggleTopic, getOverallProgress, resetAll } = useProgress();

  // Build topic name → key lookup map for linking to learn pages
  const topicKeyMap = useMemo(() => {
    const map: Record<string, string> = {};
    if (topicsData?.topics) {
      for (const t of topicsData.topics) {
        map[t.name] = t.key;
      }
    }
    return map;
  }, [topicsData]);

  // Calculate all topic keys
  const allTopicKeys = useMemo(() => {
    if (!stages) return [];
    const keys: string[] = [];
    for (const stage of stages) {
      for (const t of stage.mlTopics) keys.push(`stage-${stage.id}-ml-${t.name}`);
      for (const t of stage.dlTopics) keys.push(`stage-${stage.id}-dl-${t.name}`);
      for (const t of stage.mathTopics) keys.push(`stage-${stage.id}-math-${t.name}`);
      for (const t of stage.bioinfoTopics || []) keys.push(`stage-${stage.id}-bioinfo-${t.name}`);
    }
    return keys;
  }, [stages]);

  const overall = getOverallProgress(allTopicKeys);

  const faqs = [
    {
      q: '没有编程基础可以学习吗？',
      a: '建议先掌握Python基础（2-4周），然后同步学习第一阶段的内容。推荐先完成"Python for Data Science"教程。',
    },
    {
      q: 'ML和DL应该同时学还是分开学？',
      a: '建议先掌握ML基础（阶段1-2），再深入DL（阶段3）。经典ML方法在很多生物信息学任务中仍然非常有效，且有助于理解DL的基本概念。',
    },
    {
      q: '需要什么样的计算资源？',
      a: '阶段1-2可在CPU上完成大部分练习。阶段3-4建议使用GPU，可使用Google Colab的免费GPU资源或实验室计算集群。',
    },
    {
      q: '每个阶段需要投入多少时间？',
      a: '建议每周投入10-15小时。阶段1约4-6周，阶段2约6-8周，阶段3约8-10周，阶段4为持续学习。',
    },
    {
      q: '如何选择研究方向？',
      a: '在阶段2结束时，通过实践项目了解各领域的特点。建议结合实验室需求和个人兴趣，在阶段3开始专注特定方向。',
    },
  ];

  if (loading) return <div className="p-8 text-sm text-brand-ink-muted">Loading...</div>;
  if (error || !stages) return <div className="p-8 text-sm text-brand-error">{error || '加载数据失败'}</div>;

  return (
    <div className="space-y-14">
      <div>
        <h1 className="text-3xl font-bold mb-3 text-brand-ink">学习路径</h1>
        <p className="text-base text-brand-ink-muted max-w-[600px]">
          从基础到专业，四个阶段系统掌握生物信息学中的机器学习与深度学习
        </p>

        {overall.total > 0 && (
          <div className="mt-5 border rounded-lg p-4 border-brand-border bg-brand-off-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-brand-ink">
                总体进度: {overall.pct}%
              </span>
              <div className="flex items-center gap-3">
                <span className="text-xs text-brand-ink-muted">
                  {overall.done}/{overall.total} 项已完成
                </span>
                {overall.done > 0 && (
                  <button
                    onClick={() => { if (confirm('确定要重置所有进度？')) resetAll(); }}
                    className="flex items-center gap-1 text-xs hover:underline text-brand-ink-muted"
                  >
                    <RefreshCw size={11} />
                    重置
                  </button>
                )}
              </div>
            </div>
            <div className="w-full h-2 rounded-full bg-brand-border-light">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  backgroundColor: overall.pct === 100 ? '#2D5A3D' : '#1E3A5F',
                  width: `${overall.pct}%`,
                }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {stages.map((stage) => {
          const open = openStage === stage.id;
          return (
            <div key={stage.id} className="border rounded-lg overflow-hidden border-brand-border">
              <button
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                onClick={() => setOpenStage(open ? null : stage.id)}
              >
                <div className="flex items-center gap-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold text-white bg-brand-accent">
                    {stage.id}
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-brand-ink">
                      {stage.name}
                    </h3>
                    <p className="text-xs text-brand-ink-muted">{stage.nameEn} · {stage.duration}</p>
                  </div>
                </div>
                {open ? <ChevronUp size={18} className="text-brand-ink-muted" /> : <ChevronDown size={18} className="text-brand-ink-muted" />}
              </button>

              {open && (
                <div className="px-6 pb-6 border-t border-brand-border-light">
                  <p className="text-sm mt-4 mb-5 text-brand-ink-light">{stage.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="rounded-lg p-4 bg-brand-accent-light">
                      <div className="flex items-center gap-2 mb-3">
                        <Box size={14} className="text-brand-accent" />
                        <h4 className="text-sm font-semibold text-brand-accent">机器学习</h4>
                      </div>
                      <ul className="space-y-3">
                        {stage.mlTopics.map((topic) => {
                          const key = `stage-${stage.id}-ml-${topic.name}`;
                          const done = isTopicDone(key);
                          return (
                          <li key={topic.name}>
                            <div
                              className="flex items-start gap-2 cursor-pointer"
                              onClick={() => toggleTopic(key)}
                            >
                              <span
                                className="w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-colors"
                                style={{
                                  borderColor: done ? '#2D5A3D' : '#CCCCCC',
                                  backgroundColor: done ? '#2D5A3D' : 'transparent',
                                }}
                              >
                                {done && <Check size={10} style={{ color: 'white' }} />}
                              </span>
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <div
                                    className="font-medium text-sm"
                                    style={{ color: done ? '#8A8A8A' : '#1A1A1A', textDecoration: done ? 'line-through' : 'none' }}
                                  >
                                    {topicKeyMap[topic.name] ? (
                                      <Link to={`/learn/${topicKeyMap[topic.name]}`} className="no-underline hover:underline" style={{ color: done ? '#8A8A8A' : '#1A1A5F' }}>
                                        {topic.name} <span className="text-[10px] opacity-40">↗</span>
                                      </Link>
                                    ) : (
                                      topic.name
                                    )}
                                  </div>
                                </div>
                                <div className="text-xs mt-0.5 text-brand-ink-medium" style={{ lineHeight: 1.6 }}>{topic.description}</div>
                              </div>
                            </div>
                          </li>
                          );
                        })}
                      </ul>
                    </div>

                    <div className="rounded-lg p-4 bg-brand-dl-light">
                      <div className="flex items-center gap-2 mb-3">
                        <Cpu size={14} className="text-brand-dl" />
                        <h4 className="text-sm font-semibold text-brand-dl">深度学习</h4>
                      </div>
                      <ul className="space-y-3">
                        {stage.dlTopics.map((topic) => {
                          const key = `stage-${stage.id}-dl-${topic.name}`;
                          const done = isTopicDone(key);
                          return (
                          <li key={topic.name}>
                            <div
                              className="flex items-start gap-2 cursor-pointer"
                              onClick={() => toggleTopic(key)}
                            >
                              <span
                                className="w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-colors"
                                style={{
                                  borderColor: done ? '#2D5A3D' : '#CCCCCC',
                                  backgroundColor: done ? '#2D5A3D' : 'transparent',
                                }}
                              >
                                {done && <Check size={10} style={{ color: 'white' }} />}
                              </span>
                              <div>
                                <div
                                  className="font-medium text-sm"
                                  style={{ color: done ? '#8A8A8A' : '#1A1A1A', textDecoration: done ? 'line-through' : 'none' }}
                                >
                                    {topicKeyMap[topic.name] ? (
                                      <Link to={`/learn/${topicKeyMap[topic.name]}`} className="no-underline hover:underline" style={{ color: done ? '#8A8A8A' : '#2D5A3D' }}>
                                        {topic.name} <span className="text-[10px] opacity-40">↗</span>
                                      </Link>
                                    ) : (
                                      topic.name
                                    )}
                                </div>
                                <div className="text-xs mt-0.5 text-brand-ink-medium" style={{ lineHeight: 1.6 }}>{topic.description}</div>
                              </div>
                            </div>
                          </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-5 rounded-lg p-4 border border-brand-border-light bg-brand-off-white">
                    <div className="flex items-center gap-2 mb-3">
                      <Calculator size={14} className="text-brand-ink-muted" />
                      <h4 className="text-sm font-semibold text-brand-ink-light">数学基础</h4>
                    </div>
                    <div className="space-y-2">
                      {stage.mathTopics.map((topic) => {
                        const key = `stage-${stage.id}-math-${topic.name}`;
                        const done = isTopicDone(key);
                        return (
                        <div key={topic.name}>
                          <div
                            className="flex items-start gap-2 cursor-pointer"
                            onClick={() => toggleTopic(key)}
                          >
                            <span
                              className="w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-colors"
                              style={{
                                borderColor: done ? '#2D5A3D' : '#CCCCCC',
                                backgroundColor: done ? '#2D5A3D' : 'transparent',
                              }}
                            >
                              {done && <Check size={10} style={{ color: 'white' }} />}
                            </span>
                            <div>
                              <div
                                className="font-medium text-xs"
                                style={{ color: done ? '#8A8A8A' : '#4A4A4A', textDecoration: done ? 'line-through' : 'none' }}
                              >
                                {topicKeyMap[topic.name] ? (
                                  <Link to={`/learn/${topicKeyMap[topic.name]}`} className="no-underline hover:underline text-brand-accent">
                                    {topic.name} <span className="text-[10px] opacity-40">↗</span>
                                  </Link>
                                ) : topic.mathId ? (
                                  <Link to={`/math`} className="no-underline hover:underline text-brand-accent">
                                    {topic.name} →
                                  </Link>
                                ) : (
                                  topic.name
                                )}
                              </div>
                              <div className="text-xs mt-0.5 text-brand-ink-muted" style={{ lineHeight: 1.5 }}>{topic.description}</div>
                            </div>
                          </div>
                        </div>
                        );
                      })}
                    </div>
                  </div>

                  {stage.bioinfoTopics && stage.bioinfoTopics.length > 0 && (
                    <div className="mt-5 rounded-lg p-4 border border-brand-border-light bg-[#E9F5EF]">
                      <div className="flex items-center gap-2 mb-3">
                        <Dna size={14} className="text-[#2F6B4F]" />
                        <h4 className="text-sm font-semibold text-[#2F6B4F]">生信流程</h4>
                      </div>
                      <div className="space-y-3">
                        {stage.bioinfoTopics.map((topic) => {
                          const key = `stage-${stage.id}-bioinfo-${topic.name}`;
                          const done = isTopicDone(key);
                          return (
                            <div key={topic.name}>
                              <div
                                className="flex items-start gap-2 cursor-pointer"
                                onClick={() => toggleTopic(key)}
                              >
                                <span
                                  className="w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-colors"
                                  style={{
                                    borderColor: done ? '#2D5A3D' : '#CCCCCC',
                                    backgroundColor: done ? '#2D5A3D' : 'transparent',
                                  }}
                                >
                                  {done && <Check size={10} style={{ color: 'white' }} />}
                                </span>
                                <div>
                                  <div
                                    className="font-medium text-sm"
                                    style={{ color: done ? '#8A8A8A' : '#1A1A1A', textDecoration: done ? 'line-through' : 'none' }}
                                  >
                                    {topicKeyMap[topic.name] ? (
                                      <Link to={`/learn/${topicKeyMap[topic.name]}`} className="no-underline hover:underline" style={{ color: done ? '#8A8A8A' : '#2F6B4F' }}>
                                        {topic.name} <span className="text-[10px] opacity-40">↗</span>
                                      </Link>
                                    ) : (
                                      topic.name
                                    )}
                                  </div>
                                  <div className="text-xs mt-0.5 text-brand-ink-medium" style={{ lineHeight: 1.6 }}>{topic.description}</div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="mt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Code size={14} className="text-brand-ink-muted" />
                      <h4 className="text-sm font-semibold text-brand-ink-light">工具</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {stage.tools.map((tool) => (
                        <span key={tool} className="text-xs px-2.5 py-1 rounded font-mono bg-brand-border-light text-brand-ink-light">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5">
                    <h4 className="text-sm font-semibold mb-3 text-brand-ink-light">实践项目</h4>
                    <div className="space-y-3">
                      {stage.projects.map((project) => (
                        <div key={project.name} className="border rounded-lg p-3 border-brand-border-light">
                          <h5 className="text-sm font-medium mb-1 text-brand-ink">{project.name}</h5>
                          <p className="text-xs text-brand-ink-muted">{project.description}</p>
                          {project.starterCode && (
                            <div className="mt-2">
                              <CodeBlock code={project.starterCode} label="Starter Code" collapsible />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5">
                    <h4 className="text-sm font-semibold mb-2 text-brand-ink-light">推荐资源</h4>
                    <div className="flex flex-wrap gap-2">
                      {stage.resources.map((res) => (
                        <span key={res.name} className="text-xs px-2.5 py-1 rounded bg-brand-accent-light text-brand-accent">
                          {res.name} ({res.type})
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Weekly breakdown */}
      <section>
        <h2 className="text-xl font-bold mb-5 text-brand-ink">阶段2-3周计划示例</h2>
        <div className="border rounded-lg overflow-hidden border-brand-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-brand-off-white">
                <th className="text-left px-4 py-3 font-semibold text-brand-ink">周次</th>
                <th className="text-left px-4 py-3 font-semibold text-brand-accent">ML内容</th>
                <th className="text-left px-4 py-3 font-semibold text-brand-dl">DL内容</th>
                <th className="text-left px-4 py-3 font-semibold text-brand-ink-light">数学/其他</th>
              </tr>
            </thead>
            <tbody>
              {[
                { week: '1', ml: 'SVM理论 + 基因分类实践', dl: 'CNN架构 + PyTorch实现', math: '矩阵分解 (SVD)' },
                { week: '2', ml: '随机森林 + 集成学习', dl: 'RNN/LSTM + 序列建模', math: '梯度下降变种 (Adam)' },
                { week: '3', ml: 'XGBoost + 超参数调优', dl: 'Embedding + 正则化', math: '概率分布进阶' },
                { week: '4', ml: 'PCA/t-SNE降维可视化', dl: 'BatchNorm + 学习率调度', math: '最大似然估计' },
                { week: '5', ml: '特征工程 + 模型选择', dl: '注意力机制初步', math: '信息论基础 (熵)' },
                { week: '6', ml: '模型解释性 (SHAP)', dl: 'Transformer完整实现', math: '交叉熵损失推导' },
                { week: '7', ml: '不平衡数据处理', dl: 'BERT预训练理解', math: 'KL散度' },
                { week: '8', ml: '项目整合与调优', dl: '迁移学习实践', math: '优化理论进阶' },
              ].map((row) => (
                <tr key={row.week} className="border-t border-brand-border-light">
                  <td className="px-4 py-3 font-mono font-medium text-brand-ink">{row.week}</td>
                  <td className="px-4 py-3 text-brand-ink-light">{row.ml}</td>
                  <td className="px-4 py-3 text-brand-ink-light">{row.dl}</td>
                  <td className="px-4 py-3 text-brand-ink-light">{row.math}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ */}
      <section>
        <h2 className="text-xl font-bold mb-5 text-brand-ink">常见问题</h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const open = openFaq === i;
            return (
              <div key={i} className="border rounded-lg border-brand-border">
                <button
                  className="w-full flex items-center justify-between px-5 py-3.5 text-left"
                  onClick={() => setOpenFaq(open ? null : i)}
                >
                  <span className="text-sm font-medium text-brand-ink">{faq.q}</span>
                  {open ? <ChevronUp size={16} className="text-brand-ink-muted" /> : <ChevronDown size={16} className="text-brand-ink-muted" />}
                </button>
                {open && (
                  <div className="px-5 pb-4 border-t border-brand-border-light">
                    <p className="text-sm pt-3 text-brand-ink-light" style={{ lineHeight: 1.7 }}>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
