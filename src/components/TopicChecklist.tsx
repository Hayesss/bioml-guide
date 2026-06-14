import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

interface TopicItem {
  name: string;
  description: string;
}

interface TopicChecklistProps {
  topics: TopicItem[];
  stageId: number;
  typePrefix: string;
  isDone: (key: string) => boolean;
  onToggle: (key: string) => void;
  topicKeyMap: Record<string, string>;
  linkColorClass?: string;
  icon?: React.ReactNode;
}

export default function TopicChecklist({
  topics, stageId, typePrefix, isDone, onToggle,
  topicKeyMap, linkColorClass = 'text-brand-accent', icon
}: TopicChecklistProps) {
  if (!topics || topics.length === 0) return null;

  return (
    <ul className="space-y-3">
      {topics.map((topic) => {
        const key = `stage-${stageId}-${typePrefix}-${topic.name}`;
        const done = isDone(key);
        return (
          <li key={topic.name}>
            <div
              className="flex items-start gap-2 cursor-pointer"
              onClick={() => onToggle(key)}
            >
              <span
                className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${done ? 'border-brand-dl bg-brand-dl' : 'border-gray-300 bg-transparent'}`}
              >
                {done && <Check size={10} className="text-white" />}
              </span>
              <div>
                <div className="flex items-center gap-1.5">
                  <div className={`font-medium text-sm ${done ? 'text-brand-ink-muted line-through' : 'text-brand-ink'}`}>
                    {topicKeyMap[topic.name] ? (
                      <Link
                        to={`/learn/${topicKeyMap[topic.name]}`}
                        className={`no-underline hover:underline ${done ? 'text-brand-ink-muted' : linkColorClass}`}
                      >
                        {topic.name}
                        {icon && <span className="ml-0.5">{icon}</span>}
                        <span className="text-[10px] opacity-40"> ↗</span>
                      </Link>
                    ) : (
                      topic.name
                    )}
                  </div>
                </div>
                <div className="text-xs mt-0.5 text-brand-ink-medium" style={{ lineHeight: 1.6 }}>
                  {topic.description}
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
