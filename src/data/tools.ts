export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  installCommand: string;
  difficulty: string;
  mlRelevant: boolean;
  dlRelevant: boolean;
  url: string;
  tags: string[];
  quickExample?: string;
}

export const toolCategories = [
  '全部',
  'ML框架',
  'DL框架',
  '蛋白质',
  '基因组',
  '单细胞',
  '分子',
  '数据',
  '平台',
];

export const tools: Tool[] = [
  {
    id: 'scikit-learn',
    name: 'scikit-learn',
    description: 'Python最广泛使用的传统机器学习库，提供分类、回归、聚类、降维和模型选择等算法的统一接口和完整实现。当需要快速构建基线模型进行基因表达分类、蛋白质功能预测或变异致病性评估时，scikit-learn是首选工具，因为它API简洁且文档完善。典型生物信息学用例：使用随机森林基于基因表达特征预测癌症亚型，并通过内置的交叉验证和网格搜索进行模型调优。',
    category: 'ML框架',
    installCommand: 'pip install scikit-learn',
    difficulty: '入门',
    mlRelevant: true,
    dlRelevant: false,
    url: 'https://scikit-learn.org/',
    tags: ['分类', '回归', '聚类', '降维'],
    quickExample: `from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import cross_val_score

# 用基因表达特征预测癌症亚型
model = RandomForestClassifier(n_estimators=100)
scores = cross_val_score(model, X_gene_expr, y_cancer_type, cv=5)`,
  },
  {
    id: 'xgboost',
    name: 'XGBoost',
    description: '高效的梯度提升决策树实现，通过正则化、并行处理和缓存优化在速度和精度上均表现出色。在处理基因突变特征、蛋白质描述符等表格型生物数据时，XGBoost通常是性能最优的选择之一，在多个生物信息学Kaggle竞赛中获胜。典型生物信息学用例：利用多维度基因组特征（保守性、等位基因频率、功能注释）训练梯度提升模型预测SNP的致病性，如CADD分数的改进版本。',
    category: 'ML框架',
    installCommand: 'pip install xgboost',
    difficulty: '中级',
    mlRelevant: true,
    dlRelevant: false,
    url: 'https://xgboost.readthedocs.io/',
    tags: ['梯度提升', '决策树', 'Kaggle'],
    quickExample: `import xgboost as xgb

# 用基因组特征预测SNP致病性
dtrain = xgb.DMatrix(X_genomic_features, label=y_pathogenicity)
model = xgb.train({"max_depth": 6, "eta": 0.1}, dtrain, num_boost_round=100)
preds = model.predict(xgb.DMatrix(X_test))`,
  },
  {
    id: 'lightgbm',
    name: 'LightGBM',
    description: '微软开发的轻量级梯度提升框架，采用基于直方图的决策树算法和叶子优先(leaf-wise)的树生长策略，训练速度比传统实现快数倍且内存占用更低。适合处理大规模生物数据集（如百万级基因组变异或数十万单细胞样本）。典型生物信息学用例：在大规模GWAS数据上快速训练梯度提升模型进行多基因风险评分(polygenic risk score)计算。',
    category: 'ML框架',
    installCommand: 'pip install lightgbm',
    difficulty: '中级',
    mlRelevant: true,
    dlRelevant: false,
    url: 'https://lightgbm.readthedocs.io/',
    tags: ['梯度提升', '高效', '微软'],
    quickExample: `import lightgbm as lgb

# 大规模GWAS数据上快速训练PRS模型
train_data = lgb.Dataset(X_gwas, label=y_phenotype)
model = lgb.train({"objective": "regression", "num_leaves": 31},
                  train_data, num_boost_round=200)`,
  },
  {
    id: 'pytorch',
    name: 'PyTorch',
    description: '由Meta开发的动态深度学习框架，提供直观的张量运算、自动微分和GPU加速功能，是学术界最广泛使用的深度学习平台。几乎所有的现代生物信息学深度学习模型（AlphaFold、ESM、scVI、Enformer）都基于PyTorch实现。典型生物信息学用例：使用PyTorch搭建卷积神经网络对DNA序列进行转录因子结合位点预测，利用自动微分自动计算梯度并通过GPU加速训练。',
    category: 'DL框架',
    installCommand: 'pip install torch torchvision torchaudio',
    difficulty: '中级',
    mlRelevant: false,
    dlRelevant: true,
    url: 'https://pytorch.org/',
    tags: ['动态图', '研究', 'GPU'],
    quickExample: `import torch, torch.nn as nn

# CNN对DNA序列进行转录因子结合位点预测
class DNACNN(nn.Module):
    def __init__(self):
        super().__init__()
        self.conv = nn.Conv1d(4, 64, kernel_size=12)  # 4=A,T,C,G
        self.fc = nn.Linear(64, 1)`,
  },
  {
    id: 'tensorflow',
    name: 'TensorFlow',
    description: 'Google开发的工业级深度学习框架，Keras高阶API使其模型构建简洁直观，TensorBoard提供强大的训练可视化，SavedModel格式便于生产部署。在生物信息学中，DeepVariant和Enformer等早期重要模型使用TensorFlow实现。典型生物信息学用例：使用TensorFlow/Keras构建深度学习模型对基因组序列进行功能元件注释，并导出为TensorFlow Serving格式部署为在线预测服务。',
    category: 'DL框架',
    installCommand: 'pip install tensorflow',
    difficulty: '中级',
    mlRelevant: false,
    dlRelevant: true,
    url: 'https://www.tensorflow.org/',
    tags: ['Keras', '生产部署', 'Google'],
    quickExample: `import tensorflow as tf

# Keras构建基因组序列功能注释模型
model = tf.keras.Sequential([
    tf.keras.layers.Conv1D(64, 12, activation="relu", input_shape=(1000, 4)),
    tf.keras.layers.GlobalMaxPooling1D(),
    tf.keras.layers.Dense(1, activation="sigmoid")
])`,
  },
  {
    id: 'huggingface',
    name: 'Hugging Face Transformers',
    description: '预训练Transformer模型的统一接口库，提供BERT、GPT、T5、ESM等数千种模型的即插即用实现，支持自动模型下载、Tokenization、微调和推理流水线。在生物信息学中，所有蛋白质语言模型(ESM)和基因组语言模型(Nucleotide Transformer)都通过该库分发。典型生物信息学用例：加载预训练的ESM-2模型提取蛋白质序列嵌入，用于下游的蛋白质功能预测和突变效应评估。',
    category: 'DL框架',
    installCommand: 'pip install transformers',
    difficulty: '中级',
    mlRelevant: false,
    dlRelevant: true,
    url: 'https://huggingface.co/docs/transformers/',
    tags: ['BERT', 'GPT', '预训练模型'],
    quickExample: `from transformers import AutoTokenizer, AutoModel

# 加载ESM-2蛋白质语言模型
tokenizer = AutoTokenizer.from_pretrained("facebook/esm2_t33_650M_UR50D")
model = AutoModel.from_pretrained("facebook/esm2_t33_650M_UR50D")

# 提取蛋白质序列嵌入
inputs = tokenizer("MPYTVVFTFPNR", return_tensors="pt")
outputs = model(**inputs)  # last_hidden_state: (1, seq_len, 1280)`,
  },
  {
    id: 'esm2',
    name: 'ESM-2',
    description: 'Meta开发的15亿参数蛋白质语言模型，基于Transformer架构在UniRef数据库上训练，能够生成高质量的蛋白质上下文相关表示。提供从8M到15B多种参数规模的模型，适合不同计算资源的场景。典型生物信息学用例：对目标蛋白质序列进行零样本突变效应预测，无需任何标记数据即可评估单个氨基酸替换对蛋白质功能的潜在影响。',
    category: '蛋白质',
    installCommand: 'pip install fair-esm',
    difficulty: '中级',
    mlRelevant: false,
    dlRelevant: true,
    url: 'https://github.com/facebookresearch/esm',
    tags: ['蛋白质语言模型', '表示学习', 'Meta'],
    quickExample: `import torch
import esm

# 零样本突变效应预测
model, alphabet = esm.pretrained.esm2_t33_650M_UR50D()
batch_converter = alphabet.get_batch_converter()

data = [("WT", "MKTVRQER"), ("Mutant", "MKTVRQPR")]
_, _, batch_tokens = batch_converter(data)
with torch.no_grad():
    results = model(batch_tokens, repr_layers=[33])`,
  },
  {
    id: 'alphafold2',
    name: 'AlphaFold2',
    description: 'DeepMind开发的端到端蛋白质结构预测系统，通过Evoformer处理多序列比对和配对表示，输出原子级精度的3D结构，在CASP14竞赛中达到近实验精度。需要GPU加速和较大的内存资源，适合对少量重要蛋白质进行高精度结构预测。典型生物信息学用例：预测新测序物种的蛋白质组三维结构，为后续的功能注释和药物靶点筛选提供结构基础。',
    category: '蛋白质',
    installCommand: 'git clone https://github.com/deepmind/alphafold',
    difficulty: '高级',
    mlRelevant: false,
    dlRelevant: true,
    url: 'https://github.com/deepmind/alphafold',
    tags: ['结构预测', 'DeepMind', '诺贝尔奖'],
    quickExample: `# AlphaFold2 单体蛋白质结构预测
# 需要：序列FASTA + 遗传数据库
python run_alphafold.py \\
  --fasta_paths=protein.fasta \\
  --output_dir=./output \\
  --model_preset=monomer \\
  --db_preset=full_dbs`,
  },
  {
    id: 'colabfold',
    name: 'ColabFold',
    description: 'AlphaFold的优化实现版本，集成MMseqs2快速生成多序列比对，可在Google Colab免费GPU上运行，大幅降低蛋白质结构预测的计算门槛和时间成本。适合没有高性能计算资源的实验室快速进行蛋白质结构预测。典型生物信息学用例：研究者上传目标蛋白质序列到ColabFold笔记本，在几分钟内获得与AlphaFold2相当质量的3D结构预测结果。',
    category: '蛋白质',
    installCommand: 'pip install colabfold',
    difficulty: '入门',
    mlRelevant: false,
    dlRelevant: true,
    url: 'https://github.com/sokrypton/ColabFold',
    tags: ['AlphaFold', 'Colab', '免费'],
    quickExample: `# ColabFold 快速蛋白质结构预测
# 可在 Google Colab 免费GPU上运行
import colabfold
colabfold.run("protein.fasta", "./output")

# 或使用命令行：
# colabfold_batch protein.fasta ./output`,
  },
  {
    id: 'deepvariant',
    name: 'DeepVariant',
    description: 'Google开发的基于深度学习的变异检测工具，将测序读段比对信息编码为RGB图像后通过Inception CNN进行分类，能够精确检测SNP和短Indel。支持人类和多种非人物种的变异检测，已通过PrecisionFDA验证。典型生物信息学用例：对全基因组测序数据(BAM文件)进行变异检测，输出符合VCF标准的高质量变异调用结果用于后续的关联分析。',
    category: '基因组',
    installCommand: 'docker pull google/deepvariant',
    difficulty: '中级',
    mlRelevant: false,
    dlRelevant: true,
    url: 'https://github.com/google/deepvariant',
    tags: ['变异检测', 'CNN', 'Google'],
    quickExample: `# DeepVariant 变异检测 (Docker)
BIN_VERSION="1.6.1"
docker run \\
  -v "\${PWD}/input":"/input" \\
  -v "\${PWD}/output":"/output" \\
  google/deepvariant:"\${BIN_VERSION}" \\
  /opt/deepvariant/bin/run_deepvariant \\
  --ref=/input/ref.fasta --reads=/input/sample.bam \\
  --output_vcf=/output/output.vcf.gz`,
  },
  {
    id: 'enformer',
    name: 'Enformer',
    description: 'DeepMind开发的基于Transformer架构的基因表达预测模型，从基因组DNA序列直接预测基因表达水平和多种染色质特征，能够捕捉长达100kb以上的远距离调控相互作用。适用于理解非编码区变异的功能影响和调控机制研究。典型生物信息学用例：预测某启动子区域突变对邻近基因表达水平的影响，评估非编码变异的致病潜力。',
    category: '基因组',
    installCommand: 'pip install enformer-pytorch',
    difficulty: '高级',
    mlRelevant: false,
    dlRelevant: true,
    url: 'https://github.com/lucidrains/enformer-pytorch',
    tags: ['Transformer', '基因表达', 'DeepMind'],
    quickExample: `import torch
from enformer_pytorch import Enformer

# 从DNA序列预测基因表达
model = Enformer.from_pretrained("EleutherAI/enformer-official-rough")

# 输入: one-hot编码的DNA序列 (1, 196608, 4)
seq = torch.randint(0, 2, (1, 196608, 4)).float()
output = model(seq)  # 预测表达和表观基因组轨迹`,
  },
  {
    id: 'scvi',
    name: 'scVI',
    description: '基于变分自编码器的单细胞数据分析工具，通过深度生成模型学习细胞的概率低维表示，能够同时进行批次校正、降维、差异表达分析和缺失值插补。是单细胞RNA测序数据分析的核心工具之一。典型生物信息学用例：整合来自不同实验批次和测序平台的单细胞数据，去除批次效应后进行统一的细胞类型注释和差异表达分析。',
    category: '单细胞',
    installCommand: 'pip install scvi-tools',
    difficulty: '中级',
    mlRelevant: false,
    dlRelevant: true,
    url: 'https://scvi-tools.org/',
    tags: ['VAE', '批次校正', '单细胞'],
    quickExample: `import scvi
import scanpy as sc

# 单细胞批次校正与降维
adata = sc.read("pbmc3k.h5ad")
scvi.model.SCVI.setup_anndata(adata, batch_key="batch")
model = scvi.model.SCVI(adata)
model.train()
adata.obsm["X_scVI"] = model.get_latent_representation()`,
  },
  {
    id: 'scanpy',
    name: 'Scanpy',
    description: '单细胞数据分析的核心Python库，提供从数据预处理、质量控制、降维、聚类到差异表达分析和可视化的完整分析流程。与AnnData数据格式紧密集成，是单细胞生物信息学的事实标准工具。典型生物信息学用例：对10x Genomics平台产生的单细胞RNA测序数据进行质控过滤、归一化、PCA降维、UMAP可视化和Louvain聚类分析。',
    category: '单细胞',
    installCommand: 'pip install scanpy',
    difficulty: '入门',
    mlRelevant: true,
    dlRelevant: false,
    url: 'https://scanpy.readthedocs.io/',
    tags: ['分析流程', '可视化', '单细胞'],
    quickExample: `import scanpy as sc

# 标准单细胞RNA-seq预处理流程
adata = sc.read_10x_h5("pbmc3k_filtered_gene_bc_matrices.h5")
sc.pp.filter_cells(adata, min_genes=200)
sc.pp.normalize_total(adata, target_sum=1e4)
sc.pp.log1p(adata)
sc.pp.highly_variable_genes(adata, n_top_genes=2000)
sc.tl.pca(adata, n_comps=50)
sc.pp.neighbors(adata)
sc.tl.umap(adata)
sc.tl.leiden(adata, resolution=0.5)`,
  },
  {
    id: 'deepchem',
    name: 'DeepChem',
    description: '面向化学信息学和药物发现的深度学习库，提供分子图神经网络(MPNN、GAT)、分子指纹、SMILES表示学习和Moleculenet基准数据集。将RDKit的分子操作与PyTorch/TensorFlow的深度学习 seamlessly 结合。典型生物信息学用例：使用图卷积网络(GCN)对ChEMBL数据集中的分子进行毒性预测，评估候选药物的安全性。',
    category: '分子',
    installCommand: 'pip install deepchem',
    difficulty: '中级',
    mlRelevant: false,
    dlRelevant: true,
    url: 'https://deepchem.io/',
    tags: ['分子', '药物发现', '图神经网络'],
    quickExample: `import deepchem as dc

# 图卷积网络预测分子毒性
tasks, datasets, transformers = dc.molnet.load_tox21()
train, valid, test = datasets

model = dc.models.GraphConvModel(n_tasks=len(tasks), mode="classification")
model.fit(train, nb_epoch=50)
scores = model.evaluate(test, [dc.metrics.roc_auc_score])`,
  },
  {
    id: 'rdkit',
    name: 'RDKit',
    description: '化学信息学领域最广泛使用的开源Python库，提供分子结构解析、SMILES转换、分子指纹生成(Morgan、MACCS)、描述符计算、子结构搜索和2D/3D分子可视化功能。几乎所有分子深度学习工具都依赖RDKit进行数据预处理。典型生物信息学用例：从ChEMBL数据库下载化合物SMILES，使用RDKit计算Morgan指纹作为分子描述符输入到机器学习模型进行活性预测。',
    category: '分子',
    installCommand: 'pip install rdkit',
    difficulty: '中级',
    mlRelevant: true,
    dlRelevant: false,
    url: 'https://www.rdkit.org/',
    tags: ['化学信息学', '分子指纹', 'SMILES'],
    quickExample: `from rdkit import Chem
from rdkit.Chem import AllChem

# 从SMILES计算Morgan分子指纹
mol = Chem.MolFromSmiles("CC(=O)OC1=CC=CC=C1C(=O)O")  # 阿司匹林
fp = AllChem.GetMorganFingerprintAsBitVect(mol, radius=2, nBits=2048)
print(f"指纹长度: {len(fp)}")  # 2048位二进制向量`,
  },
  {
    id: 'biopython',
    name: 'Biopython',
    description: '生物信息学Python工具集，提供序列文件解析(FASTA、GenBank、PDB)、序列操作、BLAST接口、NCBI数据库访问、进化树处理和蛋白质结构分析等丰富的生物计算功能。是Python生物信息学编程的基础库。典型生物信息学用例：使用Biopython解析基因组FASTA文件，提取特定区域的DNA序列并进行转录翻译，为后续的深度学习模型准备输入数据。',
    category: '数据',
    installCommand: 'pip install biopython',
    difficulty: '入门',
    mlRelevant: true,
    dlRelevant: false,
    url: 'https://biopython.org/',
    tags: ['序列', 'BLAST', '生物信息学'],
    quickExample: `from Bio import SeqIO

# 解析FASTA并翻译DNA序列
for record in SeqIO.parse("genome.fasta", "fasta"):
    print(f">{record.id} 长度:{len(record.seq)}")
    # 转录+翻译前100个碱基
    protein = record.seq[:100].translate()
    print(f"  -> 蛋白质片段: {protein[:30]}...")`,
  },
  {
    id: 'numpy',
    name: 'NumPy',
    description: 'Python科学计算的基础库，提供高效的多维数组(NdArray)对象和丰富的数学运算函数，是所有Python数据科学和机器学习库的底层基础。在生物信息学中用于基因表达矩阵存储、序列编码和数值计算。典型生物信息学用例：将DNA序列的ATCG碱基转换为One-hot编码的NumPy数组(4 x seq_length)，作为卷积神经网络的输入张量。',
    category: '数据',
    installCommand: 'pip install numpy',
    difficulty: '入门',
    mlRelevant: true,
    dlRelevant: true,
    url: 'https://numpy.org/',
    tags: ['数组', '数学', '基础'],
    quickExample: `import numpy as np

# DNA序列One-hot编码 (A,T,C,G -> 4通道)
seq = "ATCGATCGAAAA"
mapping = {"A": 0, "T": 1, "C": 2, "G": 3}
one_hot = np.zeros((4, len(seq)), dtype=np.float32)
for i, base in enumerate(seq):
    one_hot[mapping[base], i] = 1.0
print(f"Shape: {one_hot.shape}")  # (4, 12)`,
  },
  {
    id: 'pandas',
    name: 'Pandas',
    description: 'Python数据处理和分析库，提供DataFrame和Series数据结构，支持数据清洗、转换、合并、分组和统计分析。在生物信息学中广泛用于处理基因表达矩阵、变异注释表格和临床元数据。典型生物信息学用例：读取TCGA基因表达矩阵(CSV格式)，根据临床信息表进行样本筛选和分组，计算差异表达基因的统计量。',
    category: '数据',
    installCommand: 'pip install pandas',
    difficulty: '入门',
    mlRelevant: true,
    dlRelevant: false,
    url: 'https://pandas.pydata.org/',
    tags: ['数据处理', 'CSV', '分析'],
    quickExample: `import pandas as pd

# 加载TCGA基因表达矩阵并按癌症类型分组
expr = pd.read_csv("TCGA_BRCA_expr.csv", index_col=0)
clinical = pd.read_csv("TCGA_BRCA_clinical.csv")

# 筛选HER2阳性样本
her2_pos = clinical[clinical["HER2_status"] == "Positive"]["sample_id"]
her2_expr = expr[her2_pos]
print(f"HER2+样本数: {her2_expr.shape[1]}")`,
  },
  {
    id: 'google-colab',
    name: 'Google Colab',
    description: 'Google提供的免费云端Jupyter Notebook环境，配备免费的GPU(T4)和TPU资源，无需本地配置即可运行深度学习代码。预装TensorFlow、PyTorch和大多数常用的Python库。典型生物信息学用例：在Colab中运行ColabFold进行蛋白质结构预测，或使用免费GPU训练基因组序列分类的深度学习模型，无需购置昂贵的GPU硬件。',
    category: '平台',
    installCommand: '# 无需安装，访问 colab.research.google.com',
    difficulty: '入门',
    mlRelevant: true,
    dlRelevant: true,
    url: 'https://colab.research.google.com/',
    tags: ['GPU', '免费', '云端'],
    quickExample: `# Google Colab 免费GPU快速启动
# 1. 访问 colab.research.google.com
# 2. 运行时 -> 更改运行时类型 -> T4 GPU

!pip install torch transformers
import torch
print(f"GPU可用: {torch.cuda.is_available()}")
print(f"GPU型号: {torch.cuda.get_device_name(0)}")`,
  },
  {
    id: 'kaggle',
    name: 'Kaggle',
    description: '全球最大的数据科学竞赛平台，提供免费GPU环境和丰富的公开数据集，支持Notebook形式的代码分享和协作。举办过多项生物信息学相关的竞赛（如蛋白质结构预测、药物分子性质预测）。典型生物信息学用例：参加Kaggle上的药物分子活性预测竞赛，使用平台提供的免费GPU训练图神经网络模型，并与其他参赛者交流优化策略。',
    category: '平台',
    installCommand: 'pip install kaggle',
    difficulty: '入门',
    mlRelevant: true,
    dlRelevant: true,
    url: 'https://www.kaggle.com/',
    tags: ['竞赛', '数据集', 'GPU'],
    quickExample: `# Kaggle API下载数据集
pip install kaggle

# 下载蛋白质结构预测竞赛数据
kaggle competitions download -c cafa-5-protein-function-prediction

import pandas as pd
df = pd.read_csv("train_sequences.csv")
print(f"训练集蛋白质数: {len(df)}")`,
  },
  {
    id: 'optuna',
    name: 'Optuna',
    description: '基于贝叶斯优化的超参数优化框架，支持剪枝策略加速搜索和分布式优化，提供直观的可视化工具分析超参数重要性。在生物信息学中用于优化基因分类模型、蛋白质性质预测网络和单细胞分析管道的超参数。典型生物信息学用例：使用TPE算法自动搜索蛋白质二级结构预测CNN的最优学习率、卷积核大小和网络深度组合。',
    category: 'ML框架',
    installCommand: 'pip install optuna',
    difficulty: '中级',
    mlRelevant: true,
    dlRelevant: true,
    url: 'https://optuna.org/',
    tags: ['超参数优化', '贝叶斯', '自动化'],
    quickExample: `import optuna
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import cross_val_score

# 贝叶斯优化搜索蛋白质分类器的最优超参数
def objective(trial):
    n_estimators = trial.suggest_int("n_estimators", 50, 500)
    max_depth = trial.suggest_int("max_depth", 3, 20)
    model = RandomForestClassifier(n_estimators=n_estimators,
                                    max_depth=max_depth)
    return cross_val_score(model, X, y, cv=3).mean()

study = optuna.create_study(direction="maximize")
study.optimize(objective, n_trials=50)`,
  },
  {
    id: 'shap',
    name: 'SHAP',
    description: '基于博弈论Shapley值的模型可解释性库，提供特征重要性的一致性和可加性度量，支持树模型、深度学习和任何Python模型的解释。在生物信息学中用于解释突变致病性预测和基因表达分类模型的决策依据。典型生物信息学用例：对训练好的随机森林变异预测模型计算SHAP值，识别驱动致病性判断的关键突变特征和位点。',
    category: 'ML框架',
    installCommand: 'pip install shap',
    difficulty: '中级',
    mlRelevant: true,
    dlRelevant: true,
    url: 'https://shap.readthedocs.io/',
    tags: ['可解释性', '特征重要性', 'XAI'],
    quickExample: `import shap
import xgboost as xgb

# SHAP解释SNP致病性预测模型的决策依据
model = xgb.XGBClassifier().fit(X_train, y_train)
explainer = shap.TreeExplainer(model)
shap_values = explainer.shap_values(X_test)

# 瀑布图展示单个变异的特征贡献
shap.waterfall_plot(explainer.expected_value, shap_values[0],
                    feature_names=feature_names)`,
  },
  {
    id: 'pyg',
    name: 'PyTorch Geometric',
    description: '基于PyTorch的图神经网络库，提供GCN、GAT、GraphSAGE、MPNN等多种图模型的高效实现，支持批次处理和稀疏矩阵运算。在生物信息学中用于蛋白质相互作用网络分析、分子图表示学习和基因调控网络建模。典型生物信息学用例：将蛋白质复合物表示为原子图（节点为原子，边为化学键），使用MPNN预测蛋白质-配体结合亲和力。',
    category: 'DL框架',
    installCommand: 'pip install torch-geometric',
    difficulty: '高级',
    mlRelevant: false,
    dlRelevant: true,
    url: 'https://pytorch-geometric.readthedocs.io/',
    tags: ['GNN', '图神经网络', 'PyTorch'],
    quickExample: `import torch
from torch_geometric.nn import GCNConv

# 图卷积网络预测蛋白质-配体结合亲和力
class ProteinGCN(torch.nn.Module):
    def __init__(self, in_channels, hidden_channels):
        super().__init__()
        self.conv1 = GCNConv(in_channels, hidden_channels)
        self.conv2 = GCNConv(hidden_channels, hidden_channels)
        self.fc = torch.nn.Linear(hidden_channels, 1)  # 输出: 亲和力`,
  },
  {
    id: 'wandb',
    name: 'Weights & Biases',
    description: '实验跟踪和可视化平台，自动记录训练指标、超参数、模型检查点和系统资源使用情况，支持团队协作和实验对比。在生物信息学深度学习研究中帮助管理大量模型训练实验，避免结果丢失。典型生物信息学用例：在训练蛋白质序列分类模型时自动记录每轮的训练损失、验证准确率和学习率变化，方便后续实验对比和最优模型选择。',
    category: '平台',
    installCommand: 'pip install wandb',
    difficulty: '入门',
    mlRelevant: true,
    dlRelevant: true,
    url: 'https://wandb.ai/',
    tags: ['实验跟踪', '可视化', '协作'],
    quickExample: `import wandb

# 实验跟踪：记录蛋白质序列分类模型训练
wandb.init(project="protein-classification", config={
    "learning_rate": 1e-4,
    "batch_size": 32,
    "architecture": "ESM-2-finetune",
    "epochs": 10,
})

# 训练循环中记录指标
wandb.log({"loss": train_loss, "accuracy": val_acc, "epoch": epoch})`,
  },
  {
    id: 'jupyter',
    name: 'Jupyter Notebook',
    description: '交互式编程环境，允许在网页中混合编写代码、文档和可视化，支持逐步执行和即时查看结果。是生物信息学数据分析、模型探索和结果展示的标准工具，几乎所有教程都以Notebook形式分发。典型生物信息学用例：在Jupyter Notebook中逐步执行单细胞RNA测序数据分析流程，每一步都可视化中间结果（如QC指标、UMAP图和差异表达热图）。',
    category: '平台',
    installCommand: 'pip install jupyterlab',
    difficulty: '入门',
    mlRelevant: true,
    dlRelevant: true,
    url: 'https://jupyter.org/',
    tags: ['交互式', '笔记本', '探索'],
    quickExample: `# JupyterLab 交互式单细胞分析
# 安装: pip install jupyterlab
# 启动: jupyter lab

# 在Notebook中逐步分析并可视化：
import scanpy as sc
adata = sc.datasets.pbmc3k()
sc.pp.filter_cells(adata, min_genes=200)
sc.pp.normalize_total(adata)
# 每步都可即时查看结果和可视化`,
  },
];
