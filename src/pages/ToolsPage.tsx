import { useState } from 'react';
import { useData } from '../hooks/useData';
import { Copy, Check, FlaskConical, BookOpen, Terminal } from 'lucide-react';
import CodeBlock from '../components/CodeBlock';

interface Tool {
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

interface ToolsData {
  toolCategories: string[];
  tools: Tool[];
}

export default function ToolsPage() {
  const { data, loading, error } = useData<ToolsData>('tools');
  const [activeCat, setActiveCat] = useState('全部');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (loading) return <div className="p-8 text-sm text-brand-ink-muted">Loading...</div>;
  if (error || !data) return <div className="p-8 text-sm text-brand-error">{error || '加载数据失败'}</div>;

  const { toolCategories, tools } = data;

  const filtered = activeCat === '全部'
    ? tools
    : tools.filter((t) => t.category === activeCat);

  const handleCopy = (id: string, text: string) => {
    try {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
      });
    } catch {
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="space-y-14">
      <div>
        <h1 className="text-3xl font-bold mb-3 text-brand-ink">工具</h1>
        <p className="text-base text-brand-ink-muted max-w-[600px]">
          生物信息学ML/DL工作流中常用的框架、库和平台
        </p>
      </div>

      <section>
        <h2 className="text-lg font-bold mb-5 text-brand-ink">ML 与 DL 框架对比</h2>
        <div className="border rounded-lg overflow-hidden border-brand-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-brand-off-white">
                <th className="text-left px-4 py-3 font-semibold text-brand-ink">维度</th>
                <th className="text-left px-4 py-3 font-semibold text-brand-accent">ML框架</th>
                <th className="text-left px-4 py-3 font-semibold text-brand-dl">DL框架</th>
              </tr>
            </thead>
            <tbody>
              {[
                { dim: '核心库', ml: 'scikit-learn, XGBoost, LightGBM, SHAP', dl: 'PyTorch, TensorFlow, JAX' },
                { dim: '数据规模', ml: '中小规模 (GB级)', dl: '大规模 (TB级)' },
                { dim: '硬件需求', ml: 'CPU即可', dl: 'GPU推荐 (CUDA)' },
                { dim: '特征处理', ml: '手工特征工程', dl: '自动特征学习' },
                { dim: '训练时间', ml: '分钟到小时', dl: '小时到天' },
                { dim: '调试难度', ml: '较低', dl: '较高 (需监控训练过程)' },
              ].map((row) => (
                <tr key={row.dim} className="border-t border-brand-border-light">
                  <td className="px-4 py-3 font-medium text-brand-ink-light">{row.dim}</td>
                  <td className="px-4 py-3 text-brand-ink-light">{row.ml}</td>
                  <td className="px-4 py-3 text-brand-ink-light">{row.dl}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <div className="flex flex-wrap gap-2 mb-6">
          {toolCategories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCat(c)}
              className="px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors border"
              style={{
                backgroundColor: activeCat === c ? '#1E3A5F' : '#FFFFFF',
                color: activeCat === c ? 'white' : '#4A4A4A',
                borderColor: activeCat === c ? '#1E3A5F' : '#E5E5E5',
              }}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((tool) => (
            <div
              key={tool.id}
              className="border rounded-lg p-5 hover:shadow-sm transition-shadow border-brand-border"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-sm font-semibold font-mono text-brand-ink">
                    <a href={tool.url} target="_blank" rel="noopener noreferrer" className="no-underline hover:underline text-brand-accent">
                      {tool.name}
                    </a>
                  </h3>
                  <p className="text-xs mt-0.5 text-brand-ink-muted">{tool.category}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  {tool.mlRelevant && (
                    <span className="text-xs px-2 py-0.5 rounded bg-brand-accent-light text-brand-accent">ML</span>
                  )}
                  {tool.dlRelevant && (
                    <span className="text-xs px-2 py-0.5 rounded bg-brand-dl-light text-brand-dl">DL</span>
                  )}
                </div>
              </div>
              <p className="text-sm mb-3 text-brand-ink-light" style={{ lineHeight: 1.7 }}>
                {tool.description}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-3">
                {tool.tags.map((tag) => (
                  <span key={tag} className="text-xs px-2 py-0.5 rounded border border-brand-border-light text-brand-ink-muted">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1 font-mono text-xs px-3 py-2 rounded border overflow-x-auto bg-brand-off-white border-brand-border-light text-brand-ink-light">
                  {tool.installCommand}
                </div>
                <button
                  onClick={() => handleCopy(tool.id, tool.installCommand)}
                  className="p-1.5 rounded border hover:bg-gray-50 transition-colors shrink-0 border-brand-border-light"
                  title="复制安装命令"
                >
                  {copiedId === tool.id ? (
                    <Check size={14} className="text-brand-dl" />
                  ) : (
                    <Copy size={14} className="text-brand-ink-muted" />
                  )}
                </button>
              </div>

              {tool.quickExample && (
                <div className="mt-3">
                  <CodeBlock code={tool.quickExample} label="Quick Example" collapsible />
                </div>
              )}

              <div className="mt-2.5 flex items-center gap-1.5">
                <span className="text-xs text-brand-ink-muted">难度:</span>
                <span
                  className="text-xs px-2 py-0.5 rounded font-medium"
                  style={{
                    backgroundColor:
                      tool.difficulty === '入门' ? '#E8F0E9' :
                      tool.difficulty === '中级' ? '#E8EDF2' : '#F5F5F0',
                    color:
                      tool.difficulty === '入门' ? '#2D5A3D' :
                      tool.difficulty === '中级' ? '#1E3A5F' : '#4A4A4A',
                  }}
                >
                  {tool.difficulty}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold mb-5 text-brand-ink">快速入门</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="border rounded-lg p-5 border-brand-border">
            <FlaskConical size={16} className="mb-2 text-brand-accent" />
            <h3 className="text-sm font-semibold mb-2 text-brand-ink">ML 快速启动</h3>
            <div className="font-mono text-xs space-y-1.5 text-brand-ink-light">
              <p>pip install scikit-learn xgboost</p>
              <p>pip install pandas numpy matplotlib</p>
              <p>pip install shap optuna</p>
            </div>
          </div>
          <div className="border rounded-lg p-5 border-brand-border">
            <BookOpen size={16} className="mb-2 text-brand-dl" />
            <h3 className="text-sm font-semibold mb-2 text-brand-ink">DL 快速启动</h3>
            <div className="font-mono text-xs space-y-1.5 text-brand-ink-light">
              <p>pip install torch torchvision</p>
              <p>pip install transformers</p>
              <p>pip install wandb</p>
            </div>
          </div>
          <div className="border rounded-lg p-5 border-brand-border">
            <Terminal size={16} className="mb-2 text-brand-ink-muted" />
            <h3 className="text-sm font-semibold mb-2 text-brand-ink">生信专用</h3>
            <div className="font-mono text-xs space-y-1.5 text-brand-ink-light">
              <p>pip install biopython scanpy</p>
              <p>pip install scvi-tools</p>
              <p>pip install deepchem rdkit</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-14">
        <h2 className="text-xl font-bold mb-5 text-brand-ink">工具选型指南</h2>

        <div className="space-y-5">
          {/* ML Framework selection */}
          <div className="border rounded-lg p-5 border-brand-border">
            <h3 className="text-sm font-semibold mb-3 text-brand-accent">ML框架怎么选？</h3>
            <div className="border rounded-lg overflow-hidden border-brand-border-light">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-brand-off-white">
                    <th className="text-left px-4 py-2.5 font-semibold text-xs text-brand-ink">场景</th>
                    <th className="text-left px-4 py-2.5 font-semibold text-xs text-brand-accent">推荐工具</th>
                    <th className="text-left px-4 py-2.5 font-semibold text-xs text-brand-ink-light">理由</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { scene: '快速搭建基线模型', tool: 'scikit-learn', reason: 'API简洁统一，文档最完善，适合入门和快速迭代' },
                    { scene: '表格数据最佳性能', tool: 'XGBoost / LightGBM', reason: '梯度提升在结构化特征上通常优于其他算法' },
                    { scene: '高维基因数据特征选择', tool: 'scikit-learn (LASSO)', reason: 'L1正则化自动筛选少量关键基因标志物' },
                    { scene: '模型可解释性要求高', tool: 'scikit-learn + SHAP', reason: '线性模型和树模型天然可解释，SHAP提供一致性归因' },
                    { scene: '数据量极大（百万+样本）', tool: 'LightGBM', reason: '基于直方图的算法，训练速度比XGBoost快数倍' },
                    { scene: '需要概率校准输出', tool: 'scikit-learn (Logistic)', reason: '逻辑回归天然输出校准概率，适合临床决策' },
                  ].map((row) => (
                    <tr key={row.scene} className="border-t border-brand-border-light">
                      <td className="px-4 py-2.5 text-xs text-brand-ink-light">{row.scene}</td>
                      <td className="px-4 py-2.5 text-xs font-mono font-medium text-brand-accent">{row.tool}</td>
                      <td className="px-4 py-2.5 text-xs text-brand-ink-muted">{row.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Protein structure tool comparison */}
          <div className="border rounded-lg p-5 border-brand-border">
            <h3 className="text-sm font-semibold mb-3 text-brand-dl">蛋白质结构预测工具怎么选？</h3>
            <div className="border rounded-lg overflow-hidden border-brand-border-light">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-brand-off-white">
                    <th className="text-left px-4 py-2.5 font-semibold text-xs text-brand-ink">工具</th>
                    <th className="text-left px-4 py-2.5 font-semibold text-xs text-brand-ink">精度</th>
                    <th className="text-left px-4 py-2.5 font-semibold text-xs text-brand-ink">速度</th>
                    <th className="text-left px-4 py-2.5 font-semibold text-xs text-brand-ink">适用场景</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { tool: 'AlphaFold2', accuracy: '⭐⭐⭐⭐⭐', speed: '慢（小时）', use: '少量蛋白质最高精度结构预测，需GPU+大内存' },
                    { tool: 'ColabFold', accuracy: '⭐⭐⭐⭐', speed: '中（分钟）', use: '日常蛋白质结构预测首选，Colab免费GPU可运行' },
                    { tool: 'ESMFold', accuracy: '⭐⭐⭐', speed: '快（秒级）', use: '大规模扫描（数千蛋白质），不需MSA，速度远超AlphaFold' },
                    { tool: 'RosettaFold', accuracy: '⭐⭐⭐⭐', speed: '慢（小时）', use: '与AlphaFold互补，某些靶标表现更好，支持蛋白质设计' },
                  ].map((row) => (
                    <tr key={row.tool} className="border-t border-brand-border-light">
                      <td className="px-4 py-2.5 text-xs font-mono font-medium text-brand-ink">{row.tool}</td>
                      <td className="px-4 py-2.5 text-xs text-brand-ink-light">{row.accuracy}</td>
                      <td className="px-4 py-2.5 text-xs text-brand-ink-light">{row.speed}</td>
                      <td className="px-4 py-2.5 text-xs text-brand-ink-muted">{row.use}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* DL Framework selection */}
          <div className="border rounded-lg p-5 border-brand-border">
            <h3 className="text-sm font-semibold mb-3 text-brand-purple">DL框架怎么选？</h3>
            <div className="border rounded-lg overflow-hidden border-brand-border-light">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-brand-off-white">
                    <th className="text-left px-4 py-2.5 font-semibold text-xs text-brand-ink">场景</th>
                    <th className="text-left px-4 py-2.5 font-semibold text-xs text-brand-dl">推荐</th>
                    <th className="text-left px-4 py-2.5 font-semibold text-xs text-brand-ink-light">为什么</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { scene: '学术研究 / 新模型开发', tool: 'PyTorch', why: '动态计算图，调试友好；几乎所有生物模型（ESM、AlphaFold、scVI）都用它' },
                    { scene: '生产部署 / 工业应用', tool: 'TensorFlow/Keras', why: 'SavedModel格式成熟，TensorFlow Serving方便部署' },
                    { scene: '使用预训练生物大模型', tool: 'PyTorch + HuggingFace', why: 'HuggingFace生态以PyTorch为主，ESM、NT等模型开箱即用' },
                    { scene: '图神经网络（分子/蛋白）', tool: 'PyTorch Geometric', why: '最活跃的GNN生态，已实现GCN/GAT/MPNN等主流架构' },
                    { scene: 'TPU训练 / Google Cloud', tool: 'TensorFlow/JAX', why: 'TPU对TensorFlow/JAX优化最好' },
                  ].map((row) => (
                    <tr key={row.scene} className="border-t border-brand-border-light">
                      <td className="px-4 py-2.5 text-xs text-brand-ink-light">{row.scene}</td>
                      <td className="px-4 py-2.5 text-xs font-mono font-medium text-brand-dl">{row.tool}</td>
                      <td className="px-4 py-2.5 text-xs text-brand-ink-muted">{row.why}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="border rounded-lg p-6 border-brand-border">
        <h2 className="text-lg font-bold mb-4 text-brand-ink">环境配置建议</h2>
        <div className="space-y-4 text-sm text-brand-ink-light">
          <div>
            <h3 className="font-medium mb-1 text-brand-ink">Python版本</h3>
            <p>推荐使用 Python 3.9-3.11，通过 conda 或 pyenv 管理虚拟环境</p>
          </div>
          <div>
            <h3 className="font-medium mb-1 text-brand-ink">GPU环境</h3>
            <p>NVIDIA GPU需安装CUDA Toolkit + cuDNN。或使用Google Colab的免费T4 GPU</p>
          </div>
          <div>
            <h3 className="font-medium mb-1 text-brand-ink">推荐IDE</h3>
            <p>VS Code + Python扩展 + Jupyter插件，或 PyCharm Professional</p>
          </div>
          <div>
            <h3 className="font-medium mb-1 text-brand-ink">Conda环境模板</h3>
            <pre className="mt-2 p-3 rounded-lg border font-mono text-xs overflow-x-auto bg-brand-off-white border-brand-border-light">
{`conda create -n bioml python=3.10
conda activate bioml
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu118
pip install scikit-learn xgboost pandas numpy matplotlib
pip install transformers biopython scanpy`}
            </pre>
          </div>
        </div>
      </section>
    </div>
  );
}
