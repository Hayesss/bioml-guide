interface ChipLineProps {
  label: string;
  items: string[];
  muted?: boolean;
  max?: number;
}

export default function ChipLine({ label, items, muted = false, max }: ChipLineProps) {
  if (!items || items.length === 0) return null;
  const displayItems = max ? items.slice(0, max) : items;
  const overflow = max ? items.length - max : 0;

  return (
    <div className="mb-2">
      <span className="text-[11px] font-medium text-brand-ink-muted">{label}: </span>
      <div className="mt-1 flex flex-wrap gap-1">
        {displayItems.map((item) => (
          <span
            key={item}
            className={`text-[11px] px-1.5 py-0.5 rounded border ${
              muted ? 'text-brand-ink-extra-muted' : 'text-brand-ink-light'
            } border-brand-border-light`}
          >
            {item}
          </span>
        ))}
        {overflow > 0 && (
          <span className="text-[11px] px-1.5 py-0.5 text-brand-ink-extra-muted">
            +{overflow}
          </span>
        )}
      </div>
    </div>
  );
}
