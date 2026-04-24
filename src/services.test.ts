import { beforeEach, describe, expect, it, vi } from 'vitest';
import { exercises, quizQuestions } from './content';
import {
  createMockInterviewPrompt,
  exportLocalData,
  filterExercises,
  getChecklistScore,
  getNotes,
  getProgress,
  importLocalData,
  saveExerciseResponse,
  saveNote,
  scoreQuiz,
  setProgress,
  submitQuizAttempt,
} from './services';

beforeEach(() => {
  localStorage.clear();
  vi.spyOn(crypto, 'randomUUID').mockReturnValue('00000000-0000-4000-8000-000000000000');
});

describe('quiz scoring', () => {
  it('scores answers against question keys', () => {
    const answers = Object.fromEntries(quizQuestions.map((question) => [question.id, question.answer]));

    expect(scoreQuiz(quizQuestions, answers)).toBe(quizQuestions.length);
  });

  it('persists a submitted attempt', () => {
    const answers = Object.fromEntries(quizQuestions.map((question) => [question.id, question.answer]));
    const attempt = submitQuizAttempt(answers);

    expect(attempt.score).toBe(quizQuestions.length);
    expect(exportLocalData().quizAttempts).toHaveLength(1);
  });
});

describe('progress and notes', () => {
  it('persists progress updates', () => {
    setProgress('crud-flow', 'completed');

    expect(getProgress()['crud-flow']).toBe('completed');
  });

  it('creates and reads notes', () => {
    saveNote({ targetId: 'crud-flow', targetType: 'topic', body: 'Practice create before update.' });

    expect(getNotes()[0]?.body).toBe('Practice create before update.');
  });
});

describe('exercise helpers', () => {
  it('filters exercises by category and difficulty', () => {
    const filtered = filterExercises('CRUD', 'Starter');

    expect(filtered.every((exercise) => exercise.category === 'CRUD' && exercise.difficulty === 'Starter')).toBe(true);
  });

  it('scores checklist completion', () => {
    expect(getChecklistScore({ model: true, validation: false, edgeCases: true })).toBe(67);
  });

  it('saves an exercise response', () => {
    const exercise = exercises[0];
    const response = saveExerciseResponse({
      exerciseId: exercise.id,
      sections: {
        requirements: 'Create and complete todos.',
        entityModel: 'Todo has id, title, completed.',
        operations: 'create, read, update, delete',
        validation: 'title required',
        edgeCases: 'empty list',
        tradeoffs: 'local first',
      },
      checklist: { [exercise.expectedConcepts[0]]: true },
    });

    expect(response.exerciseId).toBe(exercise.id);
    expect(exportLocalData().exerciseResponses).toHaveLength(1);
  });
});

describe('mock interview and import/export', () => {
  it('creates a balanced prompt set', () => {
    const prompt = createMockInterviewPrompt();

    expect(prompt.javascriptQuestion.category).toBe('JavaScript');
    expect(prompt.crudExercise.category).toBe('CRUD');
    expect(prompt.designChallenge.type).toBe('Design');
  });

  it('imports exported local data', () => {
    saveNote({ targetId: 'crud-flow', targetType: 'topic', body: 'before export' });
    const exported = exportLocalData();
    localStorage.clear();
    importLocalData(exported);

    expect(getNotes()[0]?.body).toBe('before export');
  });
});
