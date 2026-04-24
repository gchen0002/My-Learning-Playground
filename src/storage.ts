export type StorageKey =
  | 'mlp.notes'
  | 'mlp.progress'
  | 'mlp.quizAttempts'
  | 'mlp.exerciseResponses'
  | 'mlp.drillAttempts'
  | 'mlp.mockInterviewAttempts';

export const storageKeys = {
  notes: 'mlp.notes',
  progress: 'mlp.progress',
  quizAttempts: 'mlp.quizAttempts',
  exerciseResponses: 'mlp.exerciseResponses',
  drillAttempts: 'mlp.drillAttempts',
  mockInterviewAttempts: 'mlp.mockInterviewAttempts',
} as const;

export function readJson<T>(key: StorageKey, fallback: T): T {
  const stored = window.localStorage.getItem(key);
  if (!stored) {
    return fallback;
  }

  try {
    return JSON.parse(stored) as T;
  } catch {
    return fallback;
  }
}

export function writeJson<T>(key: StorageKey, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function removeJson(key: StorageKey) {
  window.localStorage.removeItem(key);
}

export function createId() {
  return crypto.randomUUID();
}
