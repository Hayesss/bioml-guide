import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'bioml-guide-progress';

interface ProgressState {
  roadmapTopics: Record<string, boolean>;
  lastUpdated: number;
}

function loadProgress(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { roadmapTopics: {}, lastUpdated: Date.now() };
}

function saveProgress(state: ProgressState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, lastUpdated: Date.now() }));
  } catch {}
}

export function useProgress() {
  const [progress, setProgress] = useState<ProgressState>(loadProgress);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  const isTopicDone = useCallback(
    (key: string) => !!progress.roadmapTopics[key],
    [progress],
  );

  const toggleTopic = useCallback(
    (key: string) => {
      const next: ProgressState = {
        ...progress,
        roadmapTopics: {
          ...progress.roadmapTopics,
          [key]: !progress.roadmapTopics[key],
        },
      };
      saveProgress(next);
      setProgress(next);
    },
    [progress],
  );

  const getStageProgress = useCallback(
    (topicKeys: string[]) => {
      const done = topicKeys.filter(k => progress.roadmapTopics[k]).length;
      return { done, total: topicKeys.length, pct: topicKeys.length > 0 ? Math.round((done / topicKeys.length) * 100) : 0 };
    },
    [progress],
  );

  const getOverallProgress = useCallback(
    (allTopicKeys: string[]) => {
      const done = allTopicKeys.filter(k => progress.roadmapTopics[k]).length;
      return { done, total: allTopicKeys.length, pct: allTopicKeys.length > 0 ? Math.round((done / allTopicKeys.length) * 100) : 0 };
    },
    [progress],
  );

  const resetAll = useCallback(() => {
    const empty: ProgressState = { roadmapTopics: {}, lastUpdated: Date.now() };
    saveProgress(empty);
    setProgress(empty);
  }, []);

  return { isTopicDone, toggleTopic, getStageProgress, getOverallProgress, resetAll };
}
