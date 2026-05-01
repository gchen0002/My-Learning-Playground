import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  Bookmark,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  Code2,
  Download,
  FileUp,
  GraduationCap,
  House,
  Layers3,
  ListTodo,
  NotebookPen,
  Play,
  RotateCcw,
  Save,
  Settings2,
  Trash2,
} from 'lucide-react';
import {
  challenges,
  codeDrills,
  exercises,
  quizQuestions,
  topics,
  type Challenge,
  type CodeDrill,
  type DesignAnswerSections,
  type Difficulty,
  type Exercise,
  type ExerciseAnswerSections,
  type LearningCategory,
} from './content';
import {
  createMockInterviewPrompt,
  deleteDrillAttempt,
  deleteExerciseResponse,
  deleteNote,
  exportLocalData,
  filterDrills,
  filterExercises,
  getChallengesForTopic,
  getDrillAttempts,
  getDrillsForTopic,
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
  saveDrillAttempt,
  saveMockInterviewAttempt,
  saveNote,
  setProgress,
  submitQuizAttempt,
  type ChecklistResult,
  type DesignResponseSections,
  type DrillAttempt,
  type ExerciseResponse,
  type LocalDataExport,
  type MockInterviewAttempt,
  type Note,
  type ProgressMap,
  type ProgressStatus,
  type QuizAttempt,
} from './services';

type View = 'learn' | 'quiz' | 'drills' | 'exercises' | 'design' | 'mock' | 'progress';
type LearnScreen = 'home' | 'topic';
type LearnTab = 'overview' | 'breakdown' | 'mental' | 'practice';
type ProgressTab = 'overview' | 'history';
type RouteState = {
  activeView: View;
  learnScreen: LearnScreen;
  progressTab: ProgressTab;
  activeTopicId: string;
  activeDrillId: string;
  activeExerciseId: string;
  activeChallengeId: string;
  quizTopicId: string | null;
};

const views: { id: View; label: string }[] = [
  { id: 'learn', label: 'Learn' },
  { id: 'quiz', label: 'Quiz' },
  { id: 'drills', label: 'Code Drills' },
  { id: 'exercises', label: 'Exercises' },
  { id: 'design', label: 'Design Mode' },
  { id: 'mock', label: 'Mock Interview' },
  { id: 'progress', label: 'Progress' },
];

const viewDescriptions: Record<View, string> = {
  learn: 'Read the lesson, build the mental model, and jump into matching practice.',
  quiz: 'Check understanding with short questions and quick feedback.',
  drills: 'Practice implementation thinking with focused JavaScript drills.',
  exercises: 'Write structured responses for CRUD and system design prompts.',
  design: 'Break a system down into requirements, entities, APIs, and tradeoffs.',
  mock: 'Run a calm practice set that mixes concept, CRUD, and design thinking.',
  progress: 'Review your saved work, history, and what to revisit next.',
};

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

const emptyDrillAttempt = {
  code: '',
  notes: '',
  confidence: 'Medium' as DrillAttempt['confidence'],
  completed: false,
};

function getEmptyDrillDraft(drill: CodeDrill = codeDrills[0]) {
  return {
    ...emptyDrillAttempt,
    code: drill.starterCode,
  };
}

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
    drillAttempts: getDrillAttempts(),
    mockAttempts: getMockInterviewAttempts(),
  };
}

function getBasePath() {
  if (window.location.pathname.startsWith('/My-Learning-Playground')) {
    return '/My-Learning-Playground';
  }

  return window.location.hostname.endsWith('github.io') ? '/My-Learning-Playground' : '';
}

function normalizeRoutePath(pathname = window.location.pathname) {
  const basePath = getBasePath();
  const withoutBase = basePath && pathname.startsWith(basePath) ? pathname.slice(basePath.length) : pathname;
  const routePath = withoutBase.replace(/\/$/, '');
  return routePath || '/';
}

function routePathWithBase(routePath: string) {
  return `${getBasePath()}${routePath === '/' ? '' : routePath}` || '/';
}

function findValidId<T extends { id: string }>(items: T[], requestedId: string | undefined, fallbackId: string) {
  return requestedId && items.some((item) => item.id === requestedId) ? requestedId : fallbackId;
}

function parseRoute(pathname = window.location.pathname): RouteState {
  const [section, itemId, extra] = normalizeRoutePath(pathname).split('/').filter(Boolean);

  if (!section || section === 'learn') {
    const activeTopicId = findValidId(topics, section === 'learn' ? itemId : undefined, topics[0].id);
    return {
      activeView: 'learn',
      learnScreen: section === 'learn' && itemId ? 'topic' : 'home',
      progressTab: 'overview',
      activeTopicId,
      activeDrillId: codeDrills[0].id,
      activeExerciseId: exercises[0].id,
      activeChallengeId: challenges[0].id,
      quizTopicId: null,
    };
  }

  if (section === 'quiz') {
    const topicId = topics.some((topic) => topic.id === itemId) ? itemId : null;
    return {
      activeView: 'quiz',
      learnScreen: 'home',
      progressTab: 'overview',
      activeTopicId: topicId ?? topics[0].id,
      activeDrillId: codeDrills[0].id,
      activeExerciseId: exercises[0].id,
      activeChallengeId: challenges[0].id,
      quizTopicId: topicId,
    };
  }

  if (section === 'code-drills' || section === 'drills') {
    return {
      activeView: 'drills',
      learnScreen: 'home',
      progressTab: 'overview',
      activeTopicId: topics[0].id,
      activeDrillId: findValidId(codeDrills, itemId, codeDrills[0].id),
      activeExerciseId: exercises[0].id,
      activeChallengeId: challenges[0].id,
      quizTopicId: null,
    };
  }

  if (section === 'exercises') {
    return {
      activeView: 'exercises',
      learnScreen: 'home',
      progressTab: 'overview',
      activeTopicId: topics[0].id,
      activeDrillId: codeDrills[0].id,
      activeExerciseId: findValidId(exercises, itemId, exercises[0].id),
      activeChallengeId: challenges[0].id,
      quizTopicId: null,
    };
  }

  if (section === 'design') {
    return {
      activeView: 'design',
      learnScreen: 'home',
      progressTab: 'overview',
      activeTopicId: topics[0].id,
      activeDrillId: codeDrills[0].id,
      activeExerciseId: exercises[0].id,
      activeChallengeId: findValidId(challenges, itemId, challenges[0].id),
      quizTopicId: null,
    };
  }

  if (section === 'mock') {
    return {
      activeView: 'mock',
      learnScreen: 'home',
      progressTab: 'overview',
      activeTopicId: topics[0].id,
      activeDrillId: codeDrills[0].id,
      activeExerciseId: exercises[0].id,
      activeChallengeId: challenges[0].id,
      quizTopicId: null,
    };
  }

  if (section === 'progress') {
    return {
      activeView: 'progress',
      learnScreen: 'home',
      progressTab: itemId === 'history' || extra === 'history' ? 'history' : 'overview',
      activeTopicId: topics[0].id,
      activeDrillId: codeDrills[0].id,
      activeExerciseId: exercises[0].id,
      activeChallengeId: challenges[0].id,
      quizTopicId: null,
    };
  }

  return parseRoute('/');
}

function buildRoutePath({
  activeChallengeId,
  activeDrillId,
  activeExerciseId,
  activeTopicId,
  activeView,
  learnScreen,
  progressTab,
  quizTopicId,
}: RouteState) {
  if (activeView === 'learn') {
    return learnScreen === 'topic' ? `/learn/${activeTopicId}` : '/';
  }

  if (activeView === 'quiz') {
    return quizTopicId ? `/quiz/${quizTopicId}` : '/quiz';
  }

  if (activeView === 'drills') {
    return `/code-drills/${activeDrillId}`;
  }

  if (activeView === 'exercises') {
    return `/exercises/${activeExerciseId}`;
  }

  if (activeView === 'design') {
    return `/design/${activeChallengeId}`;
  }

  if (activeView === 'mock') {
    return '/mock';
  }

  return progressTab === 'history' ? '/progress/history' : '/progress';
}

export function App() {
  const initialRoute = parseRoute();
  const [colorMode, setColorMode] = useState<ColorMode>(() => {
    return window.localStorage.getItem(colorModeKey) === 'dark' ? 'dark' : 'light';
  });
  const [activeView, setActiveView] = useState<View>(initialRoute.activeView);
  const [learnScreen, setLearnScreen] = useState<LearnScreen>(initialRoute.learnScreen);
  const [learnTab, setLearnTab] = useState<LearnTab>('overview');
  const [progressTab, setProgressTab] = useState<ProgressTab>(initialRoute.progressTab);
  const [activeTopicId, setActiveTopicId] = useState(initialRoute.activeTopicId);
  const [activeDrillId, setActiveDrillId] = useState(initialRoute.activeDrillId);
  const [activeExerciseId, setActiveExerciseId] = useState(initialRoute.activeExerciseId);
  const [activeChallengeId, setActiveChallengeId] = useState(initialRoute.activeChallengeId);
  const [categoryFilter, setCategoryFilter] = useState<LearningCategory | 'All'>('All');
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | 'All'>('All');
  const [drillTopicFilter, setDrillTopicFilter] = useState<string | 'All'>('All');
  const [drillDifficultyFilter, setDrillDifficultyFilter] = useState<Difficulty | 'All'>('All');
  const [progress, setProgressState] = useState<ProgressMap>(() => getProgress());
  const [notes, setNotes] = useState<Note[]>(() => getNotes());
  const [attempts, setAttempts] = useState<QuizAttempt[]>(() => getQuizAttempts());
  const [exerciseResponses, setExerciseResponses] = useState<ExerciseResponse[]>(() => getExerciseResponses());
  const [drillAttempts, setDrillAttempts] = useState<DrillAttempt[]>(() => getDrillAttempts());
  const [mockAttempts, setMockAttempts] = useState<MockInterviewAttempt[]>(() => getMockInterviewAttempts());
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [latestAttempt, setLatestAttempt] = useState<QuizAttempt | null>(null);
  const [quizTopicId, setQuizTopicId] = useState<string | null>(initialRoute.quizTopicId);
  const [noteDraft, setNoteDraft] = useState('');
  const [exerciseSections, setExerciseSections] = useState(emptyExerciseSections);
  const [exerciseChecklist, setExerciseChecklist] = useState<ChecklistResult>({});
  const [showExerciseAnswer, setShowExerciseAnswer] = useState(false);
  const [drillDraft, setDrillDraft] = useState(() => {
    return getEmptyDrillDraft(codeDrills.find((drill) => drill.id === initialRoute.activeDrillId));
  });
  const [showDrillSolution, setShowDrillSolution] = useState(false);
  const [designSections, setDesignSections] = useState(emptyDesignSections);
  const [showDesignAnswer, setShowDesignAnswer] = useState(false);
  const [mockPrompt, setMockPrompt] = useState(() => createMockInterviewPrompt());
  const [mockNotes, setMockNotes] = useState('');
  const [showMockAnswers, setShowMockAnswers] = useState(false);
  const [importMessage, setImportMessage] = useState('');

  const activeTopic = topics.find((topic) => topic.id === activeTopicId) ?? topics[0];
  const activeDrill = codeDrills.find((drill) => drill.id === activeDrillId) ?? codeDrills[0];
  const activeExercise = exercises.find((exercise) => exercise.id === activeExerciseId) ?? exercises[0];
  const activeChallenge = challenges.find((challenge) => challenge.id === activeChallengeId) ?? challenges[0];
  const filteredExercises = useMemo(() => filterExercises(categoryFilter, difficultyFilter), [categoryFilter, difficultyFilter]);
  const filteredDrills = useMemo(() => filterDrills(drillTopicFilter, drillDifficultyFilter), [drillTopicFilter, drillDifficultyFilter]);
  const completedCount = topics.filter((topic) => progress[topic.id] === 'completed').length;
  const averageScore =
    attempts.length === 0
      ? 0
      : Math.round((attempts.reduce((total, attempt) => total + attempt.score / attempt.total, 0) / attempts.length) * 100);
  const savedExerciseResponse = exerciseResponses.find((response) => response.exerciseId === activeExercise.id);
  const savedDrillAttempt = drillAttempts.find((attempt) => attempt.drillId === activeDrill.id);
  const activeTopicQuestions = getQuestionsForTopic(activeTopic.id);
  const activeTopicDrills = getDrillsForTopic(activeTopic.id);
  const activeTopicExercises = getExercisesForTopic(activeTopic.id);
  const activeTopicChallenges = getChallengesForTopic(activeTopic.id);
  const quizQuestionsToShow = quizTopicId ? getQuestionsForTopic(quizTopicId) : quizQuestions;
  const quizTopic = quizTopicId ? topics.find((topic) => topic.id === quizTopicId) : null;
  const activeViewMeta = views.find((view) => view.id === activeView) ?? views[0];
  const currentTopicProgress = progress[activeTopic.id] ?? 'not_started';
  const practiceViews: View[] = ['quiz', 'drills', 'exercises', 'design', 'mock'];
  const isPracticeView = practiceViews.includes(activeView);
  const primaryNav = isPracticeView ? 'practice' : activeView;
  const topicGroups = useMemo(() => {
    const grouped = new Map<LearningCategory, { category: LearningCategory; title: string; count: number }>();

    topics.forEach((topic) => {
      const existing = grouped.get(topic.category);
      grouped.set(topic.category, {
        category: topic.category,
        title:
          topic.category === 'JavaScript'
            ? 'JavaScript Essentials'
            : topic.category === 'CRUD'
              ? 'CRUD Flow'
              : topic.category === 'Implementation'
                ? 'Implementation Design'
                : 'System Design',
        count: (existing?.count ?? 0) + 1,
      });
    });

    return [...grouped.values()];
  }, []);

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
    setDrillAttempts(nextState.drillAttempts);
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

  function handleOpenLearnHome() {
    setActiveView('learn');
    setLearnScreen('home');
  }

  function handleOpenTopic(topicId: string) {
    setActiveTopicId(topicId);
    setActiveView('learn');
    setLearnScreen('topic');
    setLearnTab('overview');
  }

  function handleOpenPrimaryNav(target: 'learn' | 'practice' | 'progress') {
    if (target === 'learn') {
      handleOpenLearnHome();
      return;
    }

    if (target === 'practice') {
      setActiveView('drills');
      return;
    }

    setActiveView('progress');
    setProgressTab('overview');
  }

  function handleSelectDrill(id: string) {
    const attempt = drillAttempts.find((item) => item.drillId === id);
    const drill = codeDrills.find((item) => item.id === id) ?? codeDrills[0];
    setActiveDrillId(id);
    setDrillDraft({
      code: attempt?.code ?? drill.starterCode,
      notes: attempt?.notes ?? '',
      confidence: attempt?.confidence ?? 'Medium',
      completed: attempt?.completed ?? false,
    });
    setShowDrillSolution(false);
  }

  function handleLaunchDrill(id: string) {
    setDrillTopicFilter('All');
    setDrillDifficultyFilter('All');
    handleSelectDrill(id);
    setActiveView('drills');
  }

  function handleSaveDrillAttempt() {
    saveDrillAttempt({
      drillId: activeDrill.id,
      code: drillDraft.code,
      notes: drillDraft.notes,
      confidence: drillDraft.confidence,
      completed: drillDraft.completed,
    });
    setDrillAttempts(getDrillAttempts());
  }

  function handleSelectExercise(id: string) {
    const response = exerciseResponses.find((item) => item.exerciseId === id);
    setActiveExerciseId(id);
    setExerciseSections(response?.sections ?? emptyExerciseSections);
    setExerciseChecklist(response?.checklist ?? {});
    setShowExerciseAnswer(false);
  }

  function handleLaunchExercise(id: string) {
    setCategoryFilter('All');
    setDifficultyFilter('All');
    handleSelectExercise(id);
    setActiveView('exercises');
  }

  function handleLaunchChallenge(id: string) {
    setActiveChallengeId(id);
    setShowDesignAnswer(false);
    setActiveView('design');
  }

  function handleSelectChallenge(id: string) {
    setActiveChallengeId(id);
    setShowDesignAnswer(false);
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
    setShowMockAnswers(false);
    return attempt;
  }

  function handleNewMockPrompt() {
    setMockPrompt(createMockInterviewPrompt());
    setShowMockAnswers(false);
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
    setDrillDraft(getEmptyDrillDraft(activeDrill));
    setShowDrillSolution(false);
    setExerciseSections(emptyExerciseSections);
    setExerciseChecklist({});
    setShowExerciseAnswer(false);
    setDesignSections(emptyDesignSections);
    setShowDesignAnswer(false);
    setMockNotes('');
    setShowMockAnswers(false);
    setImportMessage('');
  }

  function applyRoute(route: RouteState) {
    setActiveView(route.activeView);
    setLearnScreen(route.learnScreen);
    setProgressTab(route.progressTab);
    setActiveTopicId(route.activeTopicId);
    setQuizTopicId(route.quizTopicId);

    if (route.activeView === 'drills') {
      handleSelectDrill(route.activeDrillId);
    } else {
      setActiveDrillId(route.activeDrillId);
    }

    if (route.activeView === 'exercises') {
      handleSelectExercise(route.activeExerciseId);
    } else {
      setActiveExerciseId(route.activeExerciseId);
    }

    if (route.activeView === 'design') {
      handleSelectChallenge(route.activeChallengeId);
    } else {
      setActiveChallengeId(route.activeChallengeId);
    }
  }

  useEffect(() => {
    function handlePopState() {
      applyRoute(parseRoute());
    }

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  });

  useEffect(() => {
    const routePath = buildRoutePath({
      activeChallengeId,
      activeDrillId,
      activeExerciseId,
      activeTopicId,
      activeView,
      learnScreen,
      progressTab,
      quizTopicId,
    });
    const currentPath = normalizeRoutePath();

    if (currentPath !== routePath) {
      window.history.pushState(null, '', routePathWithBase(routePath));
    }
  }, [activeChallengeId, activeDrillId, activeExerciseId, activeTopicId, activeView, learnScreen, progressTab, quizTopicId]);

  return (
    <main className={`app-shell mode-${colorMode}`}>
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-mark">
            <GraduationCap aria-hidden="true" size={24} />
          </div>
          <div>
            <h1>My Learning Playground</h1>
          </div>
        </div>

        <nav className="nav-list nav-list-primary" aria-label="Primary">
          <button className={primaryNav === 'learn' ? 'nav-item active' : 'nav-item'} onClick={() => handleOpenPrimaryNav('learn')} type="button">
            <House aria-hidden="true" size={16} />
            Learn
          </button>
          <button className={primaryNav === 'practice' ? 'nav-item active' : 'nav-item'} onClick={() => handleOpenPrimaryNav('practice')} type="button">
            <Code2 aria-hidden="true" size={16} />
            Practice
          </button>
          <button className={primaryNav === 'progress' ? 'nav-item active' : 'nav-item'} onClick={() => handleOpenPrimaryNav('progress')} type="button">
            <ClipboardList aria-hidden="true" size={16} />
            Progress
          </button>
        </nav>

        <div className="sidebar-divider" />

        <nav className="nav-list nav-list-secondary" aria-label="Workspace shortcuts">
          <button className={activeView === 'learn' && learnScreen === 'topic' ? 'nav-item active' : 'nav-item'} onClick={() => handleOpenTopic(activeTopic.id)} type="button">
            <ListTodo aria-hidden="true" size={16} />
            All topics
          </button>
          <button className={activeView === 'progress' && progressTab === 'history' ? 'nav-item active' : 'nav-item'} onClick={() => {
            setActiveView('progress');
            setProgressTab('history');
          }} type="button">
            <NotebookPen aria-hidden="true" size={16} />
            Notes
          </button>
          <button className={activeView === 'exercises' ? 'nav-item active' : 'nav-item'} onClick={() => setActiveView('exercises')} type="button">
            <Bookmark aria-hidden="true" size={16} />
            Bookmarks
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item nav-item-subtle" type="button">
            <Settings2 aria-hidden="true" size={16} />
            Settings
          </button>
          <div className="mode-stack">
            <button className={colorMode === 'light' ? 'nav-item active' : 'nav-item'} onClick={() => setColorMode('light')} type="button">
              Light
            </button>
            <button className={colorMode === 'dark' ? 'nav-item active' : 'nav-item'} onClick={() => setColorMode('dark')} type="button">
              Dark
            </button>
          </div>
          <div className="sidebar-summary">
            <small><span aria-hidden="true">•</span> Local-first. All data stays on this device.</small>
          </div>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div className="topbar-copy">
            {activeView === 'learn' && learnScreen === 'home' ? (
              <>
                <h2>Good morning</h2>
                <p className="topbar-summary">What will you learn today?</p>
              </>
            ) : activeView === 'learn' ? (
              <>
                <nav className="breadcrumb" aria-label="Breadcrumb">
                  <button onClick={handleOpenLearnHome} type="button">Learn</button>
                  <span aria-hidden="true">&gt;</span>
                  <button onClick={() => handleOpenTopic(activeTopic.id)} type="button">{activeTopic.category}</button>
                  <span aria-hidden="true">&gt;</span>
                  <button onClick={() => handleOpenTopic(activeTopic.id)} type="button">{activeTopic.title}</button>
                </nav>
                <h2>{activeTopic.title}</h2>
                <p className="topbar-summary">{activeTopic.basicExplanation}</p>
              </>
            ) : (
              <>
                <p className="eyebrow">JavaScript, CRUD, simple system design</p>
                <h2>{isPracticeView ? 'Practice' : activeViewMeta.label}</h2>
                <p className="topbar-summary">{viewDescriptions[activeView]}</p>
              </>
            )}
          </div>
          <div className="toolbar">
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

        {activeView === 'learn' && learnScreen === 'home' && (
          <section className="learn-home">
            <section className="home-section">
              <div className="section-heading">
                <div>
                  <p className="section-label">Continue learning</p>
                  <h3>{activeTopic.category === 'JavaScript' ? 'JavaScript Essentials' : activeTopic.category}</h3>
                </div>
              </div>
              <article className="continue-card">
                <div className="continue-mark">{activeTopic.category === 'JavaScript' ? 'JS' : activeTopic.category[0]}</div>
                <div className="continue-copy">
                  <span>{activeTopic.category === 'JavaScript' ? 'JavaScript Essentials' : activeTopic.category}</span>
                  <strong>{activeTopic.title}</strong>
                  <div className="progress-line">
                    <div
                      className="progress-line-fill"
                      style={{ width: `${currentTopicProgress === 'completed' ? 100 : currentTopicProgress === 'in_progress' ? 60 : 24}%` }}
                    />
                  </div>
                </div>
                <small>{currentTopicProgress === 'completed' ? '100% complete' : currentTopicProgress === 'in_progress' ? '60% complete' : '24% complete'}</small>
                <button className="primary-button" onClick={() => handleOpenTopic(activeTopic.id)} type="button">
                  Continue
                </button>
              </article>
            </section>

            <section className="home-section">
              <div className="section-heading">
                <div>
                  <p className="section-label">Pick up a topic</p>
                  <h3>Start with a clear area of practice</h3>
                </div>
              </div>
              <div className="topic-grid">
                {topicGroups.map((group) => {
                  const firstTopic = topics.find((topic) => topic.category === group.category) ?? topics[0];
                  return (
                    <button className="topic-tile" key={group.category} onClick={() => handleOpenTopic(firstTopic.id)} type="button">
                      <div className="topic-tile-mark">{group.category === 'JavaScript' ? 'JS' : group.category[0]}</div>
                      <strong>{group.title}</strong>
                      <small>{group.count} topics</small>
                    </button>
                  );
                })}
              </div>
            </section>
          </section>
        )}

        {activeView === 'learn' && learnScreen === 'topic' && (
          <section className="two-column topic-screen">
            <div className="panel-list">
              {topics.map((topic) => (
                <button
                  className={activeTopic.id === topic.id ? 'list-card active' : 'list-card'}
                  key={topic.id}
                  onClick={() => handleOpenTopic(topic.id)}
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
              <div className="tab-row">
                <button className={learnTab === 'overview' ? 'tab-button active' : 'tab-button'} onClick={() => setLearnTab('overview')} type="button">
                  Overview
                </button>
                <button className={learnTab === 'breakdown' ? 'tab-button active' : 'tab-button'} onClick={() => setLearnTab('breakdown')} type="button">
                  Breakdown
                </button>
                <button className={learnTab === 'mental' ? 'tab-button active' : 'tab-button'} onClick={() => setLearnTab('mental')} type="button">
                  Mental Model
                </button>
                <button className={learnTab === 'practice' ? 'tab-button active' : 'tab-button'} onClick={() => setLearnTab('practice')} type="button">
                  Practice
                </button>
              </div>
              {learnTab === 'overview' && (
                <section className="topic-layout">
                  <div className="mini-panel">
                    <strong>At a glance</strong>
                    <p>{activeTopic.basicExplanation}</p>
                  </div>
                  <pre className="code-block topic-snippet">
                    <code>{activeDrill.starterCode}</code>
                  </pre>
                  <div className="mini-panel">
                    <strong>In this topic</strong>
                    <ul>
                      {activeTopic.deepDive.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="mini-panel">
                    <strong>Why it matters</strong>
                    <ul>
                      {activeTopic.deepDive.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="callout checkpoint-card">
                    <strong>Checkpoint</strong>
                    <span>{activeTopic.checkpoint}</span>
                    <button className="secondary-button" onClick={() => handleLaunchTopicQuiz(activeTopic.id)} type="button">
                      Start checkpoint
                    </button>
                  </div>
                </section>
              )}
              {learnTab === 'breakdown' && (
                <section className="learning-section">
                  <p className="section-label">Breakdown</p>
                  <p>{activeTopic.lesson}</p>
                  <ul className="deep-dive-list">
                    {activeTopic.deepDive.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>
              )}
              {learnTab === 'mental' && (
                <section className="mental-grid">
                  {Object.entries(activeTopic.mentalModel).map(([label, value]) => (
                    <div className="mini-panel" key={label}>
                      <strong>{label.replace(/([A-Z])/g, ' $1')}</strong>
                      <span>{value}</span>
                    </div>
                  ))}
                </section>
              )}
              {learnTab === 'practice' && (
                <RelatedPractice
                  challenges={activeTopicChallenges}
                  drills={activeTopicDrills}
                  exercises={activeTopicExercises}
                  onOpenChallenge={handleLaunchChallenge}
                  onOpenDrill={handleLaunchDrill}
                  onOpenExercise={handleLaunchExercise}
                  onOpenQuiz={() => handleLaunchTopicQuiz(activeTopic.id)}
                  questionCount={activeTopicQuestions.length}
                />
              )}
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

        {activeView === 'drills' && (
          <section className="two-column practice-screen">
            <div className="panel-list">
              <div className="filter-row">
                <select onChange={(event) => setDrillTopicFilter(event.target.value)} value={drillTopicFilter}>
                  <option value="All">All topics</option>
                  {topics.map((topic) => (
                    <option key={topic.id} value={topic.id}>
                      Topic {topic.order}: {topic.title}
                    </option>
                  ))}
                </select>
                <select onChange={(event) => setDrillDifficultyFilter(event.target.value as Difficulty | 'All')} value={drillDifficultyFilter}>
                  <option>All</option>
                  <option>Starter</option>
                  <option>Core</option>
                  <option>Stretch</option>
                </select>
              </div>
              {filteredDrills.map((drill) => (
                <button
                  className={activeDrill.id === drill.id ? 'list-card active' : 'list-card'}
                  key={drill.id}
                  onClick={() => handleSelectDrill(drill.id)}
                  type="button"
                >
                  <span>Code drill / {drill.difficulty}</span>
                  <strong>{drill.title}</strong>
                  <small>{drill.prompt}</small>
                </button>
              ))}
            </div>
            <article className="detail-panel">
              <div className="detail-heading">
                <Code2 aria-hidden="true" size={22} />
                <div>
                  <p className="eyebrow">{activeDrill.difficulty} JavaScript drill</p>
                  <h3>{activeDrill.title}</h3>
                </div>
              </div>
              <p>{activeDrill.prompt}</p>
              <div className="drill-meta-row">
                {activeDrill.topicIds.map((topicId) => (
                  <span key={topicId}>{topics.find((topic) => topic.id === topicId)?.title ?? topicId}</span>
                ))}
              </div>
              <InfoColumns hints={activeDrill.hints} concepts={['Write a solution', 'Trace the test cases', 'Explain the tradeoff']} edgeCases={activeDrill.testCases} />
              <section className="structured-form">
                <label>
                  <span>Your code</span>
                  <textarea
                    className="code-textarea"
                    onChange={(event) => setDrillDraft({ ...drillDraft, code: event.target.value })}
                    rows={12}
                    spellCheck={false}
                    value={drillDraft.code}
                  />
                </label>
                <label>
                  <span>Notes and explanation</span>
                  <textarea
                    onChange={(event) => setDrillDraft({ ...drillDraft, notes: event.target.value })}
                    placeholder="Explain your approach, time complexity, edge cases, or what felt confusing."
                    rows={4}
                    value={drillDraft.notes}
                  />
                </label>
                <div className="drill-controls">
                  <label>
                    <span>Confidence</span>
                    <select
                      onChange={(event) => setDrillDraft({ ...drillDraft, confidence: event.target.value as DrillAttempt['confidence'] })}
                      value={drillDraft.confidence}
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                  </label>
                  <label className="check-row">
                    <input
                      checked={drillDraft.completed}
                      onChange={(event) => setDrillDraft({ ...drillDraft, completed: event.target.checked })}
                      type="checkbox"
                    />
                    <span>Mark completed</span>
                  </label>
                </div>
              </section>
              <div className="action-row">
                <button className="primary-button" onClick={handleSaveDrillAttempt} type="button">
                  <Save aria-hidden="true" size={18} />
                  Save drill attempt
                </button>
                {savedDrillAttempt && (
                  <button className="text-button" onClick={() => {
                    deleteDrillAttempt(savedDrillAttempt.id);
                    setDrillAttempts(getDrillAttempts());
                    setDrillDraft(getEmptyDrillDraft(activeDrill));
                  }} type="button">
                    <Trash2 aria-hidden="true" size={15} />
                    Delete saved attempt
                  </button>
                )}
                <button className="secondary-button" onClick={() => setShowDrillSolution(!showDrillSolution)} type="button">
                  {showDrillSolution ? 'Hide recommended solution' : 'Show recommended solution'}
                </button>
              </div>
              {showDrillSolution && <RecommendedDrillSolution drill={activeDrill} />}
            </article>
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
                <button className="secondary-button" onClick={() => setShowExerciseAnswer(!showExerciseAnswer)} type="button">
                  {showExerciseAnswer ? 'Hide recommended answer' : 'Show recommended answer'}
                </button>
              </div>
              {showExerciseAnswer && (
                <RecommendedExerciseAnswer
                  checklistNotes={activeExercise.recommendedAnswer.checklistNotes}
                  overview={activeExercise.recommendedAnswer.overview}
                  sections={activeExercise.recommendedAnswer.sections}
                />
              )}
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
                  onClick={() => handleSelectChallenge(challenge.id)}
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
              <button className="secondary-button answer-toggle" onClick={() => setShowDesignAnswer(!showDesignAnswer)} type="button">
                {showDesignAnswer ? 'Hide recommended answer' : 'Show recommended answer'}
              </button>
              {showDesignAnswer && (
                <RecommendedDesignAnswer
                  overview={activeChallenge.recommendedAnswer.overview}
                  sections={activeChallenge.recommendedAnswer.sections}
                />
              )}
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
              <button className="secondary-button" onClick={handleNewMockPrompt} type="button">
                New prompt set
              </button>
              <button className="secondary-button" onClick={() => setShowMockAnswers(!showMockAnswers)} type="button">
                {showMockAnswers ? 'Hide recommended answers' : 'Show recommended answers'}
              </button>
            </div>
            {showMockAnswers && (
              <section className="recommended-panel">
                <p className="section-label">Recommended answers</p>
                <div className="mock-grid">
                  <PromptCard
                    body={`${mockPrompt.javascriptQuestion.answer}. ${mockPrompt.javascriptQuestion.explanation}`}
                    meta="JavaScript"
                    title="Concept answer"
                  />
                  <PromptCard
                    body={mockPrompt.crudExercise.recommendedAnswer.overview}
                    meta={mockPrompt.crudExercise.difficulty}
                    title={mockPrompt.crudExercise.title}
                  />
                  <PromptCard
                    body={mockPrompt.designChallenge.recommendedAnswer.overview}
                    meta={mockPrompt.designChallenge.difficulty}
                    title={mockPrompt.designChallenge.title}
                  />
                </div>
              </section>
            )}
          </section>
        )}

        {activeView === 'progress' && (
          <section className="progress-grid">
            <div className="tab-row progress-tabs">
              <button className={progressTab === 'overview' ? 'tab-button active' : 'tab-button'} onClick={() => setProgressTab('overview')} type="button">
                Overview
              </button>
              <button className={progressTab === 'history' ? 'tab-button active' : 'tab-button'} onClick={() => setProgressTab('history')} type="button">
                History
              </button>
            </div>
            {progressTab === 'overview' ? (
              <>
                <Metric icon={<ClipboardList aria-hidden="true" size={21} />} label="Topics started" value={String(topics.length - topics.filter((topic) => progress[topic.id] === 'not_started').length)} />
                <Metric icon={<CheckCircle2 aria-hidden="true" size={21} />} label="Topics completed" value={String(completedCount)} />
                <Metric icon={<Code2 aria-hidden="true" size={21} />} label="Average quiz score" value={`${averageScore}%`} />
                <Metric icon={<Play aria-hidden="true" size={21} />} label="Mock interviews" value={String(mockAttempts.length)} />
                <HistoryPanel title="Recent activity" empty="No saved work yet.">
                  {notes.slice(0, 4).map((note) => (
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
                <HistoryPanel title="Continue where you left off" empty="No exercise responses yet.">
                  {exerciseResponses.slice(0, 4).map((response) => (
                    <div className="history-row" key={response.id}>
                      <span>{exercises.find((exercise) => exercise.id === response.exerciseId)?.title ?? response.exerciseId}</span>
                      <strong>{getChecklistScore(response.checklist)}%</strong>
                    </div>
                  ))}
                </HistoryPanel>
              </>
            ) : (
              <>
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
                <HistoryPanel title="Code drill attempts" empty="No code drills saved yet.">
                  {drillAttempts.map((attempt) => (
                    <div className="history-row" key={attempt.id}>
                      <span>{codeDrills.find((drill) => drill.id === attempt.drillId)?.title ?? attempt.drillId}</span>
                      <strong>{attempt.completed ? 'Done' : attempt.confidence}</strong>
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
              </>
            )}
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
  drills,
  exercises,
  onOpenChallenge,
  onOpenDrill,
  onOpenExercise,
  onOpenQuiz,
  questionCount,
}: {
  challenges: Challenge[];
  drills: CodeDrill[];
  exercises: Exercise[];
  onOpenChallenge: (id: string) => void;
  onOpenDrill: (id: string) => void;
  onOpenExercise: (id: string) => void;
  onOpenQuiz: () => void;
  questionCount: number;
}) {
  if (questionCount === 0 && drills.length === 0 && exercises.length === 0 && challenges.length === 0) {
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
      {drills.length > 0 && (
        <div className="practice-group">
          <span>Code drills</span>
          {drills.map((drill) => (
            <button className="practice-link" key={drill.id} onClick={() => onOpenDrill(drill.id)} type="button">
              <span>{drill.difficulty}</span>
              <strong>{drill.title}</strong>
            </button>
          ))}
        </div>
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

function RecommendedExerciseAnswer({
  checklistNotes,
  overview,
  sections,
}: {
  checklistNotes: string[];
  overview: string;
  sections: ExerciseAnswerSections;
}) {
  return (
    <section className="recommended-panel">
      <p className="section-label">Recommended answer</p>
      <p>{overview}</p>
      <AnswerSections sections={sections} />
      <div className="mini-panel">
        <strong>Checklist notes</strong>
        <ul>
          {checklistNotes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function RecommendedDesignAnswer({ overview, sections }: { overview: string; sections: DesignAnswerSections }) {
  return (
    <section className="recommended-panel">
      <p className="section-label">Recommended answer</p>
      <p>{overview}</p>
      <AnswerSections sections={sections} />
    </section>
  );
}

function RecommendedDrillSolution({ drill }: { drill: CodeDrill }) {
  return (
    <section className="recommended-panel">
      <p className="section-label">Recommended solution</p>
      <p>{drill.explanation}</p>
      <pre className="code-block">
        <code>{drill.recommendedSolution}</code>
      </pre>
      <MiniList title="Test cases to trace" items={drill.testCases} />
    </section>
  );
}

function AnswerSections({ sections }: { sections: ExerciseAnswerSections | DesignAnswerSections }) {
  return (
    <div className="answer-section-grid">
      {Object.entries(sections).map(([label, value]) => (
        <article className="answer-section" key={label}>
          <strong>{label.replace(/([A-Z])/g, ' $1')}</strong>
          <p>{value}</p>
        </article>
      ))}
    </div>
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
