import { useState } from 'react';
import { Link } from 'react-router-dom';
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

      {/* Python + R 编程语言入口 */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/python"
            className="border rounded-xl p-5 no-underline hover:shadow-md transition-all border-brand-border bg-white group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-[#3776AB] text-white font-bold text-sm">Py</div>
              <div>
                <h2 className="text-base font-bold text-brand-ink">Python 编程</h2>
                <p className="text-xs text-brand-ink-muted">基于《Python编程：从入门到实践》</p>
              </div>
            </div>
            <p className="text-xs text-brand-ink-light mb-3" style={{ lineHeight: 1.6 }}>
              基础语法 → 进阶编程 → 数据可视化。每章配有生信场景代码示例，学完即可处理基因表达矩阵、FASTA解析、火山图绘制。
            </p>
            <div className="flex flex-wrap gap-1.5">
              {['14章', '入门→中级', 'Matplotlib/Plotly'].map(t => (
                <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-brand-off-white border border-brand-border-light text-brand-ink-muted">{t}</span>
              ))}
            </div>
          </Link>

          <div className="border rounded-xl p-5 border-brand-border bg-white">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-[#276DC3] text-white font-bold text-sm">R</div>
              <div>
                <h2 className="text-base font-bold text-brand-ink">R 语言</h2>
                <p className="text-xs text-brand-ink-muted">生信分析的标准语言</p>
              </div>
            </div>
            <p className="text-xs text-brand-ink-light mb-3" style={{ lineHeight: 1.6 }}>
              DESeq2差异分析、Seurat单细胞、WGCNA共表达网络、ggplot2出版级绘图——R是生物信息学的母语，尤其在统计分析和可视化领域无可替代。
            </p>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {['Bioconductor', 'tidyverse', 'Seurat', 'DESeq2', 'ggplot2'].map(t => (
                <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-brand-off-white border border-brand-border-light text-brand-ink-muted">{t}</span>
              ))}
            </div>
            <div className="space-y-1.5">
              {[
                { label: 'R 官方文档', url: 'https://cran.r-project.org/manuals.html' },
                { label: 'Bioconductor', url: 'https://www.bioconductor.org/' },
                { label: 'R for Data Science (免费书)', url: 'https://r4ds.hadley.nz/' },
              ].map(link => (
                <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer"
                  className="block text-[11px] text-brand-accent hover:underline no-underline">
                  {link.label} →
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

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
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors border ${activeCat === c ? 'bg-brand-accent text-white border-brand-accent' : 'bg-white text-brand-ink-light border-brand-border'}`}
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
                  className={`text-xs px-2 py-0.5 rounded font-medium ${
                    tool.difficulty === '入门' ? 'bg-brand-dl-light text-brand-dl' :
                    tool.difficulty === '中级' ? 'bg-brand-accent-light text-brand-accent' :
                    'bg-brand-warm text-brand-ink-light'
                  }`}
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

      {/* Pixi Environment Management */}
      <section>
        <h2 className="text-xl font-bold mb-2 text-brand-ink">pixi — 现代生信环境管理</h2>
        <p className="text-sm text-brand-ink-muted mb-6" style={{ lineHeight: 1.7 }}>
          pixi 是基于 conda 生态的跨平台包管理器（Rust编写，mamba团队开发）。核心创新：<strong>自动生成锁文件(pixi.lock)</strong>，精确记录每个包的版本和校验和——确保环境在任何机器、任何时间都能完美复现。
        </p>

        {/* pixi vs conda */}
        <div className="border rounded-lg overflow-hidden mb-6 border-brand-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-brand-off-white">
                <th className="text-left px-4 py-2.5 font-semibold text-brand-ink">维度</th>
                <th className="text-left px-4 py-2.5 font-semibold text-brand-accent">conda / mamba</th>
                <th className="text-left px-4 py-2.5 font-semibold text-brand-dl">pixi</th>
              </tr>
            </thead>
            <tbody>
              {[
                { dim: '锁文件', conda: '需手动导出 (conda env export)', pixi: '自动生成 pixi.lock，含校验和' },
                { dim: '解决速度', conda: 'libsolv (conda) / libmamba', pixi: 'resolvo + uv 集成，显著更快' },
                { dim: '项目隔离', conda: '需手动 activate/deactivate', pixi: 'pixi run 自动使用项目环境' },
                { dim: 'Python+R混装', conda: 'conda install r-base r-xxx', pixi: 'pixi add r-base r-tidyverse，同等工作流' },
                { dim: '跨平台', conda: 'environment.yml 不含平台锁', pixi: 'platforms 字段声明，lockfile 跨OS一致' },
                { dim: '环境复用', conda: 'conda-pack / 手动拷贝', pixi: 'pixi-pack 自解压包 / pixi-docker / pixi build' },
                { dim: '配置文件', conda: 'environment.yml (YAML)', pixi: 'pixi.toml + pixi.lock (TOML)' },
              ].map(row => (
                <tr key={row.dim} className="border-t border-brand-border-light">
                  <td className="px-4 py-2.5 font-medium text-brand-ink-light text-xs">{row.dim}</td>
                  <td className="px-4 py-2.5 text-xs text-brand-ink-muted">{row.conda}</td>
                  <td className="px-4 py-2.5 text-xs text-brand-dl">{row.pixi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Installation */}
        <div className="border rounded-lg p-5 mb-6 border-brand-border bg-brand-off-white">
          <h3 className="text-sm font-semibold mb-3 text-brand-ink">安装</h3>
          <pre className="p-3 rounded-lg border font-mono text-xs overflow-x-auto bg-white border-brand-border-light">
{`# Linux / macOS
curl -fsSL https://pixi.sh/install.sh | bash

# 或通过 conda-forge
conda install pixi -c conda-forge

# 验证
pixi --version`}
          </pre>
        </div>

        {/* 工作流1: 初始化生信项目 */}
        <div className="border rounded-lg p-5 mb-4 border-brand-border">
          <h3 className="text-sm font-semibold mb-2 text-brand-ink">工作流一：初始化生信项目 (Python + R)</h3>
          <p className="text-xs text-brand-ink-muted mb-3">创建包含 Python 和 R 依赖的生信分析项目，自动生成锁文件</p>
          <pre className="p-3 rounded-lg border font-mono text-xs overflow-x-auto bg-brand-off-white border-brand-border-light mb-2">
{`# 1. 创建项目
pixi init scrna-analysis
cd scrna-analysis

# 2. 声明目标平台（跨OS复现的关键！）
# 编辑 pixi.toml，确保 platforms 包含所需平台：
# platforms = ["linux-64", "osx-arm64", "osx-64"]

# 3. 添加 Python 数据科学栈
pixi add python=3.10 scanpy scvi-tools numpy pandas matplotlib
pixi add pytorch pytorch-cuda=11.8 -c pytorch

# 4. 添加 R 生物信息学栈
pixi add r-base r-essentials r-tidyverse r-deseq2
pixi add r-seurat r-harmony r-scran

# 5. 添加命令行生信工具
pixi add samtools bwa fastqc multiqc bowtie2 bedtools

# 6. 添加开发工具
pixi add jupyterlab ipykernel
pixi add pytest black ruff`}
          </pre>
          <p className="text-xs text-brand-ink-muted">
            执行完成后，pixi.toml 记录所有依赖，pixi.lock 锁定精确版本 —— 分享项目只需这两个文件
          </p>
        </div>

        {/* 工作流2: 日常使用 */}
        <div className="border rounded-lg p-5 mb-4 border-brand-border">
          <h3 className="text-sm font-semibold mb-2 text-brand-ink">工作流二：日常开发与运行</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-brand-ink-light mb-2">运行命令</p>
              <pre className="p-2 rounded-lg border font-mono text-[11px] bg-brand-off-white border-brand-border-light">
{`# 在项目环境中执行任意命令
pixi run python analysis.py
pixi run Rscript deseq2_analysis.R
pixi run jupyter lab

# 进入交互式 shell
pixi shell

# 在 shell 中直接使用 Python / R
python -c "import scanpy; print(scanpy.__version__)"
Rscript -e "library(Seurat); sessionInfo()"`}
              </pre>
            </div>
            <div>
              <p className="text-xs font-medium text-brand-ink-light mb-2">定义快捷任务 (pixi.toml)</p>
              <pre className="p-2 rounded-lg border font-mono text-[11px] bg-brand-off-white border-brand-border-light">
{`[tasks]
# 一键运行完整分析管线
qc = "python scripts/qc.py"
cluster = "python scripts/cluster.py"
annotation = "python scripts/annotation.py"
all = { cmd = "pixi run qc && pixi run cluster && pixi run annotation", depends_on = ["qc", "cluster", "annotation"] }

# R 任务
deseq2 = "Rscript scripts/deseq2_analysis.R"

# 启动 notebook
lab = "jupyter lab --port=8888"`}
              </pre>
            </div>
          </div>
        </div>

        {/* 工作流3: 环境转移复用 */}
        <div className="border rounded-lg p-5 mb-4 border-brand-border">
          <h3 className="text-sm font-semibold mb-2 text-brand-ink">工作流三：环境转移与复用（三种方式）</h3>
          <p className="text-xs text-brand-ink-muted mb-3">
            生信分析最常见的场景：在服务器上配置好环境，需要搬到另一台机器或分享给合作者
          </p>
          <div className="space-y-3">
            {[
              { title: '方式A：Git 共享（推荐——最简单）', code: '# 开发者：提交配置文件\ngit add pixi.toml pixi.lock\ngit commit -m "更新生信环境配置"\ngit push\n\n# 合作者：克隆后一键安装\npixi install  # 读取 pixi.lock，精确复现所有包版本', desc: 'pixi.lock 记录了每个包的 URL + SHA256 校验和。只要锁文件在，环境就能100%复现。' },
              { title: '方式B：pixi-pack — 自解压离线包（适合服务器无网环境）', code: '# 源机器：打包环境\npixi pack   # 生成 .tar.gz 自解压包\n\n# 目标机器：解压即用\ntar xzf project.tar.gz\n./pixi-pack unpack', desc: '将完整环境（含解释器和所有依赖）打包为单个文件。无需目标机器安装任何包管理器。适合HPC集群离线节点。' },
              { title: '方式C：pixi build + 私有频道（适合团队级复用）', code: '# 构建 conda 包\npixi build  # 生成 .conda 二进制包\n\n# 发布到私有频道\npixi upload my-channel project-0.1.0.conda\n\n# 团队成员安装\npixi add project -c my-channel', desc: '将分析环境封装为可分发的 conda 包。适合有统一分析管线的实验室——所有成员用同一版本。' },
            ].map((item, i) => (
              <div key={i} className="border rounded-lg p-4 border-brand-border-light bg-brand-off-white">
                <h4 className="text-xs font-semibold mb-2 text-brand-accent">{item.title}</h4>
                <pre className="p-2 rounded border font-mono text-[11px] overflow-x-auto bg-white border-brand-border-light mb-2">
                  {item.code}
                </pre>
                <p className="text-[11px] text-brand-ink-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 工作流4: Docker 部署 */}
        <div className="border rounded-lg p-5 mb-4 border-brand-border">
          <h3 className="text-sm font-semibold mb-2 text-brand-ink">工作流四：Docker / CI 集成</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-brand-ink-light mb-2">生成 Docker 镜像</p>
              <pre className="p-2 rounded-lg border font-mono text-[11px] bg-brand-off-white border-brand-border-light">
{`# 从 pixi 项目生成 Dockerfile
pixi docker init

# 构建镜像
docker build -t scrna-pipeline .

# 运行
docker run -v $(pwd)/data:/data scrna-pipeline \\
  pixi run all`}
              </pre>
            </div>
            <div>
              <p className="text-xs font-medium text-brand-ink-light mb-2">GitHub Actions CI</p>
              <pre className="p-2 rounded-lg border font-mono text-[11px] bg-brand-off-white border-brand-border-light">
{`# .github/workflows/test.yml
- uses: prefix-dev/setup-pixi@v0.8.0
  with:
    pixi-version: "latest"
    cache: true
- run: pixi run test
- run: pixi run lint`}
              </pre>
            </div>
          </div>
        </div>

        {/* 生信环境模板集 */}
        <div className="border rounded-lg p-5 mb-4 border-brand-border">
          <h3 className="text-sm font-semibold mb-3 text-brand-ink">生信环境模板集</h3>
          <p className="text-xs text-brand-ink-muted mb-3">
            以下是常见生信分析场景的 pixi.toml 配置，可直接复制使用
          </p>
          <div className="space-y-3">
            {[
              { name: '单细胞分析 (Python)', deps: 'python=3.10\nscanpy\nscvi-tools\nscikit-learn\nnumpy\npandas\nmatplotlib\njupyterlab\npytest', desc: '标准 scRNA-seq 分析环境' },
              { name: 'Bulk RNA-seq (R)', deps: 'r-base\nr-deseq2\nr-edger\nr-limma\nr-pheatmap\nr-ggplot2\nr-tidyverse\nbioconductor-org.hs.eg.db', desc: '差异表达 + 通路富集' },
              { name: '深度学习蛋白分析', deps: 'python=3.10\npytorch\npytorch-cuda=11.8\nbiopython\nhuggingface-hub\ntransformers\njupyterlab\nwandb', desc: 'PyTorch + HuggingFace 蛋白模型' },
              { name: '空间转录组', deps: 'python=3.10\nscanpy\nsquidpy\nspatialdata\nnapari\njupyterlab\nnumpy\npandas\nmatplotlib', desc: 'squidpy + napari 可视化' },
              { name: '全栈生信 (Python+R+CLI)', deps: 'python=3.10\nscanpy\nr-base\nr-seurat\nr-deseq2\nsamtools\nbowtie2\nfastqc\nbedtools\njupyterlab', desc: '一个环境搞定 Python/R/CLI 工具' },
            ].map((tpl, i) => (
              <div key={i} className="border rounded-lg p-3 border-brand-border-light bg-brand-off-white">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-brand-ink">{tpl.name}</span>
                  <span className="text-[10px] text-brand-ink-muted">{tpl.desc}</span>
                </div>
                <pre className="p-2 rounded border font-mono text-[10px] bg-white border-brand-border-light">
{`pixi init ${tpl.name.toLowerCase().replace(/[() ]/g, '-')}
pixi add ${tpl.deps.replace(/\n/g, ' ')}`}
                </pre>
              </div>
            ))}
          </div>
        </div>

        {/* 最佳实践 */}
        <div className="border rounded-lg p-5 border-brand-border bg-brand-accent-light">
          <h3 className="text-sm font-semibold mb-3 text-brand-accent">生信环境管理最佳实践</h3>
          <div className="space-y-2 text-xs text-brand-ink-light">
            {[
              '<strong>永远提交 pixi.lock：</strong>这是环境可复现的唯一保证。.gitignore 中保留 pixi.lock，忽略 .pixi/ 目录。',
              '<strong>为每个项目独立建环境：</strong>不要在全局装包。scRNA分析和Bulk RNA分析用不同的 pixi 项目。',
              '<strong>声明 platforms：</strong>在 pixi.toml 中明确列出目标平台，避免跨OS依赖解析失败。',
              '<strong>PyPI 包用 uv 集成：</strong>conda-forge 没有的 Python 包，用 <code>pixi add --pypi package</code>，pixi 会用 uv 解析并锁定。',
              '<strong>R 包优先 conda-forge：</strong>conda-forge 的 R 包生态已非常完善（Bioconductor 全覆盖），优先用 <code>pixi add r-xxx</code> 而非 R 内部的 install.packages()。',
              '<strong>任务脚本化：</strong>把所有分析步骤写成 pixi.toml 中的 tasks，新成员 <code>pixi run all</code> 一键复现全部分析。',
              '<strong>环境迁移用 pixi-pack：</strong>计算集群节点通常无外网，用 pixi-pack 打包后在节点上解压即可使用。',
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-brand-accent font-bold shrink-0 mt-0.5">{i+1}.</span>
                <span dangerouslySetInnerHTML={{ __html: tip }} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
