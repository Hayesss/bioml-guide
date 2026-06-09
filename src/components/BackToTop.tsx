import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full border shadow-md flex items-center justify-center transition-opacity hover:opacity-80"
      style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E5E5' }}
      title="回到顶部"
    >
      <ChevronUp size={18} style={{ color: '#4A4A4A' }} />
    </button>
  );
}
