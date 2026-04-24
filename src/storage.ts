import { quizQuestions } from './content';

export type ProgressStatus = 'not_started' | 'in_progress' | 'completed';

export type ProgressMap = Record<string, ProgressStatus>;

export type Note = {
  id: string;
  targetId: string;
  targetType: 'topic' | 'challenge';
  body: string;
  createdAt: string;
  updatedAt: string;
};

export type QuizAttempt = {
  id: string;
  score: number;
  total: number;
  answers: Record<string, string>;
  createdAt: string;
};

const notesKey = 'mlp.notes';
const progressKey = 'mlp.progress';
const attemptsKey = 'mlp.quizAttempts';

function readJson<T>(key: string, fallback: T): T {
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

function writeJson<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function createId() {
  return crypto.randomUUID();
}

export function getNotes() {
  return readJson<Note[]>(notesKey, []);
}

export function saveNote(input: Pick<Note, 'targetId' | 'targetType' | 'body'>) {
  const now = new Date().toISOString();
  const note: Note = {
    id: createId(),
    targetId: input.targetId,
    targetType: input.targetType,
    body: input.body.trim(),
    createdAt: now,
    updatedAt: now,
  };

  const nextNotes = [note, ...getNotes()];
  writeJson(notesKey, nextNotes);
  return note;
}

export function deleteNote(id: string) {
  const nextNotes = getNotes().filter((note) => note.id !== id);
  writeJson(notesKey, nextNotes);
}

export function getProgress() {
  return readJson<ProgressMap>(progressKey, {});
}

export function setProgress(topicId: string, status: ProgressStatus) {
  const nextProgress = {
    ...getProgress(),
    [topicId]: status,
  };

  writeJson(progressKey, nextProgress);
  return nextProgress;
}

export function getQuizAttempts() {
  return readJson<QuizAttempt[]>(attemptsKey, []);
}

export function submitQuizAttempt(answers: Record<string, string>) {
  const score = quizQuestions.reduce((total, question) => {
    return answers[question.id] === question.answer ? total + 1 : total;
  }, 0);

  const attempt: QuizAttempt = {
    id: createId(),
    score,
    total: quizQuestions.length,
    answers,
    createdAt: new Date().toISOString(),
  };

  const nextAttempts = [attempt, ...getQuizAttempts()];
  writeJson(attemptsKey, nextAttempts);
  return attempt;
}

export function resetLocalProgress() {
  window.localStorage.removeItem(notesKey);
  window.localStorage.removeItem(progressKey);
  window.localStorage.removeItem(attemptsKey);
}
