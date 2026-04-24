export type LearningCategory = 'JavaScript' | 'CRUD' | 'Implementation' | 'System Design';
export type Difficulty = 'Starter' | 'Core' | 'Stretch';

export type ExerciseAnswerSections = {
  requirements: string;
  entityModel: string;
  operations: string;
  validation: string;
  edgeCases: string;
  tradeoffs: string;
};

export type DesignAnswerSections = {
  functionalRequirements: string;
  nonFunctionalRequirements: string;
  coreEntities: string;
  apiOperations: string;
  dataFlow: string;
  bottlenecks: string;
  tradeoffs: string;
};

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
  recommendedAnswer: {
    overview: string;
    sections: ExerciseAnswerSections;
    checklistNotes: string[];
  };
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
  recommendedAnswer: {
    overview: string;
    sections: DesignAnswerSections;
  };
};

export type CodeDrill = {
  id: string;
  title: string;
  topicIds: string[];
  difficulty: Difficulty;
  prompt: string;
  starterCode: string;
  testCases: string[];
  hints: string[];
  recommendedSolution: string;
  explanation: string;
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

function exerciseAnswer(title: string, focus: string, operations: string, edgeCases: string): Exercise['recommendedAnswer'] {
  return {
    overview: `A strong answer starts by naming the records involved, then walks through ${focus} with validation and user-facing states.`,
    sections: {
      requirements: `Users should be able to use ${title} for the core workflow, see the current saved state, and recover gracefully from empty or invalid input.`,
      entityModel: `Use records with stable IDs, timestamps when useful, and fields that directly support ${focus}. Keep derived values out of storage unless they are expensive or historically important.`,
      operations,
      validation: 'Validate required fields before saving, normalize simple values like whitespace or case where appropriate, and show the user what needs to be fixed.',
      edgeCases,
      tradeoffs: 'For a local-first app, simple browser storage is enough. For a multi-user app, move persistence and validation behind APIs and think about conflicts, permissions, and versioning.',
    },
    checklistNotes: [
      'Name the entity model before describing UI.',
      'Walk through create, read, update, and delete paths where relevant.',
      'Call out validation, empty states, and failure states explicitly.',
    ],
  };
}

function designAnswer(title: string, entities: string, apiOperations: string, bottlenecks: string): Challenge['recommendedAnswer'] {
  return {
    overview: `A good beginner design for ${title} starts with requirements, then maps the main records to APIs and data flow before discussing scale.`,
    sections: {
      functionalRequirements: 'Users can perform the main product action, read the current state, update or cancel when appropriate, and receive clear feedback.',
      nonFunctionalRequirements: 'Start with correctness and reliability. Mention latency, availability, abuse prevention, and data durability if the feature becomes public.',
      coreEntities: entities,
      apiOperations,
      dataFlow: 'Client sends a request to an API, the API validates the payload, reads or writes storage, and returns a response the UI can render. Background work can handle slow side effects.',
      bottlenecks,
      tradeoffs: 'Keep the first design simple, then explain where caching, queues, indexing, rate limits, or stronger consistency would matter as usage grows.',
    },
  };
}

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
    recommendedAnswer: exerciseAnswer(
      'Todo CRUD',
      'creating and maintaining todo items',
      'Create adds a todo with an ID and default status. Read shows active/completed lists. Update edits title or completion. Delete removes one item and updates the empty state.',
      'Handle blank titles, deleting the item currently being edited, no todos, duplicate-looking todos, and failed persistence.',
    ),
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
    recommendedAnswer: exerciseAnswer(
      'Bookmark Manager',
      'saving links with tags and search',
      'Create validates URL/title/tags. Read shows all bookmarks and filtered results. Update edits metadata. Delete removes one bookmark and recalculates visible results.',
      'Handle invalid URLs, duplicate URLs, empty search results, tag casing, and editing a bookmark while filters are active.',
    ),
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
    recommendedAnswer: exerciseAnswer(
      'Flashcard Deck',
      'decks, cards, and review progress',
      'Create decks and cards separately. Read deck detail and review queue. Update cards or review status. Delete cards or whole decks while cleaning up related progress.',
      'Handle empty decks, deleting a deck with cards, repeated incorrect reviews, stale review history, and reset behavior.',
    ),
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
    recommendedAnswer: exerciseAnswer(
      'Quiz Attempt History',
      'storing attempts and deriving progress stats',
      'Create an attempt after submit. Read history and summaries. Update is usually avoided for historical attempts. Delete can remove one attempt or reset all attempts.',
      'Handle no attempts, partial answers, changed quiz questions, repeated attempts, and reset confirmation.',
    ),
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
    recommendedAnswer: exerciseAnswer(
      'Shopping Cart',
      'cart items, quantities, and derived totals',
      'Create adds a cart item or increments quantity. Read shows items and totals. Update changes quantity. Delete removes an item when quantity reaches zero or user removes it.',
      'Handle duplicate adds, quantity zero, unavailable products, changed prices, and totals recalculating after every change.',
    ),
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
    recommendedAnswer: exerciseAnswer(
      'Comment Thread',
      'comments, replies, and threaded rendering',
      'Create top-level comments or replies with parent IDs. Read builds a tree or nested list. Update edits body/timestamps. Delete may soft-delete to preserve replies.',
      'Handle deleted parents, deep nesting, sorting, editing history, and rendering large threads without confusing the user.',
    ),
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
    recommendedAnswer: exerciseAnswer(
      'User Preferences',
      'defaults, updates, reset, and import/export',
      'Create starts from defaults. Read loads current preferences. Update validates each setting. Delete is usually reset-to-default rather than removing the whole object.',
      'Handle missing settings, invalid imported values, unknown future keys, reset confirmation, and versioned preference files.',
    ),
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
    recommendedAnswer: exerciseAnswer(
      'Search and Filter List',
      'source data plus derived filtered views',
      'Read starts from the full source list. Update query/filter/sort/page state. Derived results apply filter, then sort, then paginate. There may be no create/delete path in this focused exercise.',
      'Handle empty queries, no results, case sensitivity, stable sorting, and current page becoming invalid after filtering.',
    ),
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
    recommendedAnswer: exerciseAnswer(
      'Undo Delete',
      'pending deletion and recovery',
      'Create a pending-delete record or state entry. Read hides or marks the item. Update restores it on undo. Delete permanently after timeout or confirmation.',
      'Handle multiple pending deletes, undo after timeout, page refresh, failed permanent delete, and clear feedback while the undo window is open.',
    ),
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
    recommendedAnswer: exerciseAnswer(
      'Import and Export Saved Data',
      'serializing local app data safely',
      'Create an export file from current local data. Read and validate imported JSON. Update local data by replacing or merging. Delete is not direct, but reset may clear existing data first.',
      'Handle invalid JSON, unsupported versions, duplicate IDs, partial imports, and whether import should replace or merge existing data.',
    ),
  },
];

export const codeDrills: CodeDrill[] = [
  {
    id: 'map-usernames',
    title: 'Map Usernames',
    topicIds: ['arrays-objects'],
    difficulty: 'Starter',
    prompt: 'Write a function that takes an array of user objects and returns an array of usernames.',
    starterCode: `function getUsernames(users) {
  // return an array of username values
}`,
    testCases: [
      "getUsernames([{ username: 'grace' }, { username: 'linus' }]) -> ['grace', 'linus']",
      'getUsernames([]) -> []',
    ],
    hints: ['Use map when each input item becomes one output item.', 'Decide what should happen if the input array is empty.'],
    recommendedSolution: `function getUsernames(users) {
  return users.map((user) => user.username);
}`,
    explanation: 'map is the right fit because the output array has the same length as the input array and each object becomes one string.',
  },
  {
    id: 'count-by-status',
    title: 'Count by Status',
    topicIds: ['arrays-objects', 'crud-flow'],
    difficulty: 'Starter',
    prompt: 'Write a function that counts how many records exist for each status value.',
    starterCode: `function countByStatus(items) {
  // return an object like { active: 2, done: 1 }
}`,
    testCases: [
      "countByStatus([{ status: 'active' }, { status: 'done' }, { status: 'active' }]) -> { active: 2, done: 1 }",
      'countByStatus([]) -> {}',
    ],
    hints: ['Use an object as a lookup table.', 'Initialize missing statuses before incrementing them.'],
    recommendedSolution: `function countByStatus(items) {
  return items.reduce((counts, item) => {
    counts[item.status] = (counts[item.status] ?? 0) + 1;
    return counts;
  }, {});
}`,
    explanation: 'reduce works well when many input records become one summary object keyed by status.',
  },
  {
    id: 'filter-search-results',
    title: 'Filter Search Results',
    topicIds: ['arrays-objects', 'state-validation'],
    difficulty: 'Core',
    prompt: 'Write a case-insensitive search function for records with title and description fields.',
    starterCode: `function searchItems(items, query) {
  // return matching items
}`,
    testCases: [
      "searchItems([{ title: 'React', description: 'UI' }], 'rea') -> [{ title: 'React', description: 'UI' }]",
      "searchItems([{ title: 'React', description: 'UI' }], '') -> [{ title: 'React', description: 'UI' }]",
    ],
    hints: ['Normalize the query and searchable fields to lowercase.', 'An empty query should usually return the full list.'],
    recommendedSolution: `function searchItems(items, query) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return items;
  }

  return items.filter((item) => {
    const title = item.title.toLowerCase();
    const description = item.description.toLowerCase();
    return title.includes(normalizedQuery) || description.includes(normalizedQuery);
  });
}`,
    explanation: 'Filtering is derived state: keep the original list unchanged, normalize the query, and return a new visible list.',
  },
  {
    id: 'dedupe-values',
    title: 'Dedupe Values',
    topicIds: ['arrays-objects'],
    difficulty: 'Starter',
    prompt: 'Write a function that removes duplicate primitive values while preserving first-seen order.',
    starterCode: `function uniqueValues(values) {
  // return each value once
}`,
    testCases: ['uniqueValues([3, 1, 3, 2, 1]) -> [3, 1, 2]', "uniqueValues(['a', 'a', 'b']) -> ['a', 'b']"],
    hints: ['A Set can track what you have already seen.', 'Preserving order means you should scan from left to right.'],
    recommendedSolution: `function uniqueValues(values) {
  const seen = new Set();
  const result = [];

  for (const value of values) {
    if (!seen.has(value)) {
      seen.add(value);
      result.push(value);
    }
  }

  return result;
}`,
    explanation: 'The Set gives fast membership checks, while the result array preserves the order of first appearances.',
  },
  {
    id: 'group-by-category',
    title: 'Group by Category',
    topicIds: ['arrays-objects', 'data-models'],
    difficulty: 'Core',
    prompt: 'Write a function that groups records into arrays by category.',
    starterCode: `function groupByCategory(items) {
  // return { categoryName: [items...] }
}`,
    testCases: [
      "groupByCategory([{ category: 'js', id: 1 }, { category: 'css', id: 2 }, { category: 'js', id: 3 }]) -> { js: [...], css: [...] }",
      'groupByCategory([]) -> {}',
    ],
    hints: ['Use the category as an object key.', 'Create the array for a category before pushing into it.'],
    recommendedSolution: `function groupByCategory(items) {
  return items.reduce((groups, item) => {
    if (!groups[item.category]) {
      groups[item.category] = [];
    }
    groups[item.category].push(item);
    return groups;
  }, {});
}`,
    explanation: 'Grouping is a data-modeling move: each category becomes a key and each key points to the records that belong there.',
  },
  {
    id: 'update-item-immutably',
    title: 'Update Item Immutably',
    topicIds: ['crud-flow', 'state-validation'],
    difficulty: 'Core',
    prompt: 'Write a function that updates one item by ID without mutating the original array.',
    starterCode: `function updateItem(items, id, changes) {
  // return a new array with one updated item
}`,
    testCases: [
      "updateItem([{ id: 'a', done: false }], 'a', { done: true }) -> [{ id: 'a', done: true }]",
      "updateItem([{ id: 'a', done: false }], 'missing', { done: true }) -> original values",
    ],
    hints: ['Use map because each old item becomes one next item.', 'Only copy the matching item.'],
    recommendedSolution: `function updateItem(items, id, changes) {
  return items.map((item) => {
    if (item.id !== id) {
      return item;
    }
    return { ...item, ...changes };
  });
}`,
    explanation: 'This mirrors a CRUD update: find the matching ID, return an updated copy, and leave every other record unchanged.',
  },
  {
    id: 'promise-sequence',
    title: 'Promise Sequence',
    topicIds: ['async-promises'],
    difficulty: 'Core',
    prompt: 'Explain the order of logs when synchronous code, resolved promises, and async/await run together.',
    starterCode: `console.log('A');

Promise.resolve().then(() => console.log('B'));

async function run() {
  console.log('C');
  await Promise.resolve();
  console.log('D');
}

run();
console.log('E');`,
    testCases: ['Expected log order -> A, C, E, B, D'],
    hints: ['Synchronous code runs first.', 'Promise callbacks and resumed async functions run later as microtasks.'],
    recommendedSolution: `// A logs first because it is synchronous.
// run() logs C synchronously until it reaches await.
// E logs before promise microtasks resume.
// Then B and D run from the microtask queue.
// Final order: A, C, E, B, D.`,
    explanation: 'async/await pauses at await, so the rest of the async function resumes after the current synchronous call stack completes.',
  },
  {
    id: 'closure-counter',
    title: 'Closure Counter',
    topicIds: ['async-promises', 'state-validation'],
    difficulty: 'Stretch',
    prompt: 'Write a function that creates a counter with increment, decrement, and getValue methods.',
    starterCode: `function createCounter(initialValue = 0) {
  // return methods that remember the current count
}`,
    testCases: ['const counter = createCounter(2); counter.increment() -> 3; counter.decrement() -> 2; counter.getValue() -> 2'],
    hints: ['Store the count in the outer function scope.', 'Return functions that close over that variable.'],
    recommendedSolution: `function createCounter(initialValue = 0) {
  let count = initialValue;

  return {
    increment() {
      count += 1;
      return count;
    },
    decrement() {
      count -= 1;
      return count;
    },
    getValue() {
      return count;
    },
  };
}`,
    explanation: 'The returned methods keep access to count through closure even after createCounter has finished running.',
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
    recommendedAnswer: designAnswer(
      'URL Shortener System',
      'User, LongUrl, ShortCode, ClickEvent, and optional AbuseReport.',
      'POST /links creates a short code, GET /:code redirects, GET /links lists owned links, DELETE /links/:id disables a link.',
      'Hot links can create heavy read traffic, random code collisions need handling, and abusive links need rate limiting or moderation.',
    ),
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
    recommendedAnswer: designAnswer(
      'Notes App as a Service',
      'User, Note, Notebook or Tag, Permission, and AuditEvent.',
      'POST /notes creates, GET /notes lists, GET /notes/:id reads, PATCH /notes/:id updates, DELETE /notes/:id deletes or archives.',
      'Search can become slow without indexes, permission checks must happen on every request, and concurrent edits need a conflict strategy.',
    ),
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
    recommendedAnswer: designAnswer(
      'Quiz Platform',
      'User, Quiz, Question, QuestionVersion, QuizAttempt, Answer, and ScoreSummary.',
      'GET /quizzes reads content, POST /attempts submits answers, GET /attempts shows history, GET /analytics derives performance.',
      'Attempt history needs question versioning, scoring must be consistent, analytics can be precomputed, and public quizzes may need abuse prevention.',
    ),
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
    recommendedAnswer: designAnswer(
      'Flashcard Review System',
      'User, Deck, Card, ReviewAttempt, ReviewSchedule, and DailyQueue.',
      'POST /cards creates cards, POST /reviews records results, GET /queue returns due cards, PATCH /cards/:id edits content.',
      'Scheduling can be expensive for large decks, queues need consistent due dates, and background jobs can prepare daily review sets.',
    ),
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
    recommendedAnswer: designAnswer(
      'Notification System',
      'User, NotificationPreference, Event, Notification, DeliveryAttempt, and Template.',
      'POST /events records a trigger, workers create notifications, GET /notifications lists in-app items, PATCH /notifications/:id marks read.',
      'Email providers can fail, retries can duplicate messages, user preferences must be checked, and queues protect the main request path.',
    ),
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
    recommendedAnswer: designAnswer(
      'File Upload Metadata Service',
      'User, FileMetadata, UploadSession, ScanResult, Permission, and StoragePointer.',
      'POST /uploads starts an upload, PATCH /files/:id updates metadata, GET /files lists files, workers update scan status.',
      'Large uploads need resumability, scan jobs are async, permissions matter on every read, and metadata/search indexes can lag.',
    ),
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
    recommendedAnswer: designAnswer(
      'Event RSVP System',
      'User, Event, Invitation, RSVP, WaitlistEntry, and Notification.',
      'POST /events creates events, POST /rsvps changes status, GET /events/:id shows capacity, workers send reminders or waitlist updates.',
      'Capacity updates can race, waitlist promotion needs ordering, cancellations must free seats, and notifications should not block RSVP writes.',
    ),
  },
];
