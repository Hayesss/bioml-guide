export interface MathTopic {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  bioAnalogy: string;
  bioAnalogyDetail: string;
  keyConcepts: { name: string; formula: string; description: string }[];
  resources: { name: string; type: string; url: string }[];
  mlUsage: string[];
  dlUsage: string[];
  difficulty: string;
}

export const mathTopics: MathTopic[] = [
  {
    id: 'linear-algebra',
    name: '线性代数',
    nameEn: 'Linear Algebra',
    description: '机器学习的数学语言，用于表示和操作数据。',
    bioAnalogy: '基因调控网络',
    bioAnalogyDetail:
      '想象基因调控网络: 每个基因是一个节点，调控关系是边。线性代数中的矩阵正是描述这种网络的最佳工具——邻接矩阵A的元素A_ij表示基因i对基因j的调控强度。PCA用于降维寻找主要调控模式，就像WGCNA发现基因模块。',
    keyConcepts: [
      {
        name: '向量',
        formula: 'v = [v1, v2, ..., vn] ∈ R^n',
        description: '数据的数值表示。在生物信息学中，一个基因表达向量可以表示一个样本中数千个基因的表达量，如v = [TP53表达值, BRCA1表达值, EGFR表达值, ...]，是机器学习模型的基本输入单元。',
      },
      {
        name: '矩阵乘法',
        formula: '(AB)_ij = Σ_k A_ik B_kj',
        description: '神经网络前向传播的核心运算。在生物信息学中，矩阵乘法用于将基因表达矩阵(样本×基因)与权重矩阵相乘实现线性变换，例如在全连接层中将2048维基因特征映射到128维隐层表示。',
      },
      {
        name: '点积',
        formula: 'a · b = Σ_i a_i b_i = ||a|| ||b|| cos(θ)',
        description: '衡量两个向量的相似度，是注意力机制的基础。在生物信息学中，点积用于计算蛋白质序列中两个位置嵌入的相似度(Transformer中的Q·K)，以及评估基因表达谱之间的相关性进行样本聚类。',
      },
      {
        name: '特征分解',
        formula: 'Av = λv',
        description: '找到矩阵的主要方向(特征向量)和对应的缩放因子(特征值)，是PCA的核心数学操作。在生物信息学中，对基因表达矩阵的协方差矩阵进行特征分解，可以找到主导表达变化的主要基因模块(如细胞周期模块)。',
      },
      {
        name: 'SVD',
        formula: 'A = UΣV^T',
        description: '任意矩阵的分解方法，将数据分解为正交基底和奇异值。在生物信息学中，SVD用于基因表达数据的降噪(去除小的奇异值对应噪声)和缺失值插补，以及推荐系统中药物-靶标相互作用的矩阵补全。',
      },
    ],
    resources: [
      { name: '3Blue1Brown线性代数', type: '视频', url: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab' },
      { name: 'MIT 18.06 Gilbert Strang', type: '课程', url: 'https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/' },
      { name: 'MML Book Chapter 2-4', type: '书籍', url: 'https://mml-book.github.io/' },
    ],
    mlUsage: [
      'PCA降维: 对高维基因表达数据进行降维',
      '特征提取: 从原始数据中提取主要特征',
      '核方法: SVM的核技巧依赖于内积空间',
      '推荐系统: 矩阵分解用于药物-靶标预测',
    ],
    dlUsage: [
      '前向传播: 矩阵乘法构成神经网络的基本运算',
      '嵌入层: 将离散符号映射为连续向量',
      '注意力机制: Query-Key-Value的核心是点积',
      'Batch Normalization: 基于协方差矩阵的标准化',
    ],
    difficulty: '入门',
  },
  {
    id: 'calculus',
    name: '微积分',
    nameEn: 'Calculus',
    description: '优化和学习的数学基础，理解梯度下降的核心。',
    bioAnalogy: '酶动力学',
    bioAnalogyDetail:
      '酶促反应的米氏方程 v = Vmax[S]/(Km+[S]) 就是微积分的完美应用。导数告诉我们反应速率随底物浓度的变化率——这正是梯度下降寻找最优解的方式。在神经网络的训练中，我们通过反向传播计算损失函数对每个参数的偏导数，就像研究每个调控因子对反应速率的影响。',
    keyConcepts: [
      {
        name: '导数',
        formula: "f'(x) = lim(h→0) [f(x+h) - f(x)] / h",
        description: '函数在某点的瞬时变化率。在生物信息学中，导数用于计算基因表达量随时间变化的速率（如药物处理后的表达动力学），以及神经网络中损失函数对权重的敏感度。',
      },
      {
        name: '偏导数',
        formula: '∂f/∂x_i',
        description: '多变量函数对某一变量的变化率。在生物信息学中，偏导数用于计算损失函数对每个模型参数(如某一连接权重)的独立影响，是反向传播算法中逐层梯度计算的基础。',
      },
      {
        name: '链式法则',
        formula: '∂z/∂x = ∂z/∂y · ∂y/∂x',
        description: '复合函数的求导法则，反向传播算法的数学基础。在生物信息学中，链式法则使得可以高效计算深层蛋白质结构预测网络中数百万参数的梯度，从输出层的损失一直传播到输入层的嵌入。',
      },
      {
        name: '梯度',
        formula: '∇f = [∂f/∂x1, ∂f/∂x2, ..., ∂f/∂xn]',
        description: '函数增长最快的方向向量，梯度的反方向用于参数优化。在生物信息学中，梯度指导基因调控网络推断中参数的调整方向，使模型预测的基因表达值逐步接近实验观测值。',
      },
      {
        name: '梯度下降',
        formula: 'θ_{t+1} = θ_t - α ∇f(θ_t)',
        description: '沿梯度反方向迭代更新参数以最小化损失函数。在生物信息学中，梯度下降用于训练所有神经网络模型，如优化AlphaFold的结构预测参数使预测结构与实验结构的RMSD最小。',
      },
    ],
    resources: [
      { name: '3Blue1Brown微积分', type: '视频', url: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDMsr9K-rj53DwVRMYO3t5Yr' },
      { name: 'MML Book Chapter 5', type: '书籍', url: 'https://mml-book.github.io/' },
      { name: 'MIT 18.01/18.02', type: '课程', url: 'https://ocw.mit.edu/' },
    ],
    mlUsage: [
      '梯度下降: 所有参数模型的优化基础',
      '正则化: L1/L2正则项的梯度计算',
      '牛顿法: 使用二阶导数加速收敛',
      '概率模型: 似然函数的最大化',
    ],
    dlUsage: [
      '反向传播: 链式法则在多层网络中的应用',
      '学习率: 控制梯度下降的步长',
      '动量: 利用梯度的累积加速收敛',
      '自动微分: PyTorch/TensorFlow自动计算梯度',
    ],
    difficulty: '入门',
  },
  {
    id: 'probability',
    name: '概率与统计',
    nameEn: 'Probability & Statistics',
    description: '不确定性建模和数据推断的数学基础。',
    bioAnalogy: '遗传变异与表型',
    bioAnalogyDetail:
      '全基因组关联分析(GWAS)中，我们寻找SNP与疾病的关联。由于遗传和环境因素的复杂性，这种关联本质上是概率性的。贝叶斯定理让我们可以从先验知识(已知致病基因)和观测数据(患者测序)更新对致病性的信念，就像医生结合病史和新检查结果做诊断。',
    keyConcepts: [
      {
        name: '条件概率',
        formula: 'P(A|B) = P(A∩B) / P(B)',
        description: '在已知B发生的情况下A发生的概率。在生物信息学中，条件概率用于计算在观察到某基因突变的情况下患病的概率，以及从测序数据中推断给定读段条件下各基因型的后验概率。',
      },
      {
        name: '贝叶斯定理',
        formula: 'P(A|B) = P(B|A)P(A) / P(B)',
        description: '从先验概率和似然推导后验概率的数学框架。在生物信息学中，贝叶斯定理是基因组变异检测(GATK HaplotypeCaller)和蛋白质结构预测(Rosetta)的核心，将先验生物学知识与观测数据融合。',
      },
      {
        name: '正态分布',
        formula: 'N(x|μ,σ) = 1/(σ√2π) exp(-(x-μ)²/(2σ²))',
        description: '最广泛使用的连续概率分布，描述许多自然现象的随机波动。在生物信息学中，正态分布用于建模基因表达数据的对数转换后的分布、蛋白质质谱数据的噪声和微阵列数据的背景信号。',
      },
      {
        name: '最大似然估计',
        formula: 'θ̂ = argmax_θ Σ log P(x_i|θ)',
        description: '找到使观测数据出现概率最大的模型参数。在生物信息学中，最大似然估计用于训练隐马尔可夫模型进行基因结构注释(Augustus)、估计系统发育树的枝长和进化模型参数(IQ-TREE)。',
      },
      {
        name: '期望与方差',
        formula: 'E[X] = Σ x P(x), Var(X) = E[(X-E[X])²]',
        description: '描述随机变量的中心趋势和离散程度的基本统计量。在生物信息学中，期望和方差用于差异基因表达分析(edgeR/DEseq2中的归一化因子估计)、评估突变频率的群体间差异和量化表达数据的批次效应。',
      },
    ],
    resources: [
      { name: '3Blue1Brown概率', type: '视频', url: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDMsr9K-rj53DwVRMYO3t5Yr' },
      { name: 'MML Book Chapter 6-7', type: '书籍', url: 'https://mml-book.github.io/' },
      { name: 'Statistical Learning (ISLR)', type: '书籍', url: 'https://www.statlearning.com/' },
    ],
    mlUsage: [
      '朴素贝叶斯: 基于条件概率的分类器',
      '高斯过程: 贝叶斯非参数回归',
      '隐马尔可夫模型: 序列标注',
      'Bootstrap: 统计推断和置信区间',
    ],
    dlUsage: [
      '变分自编码器: 概率生成模型',
      'Dropout: 贝叶斯近似的随机正则化',
      '损失函数: 交叉熵来自信息论',
      '概率输出: Softmax给出类别概率',
    ],
    difficulty: '入门',
  },
  {
    id: 'optimization',
    name: '优化',
    nameEn: 'Optimization',
    description: '寻找最优解的方法论，是模型训练的核心。',
    bioAnalogy: '蛋白质折叠',
    bioAnalogyDetail:
      '蛋白质折叠可以看作一个能量景观上的优化问题。氨基酸序列在寻找最低自由能的构象，就像梯度下降在寻找损失函数的最小值。局部最优对应局部折叠状态，全局最优对应天然构象。AlphaFold的成功部分归功于它学会了如何在这个复杂的能量景观中导航。',
    keyConcepts: [
      {
        name: '凸函数',
        formula: 'f(λx + (1-λ)y) ≤ λf(x) + (1-λ)f(y)',
        description: '任意局部最小值都是全局最小值的函数，优化理论中最理想的性质。在生物信息学中，逻辑回归的损失函数是凸函数，保证能找到全局最优解；而蛋白质折叠的能量函数和深层神经网络损失通常是非凸的。',
      },
      {
        name: 'SGD',
        formula: 'θ_{t+1} = θ_t - α ∇f_i(θ_t)',
        description: '使用单个或小批量样本估计梯度的随机优化算法。在生物信息学中，SGD是训练大规模生物数据模型的基础，如使用小批量基因表达样本更新蛋白质功能预测网络的权重，比全批量梯度下降更高效。',
      },
      {
        name: 'Adam',
        formula: 'm_t = β1·m_{t-1} + (1-β1)·g_t; v_t = β2·v_{t-1} + (1-β2)·g_t²',
        description: '自适应学习率优化算法，结合动量(一阶矩)和RMSprop(二阶矩)为每个参数独立调整学习步长。在生物信息学中，Adam是训练蛋白质语言模型(ESM)和基因组Transformer(Nucleotide Transformer)的默认优化器，因其对稀疏梯度和不同参数尺度的鲁棒性。',
      },
      {
        name: '学习率调度',
        formula: 'α_t = α_0 / (1 + γt)',
        description: '随训练时间动态调整学习率的策略，如阶梯衰减、余弦退火和预热。在生物信息学中，训练大型基因组语言模型时使用学习率预热(warmup)可以避免早期训练不稳定，配合余弦退火有助于找到更优的模型参数。',
      },
      {
        name: '正则化',
        formula: 'L(θ) + λ||θ||²',
        description: '在目标函数中添加惩罚项以防止模型过拟合的技术。在生物信息学中，L2正则化(权重衰减)用于控制基因表达分类模型的复杂度，L1正则化(LASSO)用于从高维基因组数据中自动选择少量重要的生物标志物基因。',
      },
    ],
    resources: [
      { name: 'MML Book Chapter 7', type: '书籍', url: 'https://mml-book.github.io/' },
      { name: 'An Overview of Gradient Descent', type: '文章', url: 'https://ruder.io/optimizing-gradient-descent/' },
    ],
    mlUsage: [
      '损失最小化: 所有ML模型的训练目标',
      '超参数调优: 贝叶斯优化、网格搜索',
      '稀疏解: LASSO的L1正则化',
      '约束优化: SVM的对偶问题',
    ],
    dlUsage: [
      '反向传播: 计算梯度的算法',
      'BatchNorm: 稳定优化的归一化',
      '学习率: 最重要的超参数之一',
      '二阶方法: L-BFGS, 自然梯度',
    ],
    difficulty: '中级',
  },
  {
    id: 'information-theory',
    name: '信息论',
    nameEn: 'Information Theory',
    description: '量化信息、不确定性和通信效率的数学理论。',
    bioAnalogy: 'DNA编码效率',
    bioAnalogyDetail:
      'DNA使用4种核苷酸编码遗传信息，密码子(3个核苷酸)编码20种氨基酸。信息论帮助我们理解这种编码的效率——为什么不是2个核苷酸足够(只能编码16种)? 为什么有64个密码子却只编码20种氨基酸(冗余用于错误校正)? 熵衡量DNA序列的不确定性，互信息揭示碱基间的依赖关系。',
    keyConcepts: [
      {
        name: '熵',
        formula: 'H(X) = -Σ P(x) log P(x)',
        description: '随机变量的平均信息量或不确定性。在生物信息学中，熵用于量化DNA序列的保守性（保守位点熵低，可变位点熵高），指导多序列比对的评分和蛋白质功能位点的识别。',
      },
      {
        name: '交叉熵',
        formula: 'H(p,q) = -Σ p(x) log q(x)',
        description: '用近似分布q描述真实分布p时的信息损失，是分类任务的标准损失函数。在生物信息学中，交叉熵损失用于训练DeepVariant进行变异基因型分类、ESM进行蛋白质家族分类和Enformer进行基因表达预测。',
      },
      {
        name: 'KL散度',
        formula: 'D_KL(p||q) = Σ p(x) log(p(x)/q(x))',
        description: '衡量两个概率分布之间差异的不对称度量。在生物信息学中，KL散度用于变分自编码器(scVI)约束隐空间的先验分布、比较不同物种的密码子使用偏好和评估基因表达分布的批次间差异。',
      },
      {
        name: '互信息',
        formula: 'I(X;Y) = H(X) - H(X|Y) = D_KL(P(X,Y)||P(X)P(Y))',
        description: '衡量两个变量之间共享信息量或统计依赖性的对称度量。在生物信息学中，互信息是推断基因调控网络(ARACNE)的核心方法，通过计算基因表达之间的互信息识别直接调控关系，排除间接相互作用。',
      },
      {
        name: '信息增益',
        formula: 'IG(S,A) = H(S) - Σ |S_v|/|S| · H(S_v)',
        description: '特征A对数据集S的不确定性的减少量。在生物信息学中，信息增益用于决策树算法(如随机森林)选择最佳的基因特征进行分裂，识别对癌症亚型分类信息量最大的基因标志物。',
      },
    ],
    resources: [
      { name: '信息论入门 (MacKay)', type: '书籍', url: 'https://www.inference.org.uk/itprnn/book.html' },
      { name: 'MML Book Chapter 6', type: '书籍', url: 'https://mml-book.github.io/' },
      { name: '3Blue1Brown信息论', type: '视频', url: 'https://www.youtube.com/watch?v=ErfnhcEV9O8' },
    ],
    mlUsage: [
      '决策树: 信息增益用于特征选择',
      '特征选择: 互信息筛选重要特征',
      '聚类: 信息论准则确定聚类数',
      '模型比较: AIC/BIC基于信息论',
    ],
    dlUsage: [
      '交叉熵损失: 分类任务的标准损失函数',
      'VAE: KL散度约束隐空间分布',
      '注意力: 可解释为信息选择',
      '知识蒸馏: 最小化师生输出的KL散度',
    ],
    difficulty: '中级',
  },
];
