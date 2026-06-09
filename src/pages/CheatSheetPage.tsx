import { useState } from 'react';
import { Copy, Check, Zap, Code, Calculator, Terminal, Database } from 'lucide-react';

const sections = [
  {
    icon: Terminal,
    title: '环境一键搭建',
    color: '#1E3A5F',
    items: [
      {
        label: 'Conda 环境',
        code: `conda create -n bioml python=3.10 -y && conda activate bioml
pip install torch scikit-learn xgboost pandas numpy matplotlib
pip install transformers biopython scanpy scvi-tools
pip install deepchem rdkit jupyterlab wandb`,
      },
    ],
  },
  {
    icon: Database,
    title: '数据加载速查',
    color: '#2D5A3D',
    items: [
      {
        label: 'DNA 序列 (FASTA)',
        code: `from Bio import SeqIO
for record in SeqIO.parse("genome.fasta", "fasta"):
    print(record.id, len(record.seq))`,
      },
      {
        label: '基因表达矩阵 (CSV)',
        code: `import pandas as pd
expr = pd.read_csv("TCGA_expr.csv", index_col=0)
print(f"Genes: {expr.shape[0]}, Samples: {expr.shape[1]}")`,
      },
      {
        label: '单细胞数据 (10x h5)',
        code: `import scanpy as sc
adata = sc.read_10x_h5("pbmc3k_filtered_gene_bc_matrices.h5")
sc.pp.filter_cells(adata, min_genes=200)`,
      },
      {
        label: '蛋白质结构 (PDB)',
        code: `from Bio.PDB import PDBParser
parser = PDBParser()
structure = parser.get_structure("protein", "1abc.pdb")`,
      },
      {
        label: '分子 SMILES',
        code: `from rdkit import Chem
mol = Chem.MolFromSmiles("CC(=O)OC1=CC=CC=C1C(=O)O")
print(f"Atoms: {mol.GetNumAtoms()}")`,
      },
    ],
  },
  {
    icon: Code,
    title: 'ML 常用模式',
    color: '#1E3A5F',
    items: [
      {
        label: '训练/测试划分 + 交叉验证',
        code: `from sklearn.model_selection import train_test_split, cross_val_score
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
scores = cross_val_score(RandomForestClassifier(), X, y, cv=5)
print(f"CV Accuracy: {scores.mean():.3f} ± {scores.std():.3f}")`,
      },
      {
        label: '特征标准化 + 分类流水线',
        code: `from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
pipe = Pipeline([("scaler", StandardScaler()),
                 ("svm", SVC(kernel="rbf"))])
pipe.fit(X_train, y_train)`,
      },
      {
        label: '超参数网格搜索',
        code: `from sklearn.model_selection import GridSearchCV
params = {"n_estimators": [100, 200], "max_depth": [5, 10]}
gs = GridSearchCV(RandomForestClassifier(), params, cv=5)
gs.fit(X_train, y_train)
print(f"Best: {gs.best_params_}")`,
      },
      {
        label: 'SHAP 模型解释',
        code: `import shap
explainer = shap.TreeExplainer(model)
shap_values = explainer.shap_values(X_test)
shap.summary_plot(shap_values, X_test, feature_names=features)`,
      },
    ],
  },
  {
    icon: Zap,
    title: 'DL 常用模式',
    color: '#5B3A7B',
    items: [
      {
        label: 'PyTorch 训练循环',
        code: `import torch, torch.nn as nn
model = MyModel()
optimizer = torch.optim.Adam(model.parameters(), lr=1e-4)
loss_fn = nn.CrossEntropyLoss()

for epoch in range(epochs):
    optimizer.zero_grad()
    output = model(X_batch)
    loss = loss_fn(output, y_batch)
    loss.backward()
    optimizer.step()`,
      },
      {
        label: 'HuggingFace 加载预训练模型',
        code: `from transformers import AutoTokenizer, AutoModel
tokenizer = AutoTokenizer.from_pretrained("facebook/esm2_t33_650M_UR50D")
model = AutoModel.from_pretrained("facebook/esm2_t33_650M_UR50D")
inputs = tokenizer("MKTVRQERL", return_tensors="pt")
with torch.no_grad():
    embeddings = model(**inputs).last_hidden_state`,
      },
      {
        label: 'GPU 检查与转移',
        code: `device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = model.to(device)
X_batch, y_batch = X_batch.to(device), y_batch.to(device)
print(f"Using: {device}, GPU: {torch.cuda.get_device_name(0)}")`,
      },
      {
        label: 'scVI 单细胞批次校正',
        code: `import scvi
scvi.model.SCVI.setup_anndata(adata, batch_key="batch")
model = scvi.model.SCVI(adata, n_latent=30)
model.train()
adata.obsm["X_scVI"] = model.get_latent_representation()`,
      },
    ],
  },
  {
    icon: Calculator,
    title: '数学公式 → 代码',
    color: '#8B4513',
    items: [
      {
        label: 'One-Hot 编码 DNA 序列',
        code: `import numpy as np
seq = "ATCG"
mapping = {"A": 0, "T": 1, "C": 2, "G": 3}
one_hot = np.zeros((4, len(seq)))
for i, base in enumerate(seq):
    one_hot[mapping[base], i] = 1
# Shape: (4, 4) — 一行一个碱基类型`,
      },
      {
        label: 'Softmax 概率输出',
        code: `import numpy as np
def softmax(x):
    e_x = np.exp(x - np.max(x))
    return e_x / e_x.sum()
logits = np.array([2.0, 1.0, 0.1])
probs = softmax(logits)  # [0.66, 0.24, 0.10]`,
      },
      {
        label: '交叉熵损失',
        code: `import numpy as np
def cross_entropy(y_true, y_pred):
    return -np.sum(y_true * np.log(y_pred + 1e-15))
# y_true = [1, 0, 0], y_pred = [0.7, 0.2, 0.1]
# -> -log(0.7) = 0.357`,
      },
      {
        label: 'SGD 一步更新',
        code: `theta = theta - learning_rate * gradient
# PyTorch: optimizer.step() 自动完成
# NumPy 手动实现:
# w = w - lr * dw`,
      },
      {
        label: 'PCA via SVD',
        code: `import numpy as np
# X: (n_samples, n_features), 已中心化
U, S, Vt = np.linalg.svd(X, full_matrices=False)
X_pca = U[:, :k] * S[:k]  # 前k个主成分
explained_var = S[:k]**2 / np.sum(S**2)`,
      },
    ],
  },
  {
    icon: Zap,
    title: '生物信息学特有操作',
    color: '#4A6741',
    items: [
      {
        label: 'DNA k-mer 特征提取',
        code: `from sklearn.feature_extraction.text import CountVectorizer
vec = CountVectorizer(analyzer="char", ngram_range=(3, 3))
X = vec.fit_transform(["ATCGGGCTA", "GCTTAACCG"])
# X: (2, n_unique_kmers) 稀疏矩阵`,
      },
      {
        label: '蛋白质序列 → ESM 嵌入',
        code: `from transformers import AutoTokenizer, AutoModel
model = AutoModel.from_pretrained("facebook/esm2_t33_650M_UR50D")
tokenizer = AutoTokenizer.from_pretrained("facebook/esm2_t33_650M_UR50D")
inputs = tokenizer(["MKTVRQER", "MKTVRQPR"], return_tensors="pt", padding=True)
emb = model(**inputs).last_hidden_state.mean(dim=1)  # (2, 1280)`,
      },
      {
        label: '差异基因表达 (PyDESeq2)',
        code: `from pydeseq2.dds import DeseqDataSet
from pydeseq2.ds import DeseqStats
dds = DeseqDataSet(counts=count_df, metadata=meta_df, design="~condition")
dds.deseq2()
stat = DeseqStats(dds, contrast=["condition", "treated", "control"])
stat.summary()  # log2FC, pvalue, padj`,
      },
      {
        label: 'GSEA 通路富集',
        code: `import gseapy as gp
genes = ["TP53", "BRCA1", "EGFR", "MYC", "PTEN"]
enr = gp.enrichr(gene_list=genes,
                 gene_sets="KEGG_2021_Human",
                 organism="human")
enr.results[["Term", "Adjusted P-value"]].head(10)`,
      },
    ],
  },
];

export default function CheatSheetPage() {
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);

  const copyCode = (label: string, code: string) => {
    try {
      navigator.clipboard.writeText(code).then(() => {
        setCopiedLabel(label);
        setTimeout(() => setCopiedLabel(null), 2000);
      });
    } catch {
      setCopiedLabel(label);
      setTimeout(() => setCopiedLabel(null), 2000);
    }
  };

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-bold mb-3" style={{ color: '#1A1A1A' }}>速查表</h1>
        <p className="text-base" style={{ color: '#8A8A8A', maxWidth: 600 }}>
          生物信息学 ML/DL 常用命令、代码模式和公式的快速参考
        </p>
      </div>

      <div className="space-y-10">
        {sections.map((section) => (
          <section key={section.title}>
            <div className="flex items-center gap-2.5 mb-4">
              <section.icon size={18} style={{ color: section.color }} />
              <h2 className="text-lg font-bold" style={{ color: '#1A1A1A' }}>{section.title}</h2>
            </div>
            <div className="space-y-3">
              {section.items.map((item) => (
                <div key={item.label} className="border rounded-lg overflow-hidden" style={{ borderColor: '#E5E5E5' }}>
                  <div
                    className="flex items-center justify-between px-3 py-1.5"
                    style={{ backgroundColor: '#FAFAFA', borderBottom: '1px solid #EEEEEE' }}
                  >
                    <span className="text-xs font-medium" style={{ color: '#4A4A4A' }}>{item.label}</span>
                    <button
                      onClick={() => copyCode(item.label, item.code)}
                      className="p-1 rounded hover:bg-gray-100 transition-colors"
                      title="Copy"
                    >
                      {copiedLabel === item.label ? (
                        <Check size={13} style={{ color: '#2D5A3D' }} />
                      ) : (
                        <Copy size={13} style={{ color: '#8A8A8A' }} />
                      )}
                    </button>
                  </div>
                  <pre
                    className="m-0 px-3 py-2 font-mono text-xs overflow-x-auto"
                    style={{ backgroundColor: '#FCFCFC', color: '#4A4A4A', whiteSpace: 'pre', maxHeight: 200 }}
                  >
                    {item.code}
                  </pre>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Quick reference footer */}
      <section className="border rounded-lg p-6" style={{ borderColor: '#E5E5E5', backgroundColor: '#FAFAFA' }}>
        <h2 className="text-sm font-semibold mb-3" style={{ color: '#1A1A1A' }}>常用命令速记</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono" style={{ color: '#4A4A4A' }}>
          {[
            { cmd: 'pip list | grep torch', desc: '检查 PyTorch 版本' },
            { cmd: 'nvidia-smi', desc: '查看 GPU 状态' },
            { cmd: 'conda env list', desc: '列出所有 conda 环境' },
            { cmd: 'jupyter lab --port=8888', desc: '启动 JupyterLab' },
            { cmd: 'python -c "import torch; print(torch.cuda.is_available())"', desc: '检查 CUDA 可用性' },
            { cmd: 'tensorboard --logdir=runs', desc: '启动 TensorBoard' },
            { cmd: 'wandb login', desc: '登录 Weights & Biases' },
            { cmd: 'du -sh data/', desc: '查看数据目录大小' },
          ].map((item) => (
            <div key={item.cmd} className="flex items-start gap-2">
              <code className="shrink-0 px-1.5 py-0.5 rounded" style={{ backgroundColor: '#EEEEEE' }}>{item.cmd}</code>
              <span className="text-xs" style={{ color: '#8A8A8A' }}>{item.desc}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
