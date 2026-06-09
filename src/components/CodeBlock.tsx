import { useState } from 'react';
import { Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  label?: string;
  collapsible?: boolean;
}

export default function CodeBlock({ code, label, collapsible = false }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(!collapsible);

  const handleCopy = () => {
    try {
      navigator.clipboard.writeText(code).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    } catch {
      const el = document.createElement('textarea');
      el.value = code;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden" style={{ borderColor: '#EEEEEE' }}>
      {/* Header row */}
      <div
        className="flex items-center justify-between px-3 py-1.5"
        style={{ backgroundColor: '#FAFAFA', borderBottom: open ? '1px solid #EEEEEE' : 'none' }}
      >
        <div className="flex items-center gap-2">
          {collapsible && (
            <button
              onClick={() => setOpen(!open)}
              className="p-0.5 rounded hover:bg-gray-100 transition-colors"
              title={open ? 'Hide code' : 'Show code'}
            >
              {open ? (
                <ChevronUp size={12} style={{ color: '#8A8A8A' }} />
              ) : (
                <ChevronDown size={12} style={{ color: '#8A8A8A' }} />
              )}
            </button>
          )}
          {label && (
            <span className="text-xs font-medium" style={{ color: '#8A8A8A' }}>
              {label}
            </span>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="p-1 rounded hover:bg-gray-100 transition-colors"
          title="Copy code"
        >
          {copied ? (
            <Check size={13} style={{ color: '#2D5A3D' }} />
          ) : (
            <Copy size={13} style={{ color: '#8A8A8A' }} />
          )}
        </button>
      </div>

      {/* Code body */}
      {open && (
        <pre
          className="m-0 px-3 py-2.5 font-mono text-xs overflow-x-auto"
          style={{ backgroundColor: '#FAFAFA', color: '#4A4A4A', whiteSpace: 'pre' }}
        >
          {code}
        </pre>
      )}
    </div>
  );
}
