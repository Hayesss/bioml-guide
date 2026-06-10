import { useState } from 'react';
import { Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { Highlight, themes } from 'prism-react-renderer';

interface CodeBlockProps {
  code: string;
  label?: string;
  language?: string;
  collapsible?: boolean;
}

/** 干掉没有高亮的原始代码块，现在用Prism做语法高亮 */
export default function CodeBlock({ code, label, language = 'python', collapsible = false }: CodeBlockProps) {
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
    <div className="border rounded-lg overflow-hidden border-brand-border-light">
      {/* Header row */}
      <div
        className="flex items-center justify-between px-3 py-1.5 bg-brand-off-white"
        style={{ borderBottom: open ? '1px solid #EEEEEE' : 'none' }}
      >
        <div className="flex items-center gap-2">
          {collapsible && (
            <button
              onClick={() => setOpen(!open)}
              className="p-0.5 rounded hover:bg-gray-100 transition-colors"
              title={open ? 'Hide code' : 'Show code'}
            >
              {open ? (
                <ChevronUp size={12} className="text-brand-ink-muted" />
              ) : (
                <ChevronDown size={12} className="text-brand-ink-muted" />
              )}
            </button>
          )}
          {label && (
            <span className="text-xs font-medium text-brand-ink-muted">
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
            <Check size={13} className="text-brand-dl" />
          ) : (
            <Copy size={13} className="text-brand-ink-muted" />
          )}
        </button>
      </div>

      {/* Code body with syntax highlighting */}
      {open && (
        <Highlight
          theme={themes.github}
          code={code.trimEnd()}
          language={language}
        >
          {({ style, tokens, getLineProps, getTokenProps }) => (
            <pre
              className="m-0 px-3 py-2.5 text-xs overflow-x-auto bg-brand-off-white"
              style={{ ...style, whiteSpace: 'pre', backgroundColor: '#FAFAFA' }}
            >
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line, key: i })}>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token, key })} />
                  ))}
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      )}
    </div>
  );
}
