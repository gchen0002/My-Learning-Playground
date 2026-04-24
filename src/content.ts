export type Topic = {
  id: string;
  title: string;
  category: 'CRUD' | 'System Design' | 'Implementation';
  summary: string;
  lesson: string;
  checkpoint: string;
};

export type QuizQuestion = {
  id: string;
  topicId: string;
  prompt: string;
  choices: string[];
  answer: string;
  explanation: string;
};

export type Challenge = {
  id: string;
  title: string;
  type: 'Implementation' | 'Design';
  difficulty: 'Starter' | 'Core' | 'Stretch';
  prompt: string;
  checklist: string[];
};

export const topics: Topic[] = [
  {
    id: 'crud-flow',
    title: 'CRUD Flow',
    category: 'CRUD',
    summary: 'Trace how create, read, update, and delete actions move through a small app.',
    lesson:
      'CRUD is the backbone of most product work. A user action starts in the UI, becomes validated data, updates storage, and returns a new state to display.',
    checkpoint: 'Name the data being changed before deciding which screen or button to build.',
  },
  {
    id: 'data-models',
    title: 'Data Models',
    category: 'Implementation',
    summary: 'Practice turning product nouns into fields, IDs, and relationships.',
    lesson:
      'Implementation design gets easier when the main entities are clear. A note needs an id, body, timestamps, and a relationship to the thing it belongs to.',
    checkpoint: 'Write the entity first, then sketch the screens and actions that use it.',
  },
  {
    id: 'api-shapes',
    title: 'API Shapes',
    category: 'Implementation',
    summary: 'Learn how endpoint-style thinking helps even in a local-only app.',
    lesson:
      'An API shape is a contract. Even when storage is local, functions like createNote or submitQuizAttempt help separate interface code from data rules.',
    checkpoint: 'Keep UI components focused on intent, and move data rules into service functions.',
  },
  {
    id: 'requirements',
    title: 'Requirements First',
    category: 'System Design',
    summary: 'Split what the system must do from how reliable or fast it needs to be.',
    lesson:
      'System design starts with requirements. Functional requirements describe behavior; non-functional requirements describe qualities like scale, latency, cost, and safety.',
    checkpoint: 'Before designing, ask what must happen and what qualities matter most.',
  },
];

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    topicId: 'crud-flow',
    prompt: 'Which CRUD action best matches saving a brand new note?',
    choices: ['Create', 'Read', 'Update', 'Delete'],
    answer: 'Create',
    explanation: 'A new note does not exist yet, so the app is creating a new stored record.',
  },
  {
    id: 'q2',
    topicId: 'data-models',
    prompt: 'Why do most records need an ID?',
    choices: ['To make the UI colorful', 'To uniquely find and update one record', 'To avoid writing CSS', 'To replace validation'],
    answer: 'To uniquely find and update one record',
    explanation: 'IDs let the app target a specific record for reads, updates, deletes, and relationships.',
  },
  {
    id: 'q3',
    topicId: 'api-shapes',
    prompt: 'What is the main benefit of a service function like submitQuizAttempt?',
    choices: ['It hides all UI', 'It separates data rules from components', 'It removes TypeScript', 'It guarantees scaling'],
    answer: 'It separates data rules from components',
    explanation: 'Service functions make app behavior easier to test and later replace with real API calls.',
  },
  {
    id: 'q4',
    topicId: 'requirements',
    prompt: 'Which is a non-functional requirement?',
    choices: ['Users can create notes', 'Users can delete attempts', 'The dashboard loads within one second', 'A quiz has four choices'],
    answer: 'The dashboard loads within one second',
    explanation: 'Performance goals describe quality of service, not the core user behavior itself.',
  },
];

export const challenges: Challenge[] = [
  {
    id: 'todo-crud',
    title: 'Design a Todo CRUD Feature',
    type: 'Implementation',
    difficulty: 'Starter',
    prompt: 'Plan a todo list feature with create, read, update, delete, validation, and empty states.',
    checklist: ['Entities and fields', 'User actions', 'Validation rules', 'Failure states'],
  },
  {
    id: 'quiz-history',
    title: 'Quiz Attempt History',
    type: 'Implementation',
    difficulty: 'Core',
    prompt: 'Design how this app should store and display quiz attempts over time.',
    checklist: ['Data model', 'Submit flow', 'Dashboard summary', 'Delete or reset behavior'],
  },
  {
    id: 'url-shortener',
    title: 'URL Shortener System',
    type: 'Design',
    difficulty: 'Core',
    prompt: 'Sketch a beginner system design for a service that turns long URLs into short links.',
    checklist: ['Functional requirements', 'Core entities', 'API ideas', 'Scaling concerns'],
  },
  {
    id: 'notification-system',
    title: 'Notification System',
    type: 'Design',
    difficulty: 'Stretch',
    prompt: 'Design a basic system for sending email or in-app notifications after an event happens.',
    checklist: ['Trigger events', 'Storage', 'Async processing', 'Retries and failures'],
  },
];
