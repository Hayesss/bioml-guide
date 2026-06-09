import { useState } from 'react';
import { useData } from '../hooks/useData';
import { Box, Cpu, Calculator, Code, ChevronDown, ChevronUp } from 'lucide-react';

interface Stage {
  id: number;
  name: string;
  nameEn: string;
  duration: string;
  description: string;
  mlTopics: { name: string; description: string }[];
  dlTopics: { name: string; description: string }[];
  mathTopics: { name: string; description: string }[];
  tools: string[];
  projects: { name: string; description: string }[];
  resources: { name: string; type: string }[];
}

export default function RoadmapPage() {
  const stages = useData<Stage[]>('roadmap');
  const [openStage, setOpenStage] = useState<number | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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

  if (!stages) return <div className="p-8 text-sm" style={{ color: '#8A8A8A' }}>Loading...</div>;

  return (
    <div className="space-y-14">
      <div>
        <h1 className="text-3xl font-bold mb-3" style={{ color: '#1A1A1A' }}>学习路径</h1>
        <p className="text-base" style={{ color: '#8A8A8A', maxWidth: 600 }}>
          从基础到专业，四个阶段系统掌握生物信息学中的机器学习与深度学习
        </p>
      </div>

      <div className="space-y-6">
        {stages.map((stage) => {
          const open = openStage === stage.id;
          return (
            <div key={stage.id} className="border rounded-lg overflow-hidden" style={{ borderColor: '#E5E5E5' }}>
              <button
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                onClick={() => setOpenStage(open ? null : stage.id)}
              >
                <div className="flex items-center gap-4">
                  <span
                    className="flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold text-white"
                    style={{ backgroundColor: '#1E3A5F' }}
                  >
                    {stage.id}
                  </span>
                  <div>
                    <h3 className="text-base font-semibold" style={{ color: '#1A1A1A' }}>
                      {stage.name}
                    </h3>
                    <p className="text-xs" style={{ color: '#8A8A8A' }}>{stage.nameEn} · {stage.duration}</p>
                  </div>
                </div>
                {open ? <ChevronUp size={18} style={{ color: '#8A8A8A' }} /> : <ChevronDown size={18} style={{ color: '#8A8A8A' }} />}
              </button>

              {open && (
                <div className="px-6 pb-6 border-t" style={{ borderColor: '#EEEEEE' }}>
                  <p className="text-sm mt-4 mb-5" style={{ color: '#4A4A4A' }}>{stage.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="rounded-lg p-4" style={{ backgroundColor: '#E8EDF2' }}>
                      <div className="flex items-center gap-2 mb-3">
                        <Box size={14} style={{ color: '#1E3A5F' }} />
                        <h4 className="text-sm font-semibold" style={{ color: '#1E3A5F' }}>机器学习</h4>
                      </div>
                      <ul className="space-y-3">
                        {stage.mlTopics.map((topic) => (
                          <li key={topic.name}>
                            <div className="font-medium text-sm" style={{ color: '#1A1A1A' }}>{topic.name}</div>
                            <div className="text-xs mt-0.5" style={{ color: '#6A6A6A', lineHeight: 1.6 }}>{topic.description}</div>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-lg p-4" style={{ backgroundColor: '#E8F0E9' }}>
                      <div className="flex items-center gap-2 mb-3">
                        <Cpu size={14} style={{ color: '#2D5A3D' }} />
                        <h4 className="text-sm font-semibold" style={{ color: '#2D5A3D' }}>深度学习</h4>
                      </div>
                      <ul className="space-y-3">
                        {stage.dlTopics.map((topic) => (
                          <li key={topic.name}>
                            <div className="font-medium text-sm" style={{ color: '#1A1A1A' }}>{topic.name}</div>
                            <div className="text-xs mt-0.5" style={{ color: '#6A6A6A', lineHeight: 1.6 }}>{topic.description}</div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-5 rounded-lg p-4 border" style={{ borderColor: '#EEEEEE', backgroundColor: '#FAFAFA' }}>
                    <div className="flex items-center gap-2 mb-3">
                      <Calculator size={14} style={{ color: '#8A8A8A' }} />
                      <h4 className="text-sm font-semibold" style={{ color: '#4A4A4A' }}>数学基础</h4>
                    </div>
                    <div className="space-y-2">
                      {stage.mathTopics.map((topic) => (
                        <div key={topic.name}>
                          <div className="font-medium text-xs" style={{ color: '#4A4A4A' }}>{topic.name}</div>
                          <div className="text-xs mt-0.5" style={{ color: '#8A8A8A', lineHeight: 1.5 }}>{topic.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Code size={14} style={{ color: '#8A8A8A' }} />
                      <h4 className="text-sm font-semibold" style={{ color: '#4A4A4A' }}>工具</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {stage.tools.map((tool) => (
                        <span key={tool} className="text-xs px-2.5 py-1 rounded font-mono" style={{ backgroundColor: '#EEEEEE', color: '#4A4A4A' }}>
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5">
                    <h4 className="text-sm font-semibold mb-3" style={{ color: '#4A4A4A' }}>实践项目</h4>
                    <div className="space-y-3">
                      {stage.projects.map((project) => (
                        <div key={project.name} className="border rounded-lg p-3" style={{ borderColor: '#EEEEEE' }}>
                          <h5 className="text-sm font-medium mb-1" style={{ color: '#1A1A1A' }}>{project.name}</h5>
                          <p className="text-xs" style={{ color: '#8A8A8A' }}>{project.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5">
                    <h4 className="text-sm font-semibold mb-2" style={{ color: '#4A4A4A' }}>推荐资源</h4>
                    <div className="flex flex-wrap gap-2">
                      {stage.resources.map((res) => (
                        <span key={res.name} className="text-xs px-2.5 py-1 rounded" style={{ backgroundColor: '#E8EDF2', color: '#1E3A5F' }}>
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
        <h2 className="text-xl font-bold mb-5" style={{ color: '#1A1A1A' }}>阶段2-3周计划示例</h2>
        <div className="border rounded-lg overflow-hidden" style={{ borderColor: '#E5E5E5' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: '#FAFAFA' }}>
                <th className="text-left px-4 py-3 font-semibold" style={{ color: '#1A1A1A' }}>周次</th>
                <th className="text-left px-4 py-3 font-semibold" style={{ color: '#1E3A5F' }}>ML内容</th>
                <th className="text-left px-4 py-3 font-semibold" style={{ color: '#2D5A3D' }}>DL内容</th>
                <th className="text-left px-4 py-3 font-semibold" style={{ color: '#4A4A4A' }}>数学/其他</th>
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
                <tr key={row.week} className="border-t" style={{ borderColor: '#EEEEEE' }}>
                  <td className="px-4 py-3 font-mono font-medium" style={{ color: '#1A1A1A' }}>{row.week}</td>
                  <td className="px-4 py-3" style={{ color: '#4A4A4A' }}>{row.ml}</td>
                  <td className="px-4 py-3" style={{ color: '#4A4A4A' }}>{row.dl}</td>
                  <td className="px-4 py-3" style={{ color: '#4A4A4A' }}>{row.math}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ */}
      <section>
        <h2 className="text-xl font-bold mb-5" style={{ color: '#1A1A1A' }}>常见问题</h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const open = openFaq === i;
            return (
              <div key={i} className="border rounded-lg" style={{ borderColor: '#E5E5E5' }}>
                <button
                  className="w-full flex items-center justify-between px-5 py-3.5 text-left"
                  onClick={() => setOpenFaq(open ? null : i)}
                >
                  <span className="text-sm font-medium" style={{ color: '#1A1A1A' }}>{faq.q}</span>
                  {open ? <ChevronUp size={16} style={{ color: '#8A8A8A' }} /> : <ChevronDown size={16} style={{ color: '#8A8A8A' }} />}
                </button>
                {open && (
                  <div className="px-5 pb-4 border-t" style={{ borderColor: '#EEEEEE' }}>
                    <p className="text-sm pt-3" style={{ color: '#4A4A4A', lineHeight: 1.7 }}>{faq.a}</p>
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
