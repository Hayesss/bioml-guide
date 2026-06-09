import { useState } from 'react';
import { useData } from '../hooks/useData';
import { Copy, Check, FlaskConical, BookOpen, Terminal } from 'lucide-react';

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
}

interface ToolsData {
  toolCategories: string[];
  tools: Tool[];
}

export default function ToolsPage() {
  const data = useData<ToolsData>('tools');
  const [activeCat, setActiveCat] = useState('全部');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!data) return <div className="p-8 text-sm" style={{ color: '#8A8A8A' }}>Loading...</div>;

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
        <h1 className="text-3xl font-bold mb-3" style={{ color: '#1A1A1A' }}>工具</h1>
        <p className="text-base" style={{ color: '#8A8A8A', maxWidth: 600 }}>
          生物信息学ML/DL工作流中常用的框架、库和平台
        </p>
      </div>

      <section>
        <h2 className="text-lg font-bold mb-5" style={{ color: '#1A1A1A' }}>ML 与 DL 框架对比</h2>
        <div className="border rounded-lg overflow-hidden" style={{ borderColor: '#E5E5E5' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: '#FAFAFA' }}>
                <th className="text-left px-4 py-3 font-semibold" style={{ color: '#1A1A1A' }}>维度</th>
                <th className="text-left px-4 py-3 font-semibold" style={{ color: '#1E3A5F' }}>ML框架</th>
                <th className="text-left px-4 py-3 font-semibold" style={{ color: '#2D5A3D' }}>DL框架</th>
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
                <tr key={row.dim} className="border-t" style={{ borderColor: '#EEEEEE' }}>
                  <td className="px-4 py-3 font-medium" style={{ color: '#4A4A4A' }}>{row.dim}</td>
                  <td className="px-4 py-3" style={{ color: '#4A4A4A' }}>{row.ml}</td>
                  <td className="px-4 py-3" style={{ color: '#4A4A4A' }}>{row.dl}</td>
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
              className="border rounded-lg p-5 hover:shadow-sm transition-shadow"
              style={{ borderColor: '#E5E5E5' }}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-sm font-semibold font-mono" style={{ color: '#1A1A1A' }}>
                    <a href={tool.url} target="_blank" rel="noopener noreferrer" className="no-underline hover:underline" style={{ color: '#1E3A5F' }}>
                      {tool.name}
                    </a>
                  </h3>
                  <p className="text-xs mt-0.5" style={{ color: '#8A8A8A' }}>{tool.category}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  {tool.mlRelevant && (
                    <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: '#E8EDF2', color: '#1E3A5F' }}>ML</span>
                  )}
                  {tool.dlRelevant && (
                    <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: '#E8F0E9', color: '#2D5A3D' }}>DL</span>
                  )}
                </div>
              </div>
              <p className="text-sm mb-3" style={{ color: '#4A4A4A', lineHeight: 1.7 }}>
                {tool.description}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-3">
                {tool.tags.map((tag) => (
                  <span key={tag} className="text-xs px-2 py-0.5 rounded border" style={{ borderColor: '#EEEEEE', color: '#8A8A8A' }}>
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <div
                  className="flex-1 font-mono text-xs px-3 py-2 rounded border overflow-x-auto"
                  style={{ backgroundColor: '#FAFAFA', borderColor: '#EEEEEE', color: '#4A4A4A' }}
                >
                  {tool.installCommand}
                </div>
                <button
                  onClick={() => handleCopy(tool.id, tool.installCommand)}
                  className="p-1.5 rounded border hover:bg-gray-50 transition-colors shrink-0"
                  style={{ borderColor: '#EEEEEE' }}
                  title="复制安装命令"
                >
                  {copiedId === tool.id ? (
                    <Check size={14} style={{ color: '#2D5A3D' }} />
                  ) : (
                    <Copy size={14} style={{ color: '#8A8A8A' }} />
                  )}
                </button>
              </div>

              <div className="mt-2.5 flex items-center gap-1.5">
                <span className="text-xs" style={{ color: '#8A8A8A' }}>难度:</span>
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
        <h2 className="text-lg font-bold mb-5" style={{ color: '#1A1A1A' }}>快速入门</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="border rounded-lg p-5" style={{ borderColor: '#E5E5E5' }}>
            <FlaskConical size={16} className="mb-2" style={{ color: '#1E3A5F' }} />
            <h3 className="text-sm font-semibold mb-2" style={{ color: '#1A1A1A' }}>ML 快速启动</h3>
            <div className="font-mono text-xs space-y-1.5" style={{ color: '#4A4A4A' }}>
              <p>pip install scikit-learn xgboost</p>
              <p>pip install pandas numpy matplotlib</p>
              <p>pip install shap optuna</p>
            </div>
          </div>
          <div className="border rounded-lg p-5" style={{ borderColor: '#E5E5E5' }}>
            <BookOpen size={16} className="mb-2" style={{ color: '#2D5A3D' }} />
            <h3 className="text-sm font-semibold mb-2" style={{ color: '#1A1A1A' }}>DL 快速启动</h3>
            <div className="font-mono text-xs space-y-1.5" style={{ color: '#4A4A4A' }}>
              <p>pip install torch torchvision</p>
              <p>pip install transformers</p>
              <p>pip install wandb</p>
            </div>
          </div>
          <div className="border rounded-lg p-5" style={{ borderColor: '#E5E5E5' }}>
            <Terminal size={16} className="mb-2" style={{ color: '#8A8A8A' }} />
            <h3 className="text-sm font-semibold mb-2" style={{ color: '#1A1A1A' }}>生信专用</h3>
            <div className="font-mono text-xs space-y-1.5" style={{ color: '#4A4A4A' }}>
              <p>pip install biopython scanpy</p>
              <p>pip install scvi-tools</p>
              <p>pip install deepchem rdkit</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border rounded-lg p-6" style={{ borderColor: '#E5E5E5' }}>
        <h2 className="text-lg font-bold mb-4" style={{ color: '#1A1A1A' }}>环境配置建议</h2>
        <div className="space-y-4 text-sm" style={{ color: '#4A4A4A' }}>
          <div>
            <h3 className="font-medium mb-1" style={{ color: '#1A1A1A' }}>Python版本</h3>
            <p>推荐使用 Python 3.9-3.11，通过 conda 或 pyenv 管理虚拟环境</p>
          </div>
          <div>
            <h3 className="font-medium mb-1" style={{ color: '#1A1A1A' }}>GPU环境</h3>
            <p>NVIDIA GPU需安装CUDA Toolkit + cuDNN。或使用Google Colab的免费T4 GPU</p>
          </div>
          <div>
            <h3 className="font-medium mb-1" style={{ color: '#1A1A1A' }}>推荐IDE</h3>
            <p>VS Code + Python扩展 + Jupyter插件，或 PyCharm Professional</p>
          </div>
          <div>
            <h3 className="font-medium mb-1" style={{ color: '#1A1A1A' }}>Conda环境模板</h3>
            <pre className="mt-2 p-3 rounded-lg border font-mono text-xs overflow-x-auto" style={{ backgroundColor: '#FAFAFA', borderColor: '#EEEEEE' }}>
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
