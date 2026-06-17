import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, ArrowRight, ArrowLeft } from 'lucide-react';
import CodeBlock from '../components/CodeBlock';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorDisplay from '../components/ErrorDisplay';
import { sanitizeHTML } from '../utils/sanitize';
import { useData } from '../hooks/useData';

interface PythonSection {
  type: string;
  title: string;
  content?: string;
  code?: string;
}

interface PythonChapter {
  key: string;
  chapter: number;
  name: string;
  difficulty: string;
  sections: PythonSection[];
}

interface PythonCategory {
  id: string;
  name: string;
  description: string;
  difficulty: string;
  chapters: PythonChapter[];
}

interface PythonTopicsData {
  categories: PythonCategory[];
}

const sectionColors: Record<string, string> = {
  concept: 'bg-brand-accent-light',
  code: 'bg-brand-off-white',
  bio: 'bg-brand-dl-light',
};

export default function PythonChapterPage() {
  const { chapterKey } = useParams<{ chapterKey: string }>();
  const { data, loading, error } = useData<PythonTopicsData>('pythonTopics');

  if (loading) return <LoadingSpinner />;
  if (error || !data || !chapterKey) return <ErrorDisplay message={error || '加载失败'} />;

  // Find the chapter
  let chapter: PythonChapter | null = null;
  let category: PythonCategory | null = null;
  for (const cat of data.categories) {
    const ch = cat.chapters.find(c => c.key === chapterKey);
    if (ch) {
      chapter = ch;
      category = cat;
      break;
    }
  }

  if (!chapter || !category) return <ErrorDisplay message={`章节「${chapterKey}」不存在`} />;

  // Find prev/next
  const allChapters = data.categories.flatMap(c => c.chapters.map(ch => ({ ...ch, catId: c.id, catName: c.name })));
  const idx = allChapters.findIndex(c => c.key === chapterKey);
  const prevChapter = idx > 0 ? allChapters[idx - 1] : null;
  const nextChapter = idx < allChapters.length - 1 ? allChapters[idx + 1] : null;

  return (
    <div className="max-w-[800px] mx-auto py-8 px-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-brand-ink-muted mb-6">
        <Link to="/python" className="hover:text-brand-accent no-underline transition-colors">
          Python 编程
        </Link>
        <ChevronLeft size={10} className="rotate-180" />
        <span className="text-brand-ink-light">{category.name}</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-brand-accent-light text-brand-accent">
            第{chapter.chapter}章
          </span>
          <span className={`text-xs px-2 py-0.5 rounded ${
            chapter.difficulty === '入门' ? 'bg-brand-dl-light text-brand-dl' : 'bg-brand-accent-light text-brand-accent'
          }`}>
            {chapter.difficulty}
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-brand-ink">{chapter.name}</h1>
      </div>

      {/* Sections */}
      <div className="space-y-4">
        {chapter.sections.map((section, i) => (
          <div
            key={i}
            className={`border rounded-lg overflow-hidden border-brand-border-light ${sectionColors[section.type] || 'bg-white'}`}
          >
            <div className="px-5 py-2.5 border-b border-brand-border-light">
              <h2 className="text-sm font-semibold text-brand-ink">{section.title}</h2>
            </div>
            <div className="px-5 py-3">
              {section.content && (
                <div
                  className="text-sm leading-relaxed text-brand-ink-light"
                  style={{ lineHeight: 1.9 }}
                  dangerouslySetInnerHTML={{ __html: sanitizeHTML(section.content) }}
                />
              )}
              {section.code && (
                <div className="mt-2">
                  <CodeBlock code={section.code} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Prev/Next */}
      <div className="mt-10 pt-6 border-t border-brand-border-light flex items-center justify-between">
        {prevChapter ? (
          <Link
            to={`/python/${prevChapter.key}`}
            className="flex items-center gap-1.5 text-sm no-underline hover:underline text-brand-ink-light"
          >
            <ArrowLeft size={15} />
            <div>
              <div className="text-xs text-brand-ink-muted">上一章</div>
              <div className="font-medium">第{prevChapter.chapter}章</div>
            </div>
          </Link>
        ) : <div />}

        <Link to="/python" className="text-sm text-brand-ink-muted hover:underline no-underline">
          Python 中枢
        </Link>

        {nextChapter ? (
          <Link
            to={`/python/${nextChapter.key}`}
            className="flex items-center gap-1.5 text-sm no-underline hover:underline text-brand-accent text-right"
          >
            <div>
              <div className="text-xs text-brand-ink-muted">下一章</div>
              <div className="font-medium">第{nextChapter.chapter}章</div>
            </div>
            <ArrowRight size={15} />
          </Link>
        ) : <div />}
      </div>

      {/* Cross reference */}
      <div className="mt-6 border rounded-lg p-4 bg-brand-off-white border-brand-border-light text-center">
        <p className="text-xs text-brand-ink-muted mb-2">
          学完本章，可以在生信场景中实践相关技能
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link to="/roadmap" className="text-xs font-medium text-brand-accent hover:underline no-underline">学习路径</Link>
          <Link to="/ngs" className="text-xs font-medium text-brand-accent hover:underline no-underline">生信NGS</Link>
          <Link to="/graph" className="text-xs font-medium text-brand-accent hover:underline no-underline">知识图谱</Link>
        </div>
      </div>
    </div>
  );
}
