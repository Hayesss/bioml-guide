import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Dna, Database, Layers, Microscope, GitBranch, Sparkles, Calculator, Box } from 'lucide-react';
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
    description: '单细胞转录组全流程分析：预处理、聚类、注释、轨迹、通讯、GRN、药物响应、元细胞、反卷积、报告、多组学整合与空间映射',
    topicKeys: [
      'single-preprocessing', 'single-clustering', 'single-annotation',
      'single-trajectory', 'single-communication', 'single-grn',
      'single-downstream', 'single-drug', 'single-metacell',
      'single-bulk2single', 'single-report',
      'single-multiomics', 'single-spatial'
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
    description: '45个跨组学共用算法，按降维、矩阵分解、聚类、统计检验、回归、网络、贝叶斯与特征选择分类，每个标注最适场景',
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
  {
    id: 'published-tools',
    label: '集成工具',
    icon: <Box size={15} />,
    description: 'OmicVerse 集成的78个已发表工具完整参考，含原始论文与代码仓库链接',
    topicKeys: [],
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
        <p className="text-sm text-brand-ink-muted mt-2">
          本页聚焦生信实验数据处理流程。ML/DL 理论与方法系统学习请前往
          <Link to="/roadmap" className="text-brand-accent hover:underline font-medium"> 学习路径</Link>
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

      {/* Published Tools Table — visible on published-tools tab */}
      {activeTab === 'published-tools' && <PublishedToolsTable />}

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

interface AlgoCategory {
  name: string;
  color: string;
  algorithms: AlgoScenario[];
}

const algoCategories: AlgoCategory[] = [
  {
    name: '降维',

    color: '#1E3A5F',
    algorithms: [
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
    ],
  },
  {
    name: '矩阵分解',

    color: '#2D5A3D',
    algorithms: [
      { name: 'NMF', bestFor: '基因程序发现、突变签名、去卷积', notFor: '需要方差解释时用PCA', omics: ['癌症基因组','scRNA','空间组'], key: 'common-nmf' },
      { name: 'SVD', bestFor: '去噪、填补、Hi-C标准化', notFor: '需要非负约束时用NMF', omics: ['Bulk RNA','Hi-C','scRNA'], key: 'common-svd' },
      { name: 'ICA', bestFor: '独立通路盲分离', notFor: '通路间存在已知相关', omics: ['基因表达','代谢组','fMRI'], key: 'common-ica' },
      { name: '张量分解', bestFor: '3D+数据——基因×时间×条件', notFor: '二维矩阵数据（用SVD）', omics: ['多时间点scRNA','多组学','Hi-C'], key: 'common-tensor-decomp' },
      { name: 'Robust PCA', bestFor: '异常样本检测、信号/噪声分离', notFor: '数据干净无异常时用PCA', omics: ['基因表达QC','Hi-C','时间序列'], key: 'common-robust-pca' },
      { name: '字典学习', bestFor: '比NMF更稀疏的模式发现', notFor: '需要稠密表示时用NMF', omics: ['基因程序','图像去噪'], key: 'common-dictionary-learning' },
      { name: '矩阵补全', bestFor: '单细胞dropout填补、药物筛选缺失值', notFor: '缺失率>90%时不可靠', omics: ['scRNA填补','药物筛选','PPI预测'], key: 'common-matrix-completion' },
      { name: 'CUR分解', bestFor: '选代表性基因/样本——可解释的列选择', notFor: '需要正交基时用SVD', omics: ['biomarker','单细胞sketching'], key: 'common-cur-decomp' },
      { name: 'MOFA详解', bestFor: '多组学共享因子——跨组学"通用翻译器"', notFor: '单组学数据', omics: ['Multiome','TCGA多组学'], key: 'common-mofa-details' },
    ],
  },
  {
    name: '聚类',
    color: '#5B3A7B',
    algorithms: [
      { name: 'K-means', bestFor: '快速粗聚类、球形分布、分子亚型', notFor: '非凸形状、有噪声点、不知道K', omics: ['Bulk RNA','甲基化','蛋白'], key: 'common-kmeans' },
      { name: 'DBSCAN/HDBSCAN', bestFor: '稀有细胞发现、任意形状簇、自动处理噪声', notFor: '均匀密度的球形簇（K-means更好）', omics: ['scRNA','CyTOF','空间组'], key: 'common-dbscan' },
      { name: 'GMM', bestFor: '概率软分配、过渡态细胞、CNV检测', notFor: '需要硬分配做下游差异分析', omics: ['scRNA','CNV','甲基化'], key: 'common-gmm' },
      { name: '层次聚类', bestFor: '样本/基因树+热图、可剪枝选择K', notFor: '大型数据集(>10000样本)', omics: ['Bulk RNA','蛋白','微生物组'], key: 'common-hierarchical-clustering' },
      { name: 'Leiden/Louvain', bestFor: '单细胞标准聚类、图社区检测、PPI模块', notFor: '需要手动指定K时用K-means', omics: ['scRNA','scATAC','PPI网络'], key: 'common-leiden-louvain' },
      { name: '谱聚类', bestFor: '非线性可分细胞群、Hi-C空间域', notFor: '大型数据集（计算量大）', omics: ['scRNA','Hi-C','蛋白构象'], key: 'common-spectral-clustering' },
      { name: 'MCL', bestFor: '蛋白质家族聚类、直系同源群', notFor: '需要重叠社区时用NOCD', omics: ['蛋白质组','序列分析'], key: 'common-mcl' },
    ],
  },
  {
    name: '统计检验与富集',
    color: '#8B4513',
    algorithms: [
      { name: 'Wilcoxon', bestFor: '非正态分布数据DEG、单细胞/微生物组差异', notFor: '正态分布且需要高统计功效时用t检验', omics: ['scRNA','微生物组','代谢组'], key: 'common-wilcoxon' },
      { name: 'Bootstrap', bestFor: '置信区间估计、系统发育支持率、无分布假设', notFor: '样本量极小(<20)时偏差大', omics: ['系统发育','DEG','网络'], key: 'common-bootstrap' },
      { name: '多重检验校正', bestFor: '任何大规模并行检验——必须！', notFor: '单个假设检验', omics: ['所有组学'], key: 'common-multiple-testing' },
      { name: 'ANOVA', bestFor: '多组(>=3)差异比较、多因素实验', notFor: '只有两组时用t检验/Wilcoxon', omics: ['Bulk RNA','蛋白','代谢组'], key: 'common-anova' },
      { name: 'KS检验', bestFor: '分布整体比较、GSEA的数学基础', notFor: '只关心均值/中位数差异', omics: ['GSEA','scRNA分布比较'], key: 'common-ks-test' },
      { name: 'GSEA/富集分析', bestFor: '通路功能解释——所有差异分析的下游', notFor: '单基因层面的分析', omics: ['所有组学'], key: 'common-gsea-enrichment' },
    ],
  },
  {
    name: '回归与生存分析',
    color: '#C53030',
    algorithms: [
      { name: 'Lasso/Ridge/ElasticNet', bestFor: 'biomarker选择、高维特征>样本数', notFor: '特征数<样本数且不需要选择', omics: ['Bulk RNA','多组学','药物'], key: 'common-lasso-ridge' },
      { name: 'Poisson/NB回归', bestFor: '计数数据建模（read count）', notFor: '连续型数据（用线性回归）', omics: ['RNA-seq','ATAC','ChIP'], key: 'common-poisson-nb' },
      { name: 'Cox PH', bestFor: '生存分析——"还能活多久"', notFor: '横断面数据（无时间信息）', omics: ['TCGA','临床研究'], key: 'common-cox-ph' },
      { name: '高斯过程', bestFor: '需要不确定性的预测——时间序列、贝叶斯优化', notFor: '只需要点预测+大规模数据', omics: ['时间序列','空间组','实验优化'], key: 'common-gaussian-processes' },
    ],
  },
  {
    name: '网络与关联分析',

    color: '#4A6741',
    algorithms: [
      { name: 'WGCNA', bestFor: '共表达模块+性状关联+hub gene', notFor: '样本量<15时网络不稳定', omics: ['Bulk RNA','蛋白','代谢组','甲基化'], key: 'common-wgcna' },
      { name: 'CCA', bestFor: '两组学关联——RNA↔ATAC、菌群↔代谢物', notFor: '超过2个组学时用MOFA', omics: ['scMultiome','微生物-代谢','影像-基因'], key: 'common-cca' },
      { name: 'GCN/GAT', bestFor: '图结构数据——PPI网络、分子图、细胞图', notFor: '无图结构的数据（先用KNN建图）', omics: ['蛋白功能','药物靶标','分子性质'], key: 'common-gcn-gat' },
    ],
  },
  {
    name: '贝叶斯与特征选择',
    color: '#6B4C8B',
    algorithms: [
      { name: '经验贝叶斯(limma)', bestFor: '小样本DEG——借全体基因信息稳定方差', notFor: '大量重复(>20)时与普通t检验差别小', omics: ['Bulk RNA','蛋白','甲基化'], key: 'common-empirical-bayes' },
      { name: 'EM算法', bestFor: '隐变量模型参数估计——GMM/Isoform/scVI', notFor: '没有隐变量时直接用MLE', omics: ['Isoform定量','GMM','scVI'], key: 'common-em-algorithm' },
      { name: 'SHAP', bestFor: '模型预测解释——"为什么这么预测？"', notFor: '线性模型（直接看系数即可）', omics: ['疾病预测','药物响应','biomarker'], key: 'common-shap' },
      { name: 'RFE/Boruta', bestFor: '严格的特征选择——必须比随机噪声好', notFor: '快速筛选（用Lasso即可）', omics: ['biomarker','多组学整合'], key: 'common-rfe-boruta' },
    ],
  },
];

function AlgorithmScenarioGuide() {
  const [openCategory, setOpenCategory] = useState<string | null>('降维');

  const totalCount = algoCategories.reduce((sum, c) => sum + c.algorithms.length, 0);

  return (
    <section className="border rounded-lg border-brand-border bg-brand-off-white overflow-hidden">
      <div className="px-4 py-3 flex items-center justify-between border-b border-brand-border-light">
        <h2 className="text-sm font-bold text-brand-ink">算法场景速查 —— 一句话选算法</h2>
        <span className="text-[11px] text-brand-ink-muted">{algoCategories.length} 类 · {totalCount} 个算法</span>
      </div>

      <div className="divide-y divide-brand-border-light">
        {algoCategories.map((cat) => {
          const open = openCategory === cat.name;
          return (
            <div key={cat.name}>
              {/* Category header — clickable toggle */}
              <button
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left hover:bg-white/50 transition-colors"
                onClick={() => setOpenCategory(open ? null : cat.name)}
              >
                <span className="text-xs font-semibold text-brand-ink">{cat.name}</span>
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                  style={{ backgroundColor: cat.color + '15', color: cat.color }}
                >
                  {cat.algorithms.length}
                </span>
                <span className="ml-auto text-[10px] text-brand-ink-muted">
                  {open ? '收起 ▲' : '展开 ▼'}
                </span>
              </button>

              {/* Category table — only render when open */}
              {open && (
                <div className="overflow-x-auto border-t border-brand-border-light">
                  <table className="w-full text-[11px] border-collapse">
                    <thead>
                      <tr className="bg-white/60">
                        <th className="text-left p-1.5 pl-4 font-semibold text-brand-ink w-[120px]">算法</th>
                        <th className="text-left p-1.5 font-semibold text-brand-ink w-[30%]">最适场景</th>
                        <th className="text-left p-1.5 font-semibold text-brand-ink-muted w-[25%]">不适合</th>
                        <th className="text-left p-1.5 font-semibold text-brand-ink-muted pr-4">适用组学</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cat.algorithms.map((a) => (
                        <tr key={a.key} className="border-t border-brand-border-light hover:bg-white transition-colors">
                          <td className="p-1.5 pl-4">
                            <a href={`/learn/${a.key}`} className="font-medium text-brand-accent hover:underline no-underline">
                              {a.name}
                            </a>
                          </td>
                          <td className="p-1.5 text-brand-dl">{a.bestFor}</td>
                          <td className="p-1.5 text-brand-ink-muted" style={{ lineHeight: 1.4 }}>{a.notFor}</td>
                          <td className="p-1.5 pr-4">
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
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ============================================================
// Published Tools Table — OmicVerse integrated tools from README
// ============================================================

interface PublishedTool {
  name: string;
  github: string;
  paper: string;
  description: string;
}

interface ToolCategory {
  name: string;
  color: string;
  tools: PublishedTool[];
}

const publishedToolCategories: ToolCategory[] = [
  {
    name: '核心预处理与可视化',
    color: '#1E3A5F',
    tools: [
      { name: 'Scanpy', github: 'https://github.com/scverse/scanpy', paper: 'https://link.springer.com/article/10.1186/s13059-017-1382-0', description: '单细胞分析基础框架，预处理/聚类/降维/差异分析一站式' },
      { name: 'COSG', github: 'https://github.com/genecell/COSG', paper: 'https://academic.oup.com/bib/advance-article-abstract/doi/10.1093/bib/bbab579/6511197', description: '基于余弦相似度的marker基因检测，比传统方法更快更准' },
      { name: 'PyComplexHeatmap', github: 'https://github.com/DingWB/PyComplexHeatmap', paper: 'https://doi.org/10.1002/imt2.115', description: 'Python复杂热图绘制，支持行列注释和图例组合' },
      { name: 'marsilea', github: 'https://github.com/Marsilea-viz/marsilea/', paper: 'https://genomebiology.biomedcentral.com/articles/10.1186/s13059-024-03469-3', description: '声明式生物学数据可视化框架，组合多个子图' },
      { name: 'sude', github: 'https://github.com/ZPGuiGroupWhu/sude', paper: 'https://www.nature.com/articles/s42256-025-01112-9', description: '可扩展无监督降维嵌入，OmicVerse自研方法' },
      { name: 'mellon', github: 'https://github.com/settylab/mellon', paper: 'https://www.nature.com/articles/s41592-024-02302-w', description: '基于高斯过程的单细胞状态空间推断' },
    ],
  },
  {
    name: '批次校正与数据整合',
    color: '#2D5A3D',
    tools: [
      { name: 'Harmony', github: 'https://github.com/slowkow/harmonypy/', paper: 'https://www.nature.com/articles/s41592-019-0619-0', description: '基于模糊聚类的迭代批次校正，速度快、适合大规模数据' },
      { name: 'Scanorama', github: 'https://github.com/brianhie/scanorama', paper: 'https://www.nature.com/articles/s41587-019-0113-3', description: '基于互近邻匹配的全景图拼接式批次整合' },
      { name: 'Combat', github: 'https://github.com/epigenelabs/pyComBat/', paper: 'https://doi.org/10.1101/2020.03.17.995431', description: '经验贝叶斯批次效应校正，Bulk和单细胞通用' },
      { name: 'scVI', github: 'https://github.com/scverse/scvi-tools', paper: 'https://doi.org/10.1038/s41587-021-01206-w', description: '深度生成模型批次校正与降维，概率建模框架' },
      { name: 'MIRA', github: 'https://github.com/cistrome/MIRA', paper: 'https://www.nature.com/articles/s41592-022-01595-z', description: '多视图信息富集分析，整合基因调控与表达视图' },
      { name: 'TAPE', github: 'https://github.com/poseidonchan/TAPE', paper: 'https://doi.org/10.1038/s41467-022-34550-9', description: '时间感知的蛋白表达分析，处理时序单细胞数据' },
    ],
  },
  {
    name: '细胞类型注释',
    color: '#5B3A7B',
    tools: [
      { name: 'SCSA', github: 'https://github.com/bioinfo-ibms-pumc/SCSA', paper: 'https://doi.org/10.3389/fgene.2020.00490', description: '基于细胞标记基因得分的自动注释' },
      { name: 'CellTypist', github: 'https://github.com/Teichlab/celltypist', paper: 'https://www.science.org/doi/10.1126/science.abl5197', description: '基于逻辑回归的跨组织层次化细胞注释' },
      { name: 'MetaTiME', github: 'https://github.com/yi-zhang/MetaTiME', paper: 'https://www.nature.com/articles/s41467-023-38333-8', description: '基于预训练元特征的肿瘤微环境注释' },
      { name: 'TOSICA', github: 'https://github.com/JackieHanLab/TOSICA', paper: 'https://doi.org/10.1038/s41467-023-35923-4', description: '基于Transformer的可解释细胞注释，揭示通路调控' },
      { name: 'GPTCelltype', github: 'https://github.com/Winnie09/GPTCelltype', paper: 'https://www.nature.com/articles/s41592-024-02235-4', description: '用GPT-4进行零样本细胞类型注释' },
      { name: 'scMulan', github: 'https://github.com/SuperBianC/scMulan', paper: 'https://link.springer.com/chapter/10.1007/978-1-0716-3989-4_57', description: '多标签细胞注释，可同时标注多个细胞身份维度' },
    ],
  },
  {
    name: '轨迹推断与RNA速度',
    color: '#8B4513',
    tools: [
      { name: 'StaVIA (VIA)', github: 'https://github.com/ShobiStassen/VIA', paper: 'https://www.nature.com/articles/s41467-021-25773-3', description: '基于图遍历的概率性轨迹推断，可处理复杂拓扑' },
      { name: 'Palantir', github: 'https://github.com/dpeerlab/Palantir', paper: 'https://doi.org/10.1038/s41587-019-0068-49', description: '基于随机游走的伪时间与分化潜能推断' },
      { name: 'Monocle 2', github: 'https://github.com/cole-trapnell-lab/monocle-release', paper: 'https://doi.org/10.1038/nmeth.4402', description: '经典轨迹推断，基于反向图嵌入的伪时间排序' },
      { name: 'CytoTRACE 2', github: 'https://github.com/digitalcytometry/cytotrace2', paper: 'https://doi.org/10.1101/2024.03.19.585637', description: '基于基因计数签名的发育潜能预测' },
      { name: 'scvelo', github: 'https://github.com/theislab/scvelo', paper: 'http://dx.doi.org/10.1038/s41587-020-0591-3', description: 'RNA速度基础框架，基于剪接动力学的方向推断' },
      { name: 'Dynamo', github: 'https://github.com/aristoteleo/dynamo-release', paper: 'https://www.sciencedirect.com/science/article/pii/S0092867421015774', description: '超越RNA速度——代谢标记和转录爆发建模' },
      { name: 'latentvelo', github: 'https://github.com/Spencerfar/LatentVelo', paper: 'https://www.cell.com/cell-reports-methods/fulltext/S2667-2375(23)00225-4', description: '隐空间RNA速度，在低维流形上推断动力学' },
      { name: 'graphvelo', github: 'https://github.com/xing-lab-pitt/GraphVelo', paper: 'https://www.nature.com/articles/s41467-025-62784-w', description: '基于图的RNA速度，利用邻居信息提升精度' },
      { name: 'scTour', github: 'https://github.com/LiQian-XC/scTour', paper: 'https://genomebiology.biomedcentral.com/articles/10.1186/s13059-023-02988-9', description: '多任务DL联合学习伪时间+向量场+隐空间，无需根细胞指定和剪接数据，支持跨数据集预测' },
      { name: 'regVelo', github: 'https://github.com/theislab/regvelo', paper: 'https://doi.org/10.1016/j.cell.2026.04.022', description: '基因调控驱动的RNA速度，GRN+剪接耦合变分推断，支持先验GRN(pySCENIC)、扰动模拟、不确定性量化' },
      { name: 'scProtVelo', github: 'https://github.com/theislab/scProtVelo', paper: 'https://doi.org/10.1126/science.adr8785', description: '翻译动力学建模，从配对scRNA+蛋白质组数据推断mRNA→蛋白质速度，扩展RNA速度到蛋白层面' },
    ],
  },
  {
    name: '细胞通讯',
    color: '#C53030',
    tools: [
      { name: 'CellPhoneDB', github: 'https://github.com/ventolab/CellphoneDB', paper: 'https://www.nature.com/articles/s41596-020-0292-x', description: '配体-受体互作数据库与分析框架，领域标准' },
      { name: 'COMMOT', github: 'https://github.com/zcang/COMMOT', paper: 'https://www.nature.com/articles/s41592-022-01728-4', description: '基于最优传输的空间细胞间通讯推断' },
      { name: 'flowsig', github: 'https://github.com/axelalmet/flowsig', paper: 'https://doi.org/10.1038/s41592-024-02380-w', description: '基于流模型的细胞通讯方向推断' },
      { name: 'MEBOCOST', github: 'https://github.com/kaifuchenlab/MEBOCOST', paper: 'https://doi.org/10.1093/nar/gkaf569', description: '代谢物介导的细胞间通讯推断' },
    ],
  },
  {
    name: '基因调控与网络',
    color: '#4A6741',
    tools: [
      { name: 'AUCell', github: 'https://github.com/aertslab/AUCell', paper: 'https://bioconductor.org/packages/AUCell', description: '基于AUC的基因集活性评分，识别活跃调控子' },
      { name: 'Hotspot', github: 'https://github.com/yoseflab/hotspot', paper: 'https://www.sciencedirect.com/science/article/pii/S2405471221001149', description: '基于信息论的基因模块与调控因子识别' },
      { name: 'Banksy', github: 'https://github.com/prabhakarlab/Banksy_py', paper: 'https://www.nature.com/articles/s41588-024-01664-3', description: '基于邻域图的细胞聚类与空间域识别' },
      { name: 'scTenifoldKnk', github: 'https://github.com/cailab-tamu/scTenifoldKnk', paper: 'https://doi.org/10.1016/j.patter.2022.100434', description: '基于张量分解的基因敲除效应预测' },
      { name: 'CONCORD', github: 'https://github.com/Gartner-Lab/Concord/', paper: 'https://www.nature.com/articles/s41587-025-02950-z', description: '基于最优传输的跨条件细胞状态对齐' },
    ],
  },
  {
    name: '多组学整合',
    color: '#6B4C8B',
    tools: [
      { name: 'MOFA', github: 'https://github.com/bioFAM/mofapy2', paper: 'https://genomebiology.biomedcentral.com/articles/10.1186/s13059-020-02015-1', description: '多组学因子分析，从多模态数据中发现隐藏因子' },
      { name: 'GLUE', github: 'https://github.com/gao-lab/GLUE', paper: 'https://www.nature.com/articles/s41587-022-01284-4', description: '基于图引导的跨组学数据对齐，知识引导的整合' },
      { name: 'SIMBA', github: 'https://github.com/pinellolab/simba', paper: 'https://www.nature.com/articles/s41592-023-01899-8', description: '基于图的单细胞多任务分析框架' },
      { name: 'CEFCON', github: 'https://github.com/WPZgithub/CEFCON', paper: 'https://www.nature.com/articles/s41467-023-44103-3', description: '基于对比学习的细胞命运调控网络推断' },
      { name: 'cellANOVA', github: 'https://github.com/Janezjz/cellanova', paper: 'https://www.nature.com/articles/s41587-024-02463-1', description: '多条件单细胞差异分析，方差分析框架' },
    ],
  },
  {
    name: '空间转录组',
    color: '#A0522D',
    tools: [
      { name: 'STAGATE', github: 'https://github.com/QIFEIDKN/STAGATE_pyG', paper: 'https://www.nature.com/articles/s41467-022-29439-6', description: '基于图注意力的空间域识别与降维' },
      { name: 'Tangram', github: 'https://github.com/broadinstitute/Tangram/', paper: 'https://www.nature.com/articles/s41592-021-01264-7', description: '深度学习将scRNA-seq映射到空间位置' },
      { name: 'STAligner', github: 'https://github.com/zhoux85/STAligner', paper: 'https://doi.org/10.1038/s43588-023-00528-w', description: '跨切片空间转录组对齐与整合' },
      { name: 'GraphST', github: 'https://github.com/JinmiaoChenLab/GraphST', paper: 'https://www.nature.com/articles/s41467-023-36796-3', description: '基于图自编码器的空间转录组分析' },
      { name: 'SLAT', github: 'https://github.com/gao-lab/SLAT', paper: 'https://www.nature.com/articles/s41467-023-43105-5', description: '跨技术空间数据对齐' },
      { name: 'PROST', github: 'https://github.com/Tang-Lab-super/PROST', paper: 'https://doi.org/10.1038/s41467-024-44835-w', description: '基于原型的空间转录组表示学习' },
      { name: 'STT', github: 'https://github.com/cliffzhou92/STT/', paper: 'https://www.nature.com/articles/s41592-024-02266-x', description: '基于Transformer的空间转录组建模' },
      { name: 'SpaceFlow', github: 'https://github.com/hongleir/SpaceFlow', paper: 'https://www.nature.com/articles/s41467-022-31739-w', description: '基于最优传输流空间域识别' },
      { name: 'SpatialDE', github: 'https://github.com/Teichlab/SpatialDE', paper: 'https://doi.org/10.1038/nmeth.4636', description: '空间表达变异基因检测' },
      { name: 'CellCharter', github: 'https://github.com/CSOgroup/cellcharter', paper: 'https://doi.org/10.1038/s41588-023-01588-4', description: '跨样本空间细胞状态识别' },
      { name: 'cell2location', github: 'https://github.com/BayraktarLab/cell2location', paper: 'https://doi.org/10.1038/s41587-021-01139-4', description: '贝叶斯模型推断空间细胞类型丰度' },
      { name: 'bin2cell', github: 'https://github.com/Teichlab/bin2cell', paper: 'https://doi.org/10.1093/bioinformatics/btae546', description: 'Visium HD bin到单细胞级别的重构' },
      { name: 'starfysh', github: 'https://github.com/azizilab/starfysh', paper: 'http://dx.doi.org/10.1038/s41587-024-02173-8', description: '基于变分推断的空间多模态整合' },
      { name: 'CAST', github: 'https://github.com/wanglab-broad/CAST', paper: 'https://www.nature.com/articles/s41592-024-02410-7', description: '基于Transformer的跨组织空间映射' },
      { name: 'spaco', github: 'https://github.com/BrainStOrmics/Spaco', paper: 'https://www.cell.com/patterns/fulltext/S2666-3899(23)00324-0', description: '空间邻近性感知的聚类优化' },
      { name: 'gsMap', github: 'https://yanglab.westlake.edu.cn/gsmap/document/software', paper: 'https://www.nature.com/articles/s41586-025-08757-x', description: '空间转录组的基因程序映射' },
      { name: 'COMPOSITE', github: 'https://github.com/CHPGenetics/COMPOSITE/', paper: 'https://www.nature.com/articles/s41467-024-49448-x', description: '多模态空间数据整合框架' },
      { name: 'GASTON', github: 'https://github.com/raphael-group/GASTON', paper: 'https://www.nature.com/articles/s41592-024-02503-3', description: '基于等距深度的空间域无监督分割' },
      { name: 'BINARY', github: 'https://github.com/senlin-lin/BINARY/', paper: 'https://www.sciencedirect.com/science/article/pii/S2666979X24001319', description: '空间二值化模式分析' },
    ],
  },
  {
    name: '反卷积',
    color: '#B8860B',
    tools: [
      { name: 'Bulk2Space', github: 'https://github.com/ZJUFanLab/bulk2space', paper: 'https://www.nature.com/articles/s41467-022-34271-z', description: '深度学习将Bulk数据反卷积到空间位置' },
      { name: 'Scaden', github: 'https://github.com/KevinMenden/scaden', paper: 'https://www.science.org/doi/10.1126/sciadv.aba2619', description: '基于深度神经网络的反卷积' },
      { name: 'BayesPrism', github: 'https://github.com/Danko-Lab/BayesPrism', paper: 'https://www.nature.com/articles/s43018-022-00356-3', description: '贝叶斯反卷积框架，同时推断比例与表达' },
      { name: 'InstaPrism', github: 'https://github.com/humengying0907/InstaPrism', paper: 'https://academic.oup.com/bioinformatics/article/40/7/btae440/7708397', description: 'BayesPrism的加速版本，保持精度的同时大幅提速' },
      { name: 'FlashDeconv', github: 'https://github.com/cafferychen777/FlashDeconv', paper: 'https://doi.org/10.64898/2025.12.22.696108', description: '超快速反卷积，支持大规模Bulk数据' },
      { name: 'SEACells', github: 'https://github.com/dpeerlab/SEACells', paper: 'https://www.nature.com/articles/s41587-023-01716-9', description: '基于亲和力传播的元细胞构建，保留稀有状态' },
    ],
  },
  {
    name: '基础模型',
    color: '#1E90FF',
    tools: [
      { name: 'Geneformer', github: 'https://huggingface.co/ctheodoris/Geneformer', paper: 'https://www.nature.com/articles/s41586-023-06139-9', description: '3000万细胞预训练Transformer，基因调控网络上下文学习' },
      { name: 'scGPT', github: 'https://github.com/bowang-lab/scGPT', paper: 'https://www.nature.com/articles/s41592-024-02201-0', description: '3300万细胞预训练生成式Transformer' },
      { name: 'scFoundation', github: 'https://github.com/biomap-research/scFoundation', paper: 'https://www.nature.com/articles/s41592-024-02305-7', description: '跨平台大规模单细胞基础模型' },
      { name: 'UCE', github: 'https://github.com/snap-stanford/UCE', paper: 'https://www.biorxiv.org/content/10.1101/2023.11.28.568918v1', description: '通用细胞嵌入——跨物种细胞类型映射' },
      { name: 'CellPLM', github: 'https://github.com/OmicsML/CellPLM', paper: 'https://www.biorxiv.org/content/10.1101/2023.10.03.560734v1', description: '空间感知的细胞预训练语言模型' },
    ],
  },
  {
    name: 'Bulk RNA-seq',
    color: '#556B2F',
    tools: [
      { name: 'PyDESeq2', github: 'https://github.com/owkin/PyDESeq2', paper: 'https://academic.oup.com/bioinformatics/article/39/9/btad547/7260507', description: 'DESeq2的Python实现，差异表达分析' },
      { name: 'WGCNA', github: 'http://www.genetics.ucla.edu/labs/horvath/CoexpressionNetwork/Rpackages/WGCNA', paper: 'https://bmcbioinformatics.biomedcentral.com/articles/10.1186/1471-2105-9-559', description: '加权基因共表达网络分析' },
      { name: 'pyWGCNA', github: 'https://github.com/mortazavilab/PyWGCNA', paper: 'https://doi.org/10.1093/bioinformatics/btad415', description: 'WGCNA的Python原生实现' },
      { name: 'GSEApy', github: 'https://github.com/zqfang/GSEApy', paper: 'https://academic.oup.com/bioinformatics/article-abstract/39/1/btac757/6847088', description: '基因集富集分析的Python实现' },
      { name: 'edgeR', github: 'https://bioconductor.org/packages/edgeR', paper: 'https://academic.oup.com/nar/article/doi/10.1093/nar/gkaf018/7973897', description: '经验贝叶斯差异表达分析，RNA-seq标准工具' },
      { name: 'kb-python', github: 'https://github.com/pachterlab/kb_python', paper: 'https://doi.org/10.1038/s41596-024-01057-0', description: 'kallisto/bustools Python封装，快速伪比对定量' },
    ],
  },
  {
    name: '代谢与功能分析',
    color: '#8B0000',
    tools: [
      { name: 'scFEA', github: 'https://github.com/changwn/scFEA', paper: 'https://doi.org/10.1101/gr.271205.120', description: '基于流量平衡的单细胞代谢通量估计' },
      { name: 'scMetabolism', github: 'https://github.com/wu-yc/scMetabolism', paper: 'https://doi.org/10.1158/2159-8290.cd-21-0316', description: '单细胞代谢活性定量分析' },
      { name: 'Compass', github: 'https://github.com/YosefLab/Compass', paper: 'https://doi.org/10.1016/j.cell.2021.05.045', description: '基于通量平衡的代谢状态评分' },
      { name: 'scDrug', github: 'https://github.com/ailabstw/scDrug', paper: 'https://www.sciencedirect.com/science/article/pii/S2001037022005505', description: '单细胞药物响应预测，基于CaDRReS模型' },
      { name: 'pertpy', github: 'https://github.com/scverse/pertpy', paper: 'https://www.biorxiv.org/content/early/2024/08/07/2024.08.04.606516', description: '单细胞扰动分析统一框架' },
    ],
  },
  {
    name: '序列比对与定量',
    color: '#2F4F4F',
    tools: [
      { name: 'STAR', github: 'https://github.com/alexdobin/STAR', paper: 'https://pubmed.ncbi.nlm.nih.gov/23104886/', description: 'RNA-seq比对黄金标准，超快剪接感知比对' },
      { name: 'fastp', github: 'https://github.com/OpenGene/fastp', paper: 'https://doi.org/10.1093/bioinformatics/bty560', description: 'FASTQ全功能预处理（QC/过滤/修整）' },
      { name: 'featureCounts', github: 'https://github.com/ShiLab-Bioinformatics/subread', paper: 'https://pubmed.ncbi.nlm.nih.gov/24227677/', description: '高效读段计数，从BAM到基因表达矩阵' },
      { name: 'inmoose', github: 'https://github.com/epigenelabs/inmoose', paper: 'https://www.nature.com/articles/s41598-025-03376-y', description: 'Python差异表达分析，DESeq2风格的独立实现' },
    ],
  },
  {
    name: '其他工具',
    color: '#708090',
    tools: [
      { name: 'dynamicTreeCut', github: 'https://github.com/kylessmith/dynamicTreeCut', paper: 'https://academic.oup.com/bioinformatics/article/24/5/719/200751', description: '动态树切割，自适应层次聚类簇数选择' },
      { name: 'NOCD', github: 'https://github.com/shchur/overlapping-community-detection', paper: 'https://arxiv.org/abs/1909.12201', description: '重叠社区检测，GNN用于图聚类' },
      { name: 'DoubletFinder', github: 'https://github.com/chris-mcginnis-ucsf/DoubletFinder', paper: 'https://www.cell.com/cell-systems/fulltext/S2405-4712(19)30073-0', description: '基于模拟的双细胞检测，单细胞QC必备' },
      { name: 'memento', github: 'https://github.com/yelabucsf/scrna-parameter-estimation', paper: 'https://www.cell.com/cell/fulltext/S0092-8674(24)01144-9', description: '单细胞均值-方差参数估计，统计功效分析' },
      { name: 'scICE', github: 'https://github.com/Mathbiomed/scICE', paper: 'https://www.nature.com/articles/s41467-025-60702-8', description: '基于最优传输的细胞状态转换推断' },
    ],
  },
];

function PublishedToolsTable() {
  const [openCat, setOpenCat] = useState<string | null>('核心预处理与可视化');

  const totalTools = publishedToolCategories.reduce((s, c) => s + c.tools.length, 0);

  return (
    <section className="border rounded-lg border-brand-border bg-brand-off-white overflow-hidden">
      <div className="px-4 py-3 flex items-center justify-between border-b border-brand-border-light">
        <h2 className="text-sm font-bold text-brand-ink">OmicVerse 集成工具参考</h2>
        <span className="text-[11px] text-brand-ink-muted">{publishedToolCategories.length} 类 · {totalTools} 个工具</span>
      </div>
      <p className="px-4 pt-3 pb-1 text-xs text-brand-ink-muted">
        以下工具均通过 OmicVerse 统一API调用。点击工具名跳转GitHub，点击📖跳转原始论文。
      </p>

      <div className="divide-y divide-brand-border-light mt-2">
        {publishedToolCategories.map((cat) => {
          const open = openCat === cat.name;
          return (
            <div key={cat.name}>
              <button
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left hover:bg-white/50 transition-colors"
                onClick={() => setOpenCat(open ? null : cat.name)}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="text-xs font-semibold text-brand-ink">{cat.name}</span>
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                  style={{ backgroundColor: cat.color + '15', color: cat.color }}
                >
                  {cat.tools.length}
                </span>
                <span className="ml-auto text-[10px] text-brand-ink-muted">
                  {open ? '收起 ▲' : '展开 ▼'}
                </span>
              </button>

              {open && (
                <div className="overflow-x-auto border-t border-brand-border-light">
                  <table className="w-full text-[11px] border-collapse">
                    <thead>
                      <tr className="bg-white/60">
                        <th className="text-left p-1.5 pl-6 font-semibold text-brand-ink w-[140px]">工具</th>
                        <th className="text-left p-1.5 font-semibold text-brand-ink-muted w-[50%]">功能描述</th>
                        <th className="text-left p-1.5 font-semibold text-brand-ink-muted pr-4 w-[100px]">论文</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cat.tools.map((tool) => (
                        <tr key={tool.name} className="border-t border-brand-border-light hover:bg-white transition-colors">
                          <td className="p-1.5 pl-6">
                            <a
                              href={tool.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium text-brand-accent hover:underline no-underline"
                            >
                              {tool.name}
                            </a>
                          </td>
                          <td className="p-1.5 text-brand-ink-light" style={{ lineHeight: 1.4 }}>
                            {tool.description}
                          </td>
                          <td className="p-1.5 pr-4">
                            <a
                              href={tool.paper}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-brand-ink-muted hover:text-brand-accent no-underline"
                              title="查看论文"
                            >
                              论文
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
