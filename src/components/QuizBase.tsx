import { useState } from 'react';
import { Brain, Check, X, RefreshCw } from 'lucide-react';

export interface QuizQuestion {
  q: string;
  options: string[];
  answer: number;
  explanation: string;
}

interface QuizBaseProps {
  questions: QuizQuestion[];
  variant?: 'full' | 'compact';
}

export default function QuizBase({ questions, variant = 'full' }: QuizBaseProps) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = questions[current];
  if (!q) return null;
  const isCorrect = selected === q.answer;
  const isFull = variant === 'full';

  const handleSubmit = () => {
    if (selected === null) return;
    setSubmitted(true);
    if (isCorrect) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent((c) => c + 1);
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
    const messages =
      variant === 'full'
        ? { high: '厉害！基础知识扎实', mid: '不错，继续加油', low: '需要多看看学习路径噢' }
        : { high: '掌握得很好！', mid: '还不错，继续加油', low: '建议再看一遍上面的内容' };
    return (
      <div className={`text-center ${isFull ? 'border rounded-lg p-6 border-brand-border' : 'py-3'}`}>
        <div className={`${isFull ? 'text-4xl mb-3' : 'text-3xl mb-2'}`}>
          {pct >= 80 ? '★' : pct >= 60 ? '●' : '○'}
        </div>
        <h3 className={`font-bold mb-1 text-brand-ink ${isFull ? 'text-lg' : 'text-sm'}`}>
          {pct >= 80 ? messages.high : pct >= 60 ? messages.mid : messages.low}
        </h3>
        <p className={`mb-2 text-brand-ink-muted ${isFull ? 'text-sm mb-4' : 'text-xs'}`}>
          正确 {score}/{questions.length} ({pct}%)
        </p>
        {isFull ? (
          <button
            onClick={handleRestart}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-brand-accent text-white"
          >
            <RefreshCw size={14} />
            再来一次
          </button>
        ) : (
          <button onClick={handleRestart} className="text-xs font-medium text-brand-accent hover:underline">
            再做一遍
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={isFull ? 'border rounded-lg p-6 border-brand-border' : ''}>
      {isFull && (
        <>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Brain size={16} className="text-brand-accent" />
              <h3 className="text-sm font-semibold text-brand-ink">知识自测</h3>
            </div>
            <span className="text-xs text-brand-ink-muted">
              {current + 1} / {questions.length}
            </span>
          </div>
          <div className="w-full h-1 rounded-full mb-4 bg-brand-border-light">
            <div
              className="h-full rounded-full transition-all duration-300 bg-brand-accent"
              style={{ width: `${((current + (submitted ? 1 : 0)) / questions.length) * 100}%` }}
            />
          </div>
        </>
      )}
      {!isFull && (
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-brand-ink-muted">
            第 {current + 1} / {questions.length} 题
          </span>
        </div>
      )}

      <p className={`font-medium mb-3 text-brand-ink ${isFull ? 'text-sm mb-4' : 'text-sm'}`} style={{ lineHeight: 1.6 }}>
        {q.q}
      </p>

      <div className={`space-y-2 mb-3 ${isFull ? 'mb-4' : ''}`}>
        {q.options.map((opt, i) => {
          const submittedCorrect = submitted && i === q.answer;
          const submittedWrong = submitted && i === selected && !isCorrect;
          const selectedClass = !submitted && i === selected;

          const baseClasses = isFull
            ? 'px-4 py-2.5 text-sm gap-3'
            : 'px-3 py-2 text-xs gap-2';
          const iconSize = isFull ? 12 : 11;

          let borderClass = 'border-brand-border bg-white text-brand-ink-light';
          if (submittedCorrect) borderClass = 'border-brand-dl bg-brand-dl-light text-brand-dl';
          else if (submittedWrong) borderClass = 'border-brand-error bg-brand-error-light text-brand-error';
          else if (selectedClass) borderClass = 'border-brand-accent bg-brand-accent-light text-brand-accent';

          return (
            <button
              key={i}
              disabled={submitted}
              onClick={() => setSelected(i)}
              className={`w-full flex items-center rounded-lg border text-left transition-colors ${baseClasses} ${borderClass}`}
            >
              <span className={`rounded-full border flex items-center justify-center font-mono shrink-0 ${isFull ? 'w-6 h-6 text-xs' : 'w-5 h-5 text-xs'}`}>
                {submittedCorrect ? (
                  <Check size={iconSize} className="text-brand-dl" />
                ) : submittedWrong ? (
                  <X size={iconSize} className="text-brand-error" />
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
          className={`rounded-lg p-2.5 mb-3 text-xs ${isCorrect ? 'bg-brand-dl-light text-brand-dl' : 'bg-brand-error-light text-brand-error'}`}
        >
          <span className="font-medium">{isCorrect ? '✓ 正确！' : '✗ 错误'}</span>{' '}
          {q.explanation}
        </div>
      )}

      <button
        onClick={submitted ? handleNext : handleSubmit}
        disabled={selected === null}
        className={`w-full rounded-lg font-medium transition-colors ${isFull ? 'py-2.5 text-sm' : 'py-2 text-xs'} ${
          selected === null
            ? 'bg-brand-border-light text-brand-ink-muted cursor-not-allowed'
            : 'bg-brand-accent text-white'
        }`}
      >
        {submitted ? (current < questions.length - 1 ? '下一题' : '查看结果') : '提交答案'}
      </button>
    </div>
  );
}
