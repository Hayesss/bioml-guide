export interface Application {
  id: string;
  name: string;
  description: string;
  color: string;
  mlMethods: { name: string; description: string; useCase: string }[];
  dlMethods: { name: string; description: string; useCase: string }[];
  datasets: { name: string; description: string; size: string }[];
  keyPapers: { title: string; authors: string; year: number; venue: string; url: string }[];
  gettingStarted: string[];
}

export const applications: Application[] = [
  {
    id: 'genomics',
    name: '基因组学',
    description: '应用ML/DL进行基因变异检测、调控元件识别、序列注释和多物种基因组比较分析。',
    color: '#1E3A5F',
    mlMethods: [
      { name: '随机森林', description: '变异致病性预测', useCase: 'CADD、Eigen分数预测' },
      { name: 'SVM', description: '增强子/启动子分类', useCase: '调控元件识别' },
      { name: 'k-mer特征 + 逻辑回归', description: '序列分类', useCase: '基因家族分类' },
      { name: '隐马尔可夫模型', description: '基因结构预测', useCase: '基因注释' },
      { name: '集成学习', description: '多特征融合', useCase: '变异优先级排序' },
    ],
    dlMethods: [
      { name: 'DeepVariant', description: 'CNN序列分类', useCase: 'SNP/Indel检测' },
      { name: 'Enformer', description: 'Transformer架构', useCase: '基因表达预测' },
      { name: 'Basenji', description: 'Dilated CNN', useCase: '染色质可及性预测' },
      { name: 'Nucleotide Transformer', description: 'BERT预训练', useCase: '序列表示学习' },
      { name: 'HyenaDNA', description: '亚二次注意力', useCase: '长序列建模' },
    ],
    datasets: [
      { name: '1000 Genomes', description: '人类遗传变异参考数据集', size: '2504样本' },
      { name: 'ENCODE', description: '人类基因组功能元件', size: '9000+实验' },
      { name: 'FANTOM5', description: '哺乳动物表达和调控数据', size: '数百细胞系' },
      { name: 'ClinVar', description: '临床意义变异注释', size: '200万+变异' },
    ],
    keyPapers: [
      { title: 'A universal SNP and small-indel variant caller using deep neural networks', authors: 'Poplin et al.', year: 2018, venue: 'Nature Biotechnology', url: 'https://doi.org/10.1038/nbt.4235' },
      { title: 'Effective gene expression prediction from sequence by integrating long-range interactions', authors: 'Avsec et al.', year: 2021, venue: 'Nature Methods', url: 'https://doi.org/10.1038/s41592-021-01252-x' },
      { title: 'The Nucleotide Transformer', authors: 'Dalla-Torre et al.', year: 2023, venue: 'bioRxiv', url: 'https://doi.org/10.1101/2023.01.11.523679' },
    ],
    gettingStarted: [
      '学习DNA序列基础表示方法 (one-hot, k-mer)',
      '实践DeepVariant或使用预训练模型进行变异检测',
      '使用Enformer预测基因表达并解释注意力权重',
      '尝试Nucleotide Transformer进行迁移学习',
    ],
  },
  {
    id: 'protein',
    name: '蛋白质结构与设计',
    description: '预测蛋白质三维结构、功能注释、相互作用和全新蛋白质设计。',
    color: '#2D5A3D',
    mlMethods: [
      { name: 'SVM', description: '蛋白质分类', useCase: '亚细胞定位预测' },
      { name: '随机森林', description: '特征分类', useCase: '蛋白质家族分类' },
      { name: 'HMM', description: '序列比对', useCase: 'Pfam域注释' },
      { name: '接触图预测 (传统ML)', description: '共进化特征', useCase: '残基接触预测' },
    ],
    dlMethods: [
      { name: 'AlphaFold2', description: 'Evoformer + 结构模块', useCase: '3D结构预测' },
      { name: 'ESM-2', description: '蛋白质语言模型', useCase: '表示学习、突变效应' },
      { name: 'ColabFold', description: 'MMseqs2 + AlphaFold', useCase: '快速结构预测' },
      { name: 'ProteinMPNN', description: '图神经网络', useCase: '蛋白质序列设计' },
      { name: 'RFdiffusion', description: '扩散模型', useCase: '全新蛋白质设计' },
      { name: 'ESMFold', description: '端到端折叠', useCase: '大规模结构预测' },
    ],
    datasets: [
      { name: 'PDB', description: '蛋白质三维结构数据库', size: '20万+结构' },
      { name: 'UniProt', description: '蛋白质序列和功能注释', size: '2.5亿+序列' },
      { name: 'CATH', description: '蛋白质结构分类', size: '40万+域' },
      { name: 'String DB', description: '蛋白质相互作用网络', size: '6000+物种' },
    ],
    keyPapers: [
      { title: 'Highly accurate protein structure prediction with AlphaFold', authors: 'Jumper et al.', year: 2021, venue: 'Nature', url: 'https://doi.org/10.1038/s41586-021-03819-2' },
      { title: 'Language models enable zero-shot prediction of the effects of mutations on protein function', authors: 'Meier et al.', year: 2021, venue: 'NeurIPS', url: 'https://doi.org/10.1101/2021.07.09.450648' },
      { title: 'Robust deep learning based protein sequence design using ProteinMPNN', authors: 'Dauparas et al.', year: 2022, venue: 'Science', url: 'https://doi.org/10.1126/science.add2187' },
    ],
    gettingStarted: [
      '使用ColabFold预测蛋白质结构',
      '使用ESM-2提取蛋白质嵌入进行下游任务',
      '学习蛋白质结构表示 (接触图、距离图)',
      '实践RosettaFold或OmegaFold',
    ],
  },
  {
    id: 'single-cell',
    name: '单细胞分析',
    description: '单细胞RNA测序数据的聚类、降维、批次校正、细胞类型注释和调控网络推断。',
    color: '#5B3A7B',
    mlMethods: [
      { name: 'PCA', description: '线性降维', useCase: '数据预处理和可视化' },
      { name: 't-SNE / UMAP', description: '非线性降维', useCase: '细胞聚类可视化' },
      { name: 'Louvain/Leiden聚类', description: '图聚类', useCase: '细胞群体发现' },
      { name: '高斯混合模型', description: '概率聚类', useCase: '细胞状态建模' },
      { name: 'NMF', description: '非负矩阵分解', useCase: '基因程序发现' },
    ],
    dlMethods: [
      { name: 'scVI', description: 'VAE', useCase: '批次校正与降维' },
      { name: 'scANVI', description: '条件VAE', useCase: '细胞类型注释' },
      { name: 'scGPT', description: 'Transformer', useCase: '单细胞基础模型' },
      { name: 'TotalVI', description: '多模态VAE', useCase: 'CITE-seq分析' },
      { name: 'CellBender', description: 'VAE', useCase: '去噪和去除环境RNA' },
    ],
    datasets: [
      { name: '10x Genomics PBMC', description: '人外周血单核细胞', size: '~3000细胞' },
      { name: 'Human Cell Atlas', description: '人类所有细胞类型', size: '数百万细胞' },
      { name: 'Tabula Sapiens', description: '多组织单细胞图谱', size: '48万细胞' },
      { name: 'Mouse Organogenesis', description: '小鼠器官发育', size: '12万细胞' },
    ],
    keyPapers: [
      { title: 'Deep generative modeling for single-cell transcriptomics', authors: 'Lopez et al.', year: 2018, venue: 'Nature Methods', url: 'https://doi.org/10.1038/s41592-018-0229-2' },
      { title: 'A Python library for probabilistic analysis of single-cell omics data', authors: 'Gayoso et al.', year: 2022, venue: 'Nature Biotechnology', url: 'https://doi.org/10.1038/s41587-021-01206-2' },
      { title: 'scGPT: toward building a foundation model for single-cell multi-omics', authors: 'Cui et al.', year: 2024, venue: 'Nature Methods', url: 'https://doi.org/10.1038/s41592-024-02201-0' },
    ],
    gettingStarted: [
      '学习Scanpy数据结构和基本操作',
      '使用scVI进行批次校正和降维',
      '尝试scGPT进行迁移学习和注释',
      '学习构建和分析单细胞图谱',
    ],
  },
  {
    id: 'drug-discovery',
    name: '药物发现',
    description: '分子性质预测、虚拟筛选、药物-靶标相互作用预测和全新分子生成。',
    color: '#8B4513',
    mlMethods: [
      { name: '分子指纹 + 随机森林', description: '分子描述符', useCase: '性质预测' },
      { name: '支持向量机', description: '分类模型', useCase: '虚拟筛选' },
      { name: '高斯过程', description: '贝叶斯优化', useCase: '活性预测' },
      { name: '矩阵分解', description: '协同过滤', useCase: '靶标预测' },
      { name: 'QSAR建模', description: '回归模型', useCase: '活性-结构关系' },
    ],
    dlMethods: [
      { name: 'DeepChem', description: '图卷积网络', useCase: '分子性质预测' },
      { name: 'ChemBERTa', description: 'SMILES语言模型', useCase: '分子表示学习' },
      { name: 'SchNet/DimeNet', description: '3D图神经网络', useCase: '量子性质预测' },
      { name: 'REINVENT', description: 'RNN强化学习', useCase: '分子生成' },
      { name: 'GeoDiff', description: '扩散模型', useCase: '3D构象生成' },
    ],
    datasets: [
      { name: 'ChEMBL', description: '生物活性数据', size: '200万+化合物' },
      { name: 'PubChem', description: '化学结构数据库', size: '1.1亿+分子' },
      { name: 'BindingDB', description: '药物-靶标结合数据', size: '270万+数据点' },
      { name: 'ZINC', description: '可购买化合物库', size: '10亿+分子' },
    ],
    keyPapers: [
      { title: 'MoleculesNet: a benchmark for molecular machine learning', authors: 'Wu et al.', year: 2018, venue: 'Chemical Science', url: 'https://doi.org/10.1039/C7SC02664A' },
      { title: 'Deep learning for molecular design', authors: 'Sanchez-Lengeling & Aspuru-Guzik', year: 2018, venue: 'Science', url: 'https://doi.org/10.1126/science.aat8663' },
      { title: 'BERT-based pre-trained model for SMILES', authors: 'Chithrananda et al.', year: 2020, venue: 'arXiv', url: 'https://arxiv.org/abs/1909.10615' },
    ],
    gettingStarted: [
      '学习RDKit进行分子操作和特征提取',
      '使用DeepChem进行分子性质预测',
      '实践REINVENT进行分子生成',
      '学习图神经网络处理分子图',
    ],
  },
  {
    id: 'transcriptomics',
    name: '转录组学',
    description: '基因表达分析、差异表达、通路分析、转录调控网络和bulk/scRNA整合分析。',
    color: '#4A6741',
    mlMethods: [
      { name: 'PCA/t-SNE', description: '降维可视化', useCase: '表达谱可视化' },
      { name: 'WGCNA', description: '加权基因共表达网络', useCase: '模块发现' },
      { name: 'LASSO/Ridge', description: '正则化回归', useCase: '特征基因选择' },
      { name: '生存分析 (Cox)', description: '时间-事件模型', useCase: '预后预测' },
      { name: 'GSEA/ORA', description: '富集分析', useCase: '通路分析' },
    ],
    dlMethods: [
      { name: 'Autoencoder', description: '非线性降维', useCase: '批次效应去除' },
      { name: 'DeepSurv', description: '深度生存模型', useCase: '生存分析' },
      { name: 'ATTENTION-TRANS (Enformer)', description: 'Transformer', useCase: '表达调控预测' },
      { name: 'scVI', description: 'VAE', useCase: '单细胞去噪' },
    ],
    datasets: [
      { name: 'TCGA', description: '癌症基因组图谱', size: '11000+样本' },
      { name: 'GTEx', description: '正常组织表达', size: '17000+样本' },
      { name: 'ARCHS4', description: 'GEO自动处理', size: '80万+样本' },
      { name: 'GEO', description: '基因表达综合数据库', size: '数百万样本' },
    ],
    keyPapers: [
      { title: 'Pan-cancer integrative histology-genomic analysis via multimodal deep learning', authors: 'Chen et al.', year: 2022, venue: 'Cancer Cell', url: 'https://doi.org/10.1016/j.ccell.2022.07.004' },
      { title: 'DeepSurv: personalized treatment recommender system', authors: 'Katzman et al.', year: 2018, venue: 'BMC Medical Research Methodology', url: 'https://doi.org/10.1186/s12874-018-0482-1' },
    ],
    gettingStarted: [
      '学习bulk RNA-seq分析流程',
      '使用TCGA数据进行差异表达分析',
      '实践DeepSurv进行生存预测',
      '整合scRNA-seq和bulk RNA-seq数据',
    ],
  },
  {
    id: 'metagenomics',
    name: '宏基因组学',
    description: '微生物群落分类、功能注释、物种多样性分析和宏基因组序列分箱。',
    color: '#5B7B8A',
    mlMethods: [
      { name: 'k-mer特征 + SVM/RF', description: '序列分类', useCase: '物种分类' },
      { name: '聚类算法', description: 'OTU/ASV聚类', useCase: '物种发现' },
      { name: '主题模型 (LDA)', description: '概率主题模型', useCase: '功能剖面' },
      { name: '随机森林', description: '分类模型', useCase: '疾病状态预测' },
    ],
    dlMethods: [
      { name: 'DeepMicrobes', description: 'CNN分类', useCase: '物种识别' },
      { name: 'CNN + k-mer embedding', description: '序列嵌入', useCase: '读段分类' },
      { name: 'VAE', description: '变分自编码', useCase: '群落表示学习' },
      { name: 'GraphSAGE', description: '图神经网络', useCase: '共现网络分析' },
    ],
    datasets: [
      { name: 'Human Microbiome Project', description: '人体微生物组', size: '3000+样本' },
      { name: 'MG-RAST', description: '宏基因组分析服务器', size: '数十万样本' },
      { name: 'MetaHIT', description: '人类肠道宏基因组', size: '~300样本' },
      { name: 'TARA Oceans', description: '海洋微生物', size: '~300样本' },
    ],
    keyPapers: [
      { title: 'Accurate and complete genomes from metagenomes', authors: 'Chen et al.', year: 2020, venue: 'Genome Research', url: 'https://doi.org/10.1101/gr.258640.119' },
      { title: 'A review of deep learning methods for microbial identification', authors: 'Rampelli et al.', year: 2022, venue: 'Frontiers in Microbiology', url: 'https://doi.org/10.3389/fmicb.2022.857352' },
    ],
    gettingStarted: [
      '学习16S rRNA分析流程 (QIIME2)',
      '使用Kraken2/Bracken进行物种分类',
      '实践深度学习方法进行读段分类',
      '分析微生物组与宿主表型关联',
    ],
  },
];
