import { useState } from 'react';
import { Brain, Check, X, RefreshCw } from 'lucide-react';

interface Question {
  q: string;
  options: string[];
  answer: number;
  explanation: string;
}

const questions: Question[] = [
  {
    q: '在生物信息学中，用随机森林预测SNP致病性时，哪个指标最适合评估模型在严重不平衡数据上的性能？',
    options: ['准确率 (Accuracy)', 'ROC-AUC', '精确率-召回率曲线下面积 (PR-AUC)', 'F1分数'],
    answer: 2,
    explanation: '致病SNP通常是稀有变异（1%以下），数据严重不平衡。PR-AUC对不平衡数据更敏感，而ROC-AUC在此情况下可能给出过于乐观的估计。',
  },
  {
    q: '使用PyTorch训练蛋白质序列分类模型时，以下哪个不是反向传播的必要步骤？',
    options: ['optimizer.zero_grad()', 'loss.backward()', 'optimizer.step()', 'model.eval()'],
    answer: 3,
    explanation: 'model.eval() 用于切换到评估模式（关闭Dropout/BatchNorm训练行为），不是反向传播步骤。zero_grad→backward→step 是标准的三步训练循环。',
  },
  {
    q: '以下哪种方法最适合处理单细胞RNA-seq数据中不同实验批次的系统偏差？',
    options: ['PCA降维', 'scVI的latent space批次校正', 'Log-normalization', 'Leiden聚类'],
    answer: 1,
    explanation: 'scVI通过深度生成模型将批次信息作为条件变量，在隐空间中分离生物变异和技术批次效应。PCA和归一化无法消除批次效应，聚类是下游分析步骤。',
  },
  {
    q: 'AlphaFold2之所以能高精度预测蛋白质结构，其核心创新是什么？',
    options: ['使用了更深的CNN', 'Evoformer模块处理MSA和配对表示的协同进化信息', '更大的训练数据集', '更快的GPU计算'],
    answer: 1,
    explanation: 'AlphaFold2的核心是Evoformer模块——它在多序列比对(MSA)和残基配对表示之间迭代传递信息，有效捕捉了共同进化信号。这是其精度突破的关键。',
  },
  {
    q: '在做差异基因表达分析时，为什么需要对p值进行多重检验校正（如Benjamini-Hochberg）？',
    options: ['提高p值的精度', '控制同时检验数万个基因时的假发现率(FDR)', '减小基因表达矩阵的大小', '增加差异基因的数量'],
    answer: 1,
    explanation: '基因组范围的分析同时检验20000+个基因。如果不校正，即使所有基因都不差异表达，也会有约1000个基因p<0.05（纯随机）。BH校正控制FDR≤5%。',
  },
];

export default function Quiz() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = questions[current];
  if (!q) return null;
  const isCorrect = selected === q.answer;

  const handleSubmit = () => {
    if (selected === null) return;
    setSubmitted(true);
    if (isCorrect) setScore(s => s + 1);
  };

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent(c => c + 1);
      setSelected(null);
      setSubmitted(false);
    } else {
      setFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrent(0);
    setSelected(null);
    setSubmitted(false);
    setScore(0);
    setFinished(false);
  };

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="border rounded-lg p-6 text-center border-brand-border">
        <div className="text-4xl mb-3">{pct >= 80 ? '🎉' : pct >= 60 ? '👍' : '📚'}</div>
        <h3 className="text-lg font-bold mb-2 text-brand-ink">
          {pct >= 80 ? '厉害！基础知识扎实' : pct >= 60 ? '不错，继续加油' : '需要多看看学习路径噢'}
        </h3>
        <p className="text-sm mb-4 text-brand-ink-muted">
          正确 {score}/{questions.length} ({pct}%)
        </p>
        <button
          onClick={handleRestart}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-brand-accent text-white"
        >
          <RefreshCw size={14} />
          再来一次
        </button>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-6 border-brand-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain size={16} className="text-brand-accent" />
          <h3 className="text-sm font-semibold text-brand-ink">知识自测</h3>
        </div>
        <span className="text-xs text-brand-ink-muted">
          {current + 1} / {questions.length}
        </span>
      </div>

      {/* Progress */}
      <div className="w-full h-1 rounded-full mb-4 bg-brand-border-light">
        <div
          className="h-full rounded-full transition-all duration-300 bg-brand-accent"
          style={{ width: `${((current + (submitted ? 1 : 0)) / questions.length) * 100}%` }}
        />
      </div>

      <p className="text-sm font-medium mb-4 text-brand-ink" style={{ lineHeight: 1.6 }}>
        {q.q}
      </p>

      <div className="space-y-2 mb-4">
        {q.options.map((opt, i) => {
          let bg = 'bg-white';
          let borderColor = 'border-brand-border';
          let textColor = 'text-brand-ink-light';

          if (submitted) {
            if (i === q.answer) {
              bg = 'bg-brand-dl-light';
              borderColor = 'border-brand-dl';
              textColor = 'text-brand-dl';
            } else if (i === selected && !isCorrect) {
              bg = 'bg-brand-error-light';
              borderColor = 'border-brand-error';
              textColor = 'text-brand-error';
            }
          } else if (i === selected) {
            bg = 'bg-brand-accent-light';
            borderColor = 'border-brand-accent';
            textColor = 'text-brand-accent';
          }

          return (
            <button
              key={i}
              disabled={submitted}
              onClick={() => setSelected(i)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg border text-left text-sm transition-colors ${bg} ${borderColor} ${textColor}`}
            >
              <span
                className="w-6 h-6 rounded-full border flex items-center justify-center text-xs font-mono shrink-0"
                style={{ borderColor: submitted && i === q.answer ? '#2D5A3D' : '#E5E5E5' }}
              >
                {submitted && i === q.answer ? (
                  <Check size={12} className="text-brand-dl" />
                ) : submitted && i === selected && !isCorrect ? (
                  <X size={12} className="text-brand-error" />
                ) : (
                  String.fromCharCode(65 + i)
                )}
              </span>
              {opt}
            </button>
          );
        })}
      </div>

      {submitted && (
        <div
          className={`rounded-lg p-3 mb-4 text-xs ${isCorrect ? 'bg-brand-dl-light text-brand-dl' : 'bg-brand-error-light'}`}
          style={{ color: isCorrect ? '#2D5A3D' : '#8B4513' }}
        >
          <span className="font-medium">{isCorrect ? '✓ 正确！' : '✗ 错误'}</span>{' '}
          {q.explanation}
        </div>
      )}

      <button
        onClick={submitted ? handleNext : handleSubmit}
        disabled={selected === null}
        className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors ${selected === null ? 'bg-brand-border-light text-brand-ink-muted cursor-not-allowed' : 'bg-brand-accent text-white cursor-pointer'}`}
      >
        {submitted ? (current < questions.length - 1 ? '下一题' : '查看结果') : '提交答案'}
      </button>
    </div>
  );
}
