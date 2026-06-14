import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Dna, Database, Layers, Microscope, GitBranch, Sparkles, Calculator } from 'lucide-react';
import { useData } from '../hooks/useData';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorDisplay from '../components/ErrorDisplay';
import ChipLine from '../components/ChipLine';

interface TopicSection {
  type: string;
  title: string;
  content?: string;
}

interface WorkflowModule {
  module_id: string;
  module_name: string;
  module_type: string;
  omics_type: string;
  biological_question: string;
  inputs: string[];
  outputs: string[];
  tools: string[];
  key_parameters?: string[];
  qc_metrics: string[];
  decision_rules: string[];
  failure_modes?: string[];
  upstream_modules?: string[];
  downstream_modules?: string[];
  cross_omics_interfaces: string[];
  ml_dl_connection: string;
}

interface Topic {
  key: string;
  name: string;
  stage: number;
  type: string;
  difficulty: string;
  prerequisites: string[];
  sections: TopicSection[];
  workflowModules?: WorkflowModule[];
  interfaceSpec?: Record<string, string[]>;
}

interface TopicsData {
  topicOrder: string[];
  topics: Topic[];
}

interface OmicsTab {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  topicKeys: string[];
}

const omicsTabs: OmicsTab[] = [
  {
    id: 'transcriptomics',
    label: '转录组学',
    icon: <Dna size={15} />,
    description: '从 FASTQ 到差异表达基因的完整 RNA-seq 分析流程',
    topicKeys: ['ngs-fastq-qc', 'genome-alignment', 'count-matrix', 'rnaseq-deseq2'],
  },
  {
    id: 'epigenomics',
    label: '表观组学',
    icon: <GitBranch size={15} />,
    description: 'CUT&Tag 组蛋白修饰、ATAC-seq 染色质可及性、Hi-C 三维基因组',
    topicKeys: ['cuttag-analysis', 'atacseq-analysis', 'bulk-hic-analysis', 'single-cell-hic'],
  },
  {
    id: 'single-cell',
    label: '单细胞组学',
    icon: <Microscope size={15} />,
    description: '单细胞转录组全流程分析：预处理、聚类、注释、轨迹、通讯、GRN、多组学整合与空间映射',
    topicKeys: [
      'single-preprocessing', 'single-clustering', 'single-annotation',
      'single-trajectory', 'single-communication', 'single-grn',
      'single-downstream', 'single-multiomics', 'single-spatial'
    ],
  },
  {
    id: 'foundation',
    label: '基础模型',
    icon: <Sparkles size={15} />,
    description: '单细胞基础模型（scGPT/GeneFormer/scFoundation/UCE/CellPLM/scBERT等），ov.fm统一API',
    topicKeys: ['foundation-models'],
  },
  {
    id: 'multiomics',
    label: '多组学整合',
    icon: <Layers size={15} />,
    description: '跨组学数据整合与接口规范',
    topicKeys: ['multiomics-integration'],
  },
  {
    id: 'algorithms',
    label: '共用算法',
    icon: <Calculator size={15} />,
    description: '跨组学共用算法：降维(PCA/t-SNE/UMAP/MDS)、矩阵分解(NMF/SVD/ICA)、聚类(K-means/DBSCAN/GMM/谱聚类/层次/Leiden)、统计检验(Wilcoxon/Bootstrap/多重校正)、富集分析(GSEA)、正则化(Lasso/Ridge)、网络(WGCNA)、关联(CCA)',
    topicKeys: [
      'common-pca', 'common-umap-tsne', 'common-mds',
      'common-nmf', 'common-svd', 'common-ica',
      'common-kmeans', 'common-dbscan', 'common-gmm',
      'common-hierarchical-clustering', 'common-leiden-louvain', 'common-spectral-clustering',
      'common-wilcoxon', 'common-bootstrap', 'common-multiple-testing',
      'common-gsea-enrichment',
      'common-lasso-ridge', 'common-wgcna', 'common-cca'
    ],
  },
];

export default function BioinfoNgsPage() {
  const { data, loading, error } = useData<TopicsData>('topics');
  const [activeTab, setActiveTab] = useState('epigenomics');

  if (loading) return <LoadingSpinner />;
  if (error || !data) return <ErrorDisplay message={error || '数据加载失败'} />;

  const activeOmics = omicsTabs.find((t) => t.id === activeTab) ?? omicsTabs[0]!;
  const topics = activeOmics.topicKeys
    .map((key) => data.topics.find((topic) => topic.key === key))
    .filter((topic): topic is Topic => Boolean(topic));

  // Collect workflow modules from all visible topics
  const workflowTopics = topics.filter((t) => t.workflowModules && t.workflowModules.length > 0);
  const integration = topics.find((t) => t.key === 'multiomics-integration');

  return (
    <div className="space-y-10">
      {/* Header */}
      <header>
        <div className="flex items-center gap-2 mb-3">
          <Dna size={20} className="text-brand-dl" />
          <h1 className="text-3xl font-bold text-brand-ink">生信NGS流程</h1>
        </div>
        <p className="text-base text-brand-ink-muted max-w-[800px]" style={{ lineHeight: 1.8 }}>
          覆盖转录组学、表观组学、单细胞组学和多组学整合的完整生信分析流程。
          通过顶部Tab切换组学类型，每个专题包含可执行的代码、最佳实践和AI Skill支持。
        </p>
      </header>

      {/* Omics Type Selector */}
      <section>
        <div className="flex flex-wrap gap-2 mb-5">
          {omicsTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                activeTab === tab.id
                  ? 'bg-brand-accent text-white border-brand-accent'
                  : 'bg-white text-brand-ink-light border-brand-border hover:bg-brand-off-white'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
        <p className="text-sm text-brand-ink-muted" style={{ lineHeight: 1.6 }}>
          {activeOmics.description}
        </p>
      </section>

      {/* Topic Cards Grid */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Layers size={17} className="text-brand-accent" />
          <h2 className="text-lg font-bold text-brand-ink">专题导航</h2>
          <span className="text-[11px] text-brand-ink-extra-muted ml-2">点击进入完整教程</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {topics.map((topic, index) => (
            <Link
              key={topic.key}
              to={`/learn/${topic.key}`}
              className="border rounded-lg p-4 no-underline hover:shadow-sm transition-shadow border-brand-border bg-white"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold text-white bg-brand-accent">
                    {index + 1}
                  </span>
                  <h3 className="text-sm font-semibold text-brand-ink">{topic.name}</h3>
                </div>
                <span className="text-xs px-2 py-0.5 rounded bg-brand-off-white text-brand-ink-muted">
                  {topic.difficulty}
                </span>
              </div>
              <p className="text-xs text-brand-ink-muted mb-3" style={{ lineHeight: 1.6 }}>
                {topic.sections.find((section) => section.type === 'concept')?.content?.replace(/<[^>]*>/g, '').slice(0, 120) || topic.difficulty}
              </p>
              <div className="flex items-center gap-1.5 text-xs font-medium text-brand-dl">
                进入专题
                <ArrowRight size={13} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Workflow Modules — shown per topic with modules */}
      {workflowTopics.length > 0 && (
        <section className="space-y-8">
          <div className="flex items-center gap-2">
            <Database size={17} className="text-brand-accent" />
            <h2 className="text-lg font-bold text-brand-ink">模块化流程卡片</h2>
          </div>
          {workflowTopics.map((wt) => (
            <div key={wt.key}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-brand-ink">{wt.name}</h3>
                <Link to={`/learn/${wt.key}`} className="text-xs no-underline hover:underline text-brand-accent">
                  查看完整专题
                </Link>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                {wt.workflowModules!.map((module) => (
                  <article key={module.module_id} className="border rounded-lg p-4 border-brand-border bg-white hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h4 className="text-sm font-semibold text-brand-ink">{module.module_name}</h4>
                        <p className="text-xs mt-0.5 text-brand-ink-muted">{module.module_type} · {module.omics_type}</p>
                      </div>
                      <Check size={14} className="text-brand-dl shrink-0" />
                    </div>
                    <p className="text-xs text-brand-ink-light mb-3" style={{ lineHeight: 1.6 }}>
                      {module.biological_question}
                    </p>
                    <ChipLine label="输入" items={module.inputs} />
                    <ChipLine label="输出" items={module.outputs} />
                    <ChipLine label="工具" items={module.tools} />
                    {module.cross_omics_interfaces.length > 0 && (
                      <ChipLine label="跨组学接口" items={module.cross_omics_interfaces} />
                    )}
                    <p className="text-xs text-brand-ink-muted mt-2 pt-2 border-t border-brand-border-light" style={{ lineHeight: 1.5 }}>
                      <span className="font-medium text-brand-ink-light">ML/DL:</span> {module.ml_dl_connection}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Multiomics Interface Spec */}
      {integration?.interfaceSpec && (
        <section className="border rounded-lg p-5 border-brand-border bg-brand-off-white">
          <h2 className="text-lg font-bold mb-4 text-brand-ink">多组学接口规范</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(integration.interfaceSpec).map(([name, fields]) => (
              <div key={name} className="bg-white border rounded-lg p-3 border-brand-border-light">
                <div className="text-xs font-semibold font-mono mb-2 text-brand-accent">{name}</div>
                <div className="flex flex-wrap gap-1">
                  {fields.map((field) => (
                    <span key={field} className="text-xs px-2 py-0.5 rounded border border-brand-border-light text-brand-ink-muted">
                      {field}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
