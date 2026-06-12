import { useState } from 'react';
import { ArrowRight, Sparkles, Cpu, Zap, Database, BookOpen, ChevronDown, ChevronUp, ExternalLink, Terminal, Layers } from 'lucide-react';
import CodeBlock from '../components/CodeBlock';

interface FoundationModel {
  name: string;
  category: string;
  description: string;
  architecture: string;
  inputType: string;
  outputType: string;
  publication: string;
  github: string;
  paperUrl: string;
  keyFeatures: string[];
  ovAPI: string[];
  useCases: string[];
}

const skillReadyModels: FoundationModel[] = [
  {
    name: 'scGPT',
    category: 'Skill-Ready',
    description: '基于GPT架构的单细胞生成式预训练Transformer。在3300万个人类细胞上预训练，能够进行细胞类型注释、基因扰动预测、多组学整合和虚拟药物筛选。',
    architecture: 'GPT Transformer + Flash Attention',
    inputType: '基因表达矩阵 (AnnData)',
    outputType: '细胞嵌入 / 基因嵌入 / 扰动预测 / 细胞类型标签',
    publication: 'Cui et al., Nature Methods (2024)',
    github: 'bowang-lab/scGPT',
    paperUrl: 'https://www.nature.com/articles/s41592-024-02201-0',
    keyFeatures: [
      '3300万细胞预训练',
      '零样本细胞类型注释',
      '基因扰动响应预测',
      '多组学数据整合（scRNA+scATAC）',
      '生成虚拟单细胞数据',
      '条件生成（conditioned generation）'
    ],
    ovAPI: [
      'ov.fm.load_model("scGPT")',
      'ov.fm.embed("scGPT", adata)',
      'ov.fm.annotate("scGPT", adata)',
      'ov.fm.predict_perturbation("scGPT", adata, genes)'
    ],
    useCases: ['大规模图谱细胞注释', 'CRISPR扰动预测', '药物靶点发现', '虚拟细胞生成']
  },
  {
    name: 'GeneFormer',
    category: 'Skill-Ready',
    description: '在3000万个人类细胞上预训练的基因表达基础模型。使用掩码语言模型目标学习基因调控网络，擅长预测基因功能和调控关系。',
    architecture: 'Transformer Encoder + MLM预训练',
    inputType: '基因表达矩阵（秩标准化）',
    outputType: '基因嵌入 / 细胞嵌入 / 基因功能预测',
    publication: 'Theodoris et al., Nature (2023)',
    github: 'ctheodoris/Geneformer',
    paperUrl: 'https://www.nature.com/articles/s41586-023-06139-9',
    keyFeatures: [
      '3000万细胞预训练',
      '基因-基因关系预测',
      '染色质动力学建模',
      '剂量敏感性预测',
      '基因网络上下文嵌入',
      '零样本基因剂量预测'
    ],
    ovAPI: [
      'ov.fm.load_model("GeneFormer")',
      'ov.fm.embed("GeneFormer", adata)',
      'ov.fm.predict_gene_dosage("GeneFormer", adata)',
      'ov.fm.rank_genes("GeneFormer", adata, target_gene)'
    ],
    useCases: ['基因功能预测', '剂量敏感性分析', '药物靶点优先级排序', '罕见变异解读']
  },
  {
    name: 'scFoundation',
    category: 'Skill-Ready',
    description: '专为单细胞分析设计的大规模基础模型，支持多任务学习和多组学整合。特点是统一处理不同测序平台和技术的数据。',
    architecture: 'Transformer + 多任务学习架构',
    inputType: '基因表达矩阵',
    outputType: '多任务输出（嵌入/注释/预测/整合）',
    publication: 'Biomap Research, Nature Methods (2024)',
    github: 'biomap-research/scFoundation',
    paperUrl: 'https://www.nature.com/articles/s41592-024-02305-7',
    keyFeatures: [
      '跨平台泛化（10x, SMART-seq, Smart-seq2等）',
      '多任务统一架构',
      '大规模预训练',
      '基因表达增强（denoising）',
      '批次效应自动校正',
      '跨物种迁移学习'
    ],
    ovAPI: [
      'ov.fm.load_model("scFoundation")',
      'ov.fm.embed("scFoundation", adata)',
      'ov.fm.denoise("scFoundation", adata)',
      'ov.fm.integrate("scFoundation", adata_list)'
    ],
    useCases: ['跨平台数据整合', '基因表达去噪', '跨物种分析', '大规模图谱构建']
  },
  {
    name: 'UCE',
    category: 'Skill-Ready',
    description: '通用细胞嵌入（Universal Cell Embedding）模型。将任何单细胞数据映射到统一的参考嵌入空间，实现真正的跨物种、跨平台细胞类型对齐。',
    architecture: 'Transformer + 对比学习',
    inputType: '基因表达（支持跨物种基因名映射）',
    outputType: '统一细胞嵌入（UCE space）',
    publication: 'Rosen et al., bioRxiv (2023)',
    github: 'snap-stanford/UCE',
    paperUrl: 'https://www.biorxiv.org/content/10.1101/2023.11.28.568918v1',
    keyFeatures: [
      '跨物种通用嵌入空间',
      '无需基因名一一对应',
      '蛋白质语言模型embedding初始化',
      '大规模参考图谱对齐',
      '跨物种细胞类型映射',
      '物种无关的细胞表示'
    ],
    ovAPI: [
      'ov.fm.load_model("UCE")',
      'ov.fm.embed("UCE", adata, species="human")',
      'ov.fm.map_species("UCE", adata_human, adata_mouse)',
      'ov.fm.align_atlas("UCE", adata_query, reference)'
    ],
    useCases: ['跨物种细胞类型比较', '进化保守性分析', '多物种图谱整合', '非模式生物细胞注释']
  },
  {
    name: 'CellPLM',
    category: 'Skill-Ready',
    description: '细胞预训练语言模型，采用类似NLP的方法将基因表达建模为"细胞语言"。通过空间感知的位置编码捕捉细胞间的空间关系。',
    architecture: 'Transformer + 空间感知位置编码',
    inputType: '基因表达（支持空间坐标）',
    outputType: '细胞嵌入 / 空间嵌入',
    publication: 'OmicsML, bioRxiv (2023)',
    github: 'OmicsML/CellPLM',
    paperUrl: 'https://www.biorxiv.org/content/10.1101/2023.10.03.560734v1',
    keyFeatures: [
      '空间感知的细胞表示',
      '类似BERT的预训练策略',
      '组织空间结构建模',
      '细胞-细胞相互作用预测',
      '空间域识别',
      '多尺度特征提取'
    ],
    ovAPI: [
      'ov.fm.load_model("CellPLM")',
      'ov.fm.embed("CellPLM", adata, spatial_key="spatial")',
      'ov.fm.predict_interaction("CellPLM", adata)',
      'ov.fm.identify_spatial_domains("CellPLM", adata)'
    ],
    useCases: ['空间转录组分析', '组织微环境建模', '细胞互作预测', '空间域识别']
  }
];

const otherCategories = [
  {
    name: 'Core Models',
    description: '核心基础模型集合，覆盖最常用的单细胞分析任务的预训练模型。包括表达增强、嵌入提取、跨模态对齐等通用能力。',
    modelCount: '8+',
    icon: <Cpu size={16} />,
    highlights: ['表达去噪', '嵌入提取', '跨模态翻译', '批次整合']
  },
  {
    name: 'Specialized Models',
    description: '专业化的基础模型，针对特定分析任务优化。包括扰动预测、空间转录组、多模态融合等特定领域的预训练模型。',
    modelCount: '6+',
    icon: <Zap size={16} />,
    highlights: ['扰动建模', '空间转录组', '多模态融合', '速度预测']
  },
  {
    name: 'Domain-Specific Models',
    description: '面向特定生物学领域的预训练模型，如免疫学、肿瘤学、发育生物学等。在领域数据上微调，提供更好的领域特异性。',
    modelCount: '3+',
    icon: <Database size={16} />,
    highlights: ['免疫细胞', '肿瘤微环境', '发育谱系', '疾病特异性']
  }
];

export default function FoundationModelsPage() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <header>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={20} className="text-brand-accent" />
          <h1 className="text-3xl font-bold text-brand-ink">单细胞基础模型 (Foundation Models)</h1>
        </div>
        <p className="text-base text-brand-ink-muted max-w-[800px]" style={{ lineHeight: 1.8 }}>
          基于 OmicVerse <code className="text-xs px-1.5 py-0.5 rounded bg-brand-off-white text-brand-accent font-mono">ov.fm</code> 统一API，
          覆盖22个单细胞基础模型的完整参考。从模型选择、环境配置到实战调用，实现基础模型驱动的高效单细胞分析。
        </p>
      </header>

      {/* Concept Overview */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <BookOpen size={17} className="text-brand-accent" />
          <h2 className="text-lg font-bold text-brand-ink">什么是单细胞基础模型？</h2>
        </div>
        <div className="border rounded-lg p-5 border-brand-border bg-brand-off-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="font-semibold text-brand-ink">大规模预训练</span>
              <p className="mt-1 text-brand-ink-light" style={{ lineHeight: 1.7 }}>
                在数百万到数千万个单细胞数据上预训练的深度神经网络。通过自监督学习（掩码基因预测、对比学习等）学习基因表达的内在规律和细胞类型的深层表示。
              </p>
            </div>
            <div>
              <span className="font-semibold text-brand-ink">统一表示空间</span>
              <p className="mt-1 text-brand-ink-light" style={{ lineHeight: 1.7 }}>
                将不同平台、物种、组织的单细胞数据映射到统一的嵌入空间。跨数据集比较、跨物种映射和零样本学习成为可能。
              </p>
            </div>
            <div>
              <span className="font-semibold text-brand-ink">多任务迁移</span>
              <p className="mt-1 text-brand-ink-light" style={{ lineHeight: 1.7 }}>
                预训练模型可作为特征提取器或直接进行下游任务：细胞注释、基因扰动预测、表达去噪、批次整合、药物响应。少量微调即可适应新任务。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ov.fm API Quick Reference */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Terminal size={17} className="text-brand-accent" />
          <h2 className="text-lg font-bold text-brand-ink">ov.fm 统一API</h2>
          <span className="text-[11px] text-brand-ink-extra-muted ml-2">所有22个模型使用相同接口</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {[
            { method: 'load_model(name)', desc: '加载指定基础模型（自动下载权重）' },
            { method: 'embed(name, adata)', desc: '提取细胞/基因嵌入向量' },
            { method: 'annotate(name, adata)', desc: '零样本细胞类型注释' },
            { method: 'denoise(name, adata)', desc: '基因表达去噪和增强' },
            { method: 'integrate(name, adata_list)', desc: '跨批次/跨平台数据整合' },
            { method: 'predict_perturbation(name, adata, genes)', desc: '预测基因扰动效应' },
            { method: 'map_species(name, adata1, adata2)', desc: '跨物种细胞类型映射' },
            { method: 'get_embedding(name, adata)', desc: '获取预训练嵌入用于下游分析' },
          ].map((api) => (
            <div key={api.method} className="flex items-start gap-2 p-2.5 rounded-lg bg-white border border-brand-border-light">
              <code className="text-[11px] font-mono text-brand-accent bg-brand-off-white px-1.5 py-0.5 rounded shrink-0">
                {api.method}
              </code>
              <span className="text-brand-ink-light" style={{ lineHeight: 1.5 }}>{api.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Skill-Ready Models */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={17} className="text-brand-accent" />
          <h2 className="text-lg font-bold text-brand-ink">Skill-Ready 模型详解</h2>
          <span className="text-[11px] text-brand-ink-extra-muted ml-2">5个可直接通过AI Skill调用的基础模型</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {skillReadyModels.map((model) => (
            <FoundationModelCard key={model.name} model={model} />
          ))}
        </div>
      </section>

      {/* Other Categories */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Layers size={17} className="text-brand-accent" />
          <h2 className="text-lg font-bold text-brand-ink">更多模型分类</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {otherCategories.map((cat) => (
            <div key={cat.name} className="border rounded-lg p-4 border-brand-border bg-white">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-brand-accent">{cat.icon}</span>
                <h3 className="text-sm font-semibold text-brand-ink">{cat.name}</h3>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-brand-accent-light text-brand-accent ml-auto">
                  {cat.modelCount} models
                </span>
              </div>
              <p className="text-xs text-brand-ink-muted mb-2" style={{ lineHeight: 1.6 }}>
                {cat.description}
              </p>
              <div className="space-y-1">
                {cat.highlights.map((h) => (
                  <span key={h} className="text-[10px] block px-2 py-0.5 rounded bg-brand-off-white text-brand-ink-light">
                    {h}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Model Selection Guide */}
      <section className="border rounded-lg p-5 border-brand-border bg-brand-off-white">
        <div className="flex items-center gap-2 mb-3">
          <ArrowRight size={17} className="text-brand-accent" />
          <h2 className="text-lg font-bold text-brand-ink">模型选择指南</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-brand-border">
                <th className="text-left p-2 font-semibold text-brand-ink">应用场景</th>
                <th className="text-left p-2 font-semibold text-brand-ink">推荐模型</th>
                <th className="text-left p-2 font-semibold text-brand-ink">选择理由</th>
              </tr>
            </thead>
            <tbody>
              {[
                { scenario: '大规模细胞注释', model: 'scGPT / CellPLM', reason: '零样本注释能力，无需训练数据' },
                { scenario: '基因调控网络分析', model: 'GeneFormer', reason: 'MLM目标天然学习基因-基因关系' },
                { scenario: '跨平台/跨物种整合', model: 'UCE / scFoundation', reason: '统一嵌入空间，消除平台/物种差异' },
                { scenario: '空间转录组分析', model: 'CellPLM', reason: '空间感知位置编码建模组织结构' },
                { scenario: '基因表达去噪和增强', model: 'scFoundation', reason: '多任务架构包含表达增强能力' },
                { scenario: '扰动效应预测', model: 'scGPT', reason: '条件生成可直接模拟基因扰动' },
                { scenario: '非模式生物分析', model: 'UCE', reason: '蛋白质语言模型嵌入支持跨物种映射' },
                { scenario: '批次效应校正', model: 'scFoundation', reason: '大规模预训练自动学习批次不变表示' },
              ].map((row, i) => (
                <tr key={i} className="border-b border-brand-border-light hover:bg-white transition-colors">
                  <td className="p-2 text-brand-ink-light">{row.scenario}</td>
                  <td className="p-2">
                    <code className="text-[11px] font-mono text-brand-accent bg-brand-off-white px-1.5 py-0.5 rounded">
                      {row.model}
                    </code>
                  </td>
                  <td className="p-2 text-brand-ink-muted">{row.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Quick Start Code */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Terminal size={17} className="text-brand-accent" />
          <h2 className="text-lg font-bold text-brand-ink">快速开始</h2>
        </div>
        <CodeBlock
          code={`import omicverse as ov
import scanpy as sc

# 1. 加载预处理的单细胞数据
adata = ov.read('pbmc3k_processed.h5ad')

# 2. 加载基础模型（自动下载权重，仅首次需要）
model = ov.fm.load_model('scGPT')

# 3. 提取细胞嵌入（可直接用于聚类/可视化）
adata.obsm['X_scGPT'] = ov.fm.embed('scGPT', adata)

# 4. 零样本细胞类型注释
adata.obs['scGPT_celltype'] = ov.fm.annotate(
    'scGPT', adata,
    tissue='blood',
    species='human'
)

# 5. 可视化注释结果
ov.pl.embedding(adata, basis='umap',
                color=['scGPT_celltype'],
                frameon='small')

# 6. 基因扰动预测（条件生成）
perturbation_result = ov.fm.predict_perturbation(
    'scGPT', adata,
    target_genes=['TP53', 'MYC'],
    cell_type='T cells'
)`}
        />
      </section>

      {/* References */}
      <section className="text-xs text-brand-ink-extra-muted border-t pt-6 border-brand-border-light">
        <p className="mb-1 font-medium text-brand-ink-muted">参考资源</p>
        <ul className="space-y-1 list-disc list-inside">
          <li>
            <a href="https://omicverse.readthedocs.io/en/latest/tutorials/index_foundation.html" target="_blank" rel="noopener noreferrer" className="text-brand-accent hover:underline">
              OmicVerse Foundation Models 教程
            </a>
            {' '}— ov.fm API完整参考
          </li>
          <li>
            <a href="https://github.com/bowang-lab/scGPT" target="_blank" rel="noopener noreferrer" className="text-brand-accent hover:underline">scGPT</a>
            {' '}|{' '}
            <a href="https://github.com/ctheodoris/Geneformer" target="_blank" rel="noopener noreferrer" className="text-brand-accent hover:underline">GeneFormer</a>
            {' '}|{' '}
            <a href="https://github.com/biomap-research/scFoundation" target="_blank" rel="noopener noreferrer" className="text-brand-accent hover:underline">scFoundation</a>
            {' '}|{' '}
            <a href="https://github.com/snap-stanford/UCE" target="_blank" rel="noopener noreferrer" className="text-brand-accent hover:underline">UCE</a>
            {' '}|{' '}
            <a href="https://github.com/OmicsML/CellPLM" target="_blank" rel="noopener noreferrer" className="text-brand-accent hover:underline">CellPLM</a>
          </li>
        </ul>
      </section>
    </div>
  );
}

function FoundationModelCard({ model }: { model: FoundationModel }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border rounded-lg border-brand-border bg-white overflow-hidden hover:shadow-sm transition-shadow">
      {/* Card Header */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h3 className="text-sm font-bold text-brand-ink">{model.name}</h3>
            <p className="text-[10px] text-brand-ink-muted mt-0.5">{model.architecture}</p>
          </div>
          <a
            href={model.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs flex items-center gap-1 text-brand-accent hover:underline shrink-0"
          >
            GitHub <ExternalLink size={10} />
          </a>
        </div>
        <p className="text-xs text-brand-ink-light mb-3" style={{ lineHeight: 1.7 }}>
          {model.description}
        </p>

        {/* Key Features Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {model.keyFeatures.map((f) => (
            <span key={f} className="text-[10px] px-1.5 py-0.5 rounded-full bg-brand-accent-light text-brand-accent">
              {f}
            </span>
          ))}
        </div>

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-[11px] font-medium text-brand-accent hover:underline"
        >
          {expanded ? '收起详情' : '展开详情'}
          {expanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
        </button>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-brand-border-light bg-brand-off-white space-y-3 pt-3">
          {/* I/O */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[10px] font-semibold text-brand-ink uppercase tracking-wider">输入</span>
              <p className="mt-0.5 text-brand-ink-muted">{model.inputType}</p>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-brand-ink uppercase tracking-wider">输出</span>
              <p className="mt-0.5 text-brand-ink-muted">{model.outputType}</p>
            </div>
          </div>

          {/* ov.fm API */}
          <div>
            <span className="text-[10px] font-semibold text-brand-ink uppercase tracking-wider">ov.fm API</span>
            <div className="mt-1 flex flex-wrap gap-1">
              {model.ovAPI.map((api) => (
                <code key={api} className="text-[10px] px-1.5 py-0.5 rounded font-mono bg-white text-brand-accent border border-brand-border-light">
                  {api}
                </code>
              ))}
            </div>
          </div>

          {/* Use Cases */}
          <div>
            <span className="text-[10px] font-semibold text-brand-ink uppercase tracking-wider">适用场景</span>
            <div className="mt-1 flex flex-wrap gap-1">
              {model.useCases.map((uc) => (
                <span key={uc} className="text-[10px] px-1.5 py-0.5 rounded bg-brand-dl-light text-brand-dl">
                  {uc}
                </span>
              ))}
            </div>
          </div>

          {/* Publication */}
          <div className="text-[10px] text-brand-ink-muted pt-1 border-t border-brand-border-light">
            <a href={model.paperUrl} target="_blank" rel="noopener noreferrer" className="text-brand-accent hover:underline">
              {model.publication}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
