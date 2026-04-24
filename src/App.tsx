import { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  ClipboardList,
  Code2,
  GraduationCap,
  Layers3,
  RotateCcw,
  Save,
  Trash2,
} from 'lucide-react';
import { challenges, quizQuestions, topics } from './content';
import {
  deleteNote,
  getNotes,
  getProgress,
  getQuizAttempts,
  resetLocalProgress,
  saveNote,
  setProgress,
  submitQuizAttempt,
  type Note,
  type ProgressMap,
  type ProgressStatus,
  type QuizAttempt,
} from './storage';

type View = 'learn' | 'quiz' | 'challenges' | 'progress';

const views: { id: View; label: string }[] = [
  { id: 'learn', label: 'Learn' },
  { id: 'quiz', label: 'Quiz' },
  { id: 'challenges', label: 'Challenges' },
  { id: 'progress', label: 'Progress' },
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
}

export function App() {
  const [activeView, setActiveView] = useState<View>('learn');
  const [activeTopicId, setActiveTopicId] = useState(topics[0].id);
  const [activeChallengeId, setActiveChallengeId] = useState(challenges[0].id);
  const [progress, setProgressState] = useState<ProgressMap>(() => getProgress());
  const [notes, setNotes] = useState<Note[]>(() => getNotes());
  const [attempts, setAttempts] = useState<QuizAttempt[]>(() => getQuizAttempts());
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [latestAttempt, setLatestAttempt] = useState<QuizAttempt | null>(null);
  const [noteDraft, setNoteDraft] = useState('');

  const activeTopic = topics.find((topic) => topic.id === activeTopicId) ?? topics[0];
  const activeChallenge = challenges.find((challenge) => challenge.id === activeChallengeId) ?? challenges[0];
  const completedCount = topics.filter((topic) => progress[topic.id] === 'completed').length;
  const averageScore =
    attempts.length === 0
      ? 0
      : Math.round((attempts.reduce((total, attempt) => total + attempt.score / attempt.total, 0) / attempts.length) * 100);

  function updateProgress(topicId: string, status: ProgressStatus) {
    setProgressState(setProgress(topicId, status));
  }

  function handleSaveNote(targetId: string, targetType: Note['targetType']) {
    if (!noteDraft.trim()) {
      return;
    }

    const note = saveNote({ targetId, targetType, body: noteDraft });
    setNotes((currentNotes) => [note, ...currentNotes]);
    setNoteDraft('');
  }

  function handleDeleteNote(id: string) {
    deleteNote(id);
    setNotes((currentNotes) => currentNotes.filter((note) => note.id !== id));
  }

  function handleSubmitQuiz() {
    if (Object.keys(quizAnswers).length !== quizQuestions.length) {
      return;
    }

    const attempt = submitQuizAttempt(quizAnswers);
    setAttempts((currentAttempts) => [attempt, ...currentAttempts]);
    setLatestAttempt(attempt);
  }

  function handleReset() {
    resetLocalProgress();
    setNotes([]);
    setAttempts([]);
    setProgressState({});
    setQuizAnswers({});
    setLatestAttempt(null);
    setNoteDraft('');
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-mark">
            <GraduationCap aria-hidden="true" size={24} />
          </div>
          <div>
            <p className="eyebrow">Local-first study tool</p>
            <h1>My Learning Playground</h1>
          </div>
        </div>

        <nav className="nav-list" aria-label="Primary">
          {views.map((view) => (
            <button
              className={activeView === view.id ? 'nav-item active' : 'nav-item'}
              key={view.id}
              onClick={() => setActiveView(view.id)}
              type="button"
            >
              {view.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-summary">
          <span>{completedCount} of {topics.length} topics complete</span>
          <strong>{attempts.length} quiz attempts</strong>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Interview fundamentals</p>
            <h2>{views.find((view) => view.id === activeView)?.label}</h2>
          </div>
          <button className="icon-button" onClick={handleReset} title="Reset local data" type="button">
            <RotateCcw aria-hidden="true" size={18} />
          </button>
        </header>

        {activeView === 'learn' && (
          <section className="two-column">
            <div className="panel-list">
              {topics.map((topic) => (
                <button
                  className={activeTopic.id === topic.id ? 'list-card active' : 'list-card'}
                  key={topic.id}
                  onClick={() => setActiveTopicId(topic.id)}
                  type="button"
                >
                  <span>{topic.category}</span>
                  <strong>{topic.title}</strong>
                  <small>{topic.summary}</small>
                </button>
              ))}
            </div>

            <article className="detail-panel">
              <div className="detail-heading">
                <BookOpen aria-hidden="true" size={22} />
                <div>
                  <p className="eyebrow">{activeTopic.category}</p>
                  <h3>{activeTopic.title}</h3>
                </div>
              </div>
              <p>{activeTopic.lesson}</p>
              <div className="callout">
                <strong>Checkpoint</strong>
                <span>{activeTopic.checkpoint}</span>
              </div>
              <div className="status-row">
                {(['not_started', 'in_progress', 'completed'] as ProgressStatus[]).map((status) => (
                  <button
                    className={progress[activeTopic.id] === status ? 'status active' : 'status'}
                    key={status}
                    onClick={() => updateProgress(activeTopic.id, status)}
                    type="button"
                  >
                    {status.replace('_', ' ')}
                  </button>
                ))}
              </div>
              <NoteComposer
                buttonLabel="Save topic note"
                draft={noteDraft}
                onChange={setNoteDraft}
                onSave={() => handleSaveNote(activeTopic.id, 'topic')}
              />
            </article>
          </section>
        )}

        {activeView === 'quiz' && (
          <section className="quiz-panel">
            {quizQuestions.map((question, index) => (
              <fieldset className="question-card" key={question.id}>
                <legend>{index + 1}. {question.prompt}</legend>
                <div className="choice-grid">
                  {question.choices.map((choice) => (
                    <label className="choice" key={choice}>
                      <input
                        checked={quizAnswers[question.id] === choice}
                        name={question.id}
                        onChange={() => setQuizAnswers({ ...quizAnswers, [question.id]: choice })}
                        type="radio"
                      />
                      <span>{choice}</span>
                    </label>
                  ))}
                </div>
                {latestAttempt && (
                  <p className={latestAttempt.answers[question.id] === question.answer ? 'answer correct' : 'answer'}>
                    {question.explanation}
                  </p>
                )}
              </fieldset>
            ))}
            <div className="action-row">
              <button
                className="primary-button"
                disabled={Object.keys(quizAnswers).length !== quizQuestions.length}
                onClick={handleSubmitQuiz}
                type="button"
              >
                <CheckCircle2 aria-hidden="true" size={18} />
                Submit quiz
              </button>
              {latestAttempt && <strong>{latestAttempt.score}/{latestAttempt.total} correct</strong>}
            </div>
          </section>
        )}

        {activeView === 'challenges' && (
          <section className="two-column">
            <div className="panel-list">
              {challenges.map((challenge) => (
                <button
                  className={activeChallenge.id === challenge.id ? 'list-card active' : 'list-card'}
                  key={challenge.id}
                  onClick={() => setActiveChallengeId(challenge.id)}
                  type="button"
                >
                  <span>{challenge.type} / {challenge.difficulty}</span>
                  <strong>{challenge.title}</strong>
                  <small>{challenge.prompt}</small>
                </button>
              ))}
            </div>

            <article className="detail-panel">
              <div className="detail-heading">
                {activeChallenge.type === 'Design' ? <Layers3 aria-hidden="true" size={22} /> : <Code2 aria-hidden="true" size={22} />}
                <div>
                  <p className="eyebrow">{activeChallenge.type} challenge</p>
                  <h3>{activeChallenge.title}</h3>
                </div>
              </div>
              <p>{activeChallenge.prompt}</p>
              <ul className="checklist">
                {activeChallenge.checklist.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <NoteComposer
                buttonLabel="Save challenge response"
                draft={noteDraft}
                onChange={setNoteDraft}
                onSave={() => handleSaveNote(activeChallenge.id, 'challenge')}
              />
            </article>
          </section>
        )}

        {activeView === 'progress' && (
          <section className="progress-grid">
            <div className="metric">
              <ClipboardList aria-hidden="true" size={21} />
              <span>Completion</span>
              <strong>{completedCount}/{topics.length}</strong>
            </div>
            <div className="metric">
              <CheckCircle2 aria-hidden="true" size={21} />
              <span>Average quiz score</span>
              <strong>{averageScore}%</strong>
            </div>
            <section className="history-panel">
              <h3>Quiz history</h3>
              {attempts.length === 0 ? (
                <p className="muted">No quiz attempts yet.</p>
              ) : (
                attempts.map((attempt) => (
                  <div className="history-row" key={attempt.id}>
                    <span>{formatDate(attempt.createdAt)}</span>
                    <strong>{attempt.score}/{attempt.total}</strong>
                  </div>
                ))
              )}
            </section>
            <section className="history-panel">
              <h3>Saved notes</h3>
              {notes.length === 0 ? (
                <p className="muted">No notes saved yet.</p>
              ) : (
                notes.map((note) => (
                  <article className="note-card" key={note.id}>
                    <p>{note.body}</p>
                    <div>
                      <span>{note.targetType} / {formatDate(note.createdAt)}</span>
                      <button className="text-button" onClick={() => handleDeleteNote(note.id)} type="button">
                        <Trash2 aria-hidden="true" size={15} />
                        Delete
                      </button>
                    </div>
                  </article>
                ))
              )}
            </section>
          </section>
        )}
      </section>
    </main>
  );
}

type NoteComposerProps = {
  buttonLabel: string;
  draft: string;
  onChange: (value: string) => void;
  onSave: () => void;
};

function NoteComposer({ buttonLabel, draft, onChange, onSave }: NoteComposerProps) {
  return (
    <div className="note-composer">
      <textarea
        onChange={(event) => onChange(event.target.value)}
        placeholder="Write the rough version of your thinking here."
        rows={5}
        value={draft}
      />
      <button className="primary-button" disabled={!draft.trim()} onClick={onSave} type="button">
        <Save aria-hidden="true" size={18} />
        {buttonLabel}
      </button>
    </div>
  );
}
