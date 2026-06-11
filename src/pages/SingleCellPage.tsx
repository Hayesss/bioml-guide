import { ArrowRight, Microscope, Database, GitBranch, Network, Dna, BoxSelect, Workflow, BarChart3, Hash, ArrowLeftRight, Sparkles } from 'lucide-react';

interface SkillRef {
  name: string;
  description: string;
  usage: string;
}

interface SingleCellModule {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  methods: string[];
  ovFunctions: string[];
  skill: SkillRef;
  codeSnippet: string;
  topicKey?: string;
}

const singleCellModules: SingleCellModule[] = [
  {
    id: 'preprocessing',
    title: '数据加载与预处理',
    icon: <Database size={18} />,
    description:
      '从10x Genomics、H5AD等格式加载单细胞数据，执行质控过滤、标准化、高变基因选择、PCA降维、邻居图构建和UMAP/tSNE可视化。支持CPU、CPU-GPU混合和纯GPU三种计算模式。',
    methods: ['质控过滤 (QC)', 'Shift-log标准化', 'Pearson残差HVG', 'PCA降维', 'UMAP/tSNE/MDE嵌入', 'Scrublet双细胞检测'],
    ovFunctions: ['ov.io.read_10x_mtx', 'ov.pp.qc', 'ov.pp.preprocess', 'ov.pp.scale', 'ov.pp.pca', 'ov.pp.neighbors', 'ov.pp.umap'],
    skill: {
      name: 'single-preprocessing',
      description: '单细胞QC、标准化、HVG检测、PCA、邻居图、UMAP/tSNE嵌入管线的OmicVerse实现 (CPU/GPU)',
      usage: '在Claude Code中使用 /single-preprocessing 调用此skill，自动生成预处理代码。适用于PBMC3k等标准数据集，支持CPU/GPU模式切换。'
    },
    codeSnippet: `import omicverse as ov
import scanpy as sc

# 加载10x数据
adata = ov.io.read_10x_mtx('data/filtered_gene_bc_matrices/hg19/',
                             var_names='gene_symbols')

# 质控过滤
adata = ov.pp.qc(adata,
    tresh={'mito_perc': 0.2, 'nUMIs': 500, 'detected_genes': 250},
    doublets_method='scrublet')

# 保存原始计数层
ov.utils.store_layers(adata, layers='counts')

# 标准化 + HVG选择
ov.pp.preprocess(adata, mode='shiftlog|pearson',
                 n_HVGs=2000, target_sum=5e5)

# 降维与嵌入
ov.pp.scale(adata)
ov.pp.pca(adata, layer='scaled', n_pcs=50)
ov.pp.neighbors(adata, n_neighbors=15, use_rep='X_pca')
ov.pp.umap(adata)`,
    topicKey: 'single-preprocessing'
  },
  {
    id: 'clustering',
    title: '聚类与批次校正',
    icon: <BoxSelect size={18} />,
    description:
      '使用Leiden/Louvain算法进行细胞聚类，通过Harmony、scVI、BBKNN、Combat等方法消除批次效应。支持scICE信息熵聚类、GMM高斯混合模型和cNMF主题建模。',
    methods: ['Leiden聚类', 'Louvain聚类', 'scICE信息熵聚类', 'GMM高斯混合', 'Harmony批次校正', 'scVI整合', 'BBKNN图连接', 'Combat批次校正'],
    ovFunctions: ['ov.pp.leiden', 'ov.single.leiden', 'ov.single.scICE', 'ov.single.gmm', 'ov.pp.harmony', 'ov.single.bbknn'],
    skill: {
      name: 'single-clustering',
      description: '单细胞聚类 (Leiden/Louvain/scICE/GMM)、批次校正 (Harmony/scVI/BBKNN/Combat)、主题建模和cNMF',
      usage: '使用 /single-clustering 调用。根据数据复杂度推荐方法：简单数据用Leiden+Harmony，复杂批次用scVI，图谱级别用BBKNN。'
    },
    codeSnippet: `# Leiden聚类
ov.pp.leiden(adata, resolution=1.0)

# Harmony批次校正
ov.pp.harmony(adata, batch_key='batch')

# scVI整合 (需要先安装scvi-tools)
import scvi
scvi.model.SCVI.setup_anndata(adata, batch_key='batch')
vae = scvi.model.SCVI(adata)
vae.train()
adata.obsm['X_scVI'] = vae.get_latent_representation()

# scICE信息熵聚类
ov.single.scICE(adata, k=15)`,
    topicKey: 'single-clustering'
  },
  {
    id: 'annotation',
    title: '细胞类型注释',
    icon: <GitBranch size={18} />,
    description:
      '综合运用自动注释(SCSA)、肿瘤微环境(MetaTiME)、共识投票(CellVote)、本体映射(CellMatch)和大语言模型(GPTAnno)进行细胞类型鉴定。支持PopV群体级别的10种算法共识注释。',
    methods: ['SCSA自动注释', 'MetaTiME微环境', 'CellVote共识投票', 'CellMatch本体映射', 'GPTAnno大模型注释', '加权KNN标签迁移', 'PopV群体注释'],
    ovFunctions: ['ov.single.pySCSA', 'ov.single.MetaTiME', 'ov.single.CellVote', 'ov.single.CellOntologyMapper', 'ov.single.gptcelltype', 'ov.utils.weighted_knn_transfer'],
    skill: {
      name: 'single-annotation / single-popv-annotation',
      description: '细胞注释：SCSA/MetaTiME/CellVote/CellMatch/GPTAnno/加权KNN + PopV 10种算法共识',
      usage: '基础注释用 /single-annotation，群体级别共识注释用 /single-popv-annotation。小数据集推荐SCSA+CellVote组合，大数据集推荐PopV。'
    },
    codeSnippet: `# SCSA自动注释
scsa = ov.single.pySCSA(adata, target='cellmarker',
    tissue='Blood', model_path='pySCSA_2024_v1_plus.db')
scsa.cell_anno(clustertype='leiden',
    result_key='scsa_celltype')

# GPTAnno大模型注释
marker_dict = ov.single.get_celltype_marker(adata,
    clustertype='leiden', rank=True)
result = ov.single.gptcelltype(adata,
    tissue='Human PBMC', provider='openai',
    model='gpt-4o-mini', topgenenumber=5)

# PopV群体注释 (10种算法共识)
import popv
results = popv.annotation.annotate_data(adata)`,
    topicKey: 'single-annotation'
  },
  {
    id: 'trajectory',
    title: '轨迹推断与RNA速度',
    icon: <Workflow size={18} />,
    description:
      '通过PAGA图抽象、Palantir伪时间、VIA拓扑保持等多种方法推断发育轨迹。支持scVelo/dynamo/latentvelo/graphvelo多种RNA速度后端，进行细胞命运方向性分析。',
    methods: ['PAGA图抽象', 'Palantir伪时间', 'VIA轨迹推断', 'scVelo速度', 'dynamo速度', 'latentvelo变分速度', 'graphvelo图速度', 'CellFateGenie命运'],
    ovFunctions: ['ov.single.Trajectory', 'ov.single.Velo', 'ov.single.palantir', 'ov.single.via', 'ov.single.Fate'],
    skill: {
      name: 'single-trajectory / single-cellfate-analysis',
      description: '轨迹与RNA速度：PAGA/Palantir/VIA/dynamo/scVelo/latentvelo/graphvelo + CellFateGenie命运分析',
      usage: '轨迹推断用 /single-trajectory，伪时间基因发现用 /single-cellfate-analysis。RNA速度需要未剪接/剪接计数，推荐scVelo作为默认后端。'
    },
    codeSnippet: `# PAGA轨迹推断
ov.single.paga(adata, groups='leiden')
sc.pl.paga(adata)

# Palantir伪时间分析
ov.single.palantir(adata, root_cell='root_cell_barcode')

# RNA速度 (scVelo)
import scvelo as scv
scv.pp.moments(adata, n_pcs=30, n_neighbors=30)
scv.tl.velocity(adata, mode='stochastic')
scv.tl.velocity_graph(adata)

# CellFateGenie命运基因发现
ov.single.Fate.cellfategenie(adata,
    pseudotime_key='palantir_pseudotime')`,
    topicKey: 'single-trajectory'
  },
  {
    id: 'communication',
    title: '细胞间通讯分析',
    icon: <Network size={18} />,
    description:
      '基于CellPhoneDB v5数据库进行配体-受体分析，揭示细胞群之间的信号交流网络。支持CellChatViz可视化、ccc_heatmap热图、ccc_network_plot网络图和ccc_stat_plot统计图。',
    methods: ['CellPhoneDB v5', '配体-受体分析', 'CellChatViz可视化', '通讯热图', '通讯网络图', '统计显著性检验'],
    ovFunctions: ['ov.single.cellphonedb', 'ov.pl.ccc_heatmap', 'ov.pl.ccc_network_plot', 'ov.pl.ccc_stat_plot'],
    skill: {
      name: 'single-cellphone-db',
      description: 'CellPhoneDB v5配体-受体分析、CellChatViz绘图、ccc_heatmap/ccc_network_plot/ccc_stat_plot通讯可视化',
      usage: '使用 /single-cellphone-db 调用。需要先准备好细胞类型注释，CellPhoneDB需要Linux环境。支持自定义配体-受体数据库。'
    },
    codeSnippet: `# CellPhoneDB v5分析
ov.single.cellphonedb(adata,
    celltype_key='celltype',
    organism='human',
    method='statistical_analysis')

# 通讯热图
ov.pl.ccc_heatmap(adata,
    celltype_key='celltype',
    interaction_pairs=['CD4_T|CD8_T'])

# 通讯网络图
ov.pl.ccc_network_plot(adata,
    celltype_key='celltype',
    ligand_receptor_pairs=['CCL5_CCR5'])`,
    topicKey: 'single-communication'
  },
  {
    id: 'grn',
    title: '基因调控网络分析',
    icon: <Dna size={18} />,
    description:
      '通过SCENIC流程推断转录因子调控网络，使用RegDiffusion进行GRN推断，cisTarget进行regulon修剪，AUCell计算regulon活性评分。支持RSS调控特异性和regulon嵌入分析。',
    methods: ['SCENIC流程', 'RegDiffusion GRN推断', 'cisTarget regulon修剪', 'AUCell活性评分', 'RSS调控特异性', 'Regulon嵌入'],
    ovFunctions: ['ov.single.scenic', 'ov.single.RegDiffusion', 'ov.single.cistarget', 'ov.single.aucell', 'ov.single.rss'],
    skill: {
      name: 'single-scenic-grn',
      description: 'SCENIC基因调控网络：RegDiffusion GRN推断、cisTarget regulon修剪、AUCell评分、RSS、regulon嵌入',
      usage: '使用 /single-scenic-grn 调用。SCENIC需要安装pySCENIC和相关数据库文件（cisTarget databases, motif collections）。'
    },
    codeSnippet: `# SCENIC GRN推断流程
# 1. RegDiffusion推断共表达网络
ov.single.RegDiffusion(adata,
    tf_list='human_tfs.txt')

# 2. cisTarget regulon修剪
ov.single.cistarget(adata,
    database='hg38__refseq-r80__10kb_up_and_down_tss.mc9nr.feather')

# 3. AUCell活性评分
ov.single.aucell(adata,
    regulon_key='regulons')

# 4. RSS调控特异性评分
ov.single.rss(adata,
    groupby='celltype')`,
    topicKey: 'single-grn'
  },
  {
    id: 'downstream',
    title: '下游分析与功能注释',
    icon: <BarChart3 size={18} />,
    description:
      '对聚类后的细胞群进行功能富集(AUCell通路评分)、MetaCell差异表达分析、药物反应预测(scDrug)、SCENIC调控子分析和NOCD社区检测。全面挖掘单细胞数据的生物学意义。',
    methods: ['AUCell通路评分', 'MetaCell DEG', 'scDrug药物响应', 'SCENIC regulon', 'cNMF程序', 'NOCD社区检测'],
    ovFunctions: ['ov.single.aucell_pathway', 'ov.single.metacell_deg', 'ov.single.scdrug', 'ov.single.cnmf', 'ov.single.nocd'],
    skill: {
      name: 'single-downstream-analysis',
      description: '下游分析：AUCell通路评分、MetaCell DEG、scDrug药物响应、SCENIC regulons、cNMF程序、NOCD社区检测',
      usage: '使用 /single-downstream-analysis 调用。通常在注释和聚类完成后使用，将细胞身份与功能通路关联。'
    },
    codeSnippet: `# AUCell通路活性评分
ov.single.aucell_pathway(adata,
    pathway_database='MSigDB_Hallmark_2020')

# MetaCell差异表达
ov.single.metacell_deg(adata,
    groupby='celltype',
    method='wilcoxon')

# scDrug药物响应预测
ov.single.scdrug(adata,
    celltype_key='celltype',
    drug_database='GDSC')

# NOCD社区检测
ov.single.nocd(adata,
    use_rep='X_pca')`,
    topicKey: 'single-downstream'
  },
  {
    id: 'multiomics',
    title: '单细胞多组学整合',
    icon: <ArrowLeftRight size={18} />,
    description:
      '整合scRNA-seq与scATAC-seq等多组学数据。支持MOFA因子分析、GLUE非配对对齐、SIMBA批次校正、TOSICA标签迁移和StaVIA轨迹推断。覆盖配对和非配对多组学工作流。',
    methods: ['MOFA因子分析', 'GLUE非配对对齐', 'SIMBA批次校正', 'TOSICA标签迁移', 'StaVIA轨迹', 'scRNA-scATAC整合'],
    ovFunctions: ['ov.single.mofa', 'ov.single.glue', 'ov.single.simba', 'ov.single.tosica', 'ov.single.stavia'],
    skill: {
      name: 'single-multiomics',
      description: '多组学整合：MOFA因子分析、GLUE非配对对齐、SIMBA批次校正、TOSICA标签迁移、StaVIA轨迹',
      usage: '使用 /single-multiomics 调用。配对数据推荐MOFA，非配对数据推荐GLUE。需要同时准备scRNA和scATAC数据。'
    },
    codeSnippet: `# MOFA因子分析 (配对数据)
ov.single.mofa(adata,
    use_rep=['X_scRNA', 'X_scATAC'],
    n_factors=15)

# GLUE非配对对齐
ov.single.glue(adata_rna, adata_atac,
    annotation_key='celltype')

# SIMBA批次校正
ov.single.simba(adata,
    batch_key='batch',
    use_rep='X_pca')

# TOSICA标签迁移
ov.single.tosica(adata_ref, adata_query,
    label_key='celltype')`,
    topicKey: 'single-multiomics'
  },
  {
    id: 'spatial',
    title: '单细胞到空间转录组映射',
    icon: <Hash size={18} />,
    description:
      '将scRNA-seq图谱映射到空间转录组切片上，使用Single2Spatial深度森林训练进行spot级别的细胞类型预测和标记基因可视化，实现单细胞分辨率的空间定位。',
    methods: ['Single2Spatial映射', '深度森林训练', 'Spot级别预测', '标记基因可视化', '空间定位评估'],
    ovFunctions: ['ov.single.Single2Spatial', 'ov.single.deep_forest_train', 'ov.single.spot_assessment'],
    skill: {
      name: 'single-to-spatial-mapping',
      description: '单细胞到空间映射：Single2Spatial深度森林训练、spot级别评估和标记基因可视化',
      usage: '使用 /single-to-spatial-mapping 调用。需要单细胞参考图谱和空间转录组数据（Visium/Stereo-seq等）。'
    },
    codeSnippet: `# Single2Spatial映射
mapper = ov.single.Single2Spatial(
    adata_sc=adata_ref,
    adata_sp=adata_spatial)

# 深度森林训练
mapper.train(n_estimators=100,
    max_depth=15)

# Spot级别预测
predictions = mapper.predict(
    adata_spatial,
    celltype_key='celltype')

# 标记基因空间可视化
mapper.plot_marker_genes(
    gene_list=['MALAT1', 'CD3D', 'CD79A'])`,
    topicKey: 'single-spatial'
  }
];

export default function SingleCellPage() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <header>
        <div className="flex items-center gap-2 mb-3">
          <Microscope size={20} className="text-[#2F6B4F]" />
          <h1 className="text-3xl font-bold text-brand-ink">单细胞组学分析</h1>
        </div>
        <p className="text-base text-brand-ink-muted max-w-[800px]" style={{ lineHeight: 1.8 }}>
          基于 OmicVerse 的单细胞转录组全流程分析平台。从原始数据预处理、细胞聚类注释，
          到高级分析的轨迹推断、细胞通讯、基因调控网络和多组学整合，提供一站式的单细胞分析解决方案。
          每个模块均配备对应的 AI Skill，可在 Claude Code 中直接调用进行自动化分析。
        </p>
      </header>

      {/* Workflow Overview */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={17} className="text-brand-accent" />
          <h2 className="text-lg font-bold text-brand-ink">分析流程总览</h2>
        </div>
        <div className="border rounded-lg p-5 border-brand-border bg-brand-off-white">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {[
              '数据加载',
              '质控QC',
              '标准化',
              'HVG选择',
              'PCA降维',
              '聚类',
              '批次校正',
              '注释',
              '轨迹推断',
              'RNA速度',
              '细胞通讯',
              'GRN',
              '下游分析',
              '多组学整合',
              '空间映射'
            ].map((step, i) => (
              <span key={step} className="flex items-center gap-1.5">
                <span className="flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold text-white bg-[#2F6B4F]">
                  {i + 1}
                </span>
                <span className="text-brand-ink-light">{step}</span>
                {i < 14 && <span className="text-brand-ink-extra-muted mx-0.5">→</span>}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Module Cards Grid */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Microscope size={17} className="text-brand-accent" />
          <h2 className="text-lg font-bold text-brand-ink">分析模块</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {singleCellModules.map((mod) => (
            <article
              key={mod.id}
              className="border rounded-lg p-4 border-brand-border bg-white hover:shadow-sm transition-shadow flex flex-col"
            >
              {/* Module Header */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[#2F6B4F]">{mod.icon}</span>
                <h3 className="text-sm font-semibold text-brand-ink">{mod.title}</h3>
              </div>

              {/* Description */}
              <p className="text-xs text-brand-ink-muted mb-3" style={{ lineHeight: 1.7 }}>
                {mod.description}
              </p>

              {/* Methods Tags */}
              <div className="mb-2">
                <span className="text-[11px] font-medium text-brand-ink-muted">关键方法:</span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {mod.methods.slice(0, 4).map((m) => (
                    <span
                      key={m}
                      className="text-[10px] px-1.5 py-0.5 rounded border border-brand-border-light text-brand-ink-light bg-brand-off-white"
                    >
                      {m}
                    </span>
                  ))}
                  {mod.methods.length > 4 && (
                    <span className="text-[10px] px-1.5 py-0.5 text-brand-ink-extra-muted">
                      +{mod.methods.length - 4}
                    </span>
                  )}
                </div>
              </div>

              {/* OV Functions */}
              <div className="mb-3">
                <span className="text-[11px] font-medium text-brand-ink-muted">核心API:</span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {mod.ovFunctions.slice(0, 3).map((fn) => (
                    <code
                      key={fn}
                      className="text-[10px] px-1.5 py-0.5 rounded font-mono bg-brand-off-white text-brand-accent"
                    >
                      {fn}
                    </code>
                  ))}
                  {mod.ovFunctions.length > 3 && (
                    <span className="text-[10px] px-1.5 py-0.5 text-brand-ink-extra-muted">
                      +{mod.ovFunctions.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Skill Info */}
              <div className="border-t pt-2 mt-auto border-brand-border-light">
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#2F6B4F] text-white">
                    SKILL
                  </span>
                  <code className="text-[10px] font-mono text-brand-accent">{mod.skill.name}</code>
                </div>
                <p className="text-[10px] text-brand-ink-muted mb-1" style={{ lineHeight: 1.5 }}>
                  {mod.skill.description}
                </p>
                <p className="text-[10px] text-brand-ink-light" style={{ lineHeight: 1.5 }}>
                  <span className="font-medium">调用方式:</span> {mod.skill.usage}
                </p>
              </div>

              {/* Code Preview - collapsed by default, shown on hover/click */}
              <details className="mt-2 text-[10px]">
                <summary className="cursor-pointer text-brand-accent font-medium hover:underline">
                  查看代码示例
                </summary>
                <pre className="mt-2 p-2 rounded bg-[#1E1E1E] text-[#D4D4D4] overflow-x-auto text-[10px] leading-relaxed"
                     style={{ maxHeight: 200, overflowY: 'auto' }}>
                  <code>{mod.codeSnippet}</code>
                </pre>
              </details>
            </article>
          ))}
        </div>
      </section>

      {/* Skills Quick Reference Table */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={17} className="text-brand-accent" />
          <h2 className="text-lg font-bold text-brand-ink">Skills 快速参考</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-brand-off-white border-b border-brand-border">
                <th className="text-left p-2.5 font-semibold text-brand-ink">Skill 名称</th>
                <th className="text-left p-2.5 font-semibold text-brand-ink">功能描述</th>
                <th className="text-left p-2.5 font-semibold text-brand-ink">调用命令</th>
                <th className="text-left p-2.5 font-semibold text-brand-ink">适用场景</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  name: 'single-preprocessing',
                  desc: 'QC、标准化、HVG、PCA、UMAP/tSNE嵌入管线',
                  cmd: '/single-preprocessing',
                  scenario: '任何单细胞分析的第一步，数据清洗和基础嵌入'
                },
                {
                  name: 'single-clustering',
                  desc: 'Leiden/Louvain/scICE聚类 + Harmony/scVI/BBKNN批次校正',
                  cmd: '/single-clustering',
                  scenario: '细胞分群、去除批次效应、跨样本整合'
                },
                {
                  name: 'single-annotation',
                  desc: 'SCSA/MetaTiME/CellVote/CellMatch/GPTAnno注释',
                  cmd: '/single-annotation',
                  scenario: '自动化细胞类型鉴定，支持多种注释策略'
                },
                {
                  name: 'single-popv-annotation',
                  desc: 'PopV群体注释：10种算法共识投票',
                  cmd: '/single-popv-annotation',
                  scenario: '大规模图谱的群体级别细胞注释'
                },
                {
                  name: 'single-trajectory',
                  desc: 'PAGA/Palantir/VIA轨迹 + scVelo/dynamo RNA速度',
                  cmd: '/single-trajectory',
                  scenario: '发育轨迹、分化路径、RNA速度方向性'
                },
                {
                  name: 'single-cellfate-analysis',
                  desc: 'CellFateGenie伪时间基因发现、Mellon密度',
                  cmd: '/single-cellfate-analysis',
                  scenario: '发现命运决定基因、密度估计'
                },
                {
                  name: 'single-cellphone-db',
                  desc: 'CellPhoneDB v5配体-受体、CellChatViz通讯可视化',
                  cmd: '/single-cellphone-db',
                  scenario: '细胞间信号交流网络分析'
                },
                {
                  name: 'single-scenic-grn',
                  desc: 'SCENIC GRN：RegDiffusion + cisTarget + AUCell',
                  cmd: '/single-scenic-grn',
                  scenario: '转录因子调控网络推断和活性评分'
                },
                {
                  name: 'single-downstream-analysis',
                  desc: 'AUCell通路、MetaCell DEG、scDrug、NOCD',
                  cmd: '/single-downstream-analysis',
                  scenario: '注释后的功能挖掘和生物学解释'
                },
                {
                  name: 'single-multiomics',
                  desc: 'MOFA/GLUE/SIMBA/TOSICA/StaVIA多组学整合',
                  cmd: '/single-multiomics',
                  scenario: 'scRNA+scATAC配对或非配对整合分析'
                },
                {
                  name: 'single-to-spatial-mapping',
                  desc: 'Single2Spatial深度森林空间映射',
                  cmd: '/single-to-spatial-mapping',
                  scenario: '将单细胞数据映射到空间转录组切片'
                }
              ].map((skill) => (
                <tr key={skill.name} className="border-b border-brand-border-light hover:bg-brand-off-white transition-colors">
                  <td className="p-2.5">
                    <code className="text-[11px] font-mono text-brand-accent bg-brand-off-white px-1.5 py-0.5 rounded">
                      {skill.name}
                    </code>
                  </td>
                  <td className="p-2.5 text-brand-ink-light" style={{ lineHeight: 1.6 }}>
                    {skill.desc}
                  </td>
                  <td className="p-2.5">
                    <code className="text-[11px] font-mono text-[#2F6B4F] bg-brand-off-white px-1.5 py-0.5 rounded">
                      {skill.cmd}
                    </code>
                  </td>
                  <td className="p-2.5 text-brand-ink-light" style={{ lineHeight: 1.6 }}>
                    {skill.scenario}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Learning Path Recommendation */}
      <section className="border rounded-lg p-5 border-brand-border bg-brand-off-white">
        <div className="flex items-center gap-2 mb-3">
          <ArrowRight size={17} className="text-brand-accent" />
          <h2 className="text-lg font-bold text-brand-ink">推荐学习路径</h2>
        </div>
        <div className="space-y-3">
          {[
            {
              step: '入门',
              description: '从数据加载与预处理开始，掌握QC过滤、标准化和可视化基础。使用PBMC3k数据集练习。',
              modules: ['单细胞预处理', '数据IO']
            },
            {
              step: '进阶',
              description: '学习聚类、批次校正和细胞注释。理解不同聚类算法和注释策略的适用场景。',
              modules: ['聚类与批次校正', '细胞类型注释']
            },
            {
              step: '高级',
              description: '深入轨迹推断、RNA速度、细胞通讯和基因调控网络。多组学整合用于跨模态分析。',
              modules: ['轨迹推断', '细胞间通讯', '基因调控网络', '多组学整合']
            },
            {
              step: '专业',
              description: '空间转录组映射、药物响应预测和自定义分析流程开发。',
              modules: ['下游分析', '单细胞到空间映射', '细胞命运分析']
            }
          ].map((phase, i) => (
            <div key={phase.step} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span className="flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold text-white bg-[#2F6B4F]">
                  {i + 1}
                </span>
                {i < 3 && <div className="w-px flex-1 bg-brand-border-light mt-1" />}
              </div>
              <div className="pb-3">
                <h3 className="text-sm font-semibold text-brand-ink mb-1">
                  {phase.step}阶段
                </h3>
                <p className="text-xs text-brand-ink-muted mb-1.5" style={{ lineHeight: 1.6 }}>
                  {phase.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {phase.modules.map((m) => (
                    <span
                      key={m}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-brand-border-light text-brand-ink-light"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Citation / Reference */}
      <section className="text-xs text-brand-ink-extra-muted border-t pt-6 border-brand-border-light">
        <p className="mb-1 font-medium text-brand-ink-muted">参考资源</p>
        <ul className="space-y-1 list-disc list-inside">
          <li>
            <a
              href="https://omicverse.readthedocs.io/en/latest/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-accent hover:underline"
            >
              OmicVerse 官方文档
            </a>
            {' '}— 完整的API参考和教程
          </li>
          <li>
            <a
              href="https://github.com/omicverse/omicverse"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-accent hover:underline"
            >
              OmicVerse GitHub
            </a>
            {' '}— 源代码和示例notebook
          </li>
          <li>
            <a
              href="https://doi.org/10.1101/2024.01.10.575120"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-accent hover:underline"
            >
              OmicVerse 论文
            </a>
            {' '}— bioRxiv预印本
          </li>
        </ul>
      </section>
    </div>
  );
}
