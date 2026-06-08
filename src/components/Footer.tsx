import { Link } from 'react-router-dom';

const footerLinks = [
  { path: '/roadmap', label: '学习路径' },
  { path: '/applications', label: '应用方向' },
  { path: '/resources', label: '资源库' },
  { path: '/tools', label: '工具' },
  { path: '/math', label: '数学直觉' },
];

export default function Footer() {
  return (
    <footer
      className="border-t py-8"
      style={{ backgroundColor: '#FAFAFA', borderColor: '#E5E5E5' }}
    >
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm" style={{ color: '#8A8A8A' }}>
            BioML Guide — 生信机器学习与深度学习学习指南
          </div>
          <div className="flex flex-wrap items-center gap-4">
            {footerLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-sm no-underline"
                style={{ color: '#8A8A8A' }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div
          className="mt-4 pt-4 border-t text-center text-xs"
          style={{ color: '#8A8A8A', borderColor: '#EEEEEE' }}
        >
          &copy; {new Date().getFullYear()} BioML Guide. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
