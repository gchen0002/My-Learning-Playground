export type LearningCategory = 'JavaScript' | 'CRUD' | 'Implementation' | 'System Design';
export type Difficulty = 'Starter' | 'Core' | 'Stretch';

export type Topic = {
  id: string;
  title: string;
  category: LearningCategory;
  order: number;
  summary: string;
  basicExplanation: string;
  lesson: string;
  deepDive: string[];
  checkpoint: string;
  mentalModel: {
    data: string;
    action: string;
    stateChange: string;
    edgeCases: string;
  };
};

export type QuizQuestion = {
  id: string;
  topicId: string;
  category: LearningCategory;
  prompt: string;
  choices: string[];
  answer: string;
  explanation: string;
};

export type Exercise = {
  id: string;
  title: string;
  category: LearningCategory;
  difficulty: Difficulty;
  topicIds: string[];
  prompt: string;
  starterHints: string[];
  expectedConcepts: string[];
  edgeCases: string[];
};

export type Challenge = {
  id: string;
  title: string;
  type: 'Implementation' | 'Design';
  difficulty: Difficulty;
  topicIds: string[];
  prompt: string;
  checklist: string[];
  comparisonPrompt?: string;
};

export const topics: Topic[] = [
  {
    id: 'arrays-objects',
    title: 'Arrays and Objects',
    category: 'JavaScript',
    order: 1,
    summary: 'Practice the data structures most JS interview tasks use.',
    basicExplanation:
      'Arrays and objects are the everyday containers of JavaScript. Arrays are best when order matters, and objects are best when you want to name or look up values by a key.',
    lesson:
      'Most JavaScript implementation questions start with arrays and objects. Arrays are ordered collections; objects model named properties. Your first move is usually to choose the shape that makes lookup, update, or grouping easiest.',
    deepDive: [
      'Use arrays when you need to preserve order, scan every item, sort values, or render a list.',
      'Use objects or Maps when you need fast lookup by ID, grouping, counting, or deduping.',
      'In interviews, say the shape out loud: "I will use an object keyed by ID so updates are direct instead of scanning the array."',
    ],
    checkpoint: 'Before coding, say whether the problem needs ordering, lookup by key, or both.',
    mentalModel: {
      data: 'Input arrays, records, maps, IDs, and grouped values.',
      action: 'Transform, filter, find, group, count, or merge.',
      stateChange: 'Return a new value when possible; mutate only when the prompt or performance calls for it.',
      edgeCases: 'Empty arrays, duplicate keys, missing fields, and unexpected value types.',
    },
  },
  {
    id: 'async-promises',
    title: 'Promises and async/await',
    category: 'JavaScript',
    order: 2,
    summary: 'Understand async flow, errors, and sequencing.',
    basicExplanation:
      'Async JavaScript handles work that finishes later, like loading data or saving something. Promises represent that future result, and async/await makes the steps easier to read.',
    lesson:
      'Promises represent work that finishes later. async/await makes promise code read like steps, but errors still need try/catch and parallel work may need Promise.all.',
    deepDive: [
      'Use await when one step depends on the previous result.',
      'Use Promise.all when independent requests can run at the same time.',
      'In interviews, mention loading, success, and error states because async code affects what the user sees.',
    ],
    checkpoint: 'Name which work must happen in order and which work can happen in parallel.',
    mentalModel: {
      data: 'Pending, fulfilled, and rejected promise states.',
      action: 'Await a result, catch failure, or combine multiple promises.',
      stateChange: 'Loading, success, and error states usually mirror async progress in the UI.',
      edgeCases: 'Rejected promises, partial failures, stale requests, and slow responses.',
    },
  },
  {
    id: 'crud-flow',
    title: 'CRUD Flow',
    category: 'CRUD',
    order: 3,
    summary: 'Trace how create, read, update, and delete actions move through a small app.',
    basicExplanation:
      'CRUD means create, read, update, and delete. Most app features are some version of adding records, showing records, changing records, or removing records.',
    lesson:
      'CRUD is the backbone of product work. A user action starts in the UI, becomes validated data, updates storage, and returns a new state to display.',
    deepDive: [
      'Create needs validation, an ID, and a decision about where the new item appears.',
      'Update needs to find one existing record and preserve fields that did not change.',
      'Delete needs to handle confirmation, empty states, and what happens if the record no longer exists.',
    ],
    checkpoint: 'Name the data being changed before deciding which screen or button to build.',
    mentalModel: {
      data: 'Records with IDs, fields, timestamps, and status values.',
      action: 'Create a record, read a list/detail, update one record, or delete one record.',
      stateChange: 'The visible list, detail view, counters, and empty states must reflect the operation.',
      edgeCases: 'Invalid input, duplicate records, missing IDs, delete confirmation, and failed persistence.',
    },
  },
  {
    id: 'data-models',
    title: 'Data Models',
    category: 'Implementation',
    order: 4,
    summary: 'Turn product nouns into fields, IDs, and relationships.',
    basicExplanation:
      'A data model is the shape of the information your app stores. Before building screens, you decide the important nouns, their fields, and how they relate.',
    lesson:
      'Implementation design gets easier when the main entities are clear. A note needs an ID, body, timestamps, and a relationship to the thing it belongs to.',
    deepDive: [
      'Start with nouns from the prompt: user, note, quiz attempt, flashcard, bookmark.',
      'Give each stored record an ID so it can be read, updated, deleted, or linked from another record.',
      'In interviews, separate stored fields from derived values like counts, filtered lists, and percentages.',
    ],
    checkpoint: 'Write the entity first, then sketch the screens and actions that use it.',
    mentalModel: {
      data: 'Entity fields, IDs, relationships, indexes, and derived values.',
      action: 'Decide what needs to be stored and what can be computed.',
      stateChange: 'Changing one entity may update related counts, lists, or progress.',
      edgeCases: 'Orphaned records, stale derived values, invalid statuses, and migration needs.',
    },
  },
  {
    id: 'state-validation',
    title: 'State Shape and Validation',
    category: 'Implementation',
    order: 5,
    summary: 'Break a feature into state, forms, validation, and UI feedback.',
    basicExplanation:
      'State is what the app remembers right now. Validation is how the app decides whether user input is safe and complete enough to save.',
    lesson:
      'Good implementation design separates raw input, validated data, saved records, and derived UI state. This makes edge cases easier to reason about in interviews.',
    deepDive: [
      'Keep draft form state separate from saved records so cancel/reset behavior is clear.',
      'Validate before saving, then show useful feedback when input is blank, duplicated, or invalid.',
      'Explain state transitions: empty form, typing, validation error, saving, saved, or failed.',
    ],
    checkpoint: 'Explain what state exists before, during, and after the user action.',
    mentalModel: {
      data: 'Draft form values, validation errors, saved records, and derived filters.',
      action: 'Validate, submit, persist, reset, or show an error.',
      stateChange: 'Draft values become records only after validation succeeds.',
      edgeCases: 'Blank input, duplicate submissions, partial edits, reset behavior, and failed saves.',
    },
  },
  {
    id: 'api-shapes',
    title: 'API Shapes',
    category: 'Implementation',
    order: 6,
    summary: 'Use endpoint-style thinking even in a local-only app.',
    basicExplanation:
      'An API shape is the contract for an action. Even without a backend, naming actions like createNote or submitQuizAttempt makes the app easier to reason about.',
    lesson:
      'An API shape is a contract. Even when storage is local, functions like createNote or submitQuizAttempt separate interface code from data rules.',
    deepDive: [
      'Think in inputs and outputs: what payload comes in, what result comes back, and what errors can happen.',
      'Keep business rules in service functions instead of scattering them through UI components.',
      'In interviews, endpoint-style thinking helps you explain boundaries even if you are coding locally.',
    ],
    checkpoint: 'Keep UI components focused on intent, and move data rules into service functions.',
    mentalModel: {
      data: 'Request payloads, response values, errors, and IDs.',
      action: 'Call a named operation that owns validation and persistence.',
      stateChange: 'The caller receives the next state and renders it.',
      edgeCases: 'Invalid payloads, missing records, duplicate requests, and versioned data.',
    },
  },
  {
    id: 'requirements',
    title: 'Requirements First',
    category: 'System Design',
    order: 7,
    summary: 'Split what the system must do from how reliable or fast it needs to be.',
    basicExplanation:
      'Requirements describe what you are building. Functional requirements are behaviors; non-functional requirements are qualities like speed, reliability, and scale.',
    lesson:
      'System design starts with requirements. Functional requirements describe behavior; non-functional requirements describe qualities like scale, latency, cost, and safety.',
    deepDive: [
      'Functional requirements answer: what can users do?',
      'Non-functional requirements answer: how fast, reliable, secure, or scalable must it be?',
      'In design interviews, requirements keep you from designing a system for the wrong problem.',
    ],
    checkpoint: 'Before designing, ask what must happen and what qualities matter most.',
    mentalModel: {
      data: 'Users, records, events, and system limits.',
      action: 'Capture requirements, then map them to entities and flows.',
      stateChange: 'A request moves through clients, APIs, storage, and optional background work.',
      edgeCases: 'High traffic, slow dependencies, retries, duplicate writes, and stale reads.',
    },
  },
  {
    id: 'scaling-local-to-service',
    title: 'From Local App to Service',
    category: 'System Design',
    order: 8,
    summary: 'Explain how a browser-only feature changes when many users need it.',
    basicExplanation:
      'A local app stores data for one browser. A service stores shared data for many users, so it needs identity, permissions, APIs, and server-side storage.',
    lesson:
      'A local app stores data for one browser. A multi-user service needs authentication, shared storage, access control, APIs, observability, and tradeoffs around consistency and scale.',
    deepDive: [
      'Local storage is simple because only one browser writes the data.',
      'A shared service must handle many users reading and writing at the same time.',
      'In interviews, explain what moves from the client to the server and what new risks appear.',
    ],
    checkpoint: 'For every local feature, ask what changes when the data must be shared safely.',
    mentalModel: {
      data: 'User-owned records, shared records, permissions, and audit events.',
      action: 'Route requests through APIs and persistence instead of browser-only storage.',
      stateChange: 'Many clients may update or read the same data at different times.',
      edgeCases: 'Authorization, race conditions, outages, retries, rate limits, and abuse.',
    },
  },
];

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'q-arrays-1',
    topicId: 'arrays-objects',
    category: 'JavaScript',
    prompt: 'Which structure is usually best when you need fast lookup by ID?',
    choices: ['Array only', 'Object or Map keyed by ID', 'String', 'Boolean flag'],
    answer: 'Object or Map keyed by ID',
    explanation: 'A keyed object or Map avoids scanning the whole array each time you need one record.',
  },
  {
    id: 'q-arrays-2',
    topicId: 'arrays-objects',
    category: 'JavaScript',
    prompt: 'What does Array.prototype.map usually return?',
    choices: ['A new array', 'The first matching item', 'A boolean', 'The original array length'],
    answer: 'A new array',
    explanation: 'map transforms each item and returns a new array of transformed values.',
  },
  {
    id: 'q-async-1',
    topicId: 'async-promises',
    category: 'JavaScript',
    prompt: 'When should Promise.all be considered?',
    choices: ['When independent async work can run together', 'Only for CSS loading', 'When avoiding errors', 'Only inside loops'],
    answer: 'When independent async work can run together',
    explanation: 'Promise.all is useful when multiple async operations do not depend on each other.',
  },
  {
    id: 'q-crud-1',
    topicId: 'crud-flow',
    category: 'CRUD',
    prompt: 'Which CRUD action best matches saving a brand new note?',
    choices: ['Create', 'Read', 'Update', 'Delete'],
    answer: 'Create',
    explanation: 'A new note does not exist yet, so the app is creating a new stored record.',
  },
  {
    id: 'q-models-1',
    topicId: 'data-models',
    category: 'Implementation',
    prompt: 'Why do most records need an ID?',
    choices: ['To uniquely find and update one record', 'To make the UI colorful', 'To avoid writing CSS', 'To replace validation'],
    answer: 'To uniquely find and update one record',
    explanation: 'IDs let the app target a specific record for reads, updates, deletes, and relationships.',
  },
  {
    id: 'q-state-1',
    topicId: 'state-validation',
    category: 'Implementation',
    prompt: 'Which value should usually be stored instead of recomputed from a filtered list?',
    choices: ['A user-entered note body', 'The number of visible filtered rows', 'Whether an array is empty', 'The current date label'],
    answer: 'A user-entered note body',
    explanation: 'User input is source data. Counts and visible rows are usually derived from source data.',
  },
  {
    id: 'q-api-1',
    topicId: 'api-shapes',
    category: 'Implementation',
    prompt: 'What is the main benefit of a service function like submitQuizAttempt?',
    choices: ['It separates data rules from components', 'It hides all UI', 'It removes TypeScript', 'It guarantees scaling'],
    answer: 'It separates data rules from components',
    explanation: 'Service functions make app behavior easier to test and later replace with real API calls.',
  },
  {
    id: 'q-req-1',
    topicId: 'requirements',
    category: 'System Design',
    prompt: 'Which is a non-functional requirement?',
    choices: ['The dashboard loads within one second', 'Users can create notes', 'Users can delete attempts', 'A quiz has four choices'],
    answer: 'The dashboard loads within one second',
    explanation: 'Performance goals describe quality of service, not the core user behavior itself.',
  },
  {
    id: 'q-scale-1',
    topicId: 'scaling-local-to-service',
    category: 'System Design',
    prompt: 'What does a multi-user version need that localStorage does not provide?',
    choices: ['Authentication and shared persistence', 'More CSS variables only', 'Fewer IDs', 'No validation'],
    answer: 'Authentication and shared persistence',
    explanation: 'Once many users share data, the app needs identity, authorization, APIs, and server-side storage.',
  },
];

export const exercises: Exercise[] = [
  {
    id: 'todo-crud',
    title: 'Todo CRUD',
    category: 'CRUD',
    difficulty: 'Starter',
    topicIds: ['crud-flow'],
    prompt: 'Design and explain a todo list with create, read, update, delete, validation, and empty states.',
    starterHints: ['What fields does a todo need?', 'What happens after deleting the last item?', 'How do you validate blank input?'],
    expectedConcepts: ['Entity model', 'CRUD operations', 'Validation', 'Empty states'],
    edgeCases: ['Blank todo title', 'Duplicate text', 'Deleting an active edit', 'Persisted stale data'],
  },
  {
    id: 'bookmark-manager',
    title: 'Bookmark Manager',
    category: 'Implementation',
    difficulty: 'Starter',
    topicIds: ['data-models', 'state-validation'],
    prompt: 'Plan a saved links feature with tags, search, edit, and delete.',
    starterHints: ['What makes a URL valid?', 'How are tags stored?', 'What should search inspect?'],
    expectedConcepts: ['Form validation', 'Filtering', 'Many-to-many thinking', 'Update flow'],
    edgeCases: ['Invalid URL', 'Duplicate bookmark', 'Empty tag list', 'Case-insensitive search'],
  },
  {
    id: 'flashcard-deck',
    title: 'Flashcard Deck',
    category: 'CRUD',
    difficulty: 'Core',
    topicIds: ['crud-flow', 'data-models'],
    prompt: 'Design flashcard deck CRUD plus a review queue.',
    starterHints: ['Separate deck from cards.', 'Track review results.', 'Decide what can be derived.'],
    expectedConcepts: ['Related entities', 'Derived state', 'Progress tracking', 'Review history'],
    edgeCases: ['Deck with no cards', 'Deleting a deck', 'Repeated incorrect answers', 'Resetting progress'],
  },
  {
    id: 'quiz-attempt-history',
    title: 'Quiz Attempt History',
    category: 'Implementation',
    difficulty: 'Core',
    topicIds: ['data-models', 'api-shapes'],
    prompt: 'Design how this app should store, display, filter, and delete quiz attempts over time.',
    starterHints: ['What belongs on an attempt?', 'Which stats are derived?', 'Can attempts be deleted?'],
    expectedConcepts: ['Append-only history', 'Dashboard summaries', 'Delete behavior', 'Filtering'],
    edgeCases: ['No attempts', 'Partial answer set', 'Old question versions', 'Reset all progress'],
  },
  {
    id: 'shopping-cart',
    title: 'Shopping Cart',
    category: 'Implementation',
    difficulty: 'Core',
    topicIds: ['state-validation'],
    prompt: 'Plan cart add/remove/update quantity behavior with totals.',
    starterHints: ['What is stored: product or cart item?', 'How do totals update?', 'What quantity values are allowed?'],
    expectedConcepts: ['State shape', 'Derived totals', 'Validation', 'Optimistic updates'],
    edgeCases: ['Quantity zero', 'Product unavailable', 'Price changed', 'Duplicate add'],
  },
  {
    id: 'comment-thread',
    title: 'Comment Thread',
    category: 'Implementation',
    difficulty: 'Stretch',
    topicIds: ['data-models'],
    prompt: 'Design comments with replies, edit/delete, sorting, and collapsed threads.',
    starterHints: ['How does a reply reference a parent?', 'What does delete mean with replies?', 'How should sorting work?'],
    expectedConcepts: ['Tree data', 'Parent IDs', 'Soft delete', 'Sorting'],
    edgeCases: ['Deleted parent', 'Deep replies', 'Edited timestamps', 'Large thread rendering'],
  },
  {
    id: 'user-preferences',
    title: 'User Preferences',
    category: 'CRUD',
    difficulty: 'Starter',
    topicIds: ['crud-flow'],
    prompt: 'Design local preference settings with update, reset, and export/import.',
    starterHints: ['Which preferences need defaults?', 'What happens with unknown imported keys?', 'How do you validate values?'],
    expectedConcepts: ['Defaults', 'Validation', 'Persistence', 'Import/export'],
    edgeCases: ['Missing settings', 'Invalid imported data', 'Reset confirmation', 'Versioned preferences'],
  },
  {
    id: 'search-filter-list',
    title: 'Search and Filter List',
    category: 'JavaScript',
    difficulty: 'Starter',
    topicIds: ['arrays-objects'],
    prompt: 'Implement the thinking behind searching, filtering, sorting, and paginating a list.',
    starterHints: ['Which state is source data?', 'Which state is derived?', 'What order should filter/sort/page run?'],
    expectedConcepts: ['Array methods', 'Derived state', 'Pagination', 'Stable sorting'],
    edgeCases: ['Empty query', 'No results', 'Case sensitivity', 'Last page after filtering'],
  },
  {
    id: 'undo-delete',
    title: 'Undo Delete',
    category: 'Implementation',
    difficulty: 'Stretch',
    topicIds: ['state-validation'],
    prompt: 'Design a delete flow where the user can undo for a few seconds.',
    starterHints: ['Is the record deleted immediately?', 'Where is pending deletion stored?', 'What if the user navigates away?'],
    expectedConcepts: ['Soft delete', 'Timers', 'Pending state', 'User feedback'],
    edgeCases: ['Multiple deletes', 'Undo after timeout', 'Page refresh', 'Delete failure'],
  },
  {
    id: 'import-export',
    title: 'Import and Export Saved Data',
    category: 'Implementation',
    difficulty: 'Core',
    topicIds: ['api-shapes'],
    prompt: 'Plan a browser-only import/export feature for notes, progress, attempts, and exercise responses.',
    starterHints: ['What is the file shape?', 'How do you validate imported JSON?', 'Should import merge or replace?'],
    expectedConcepts: ['Serialization', 'Validation', 'Migration', 'Conflict handling'],
    edgeCases: ['Invalid JSON', 'Unknown version', 'Duplicate IDs', 'Partial import'],
  },
];

export const challenges: Challenge[] = [
  {
    id: 'url-shortener',
    title: 'URL Shortener System',
    type: 'Design',
    difficulty: 'Core',
    topicIds: ['requirements'],
    prompt: 'Sketch a beginner system design for a service that turns long URLs into short links.',
    checklist: ['Functional requirements', 'Core entities', 'API ideas', 'Read path', 'Write path', 'Rate limiting'],
    comparisonPrompt: 'How would this differ from storing links in this local-only browser app?',
  },
  {
    id: 'notes-service',
    title: 'Notes App as a Service',
    type: 'Design',
    difficulty: 'Starter',
    topicIds: ['requirements', 'scaling-local-to-service'],
    prompt: 'Turn the local notes feature into a multi-user notes service.',
    checklist: ['Auth', 'Note ownership', 'CRUD APIs', 'Search', 'Sync behavior', 'Access control'],
    comparisonPrompt: 'What must move from localStorage to a server, and what can stay client-side?',
  },
  {
    id: 'quiz-platform',
    title: 'Quiz Platform',
    type: 'Design',
    difficulty: 'Core',
    topicIds: ['requirements', 'scaling-local-to-service'],
    prompt: 'Design a platform where users take quizzes and review attempt history.',
    checklist: ['Question storage', 'Attempt storage', 'Scoring', 'Analytics', 'Versioning', 'Abuse cases'],
    comparisonPrompt: 'What changes when quiz content is edited after attempts already exist?',
  },
  {
    id: 'flashcard-review-system',
    title: 'Flashcard Review System',
    type: 'Design',
    difficulty: 'Core',
    topicIds: ['requirements'],
    prompt: 'Design a spaced repetition system for flashcards.',
    checklist: ['Decks and cards', 'Review scheduling', 'Attempt history', 'Read/write paths', 'Background jobs'],
    comparisonPrompt: 'Which parts can be computed on the client, and which need server storage?',
  },
  {
    id: 'notification-system',
    title: 'Notification System',
    type: 'Design',
    difficulty: 'Stretch',
    topicIds: ['scaling-local-to-service'],
    prompt: 'Design a basic system for sending email or in-app notifications after an event happens.',
    checklist: ['Trigger events', 'Storage', 'Async processing', 'Retries', 'Failures', 'User preferences'],
    comparisonPrompt: 'Why is async processing useful compared with sending during the original request?',
  },
  {
    id: 'file-metadata-service',
    title: 'File Upload Metadata Service',
    type: 'Design',
    difficulty: 'Stretch',
    topicIds: ['scaling-local-to-service'],
    prompt: 'Design metadata tracking for uploaded files without focusing on raw file storage.',
    checklist: ['Metadata model', 'Upload flow', 'Permissions', 'Virus scan state', 'Background jobs'],
    comparisonPrompt: 'What statuses would the UI need while upload and scanning are happening?',
  },
  {
    id: 'event-rsvp-system',
    title: 'Event RSVP System',
    type: 'Design',
    difficulty: 'Core',
    topicIds: ['requirements'],
    prompt: 'Design events, invites, RSVP status, capacity, and waitlists.',
    checklist: ['Entities', 'Capacity rules', 'Status changes', 'Race conditions', 'Notifications'],
    comparisonPrompt: 'What race conditions appear when many people RSVP at the same time?',
  },
];
