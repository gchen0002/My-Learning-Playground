import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  BookOpen,
  CheckCircle2,
  ClipboardList,
  Code2,
  Download,
  FileUp,
  GraduationCap,
  Layers3,
  Play,
  RotateCcw,
  Save,
  Trash2,
} from 'lucide-react';
import { challenges, exercises, quizQuestions, topics, type Challenge, type Difficulty, type Exercise, type LearningCategory } from './content';
import {
  createMockInterviewPrompt,
  deleteExerciseResponse,
  deleteNote,
  exportLocalData,
  filterExercises,
  getChallengesForTopic,
  getChecklistScore,
  getExercisesForTopic,
  getExerciseResponses,
  getMockInterviewAttempts,
  getNotes,
  getProgress,
  getQuestionsForTopic,
  getQuizAttempts,
  importLocalData,
  resetLocalProgress,
  saveExerciseResponse,
  saveMockInterviewAttempt,
  saveNote,
  setProgress,
  submitQuizAttempt,
  type ChecklistResult,
  type DesignResponseSections,
  type ExerciseResponse,
  type LocalDataExport,
  type MockInterviewAttempt,
  type Note,
  type ProgressMap,
  type ProgressStatus,
  type QuizAttempt,
} from './services';

type View = 'learn' | 'quiz' | 'exercises' | 'design' | 'mock' | 'progress';

const views: { id: View; label: string }[] = [
  { id: 'learn', label: 'Learn' },
  { id: 'quiz', label: 'Quiz' },
  { id: 'exercises', label: 'Exercises' },
  { id: 'design', label: 'Design Mode' },
  { id: 'mock', label: 'Mock Interview' },
  { id: 'progress', label: 'Progress' },
];

const colorModeKey = 'mlp.colorMode';

type ColorMode = 'light' | 'dark';

const emptyExerciseSections: ExerciseResponse['sections'] = {
  requirements: '',
  entityModel: '',
  operations: '',
  validation: '',
  edgeCases: '',
  tradeoffs: '',
};

const emptyDesignSections: DesignResponseSections = {
  functionalRequirements: '',
  nonFunctionalRequirements: '',
  coreEntities: '',
  apiOperations: '',
  dataFlow: '',
  bottlenecks: '',
  tradeoffs: '',
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
}

function refreshLocalState() {
  return {
    notes: getNotes(),
    progress: getProgress(),
    attempts: getQuizAttempts(),
    exerciseResponses: getExerciseResponses(),
    mockAttempts: getMockInterviewAttempts(),
  };
}

export function App() {
  const [colorMode, setColorMode] = useState<ColorMode>(() => {
    return window.localStorage.getItem(colorModeKey) === 'light' ? 'light' : 'dark';
  });
  const [activeView, setActiveView] = useState<View>('learn');
  const [activeTopicId, setActiveTopicId] = useState(topics[0].id);
  const [activeExerciseId, setActiveExerciseId] = useState(exercises[0].id);
  const [activeChallengeId, setActiveChallengeId] = useState(challenges[0].id);
  const [categoryFilter, setCategoryFilter] = useState<LearningCategory | 'All'>('All');
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | 'All'>('All');
  const [progress, setProgressState] = useState<ProgressMap>(() => getProgress());
  const [notes, setNotes] = useState<Note[]>(() => getNotes());
  const [attempts, setAttempts] = useState<QuizAttempt[]>(() => getQuizAttempts());
  const [exerciseResponses, setExerciseResponses] = useState<ExerciseResponse[]>(() => getExerciseResponses());
  const [mockAttempts, setMockAttempts] = useState<MockInterviewAttempt[]>(() => getMockInterviewAttempts());
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [latestAttempt, setLatestAttempt] = useState<QuizAttempt | null>(null);
  const [quizTopicId, setQuizTopicId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState('');
  const [exerciseSections, setExerciseSections] = useState(emptyExerciseSections);
  const [exerciseChecklist, setExerciseChecklist] = useState<ChecklistResult>({});
  const [designSections, setDesignSections] = useState(emptyDesignSections);
  const [mockPrompt, setMockPrompt] = useState(() => createMockInterviewPrompt());
  const [mockNotes, setMockNotes] = useState('');
  const [importMessage, setImportMessage] = useState('');

  const activeTopic = topics.find((topic) => topic.id === activeTopicId) ?? topics[0];
  const activeExercise = exercises.find((exercise) => exercise.id === activeExerciseId) ?? exercises[0];
  const activeChallenge = challenges.find((challenge) => challenge.id === activeChallengeId) ?? challenges[0];
  const filteredExercises = useMemo(() => filterExercises(categoryFilter, difficultyFilter), [categoryFilter, difficultyFilter]);
  const completedCount = topics.filter((topic) => progress[topic.id] === 'completed').length;
  const averageScore =
    attempts.length === 0
      ? 0
      : Math.round((attempts.reduce((total, attempt) => total + attempt.score / attempt.total, 0) / attempts.length) * 100);
  const savedExerciseResponse = exerciseResponses.find((response) => response.exerciseId === activeExercise.id);
  const activeTopicQuestions = getQuestionsForTopic(activeTopic.id);
  const activeTopicExercises = getExercisesForTopic(activeTopic.id);
  const activeTopicChallenges = getChallengesForTopic(activeTopic.id);
  const quizQuestionsToShow = quizTopicId ? getQuestionsForTopic(quizTopicId) : quizQuestions;
  const quizTopic = quizTopicId ? topics.find((topic) => topic.id === quizTopicId) : null;

  useEffect(() => {
    document.documentElement.dataset.mode = colorMode;
    window.localStorage.setItem(colorModeKey, colorMode);
  }, [colorMode]);

  function syncState() {
    const nextState = refreshLocalState();
    setNotes(nextState.notes);
    setProgressState(nextState.progress);
    setAttempts(nextState.attempts);
    setExerciseResponses(nextState.exerciseResponses);
    setMockAttempts(nextState.mockAttempts);
  }

  function updateProgress(topicId: string, status: ProgressStatus) {
    setProgressState(setProgress(topicId, status));
  }

  function handleSaveNote(targetId: string, targetType: Note['targetType']) {
    if (!noteDraft.trim()) {
      return;
    }

    saveNote({ targetId, targetType, body: noteDraft });
    setNoteDraft('');
    setNotes(getNotes());
  }

  function handleDeleteNote(id: string) {
    deleteNote(id);
    setNotes(getNotes());
  }

  function handleSubmitQuiz() {
    if (Object.keys(quizAnswers).length !== quizQuestionsToShow.length) {
      return;
    }

    const attempt = submitQuizAttempt(quizAnswers, quizQuestionsToShow);
    setAttempts(getQuizAttempts());
    setLatestAttempt(attempt);
  }

  function handleLaunchTopicQuiz(topicId: string) {
    setQuizTopicId(topicId);
    setQuizAnswers({});
    setLatestAttempt(null);
    setActiveView('quiz');
  }

  function handleClearTopicQuiz() {
    setQuizTopicId(null);
    setQuizAnswers({});
    setLatestAttempt(null);
  }

  function handleSelectExercise(id: string) {
    const response = exerciseResponses.find((item) => item.exerciseId === id);
    setActiveExerciseId(id);
    setExerciseSections(response?.sections ?? emptyExerciseSections);
    setExerciseChecklist(response?.checklist ?? {});
  }

  function handleLaunchExercise(id: string) {
    setCategoryFilter('All');
    setDifficultyFilter('All');
    handleSelectExercise(id);
    setActiveView('exercises');
  }

  function handleLaunchChallenge(id: string) {
    setActiveChallengeId(id);
    setActiveView('design');
  }

  function handleSaveExerciseResponse() {
    saveExerciseResponse({
      exerciseId: activeExercise.id,
      sections: exerciseSections,
      checklist: exerciseChecklist,
    });
    setExerciseResponses(getExerciseResponses());
  }

  function handleSaveDesignResponse() {
    const body = Object.entries(designSections)
      .map(([key, value]) => `${key}: ${value || 'Not answered yet.'}`)
      .join('\n\n');
    saveNote({ targetId: activeChallenge.id, targetType: 'challenge', body });
    setNotes(getNotes());
  }

  function handleSaveMockAttempt() {
    const attempt = saveMockInterviewAttempt({
      javascriptQuestionId: mockPrompt.javascriptQuestion.id,
      crudExerciseId: mockPrompt.crudExercise.id,
      designChallengeId: mockPrompt.designChallenge.id,
      notes: mockNotes,
    });
    setMockAttempts(getMockInterviewAttempts());
    setMockNotes('');
    setMockPrompt(createMockInterviewPrompt());
    return attempt;
  }

  function handleExport() {
    const blob = new Blob([JSON.stringify(exportLocalData(), null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'my-learning-playground-export.json';
    link.click();
    URL.revokeObjectURL(url);
  }

  async function handleImport(file: File | undefined) {
    if (!file) {
      return;
    }

    try {
      const imported = JSON.parse(await file.text()) as LocalDataExport;
      importLocalData(imported);
      syncState();
      setImportMessage('Imported local data successfully.');
    } catch (error) {
      setImportMessage(error instanceof Error ? error.message : 'Import failed.');
    }
  }

  function handleReset() {
    resetLocalProgress();
    syncState();
    setQuizAnswers({});
    setLatestAttempt(null);
    setNoteDraft('');
    setExerciseSections(emptyExerciseSections);
    setExerciseChecklist({});
    setDesignSections(emptyDesignSections);
    setMockNotes('');
    setImportMessage('');
  }

  return (
    <main className={`app-shell mode-${colorMode}`}>
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-mark">
            <GraduationCap aria-hidden="true" size={24} />
          </div>
          <div>
            <p className="eyebrow">Interview prep topics</p>
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
          <span>{completedCount} of {topics.length} lessons complete</span>
          <strong>{exerciseResponses.length} exercise responses</strong>
          <small>{attempts.length} quiz attempts / {mockAttempts.length} mock interviews</small>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">JavaScript, CRUD, simple system design</p>
            <h2>{views.find((view) => view.id === activeView)?.label}</h2>
          </div>
          <div className="toolbar">
            <div className="mode-switch" aria-label="Color mode">
              <button className={colorMode === 'light' ? 'active' : ''} onClick={() => setColorMode('light')} type="button">
                Light
              </button>
              <button className={colorMode === 'dark' ? 'active' : ''} onClick={() => setColorMode('dark')} type="button">
                Dark
              </button>
            </div>
            <button className="icon-button" onClick={handleExport} title="Export local data" type="button">
              <Download aria-hidden="true" size={18} />
            </button>
            <label className="icon-button file-button" title="Import local data">
              <FileUp aria-hidden="true" size={18} />
              <input accept="application/json" onChange={(event) => void handleImport(event.target.files?.[0])} type="file" />
            </label>
            <button className="icon-button" onClick={handleReset} title="Reset local data" type="button">
              <RotateCcw aria-hidden="true" size={18} />
            </button>
          </div>
        </header>
        {importMessage && <p className="inline-message">{importMessage}</p>}

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
                  <span>Topic {topic.order} / {topic.category}</span>
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
              <section className="learning-section">
                <p className="section-label">Broad explanation</p>
                <p>{activeTopic.basicExplanation}</p>
              </section>
              <section className="learning-section">
                <p className="section-label">More specific</p>
                <p>{activeTopic.lesson}</p>
                <ul className="deep-dive-list">
                  {activeTopic.deepDive.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
              <section className="mental-grid">
                {Object.entries(activeTopic.mentalModel).map(([label, value]) => (
                  <div className="mini-panel" key={label}>
                    <strong>{label.replace(/([A-Z])/g, ' $1')}</strong>
                    <span>{value}</span>
                  </div>
                ))}
              </section>
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
              <RelatedPractice
                challenges={activeTopicChallenges}
                exercises={activeTopicExercises}
                onOpenChallenge={handleLaunchChallenge}
                onOpenExercise={handleLaunchExercise}
                onOpenQuiz={() => handleLaunchTopicQuiz(activeTopic.id)}
                questionCount={activeTopicQuestions.length}
              />
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
            {quizTopic && (
              <div className="topic-filter-banner">
                <div>
                  <span>Topic quiz</span>
                  <strong>{quizTopic.title}</strong>
                </div>
                <button className="secondary-button" onClick={handleClearTopicQuiz} type="button">
                  Clear topic filter
                </button>
              </div>
            )}
            {quizQuestionsToShow.map((question, index) => (
              <fieldset className="question-card" key={question.id}>
                <legend>{index + 1}. {question.prompt}</legend>
                <p className="tagline">{question.category}</p>
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
                disabled={Object.keys(quizAnswers).length !== quizQuestionsToShow.length}
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

        {activeView === 'exercises' && (
          <section className="two-column">
            <div className="panel-list">
              <div className="filter-row">
                <select onChange={(event) => setCategoryFilter(event.target.value as LearningCategory | 'All')} value={categoryFilter}>
                  <option>All</option>
                  <option>JavaScript</option>
                  <option>CRUD</option>
                  <option>Implementation</option>
                  <option>System Design</option>
                </select>
                <select onChange={(event) => setDifficultyFilter(event.target.value as Difficulty | 'All')} value={difficultyFilter}>
                  <option>All</option>
                  <option>Starter</option>
                  <option>Core</option>
                  <option>Stretch</option>
                </select>
              </div>
              {filteredExercises.map((exercise) => (
                <button
                  className={activeExercise.id === exercise.id ? 'list-card active' : 'list-card'}
                  key={exercise.id}
                  onClick={() => handleSelectExercise(exercise.id)}
                  type="button"
                >
                  <span>{exercise.category} / {exercise.difficulty}</span>
                  <strong>{exercise.title}</strong>
                  <small>{exercise.prompt}</small>
                </button>
              ))}
            </div>
            <article className="detail-panel">
              <div className="detail-heading">
                <Code2 aria-hidden="true" size={22} />
                <div>
                  <p className="eyebrow">{activeExercise.category} exercise</p>
                  <h3>{activeExercise.title}</h3>
                </div>
              </div>
              <p>{activeExercise.prompt}</p>
              <InfoColumns hints={activeExercise.starterHints} concepts={activeExercise.expectedConcepts} edgeCases={activeExercise.edgeCases} />
              <StructuredExerciseForm
                checklist={exerciseChecklist}
                concepts={activeExercise.expectedConcepts}
                onChecklistChange={setExerciseChecklist}
                onSectionsChange={setExerciseSections}
                sections={exerciseSections}
              />
              <div className="action-row">
                <button className="primary-button" onClick={handleSaveExerciseResponse} type="button">
                  <Save aria-hidden="true" size={18} />
                  Save response
                </button>
                <strong>{getChecklistScore(exerciseChecklist)}% checklist score</strong>
                {savedExerciseResponse && (
                  <button className="text-button" onClick={() => {
                    deleteExerciseResponse(savedExerciseResponse.id);
                    setExerciseResponses(getExerciseResponses());
                  }} type="button">
                    <Trash2 aria-hidden="true" size={15} />
                    Delete saved response
                  </button>
                )}
              </div>
            </article>
          </section>
        )}

        {activeView === 'design' && (
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
                <Layers3 aria-hidden="true" size={22} />
                <div>
                  <p className="eyebrow">System design prompt</p>
                  <h3>{activeChallenge.title}</h3>
                </div>
              </div>
              <p>{activeChallenge.prompt}</p>
              <ul className="checklist">
                {activeChallenge.checklist.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              {activeChallenge.comparisonPrompt && <div className="callout"><strong>Local to multi-user</strong><span>{activeChallenge.comparisonPrompt}</span></div>}
              <StructuredDesignForm onChange={setDesignSections} sections={designSections} />
              <button className="primary-button" onClick={handleSaveDesignResponse} type="button">
                <Save aria-hidden="true" size={18} />
                Save design response
              </button>
            </article>
          </section>
        )}

        {activeView === 'mock' && (
          <section className="detail-panel">
            <div className="detail-heading">
              <Play aria-hidden="true" size={22} />
              <div>
                <p className="eyebrow">30-45 minute practice set</p>
                <h3>Mock Interview</h3>
              </div>
            </div>
            <div className="mock-grid">
              <PromptCard title="JavaScript concept" body={mockPrompt.javascriptQuestion.prompt} meta={mockPrompt.javascriptQuestion.category} />
              <PromptCard title="CRUD implementation" body={mockPrompt.crudExercise.prompt} meta={mockPrompt.crudExercise.difficulty} />
              <PromptCard title="Simple system design" body={mockPrompt.designChallenge.prompt} meta={mockPrompt.designChallenge.difficulty} />
            </div>
            <textarea
              onChange={(event) => setMockNotes(event.target.value)}
              placeholder="Track how you explained the prompt, what got stuck, and what to review next."
              rows={7}
              value={mockNotes}
            />
            <div className="action-row">
              <button className="primary-button" disabled={!mockNotes.trim()} onClick={handleSaveMockAttempt} type="button">
                <Save aria-hidden="true" size={18} />
                Save mock attempt
              </button>
              <button className="secondary-button" onClick={() => setMockPrompt(createMockInterviewPrompt())} type="button">
                New prompt set
              </button>
            </div>
          </section>
        )}

        {activeView === 'progress' && (
          <section className="progress-grid">
            <Metric icon={<ClipboardList aria-hidden="true" size={21} />} label="Lessons complete" value={`${completedCount}/${topics.length}`} />
            <Metric icon={<CheckCircle2 aria-hidden="true" size={21} />} label="Average quiz score" value={`${averageScore}%`} />
            <Metric icon={<Code2 aria-hidden="true" size={21} />} label="Exercise responses" value={String(exerciseResponses.length)} />
            <Metric icon={<Play aria-hidden="true" size={21} />} label="Mock interviews" value={String(mockAttempts.length)} />
            <HistoryPanel title="Quiz history" empty="No quiz attempts yet.">
              {attempts.map((attempt) => (
                <div className="history-row" key={attempt.id}>
                  <span>{formatDate(attempt.createdAt)}</span>
                  <strong>{attempt.score}/{attempt.total}</strong>
                </div>
              ))}
            </HistoryPanel>
            <HistoryPanel title="Saved notes" empty="No notes saved yet.">
              {notes.map((note) => (
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
              ))}
            </HistoryPanel>
            <HistoryPanel title="Exercise responses" empty="No exercise responses yet.">
              {exerciseResponses.map((response) => (
                <div className="history-row" key={response.id}>
                  <span>{exercises.find((exercise) => exercise.id === response.exerciseId)?.title ?? response.exerciseId}</span>
                  <strong>{getChecklistScore(response.checklist)}%</strong>
                </div>
              ))}
            </HistoryPanel>
            <HistoryPanel title="Mock interview history" empty="No mock interviews saved yet.">
              {mockAttempts.map((attempt) => (
                <div className="history-row" key={attempt.id}>
                  <span>{formatDate(attempt.createdAt)}</span>
                  <strong>{attempt.notes.length} chars</strong>
                </div>
              ))}
            </HistoryPanel>
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

function RelatedPractice({
  challenges,
  exercises,
  onOpenChallenge,
  onOpenExercise,
  onOpenQuiz,
  questionCount,
}: {
  challenges: Challenge[];
  exercises: Exercise[];
  onOpenChallenge: (id: string) => void;
  onOpenExercise: (id: string) => void;
  onOpenQuiz: () => void;
  questionCount: number;
}) {
  if (questionCount === 0 && exercises.length === 0 && challenges.length === 0) {
    return null;
  }

  return (
    <section className="related-practice">
      <div>
        <p className="section-label">Practice this topic</p>
        <h4>Jump into the matching quiz, exercises, and design prompts.</h4>
      </div>
      {questionCount > 0 && (
        <button className="practice-link primary-practice" onClick={onOpenQuiz} type="button">
          <span>{questionCount} question{questionCount === 1 ? '' : 's'}</span>
          <strong>Start topic quiz</strong>
        </button>
      )}
      {exercises.length > 0 && (
        <div className="practice-group">
          <span>Exercises</span>
          {exercises.map((exercise) => (
            <button className="practice-link" key={exercise.id} onClick={() => onOpenExercise(exercise.id)} type="button">
              <span>{exercise.difficulty}</span>
              <strong>{exercise.title}</strong>
            </button>
          ))}
        </div>
      )}
      {challenges.length > 0 && (
        <div className="practice-group">
          <span>Design prompts</span>
          {challenges.map((challenge) => (
            <button className="practice-link" key={challenge.id} onClick={() => onOpenChallenge(challenge.id)} type="button">
              <span>{challenge.difficulty}</span>
              <strong>{challenge.title}</strong>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

function InfoColumns({ hints, concepts, edgeCases }: { hints: string[]; concepts: string[]; edgeCases: string[] }) {
  return (
    <section className="info-columns">
      <MiniList title="Starter hints" items={hints} />
      <MiniList title="Expected concepts" items={concepts} />
      <MiniList title="Edge cases" items={edgeCases} />
    </section>
  );
}

function MiniList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mini-panel">
      <strong>{title}</strong>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function StructuredExerciseForm({
  checklist,
  concepts,
  onChecklistChange,
  onSectionsChange,
  sections,
}: {
  checklist: ChecklistResult;
  concepts: string[];
  onChecklistChange: (checklist: ChecklistResult) => void;
  onSectionsChange: (sections: ExerciseResponse['sections']) => void;
  sections: ExerciseResponse['sections'];
}) {
  return (
    <section className="structured-form">
      {Object.entries(sections).map(([key, value]) => (
        <label key={key}>
          <span>{key.replace(/([A-Z])/g, ' $1')}</span>
          <textarea
            onChange={(event) => onSectionsChange({ ...sections, [key as keyof ExerciseResponse['sections']]: event.target.value })}
            rows={3}
            value={value}
          />
        </label>
      ))}
      <div className="checklist-box">
        {concepts.map((concept) => (
          <label className="check-row" key={concept}>
            <input
              checked={Boolean(checklist[concept])}
              onChange={(event) => onChecklistChange({ ...checklist, [concept]: event.target.checked })}
              type="checkbox"
            />
            <span>{concept}</span>
          </label>
        ))}
      </div>
    </section>
  );
}

function StructuredDesignForm({
  onChange,
  sections,
}: {
  onChange: (sections: DesignResponseSections) => void;
  sections: DesignResponseSections;
}) {
  return (
    <section className="structured-form">
      {Object.entries(sections).map(([key, value]) => (
        <label key={key}>
          <span>{key.replace(/([A-Z])/g, ' $1')}</span>
          <textarea onChange={(event) => onChange({ ...sections, [key as keyof DesignResponseSections]: event.target.value })} rows={3} value={value} />
        </label>
      ))}
    </section>
  );
}

function PromptCard({ title, body, meta }: { title: string; body: string; meta: string }) {
  return (
    <article className="prompt-card">
      <span>{meta}</span>
      <strong>{title}</strong>
      <p>{body}</p>
    </article>
  );
}

function Metric({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="metric">
      {icon}
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function HistoryPanel({ children, empty, title }: { children: ReactNode[]; empty: string; title: string }) {
  return (
    <section className="history-panel">
      <h3>{title}</h3>
      {children.length === 0 ? <p className="muted">{empty}</p> : children}
    </section>
  );
}
