import { challenges, exercises, quizQuestions, type Difficulty, type LearningCategory, type QuizQuestion } from './content';
import { createId, readJson, removeJson, storageKeys, writeJson } from './storage';

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

export type ChecklistResult = Record<string, boolean>;

export type ExerciseResponse = {
  id: string;
  exerciseId: string;
  sections: {
    requirements: string;
    entityModel: string;
    operations: string;
    validation: string;
    edgeCases: string;
    tradeoffs: string;
  };
  checklist: ChecklistResult;
  createdAt: string;
  updatedAt: string;
};

export type DesignResponseSections = {
  functionalRequirements: string;
  nonFunctionalRequirements: string;
  coreEntities: string;
  apiOperations: string;
  dataFlow: string;
  bottlenecks: string;
  tradeoffs: string;
};

export type MockInterviewAttempt = {
  id: string;
  javascriptQuestionId: string;
  crudExerciseId: string;
  designChallengeId: string;
  notes: string;
  createdAt: string;
};

export type LocalDataExport = {
  version: 1;
  exportedAt: string;
  notes: Note[];
  progress: ProgressMap;
  quizAttempts: QuizAttempt[];
  exerciseResponses: ExerciseResponse[];
  mockInterviewAttempts: MockInterviewAttempt[];
};

export function scoreQuiz(questions: QuizQuestion[], answers: Record<string, string>) {
  return questions.reduce((score, question) => (answers[question.id] === question.answer ? score + 1 : score), 0);
}

export function getQuestionsForTopic(topicId: string) {
  return quizQuestions.filter((question) => question.topicId === topicId);
}

export function getExercisesForTopic(topicId: string) {
  return exercises.filter((exercise) => exercise.topicIds.includes(topicId));
}

export function getChallengesForTopic(topicId: string) {
  return challenges.filter((challenge) => challenge.topicIds.includes(topicId));
}

export function getQuizAttempts() {
  return readJson<QuizAttempt[]>(storageKeys.quizAttempts, []);
}

export function submitQuizAttempt(answers: Record<string, string>, questions: QuizQuestion[] = quizQuestions) {
  const attempt: QuizAttempt = {
    id: createId(),
    score: scoreQuiz(questions, answers),
    total: questions.length,
    answers,
    createdAt: new Date().toISOString(),
  };

  writeJson(storageKeys.quizAttempts, [attempt, ...getQuizAttempts()]);
  return attempt;
}

export function getNotes() {
  return readJson<Note[]>(storageKeys.notes, []);
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

  writeJson(storageKeys.notes, [note, ...getNotes()]);
  return note;
}

export function deleteNote(id: string) {
  writeJson(
    storageKeys.notes,
    getNotes().filter((note) => note.id !== id),
  );
}

export function getProgress() {
  return readJson<ProgressMap>(storageKeys.progress, {});
}

export function setProgress(topicId: string, status: ProgressStatus) {
  const nextProgress = {
    ...getProgress(),
    [topicId]: status,
  };
  writeJson(storageKeys.progress, nextProgress);
  return nextProgress;
}

export function getExerciseResponses() {
  return readJson<ExerciseResponse[]>(storageKeys.exerciseResponses, []);
}

export function saveExerciseResponse(input: Omit<ExerciseResponse, 'id' | 'createdAt' | 'updatedAt'>) {
  const now = new Date().toISOString();
  const existing = getExerciseResponses().find((response) => response.exerciseId === input.exerciseId);
  const nextResponse: ExerciseResponse = {
    ...input,
    id: existing?.id ?? createId(),
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };

  const nextResponses = [nextResponse, ...getExerciseResponses().filter((response) => response.exerciseId !== input.exerciseId)];
  writeJson(storageKeys.exerciseResponses, nextResponses);
  return nextResponse;
}

export function deleteExerciseResponse(id: string) {
  writeJson(
    storageKeys.exerciseResponses,
    getExerciseResponses().filter((response) => response.id !== id),
  );
}

export function filterExercises(category: LearningCategory | 'All', difficulty: Difficulty | 'All') {
  return exercises.filter((exercise) => {
    const categoryMatches = category === 'All' || exercise.category === category;
    const difficultyMatches = difficulty === 'All' || exercise.difficulty === difficulty;
    return categoryMatches && difficultyMatches;
  });
}

export function getChecklistScore(checklist: ChecklistResult) {
  const values = Object.values(checklist);
  if (values.length === 0) {
    return 0;
  }

  return Math.round((values.filter(Boolean).length / values.length) * 100);
}

export function getMockInterviewAttempts() {
  return readJson<MockInterviewAttempt[]>(storageKeys.mockInterviewAttempts, []);
}

export function createMockInterviewPrompt() {
  const javascriptQuestion = quizQuestions.find((question) => question.category === 'JavaScript') ?? quizQuestions[0];
  const crudExercise = exercises.find((exercise) => exercise.category === 'CRUD') ?? exercises[0];
  const designChallenge = challenges.find((challenge) => challenge.type === 'Design') ?? challenges[0];

  return {
    javascriptQuestion,
    crudExercise,
    designChallenge,
  };
}

export function saveMockInterviewAttempt(input: Omit<MockInterviewAttempt, 'id' | 'createdAt'>) {
  const attempt: MockInterviewAttempt = {
    ...input,
    id: createId(),
    createdAt: new Date().toISOString(),
  };

  writeJson(storageKeys.mockInterviewAttempts, [attempt, ...getMockInterviewAttempts()]);
  return attempt;
}

export function exportLocalData(): LocalDataExport {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    notes: getNotes(),
    progress: getProgress(),
    quizAttempts: getQuizAttempts(),
    exerciseResponses: getExerciseResponses(),
    mockInterviewAttempts: getMockInterviewAttempts(),
  };
}

export function importLocalData(data: LocalDataExport) {
  if (data.version !== 1) {
    throw new Error('Unsupported export version.');
  }

  writeJson(storageKeys.notes, Array.isArray(data.notes) ? data.notes : []);
  writeJson(storageKeys.progress, data.progress ?? {});
  writeJson(storageKeys.quizAttempts, Array.isArray(data.quizAttempts) ? data.quizAttempts : []);
  writeJson(storageKeys.exerciseResponses, Array.isArray(data.exerciseResponses) ? data.exerciseResponses : []);
  writeJson(storageKeys.mockInterviewAttempts, Array.isArray(data.mockInterviewAttempts) ? data.mockInterviewAttempts : []);
}

export function resetLocalProgress() {
  removeJson(storageKeys.notes);
  removeJson(storageKeys.progress);
  removeJson(storageKeys.quizAttempts);
  removeJson(storageKeys.exerciseResponses);
  removeJson(storageKeys.mockInterviewAttempts);
}
