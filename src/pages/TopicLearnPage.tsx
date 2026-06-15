import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ArrowRight, FlaskConical } from 'lucide-react';
import CodeBlock from '../components/CodeBlock';
import QuizBase from '../components/QuizBase';
import type { QuizQuestion } from '../components/QuizBase';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorDisplay from '../components/ErrorDisplay';
import ChipLine from '../components/ChipLine';
import { sanitizeHTML } from '../utils/sanitize';
import { useData } from '../hooks/useData';

interface TopicSection {
  type: string;
  icon: string;
  title: string;
  content?: string;
  code?: string;
  output?: string;
  questions?: QuizQuestion[];
}

interface TopicCitation {
  id: string;
  label: string;
  url: string;
}

interface WorkflowModule {
  module_id: string;
  module_name: string;
  omics_type: string;
  module_type: string;
  biological_question: string;
  inputs: string[];
  outputs: string[];
  tools: string[];
  key_parameters: string[];
  qc_metrics: string[];
  decision_rules: string[];
  failure_modes: string[];
  upstream_modules: string[];
  downstream_modules: string[];
  cross_omics_interfaces: string[];
  ml_dl_connection: string;
  citations: string[];
}

interface Topic {
  key: string;
  name: string;
  stage: number;
  type: string;
  difficulty: string;
  prerequisites: string[];
  nextTopic?: string;
  citations?: TopicCitation[];
  workflowModules?: WorkflowModule[];
  sections: TopicSection[];
}

interface TopicsData {
  topicOrder: string[];
  topics: Topic[];
}

export default function TopicLearnPage() {
  const { topicKey } = useParams<{ topicKey: string }>();
  const navigate = useNavigate();
  const { data: topicsData, loading, error } = useData<TopicsData>('topics');

  if (loading) return <LoadingSpinner />;
  if (error || !topicsData || !topicKey) return <ErrorDisplay message={error || '专题数据加载失败'} />;

  const topic = topicsData.topics.find(t => t.key === topicKey);
  if (!topic) return <ErrorDisplay message={`专题「${topicKey}」不存在`} />;

  const currentIndex = topicsData.topicOrder.indexOf(topicKey);
  const prevKey = currentIndex > 0 ? topicsData.topicOrder[currentIndex - 1] : null;
  const nextKey = currentIndex < topicsData.topicOrder.length - 1 ? topicsData.topicOrder[currentIndex + 1] : null;
  const prevTopic = prevKey ? topicsData.topics.find(t => t.key === prevKey) : null;
  const nextTopic = nextKey ? topicsData.topics.find(t => t.key === nextKey) : null;

  const stageNames: Record<number, string> = {
    1: '基础入门',
    2: '核心方法',
    3: '进阶架构',
    4: '专业应用',
  };

  const typeNames: Record<string, string> = {
    ml: '机器学习',
    dl: '深度学习',
    math: '数学基础',
    bioinfo: '生物信息学',
  };

  const typeStyles: Record<string, string> = {
    ml: 'bg-brand-accent-light text-brand-accent',
    dl: 'bg-brand-dl-light text-brand-dl',
    math: 'bg-brand-warm text-brand-error',
    bioinfo: 'bg-brand-dl-light text-brand-dl',
  };

  const sectionBgColors: Record<string, string> = {
    analogy: 'bg-amber-50',
    concept: 'bg-white',
    expert: 'bg-yellow-50',
    how: 'bg-brand-off-white',
    bio: 'bg-brand-dl-light',
    code: 'bg-brand-accent-light',
    check: 'bg-purple-50',
  };

  const typeStyle = typeStyles[topic.type] ?? 'bg-brand-accent-light text-brand-accent';

  return (
    <div className="max-w-[800px] mx-auto py-8 px-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-brand-ink-muted mb-6">
        <Link to="/roadmap" className="hover:text-brand-accent no-underline transition-colors">
          学习路径
        </Link>
        <ChevronLeft size={10} className="rotate-180" />
        <span className="text-brand-ink-light">
          阶段{topic.stage}：{stageNames[topic.stage]}
        </span>
        <ChevronLeft size={10} className="rotate-180" />
        <span className="text-brand-ink-light">
          {typeNames[topic.type] || topic.type}
        </span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${typeStyle}`}>
            {typeNames[topic.type] || topic.type}
          </span>
          <span className="text-xs px-2 py-0.5 rounded bg-brand-border-light text-brand-ink-muted">
            {topic.difficulty}
          </span>
          <span className="text-xs text-brand-ink-muted">
            阶段{topic.stage} · {stageNames[topic.stage]}
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-brand-ink">{topic.name}</h1>
        {topic.citations && topic.citations.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {topic.citations.map((citation) => (
              <a
                key={citation.id}
                href={citation.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-2 py-0.5 rounded border no-underline hover:underline border-brand-border-light text-brand-ink-muted"
              >
                {citation.label}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Prerequisites */}
      {topic.prerequisites.length > 0 && (
        <div className="mb-6 border rounded-lg p-4 bg-brand-off-white border-brand-border-light">
          <p className="text-xs font-medium text-brand-ink-light mb-2">前置知识</p>
          <div className="flex flex-wrap gap-2">
            {topic.prerequisites.map(pre => {
              const preTopic = topicsData.topics.find(t => t.key === pre);
              return preTopic ? (
                <Link
                  key={pre}
                  to={`/learn/${pre}`}
                  className="text-xs px-2 py-0.5 rounded border no-underline hover:bg-gray-50 border-brand-border-light text-brand-accent"
                >
                  {preTopic.name}
                </Link>
              ) : (
                <span key={pre} className="text-xs px-2 py-0.5 rounded border border-brand-border-light text-brand-ink-muted">{pre}</span>
              );
            })}
          </div>
        </div>
      )}

      {/* Feynman Sections */}
      <div className="space-y-5">
        {topic.sections.map((section, i) => (
          <div
            key={i}
            className={`border rounded-lg overflow-hidden border-brand-border-light ${sectionBgColors[section.type] || 'bg-white'}`}
          >
            <div className="px-5 py-3 border-b border-brand-border-light flex items-center gap-2">
              <span className="text-lg">{section.icon}</span>
              <h2 className="text-sm font-semibold text-brand-ink">{section.title}</h2>
            </div>
            <div className="px-5 py-4">
              {section.content && (
                <div
                  className="text-sm leading-relaxed text-brand-ink-light"
                  style={{ lineHeight: 1.9 }}
                  dangerouslySetInnerHTML={{ __html: sanitizeHTML(section.content) }}
                />
              )}
              {section.code && (
                <div className="mt-2">
                  <CodeBlock code={section.code} label="代码" />
                </div>
              )}
              {section.output && (
                <div className="mt-2 border rounded-lg p-3 bg-brand-off-white border-brand-border-light">
                  <span className="text-xs font-medium text-brand-ink-muted">输出结果：</span>
                  <pre className="text-xs font-mono mt-1 text-brand-ink-light">{section.output}</pre>
                </div>
              )}
              {section.questions && (
                <QuizBase questions={section.questions as QuizQuestion[]} variant="compact" />
              )}
            </div>
          </div>
        ))}
      </div>

      {topic.workflowModules && topic.workflowModules.length > 0 && (
        <section className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-brand-ink">流程模块卡片</h2>
            <span className="text-xs text-brand-ink-muted">{topic.workflowModules.length} 个模块</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {topic.workflowModules.map((module) => (
              <div key={module.module_id} className="border rounded-lg p-4 border-brand-border-light bg-white">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h3 className="text-sm font-semibold text-brand-ink">{module.module_name}</h3>
                    <p className="text-xs mt-0.5 text-brand-ink-muted">{module.module_type} · {module.omics_type}</p>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-brand-off-white text-brand-ink-muted shrink-0">
                    {module.module_id}
                  </span>
                </div>
                <p className="text-xs text-brand-ink-light mb-3" style={{ lineHeight: 1.6 }}>
                  {module.biological_question}
                </p>
                <ChipLine label="输入" items={module.inputs} />
                <ChipLine label="输出" items={module.outputs} />
                <ChipLine label="工具" items={module.tools} />
                <ChipLine label="QC" items={module.qc_metrics} />
                <ChipLine label="决策" items={module.decision_rules} muted />
                <ChipLine label="跨组学接口" items={module.cross_omics_interfaces} />
                <div className="mt-2 text-xs text-brand-ink-muted" style={{ lineHeight: 1.5 }}>
                  <span className="font-medium text-brand-ink-light">ML/DL:</span> {module.ml_dl_connection}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Prev / Next navigation */}
      <div className="mt-10 pt-6 border-t border-brand-border-light flex items-center justify-between">
        {prevTopic ? (
          <Link
            to={`/learn/${prevTopic.key}`}
            className="flex items-center gap-1.5 text-sm no-underline hover:underline text-brand-ink-light"
          >
            <ChevronLeft size={15} />
            <div>
              <div className="text-xs text-brand-ink-muted">上一节</div>
              <div className="font-medium">{prevTopic.name}</div>
            </div>
          </Link>
        ) : (
          <div />
        )}

        <Link
          to="/roadmap"
          className="text-sm text-brand-ink-muted hover:underline no-underline"
        >
          返回学习路径
        </Link>

        {nextTopic ? (
          <Link
            to={`/learn/${nextTopic.key}`}
            className="flex items-center gap-1.5 text-sm no-underline hover:underline text-brand-accent text-right"
          >
            <div>
              <div className="text-xs text-brand-ink-muted">下一节</div>
              <div className="font-medium">{nextTopic.name}</div>
            </div>
            <ArrowRight size={15} />
          </Link>
        ) : (
          <div />
        )}
      </div>

      {/* Bottom CTA */}
      <div className="mt-8 border rounded-lg p-6 text-center bg-brand-off-white border-brand-border-light">
        <FlaskConical size={20} className="mx-auto mb-2 text-brand-accent" />
        <p className="text-sm text-brand-ink-light mb-3">
          学完这个专题了？回到学习路径继续下一个主题吧
        </p>
        <button
          onClick={() => navigate('/roadmap')}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-brand-accent text-white"
        >
          返回学习路径
        </button>
      </div>
    </div>
  );
}

