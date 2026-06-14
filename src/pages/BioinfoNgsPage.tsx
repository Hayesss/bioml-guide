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
    description: '31个跨组学共用算法，每个标注最适场景。覆盖降维、矩阵分解、聚类、统计检验、回归、网络分析、特征选择、贝叶斯方法',
    topicKeys: [
      'common-pca', 'common-sparse-pca', 'common-kernel-pca',
      'common-umap-tsne', 'common-tsne-details', 'common-umap-details',
      'common-mds', 'common-diffusion-maps',
      'common-isomap-lle', 'common-autoencoder',
      'common-pls-da', 'common-factor-analysis',
      'common-nmf', 'common-svd', 'common-ica',
      'common-tensor-decomp', 'common-robust-pca',
      'common-dictionary-learning', 'common-matrix-completion',
      'common-cur-decomp', 'common-mofa-details',
      'common-kmeans', 'common-dbscan', 'common-gmm', 'common-hierarchical-clustering',
      'common-leiden-louvain', 'common-spectral-clustering', 'common-mcl',
      'common-wilcoxon', 'common-bootstrap', 'common-multiple-testing',
      'common-anova', 'common-ks-test',
      'common-gsea-enrichment',
      'common-lasso-ridge', 'common-poisson-nb', 'common-cox-ph',
      'common-empirical-bayes', 'common-shap', 'common-em-algorithm',
      'common-wgcna', 'common-cca', 'common-gcn-gat',
      'common-rfe-boruta', 'common-gaussian-processes'
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

      {/* Algorithm Scenario Guide — visible on algorithms tab */}
      {activeTab === 'algorithms' && <AlgorithmScenarioGuide />}

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

// ============================================================
// Algorithm Scenario Guide
// ============================================================

interface AlgoScenario {
  name: string;
  bestFor: string;
  notFor: string;
  omics: string[];
  key: string;
}

const algoScenarios: AlgoScenario[] = [
  // 降维
  { name: 'PCA', bestFor: '线性降维、样本QC、去噪预处理', notFor: '非线性关系、需要可解释的loading', omics: ['Bulk RNA','scRNA','ATAC','Hi-C','甲基化'], key: 'common-pca' },
  { name: 'Sparse PCA', bestFor: 'biomarker发现、稀疏可解释loading', notFor: '保留全局方差结构', omics: ['Bulk RNA','单细胞'], key: 'common-sparse-pca' },
  { name: 'Kernel PCA', bestFor: '非线性基因关系、蛋白质折叠', notFor: '需要反向映射到原始特征', omics: ['基因调控','蛋白构象','代谢组'], key: 'common-kernel-pca' },
  { name: 't-SNE/UMAP', bestFor: '单细胞可视化、聚类展示', notFor: '保留全局距离', omics: ['scRNA','CyTOF','蛋白嵌入'], key: 'common-umap-tsne' },
  { name: 't-SNE 深度解析', bestFor: 'perplexity/learning_rate调参、陷阱规避', notFor: '大数据集(>10万)', omics: ['scRNA','CyTOF'], key: 'common-tsne-details' },
  { name: 'UMAP 深度解析', bestFor: 'n_neighbors/min_dist调参、新数据映射', notFor: '不需要可重复性', omics: ['scRNA','大数据集'], key: 'common-umap-details' },
  { name: 'MDS/NMDS', bestFor: '距离矩阵可视化、微生物组beta多样性', notFor: '需要原始特征loading', omics: ['微生物组','生态学'], key: 'common-mds' },
  { name: '扩散图/PHATE', bestFor: '全局轨迹结构、发育路径', notFor: '简单聚类可视化（UMAP更快）', omics: ['scRNA轨迹','蛋白构象'], key: 'common-diffusion-maps' },
  { name: 'Isomap/LLE', bestFor: '测地距离流形学习、Swiss roll展开', notFor: '噪声大的数据（Isomap对short-circuit敏感）', omics: ['发育轨迹','蛋白折叠'], key: 'common-isomap-lle' },
  { name: 'Autoencoder', bestFor: '非线性降维+去噪、scVI/DCA的基础', notFor: '需要可解释的线性loading', omics: ['scRNA去噪','批次校正','多组学'], key: 'common-autoencoder' },
  { name: 'PLS-DA', bestFor: '有监督降维——最大化组间分离、代谢组学标准方法', notFor: '无标签数据（用PCA）', omics: ['代谢组','微生物组','biomarker'], key: 'common-pls-da' },
  { name: '因子分析', bestFor: '隐藏调控因子发现、MOFA的基础', notFor: '只关心方差方向（用PCA）', omics: ['多组学','基因调控','scMultiome'], key: 'common-factor-analysis' },
  // 矩阵分解
  { name: 'NMF', bestFor: '基因程序发现、突变签名、去卷积', notFor: '需要方差解释时用PCA', omics: ['癌症基因组','scRNA','空间组'], key: 'common-nmf' },
  { name: 'SVD', bestFor: '去噪、填补、Hi-C标准化', notFor: '需要非负约束时用NMF', omics: ['Bulk RNA','Hi-C','scRNA'], key: 'common-svd' },
  { name: 'ICA', bestFor: '独立通路盲分离', notFor: '通路间存在已知相关', omics: ['基因表达','代谢组','fMRI'], key: 'common-ica' },
  { name: '张量分解', bestFor: '3D+数据——基因×时间×条件', notFor: '二维矩阵数据（用SVD）', omics: ['多时间点scRNA','多组学','Hi-C'], key: 'common-tensor-decomp' },
  { name: 'Robust PCA', bestFor: '异常样本检测、信号/噪声分离', notFor: '数据干净无异常时用PCA', omics: ['基因表达QC','Hi-C','时间序列'], key: 'common-robust-pca' },
  { name: '字典学习', bestFor: '比NMF更稀疏的模式发现', notFor: '需要稠密表示时用NMF', omics: ['基因程序','图像去噪'], key: 'common-dictionary-learning' },
  { name: '矩阵补全', bestFor: '单细胞dropout填补、药物筛选缺失值', notFor: '缺失率>90%时不可靠', omics: ['scRNA填补','药物筛选','PPI预测'], key: 'common-matrix-completion' },
  { name: 'CUR分解', bestFor: '选代表性基因/样本——可解释的列选择', notFor: '需要正交基时用SVD', omics: ['biomarker','单细胞sketching'], key: 'common-cur-decomp' },
  { name: 'MOFA详解', bestFor: '多组学共享因子——跨组学\"通用翻译器\"', notFor: '单组学数据', omics: ['Multiome','TCGA多组学'], key: 'common-mofa-details' },
  // 聚类
  { name: 'K-means', bestFor: '快速粗聚类、球形分布、分子亚型', notFor: '非凸形状、有噪声点、不知道K', omics: ['Bulk RNA','甲基化','蛋白'], key: 'common-kmeans' },
  { name: 'DBSCAN/HDBSCAN', bestFor: '稀有细胞发现、任意形状簇、自动处理噪声', notFor: '均匀密度的球形簇（K-means更好）', omics: ['scRNA','CyTOF','空间组'], key: 'common-dbscan' },
  { name: 'GMM', bestFor: '概率软分配、过渡态细胞、CNV检测', notFor: '需要硬分配做下游差异分析', omics: ['scRNA','CNV','甲基化'], key: 'common-gmm' },
  { name: '层次聚类', bestFor: '样本/基因树+热图、可剪枝选择K', notFor: '大型数据集(>10000样本)', omics: ['Bulk RNA','蛋白','微生物组'], key: 'common-hierarchical-clustering' },
  { name: 'Leiden/Louvain', bestFor: '单细胞标准聚类、图社区检测、PPI模块', notFor: '需要手动指定K时用K-means', omics: ['scRNA','scATAC','PPI网络'], key: 'common-leiden-louvain' },
  { name: '谱聚类', bestFor: '非线性可分细胞群、Hi-C空间域', notFor: '大型数据集（计算量大）', omics: ['scRNA','Hi-C','蛋白构象'], key: 'common-spectral-clustering' },
  { name: 'MCL', bestFor: '蛋白质家族聚类、直系同源群', notFor: '需要重叠社区时用NOCD', omics: ['蛋白质组','序列分析'], key: 'common-mcl' },
  // 统计检验
  { name: 'Wilcoxon', bestFor: '非正态分布数据DEG、单细胞/微生物组差异', notFor: '正态分布且需要高统计功效时用t检验', omics: ['scRNA','微生物组','代谢组'], key: 'common-wilcoxon' },
  { name: 'Bootstrap', bestFor: '置信区间估计、系统发育支持率、无分布假设', notFor: '样本量极小(<20)时偏差大', omics: ['系统发育','DEG','网络'], key: 'common-bootstrap' },
  { name: '多重检验校正', bestFor: '任何大规模并行检验——必须！', notFor: '单个假设检验', omics: ['所有组学'], key: 'common-multiple-testing' },
  { name: 'ANOVA', bestFor: '多组(>=3)差异比较、多因素实验', notFor: '只有两组时用t检验/Wilcoxon', omics: ['Bulk RNA','蛋白','代谢组'], key: 'common-anova' },
  { name: 'KS检验', bestFor: '分布整体比较、GSEA的数学基础', notFor: '只关心均值/中位数差异', omics: ['GSEA','scRNA分布比较'], key: 'common-ks-test' },
  // 功能分析
  { name: 'GSEA/富集分析', bestFor: '通路功能解释——所有差异分析的下游', notFor: '单基因层面的分析', omics: ['所有组学'], key: 'common-gsea-enrichment' },
  // 回归
  { name: 'Lasso/Ridge/ElasticNet', bestFor: 'biomarker选择、高维特征>样本数', notFor: '特征数<样本数且不需要选择', omics: ['Bulk RNA','多组学','药物'], key: 'common-lasso-ridge' },
  { name: 'Poisson/NB回归', bestFor: '计数数据建模（read count）', notFor: '连续型数据（用线性回归）', omics: ['RNA-seq','ATAC','ChIP'], key: 'common-poisson-nb' },
  { name: 'Cox PH', bestFor: '生存分析——\"还能活多久\"', notFor: '横断面数据（无时间信息）', omics: ['TCGA','临床研究'], key: 'common-cox-ph' },
  { name: '经验贝叶斯(limma)', bestFor: '小样本DEG——借全体基因信息稳定方差', notFor: '大量重复(>20)时与普通t检验差别小', omics: ['Bulk RNA','蛋白','甲基化'], key: 'common-empirical-bayes' },
  // 可解释性与学习
  { name: 'SHAP', bestFor: '模型预测解释——\"为什么这么预测？\"', notFor: '线性模型（直接看系数即可）', omics: ['疾病预测','药物响应','biomarker'], key: 'common-shap' },
  { name: 'EM算法', bestFor: '隐变量模型参数估计——GMM/Isoform/scVI', notFor: '没有隐变量时直接用MLE', omics: ['Isoform定量','GMM','scVI'], key: 'common-em-algorithm' },
  // 网络
  { name: 'WGCNA', bestFor: '共表达模块+性状关联+hub gene', notFor: '样本量<15时网络不稳定', omics: ['Bulk RNA','蛋白','代谢组','甲基化'], key: 'common-wgcna' },
  { name: 'CCA', bestFor: '两组学关联——RNA↔ATAC、菌群↔代谢物', notFor: '超过2个组学时用MOFA', omics: ['scMultiome','微生物-代谢','影像-基因'], key: 'common-cca' },
  { name: 'GCN/GAT', bestFor: '图结构数据——PPI网络、分子图、细胞图', notFor: '无图结构的数据（先用KNN建图）', omics: ['蛋白功能','药物靶标','分子性质'], key: 'common-gcn-gat' },
  // 特征选择与高级方法
  { name: 'RFE/Boruta', bestFor: '严格的特征选择——必须比随机噪声好', notFor: '快速筛选（用Lasso即可）', omics: ['biomarker','多组学整合'], key: 'common-rfe-boruta' },
  { name: '高斯过程', bestFor: '需要不确定性的预测——时间序列、贝叶斯优化', notFor: '只需要点预测+大规模数据', omics: ['时间序列','空间组','实验优化'], key: 'common-gaussian-processes' },
];

function AlgorithmScenarioGuide() {
  return (
    <section className="border rounded-lg p-4 border-brand-border bg-brand-off-white">
      <h2 className="text-sm font-bold text-brand-ink mb-3">算法场景速查 —— 一句话选算法</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-[11px] border-collapse">
          <thead>
            <tr className="border-b border-brand-border">
              <th className="text-left p-1.5 font-semibold text-brand-ink">算法</th>
              <th className="text-left p-1.5 font-semibold text-brand-ink w-[30%]">最适场景</th>
              <th className="text-left p-1.5 font-semibold text-brand-ink-muted w-[25%]">不适合</th>
              <th className="text-left p-1.5 font-semibold text-brand-ink-muted">适用组学</th>
            </tr>
          </thead>
          <tbody>
            {algoScenarios.map((a) => (
              <tr key={a.key} className="border-b border-brand-border-light hover:bg-white transition-colors">
                <td className="p-1.5">
                  <a href={`/learn/${a.key}`} className="font-medium text-brand-accent hover:underline no-underline">
                    {a.name}
                  </a>
                </td>
                <td className="p-1.5 text-brand-dl">{a.bestFor}</td>
                <td className="p-1.5 text-brand-ink-muted" style={{ lineHeight: 1.4 }}>{a.notFor}</td>
                <td className="p-1.5">
                  <div className="flex flex-wrap gap-0.5">
                    {a.omics.map((o) => (
                      <span key={o} className="text-[10px] px-1 py-0.5 rounded bg-white border border-brand-border-light text-brand-ink-light">{o}</span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
