export interface Stage {
  id: number;
  name: string;
  nameEn: string;
  duration: string;
  description: string;
  mlTopics: string[];
  dlTopics: string[];
  mathTopics: string[];
  tools: string[];
  projects: { name: string; description: string }[];
  resources: { name: string; type: string }[];
}

export const stages: Stage[] = [
  {
    id: 1,
    name: '基础入门',
    nameEn: 'Foundations',
    duration: '4-6 周',
    description: '建立编程、数学和生物信息学基础，理解ML/DL基本概念和术语。',
    mlTopics: [
      '监督学习 vs 无监督学习',
      '分类与回归问题',
      'k近邻算法 (k-NN)',
      'k-means聚类',
      '决策树基础',
      '模型评估: 准确率、精确率、召回率、F1',
      '交叉验证',
      '过拟合与欠拟合',
    ],
    dlTopics: [
      '神经网络基础结构',
      '前馈神经网络 (FNN)',
      '激活函数: ReLU, Sigmoid, Tanh',
      '反向传播算法',
      '损失函数基础',
      '梯度下降概念',
      'PyTorch/TensorFlow入门',
    ],
    mathTopics: [
      '线性代数: 向量、矩阵、点积',
      '微积分: 导数、偏导数、链式法则',
      '概率基础: 条件概率、贝叶斯定理',
      '统计基础: 均值、方差、分布',
    ],
    tools: ['Python', 'NumPy', 'Pandas', 'Matplotlib', 'scikit-learn', 'PyTorch'],
    projects: [
      { name: '基因表达分类', description: '使用k-NN对TCGA基因表达数据进行癌症类型分类' },
      { name: 'DNA序列k-mer聚类', description: '对不同物种的DNA序列进行k-mer频率聚类分析' },
    ],
    resources: [
      { name: 'Andrew Ng机器学习课程', type: '视频课程' },
      { name: '3Blue1Brown深度学习系列', type: '视频' },
      { name: 'ISLR (统计学习导论)', type: '书籍' },
      { name: 'PyTorch官方教程', type: '教程' },
    ],
  },
  {
    id: 2,
    name: '核心方法',
    nameEn: 'Core Methods',
    duration: '6-8 周',
    description: '深入掌握经典ML算法和深度学习核心架构，学习特征工程和模型调优。',
    mlTopics: [
      '支持向量机 (SVM)',
      '随机森林与集成学习',
      '梯度提升树 (XGBoost, LightGBM)',
      '逻辑回归',
      '朴素贝叶斯',
      '特征选择与降维 (PCA, t-SNE)',
      '超参数调优 (Grid Search, Random Search)',
      '模型解释性 (SHAP, LIME)',
      '不平衡数据处理',
    ],
    dlTopics: [
      '卷积神经网络 (CNN)',
      '循环神经网络 (RNN)',
      'LSTM与GRU',
      'Embedding层',
      'Dropout与正则化',
      'Batch Normalization',
      '学习率调度',
      '数据增强',
      '迁移学习基础',
    ],
    mathTopics: [
      '矩阵分解 (SVD, 特征分解)',
      '梯度下降变种 (SGD, Adam, RMSprop)',
      '概率分布 (正态、伯努利、多项)',
      '最大似然估计',
      '信息论基础 (熵、交叉熵)',
    ],
    tools: ['scikit-learn', 'XGBoost', 'PyTorch', 'TensorFlow', 'SHAP', 'Optuna'],
    projects: [
      { name: '蛋白质二级结构预测', description: '使用CNN对蛋白质序列进行二级结构分类' },
      { name: '基因表达降维可视化', description: '使用PCA和t-SNE对单细胞数据进行降维和可视化' },
      { name: '突变致病性预测', description: '使用随机森林预测SNP的致病性' },
    ],
    resources: [
      { name: 'Hands-On Machine Learning', type: '书籍' },
      { name: 'Dive into Deep Learning (D2L)', type: '书籍+教程' },
      { name: 'Fast.ai Part 1', type: '课程' },
      { name: 'Stanford CS231n', type: '课程' },
    ],
  },
  {
    id: 3,
    name: '进阶架构',
    nameEn: 'Advanced Architectures',
    duration: '8-10 周',
    description: '掌握Transformer、自注意力机制等现代深度学习架构，学习大规模预训练模型。',
    mlTopics: [
      '集成策略进阶 (Stacking, Blending)',
      '主动学习',
      '半监督学习',
      '图神经网络基础 (GNN)',
      'AutoML',
    ],
    dlTopics: [
      '注意力机制',
      'Transformer架构 (Self-Attention, Multi-Head)',
      'BERT与预训练语言模型',
      'Vision Transformer (ViT)',
      '自编码器 (Autoencoder, VAE)',
      '生成对抗网络 (GAN)',
      '多模态学习',
      '模型蒸馏',
    ],
    mathTopics: [
      '注意力机制数学推导',
      '变分推断基础',
      '图论与谱聚类',
      '优化理论进阶',
      '拉格朗日乘子法',
    ],
    tools: ['PyTorch', 'Hugging Face Transformers', 'PyTorch Geometric', 'WandB', 'TensorBoard'],
    projects: [
      { name: 'DNA序列BERT预训练', description: '使用Transformer对DNA序列进行预训练和调控区域预测' },
      { name: '蛋白质接触图预测', description: '使用注意力机制预测蛋白质残基间接触' },
      { name: '单细胞数据插补', description: '使用VAE对单细胞RNA-seq数据进行缺失值插补' },
    ],
    resources: [
      { name: 'Attention Is All You Need (论文)', type: '论文' },
      { name: 'Hugging Face NLP Course', type: '课程' },
      { name: 'Stanford CS224N', type: '课程' },
      { name: 'Deep Graph Library教程', type: '教程' },
    ],
  },
  {
    id: 4,
    name: '专业应用',
    nameEn: 'Specialized Applications',
    duration: '持续学习',
    description: '深入特定生物信息学子领域，掌握前沿方法和大型预训练生物模型。',
    mlTopics: [
      'AlphaFold相关ML方法',
      '蛋白质语言模型 (ESM系列)',
      '基因组语言模型 (Enformer, Nucleotide Transformer)',
      '因果推断基础',
      '强化学习在生物中的应用',
      '神经架构搜索 (NAS)',
      '联邦学习',
    ],
    dlTopics: [
      'AlphaFold2架构详解',
      'ESM-2蛋白质表示学习',
      'Enformer基因表达预测',
      '扩散模型在分子生成中的应用',
      '大型生物多模态模型',
      '单细胞基础模型 (scGPT, scFoundation)',
    ],
    mathTopics: [
      '微分方程与动力系统',
      '随机过程与马尔可夫链',
      '变分法',
      '信息论进阶 (互信息、KL散度)',
      '流形学习',
    ],
    tools: [
      'AlphaFold2 / ColabFold',
      'ESM-2 (Hugging Face)',
      'Enformer',
      'DeepChem',
      'Scanpy / scVI',
      'RDKit',
    ],
    projects: [
      { name: '蛋白质功能预测', description: '使用ESM-2嵌入进行蛋白质GO注释预测' },
      { name: '基因调控序列设计', description: '使用扩散模型生成具有特定调控功能的DNA序列' },
      { name: '药物分子性质预测', description: '使用图神经网络预测分子ADMET性质' },
      { name: '单细胞注释与批次校正', description: '使用scVI进行单细胞数据整合与细胞类型注释' },
    ],
    resources: [
      { name: 'AlphaFold论文 (Nature 2021)', type: '论文' },
      { name: 'ESM论文系列', type: '论文' },
      { name: 'Deep Learning for the Life Sciences', type: '书籍' },
      { name: 'CS25: Transformers United (Stanford)', type: '课程' },
    ],
  },
];
