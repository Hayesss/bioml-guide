import { Link } from 'react-router-dom';

const footerLinks = [
  { path: '/roadmap', label: '学习路径' },
  { path: '/applications', label: '应用方向' },
  { path: '/resources', label: '资源库' },
  { path: '/tools', label: '工具' },
  { path: '/math', label: '数学直觉' },
  { path: '/cheatsheet', label: '速查表' },
];

export default function Footer() {
  return (
    <footer className="border-t py-8 bg-brand-off-white border-brand-border">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Brand */}
          <div>
            <div className="text-sm font-semibold mb-2 text-brand-ink">BioML Guide</div>
            <p className="text-xs mb-1 text-brand-ink-muted">
              面向生物信息学研究者的机器学习与深度学习系统学习指南
            </p>
            <p className="text-xs text-brand-ink-muted">
              涵盖基因组学、蛋白质科学、单细胞、药物发现等核心领域
            </p>
          </div>

          {/* Quick nav */}
          <div>
            <div className="text-xs font-semibold mb-2 text-brand-ink-light">页面导航</div>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {footerLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-sm no-underline hover:underline text-brand-ink-muted"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div>
            <div className="text-xs font-semibold mb-2 text-brand-ink-light">外部资源</div>
            <div className="space-y-1">
              {[
                { label: 'scikit-learn', url: 'https://scikit-learn.org/' },
                { label: 'PyTorch', url: 'https://pytorch.org/' },
                { label: 'Hugging Face', url: 'https://huggingface.co/' },
                { label: '3Blue1Brown', url: 'https://www.youtube.com/@3blue1brown' },
                { label: 'AlphaFold', url: 'https://github.com/deepmind/alphafold' },
              ].map((ext) => (
                <a
                  key={ext.label}
                  href={ext.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm no-underline hover:underline text-brand-ink-muted"
                >
                  {ext.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t text-center text-xs text-brand-ink-muted border-brand-border-light">
          &copy; {new Date().getFullYear()} BioML Guide. Built with React + Vite + Tailwind CSS.
        </div>
      </div>
    </footer>
  );
}
