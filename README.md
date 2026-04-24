# My Learning Playground

A local-first study app for learning CRUD, implementation-style interview questions, and beginner system design principles.

The app is intentionally small: it runs in the browser, saves progress to `localStorage`, and can be hosted as a static site on GitHub Pages.

## What It Includes

- Topic-based lessons for CRUD, data models, API shapes, and requirements.
- A quiz flow that stores attempts locally.
- Implementation and system design challenge prompts.
- Notes tied to topics or challenges.
- A progress dashboard.

## Tech Stack

- Vite
- React
- TypeScript
- Local browser storage
- CSS

## Getting Started

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Build the static site:

```bash
npm run build
```

Preview the build:

```bash
npm run preview
```

## Project Goals

This project is meant to help a beginner learn how product ideas map to implementation details:

- What data needs to exist?
- What CRUD actions are available?
- Where should validation happen?
- What does the UI need to show after each action?
- What edge cases should be considered?
- How would the same feature be described in a system design interview?

## Roadmap

- Add editable lesson content.
- Add challenge categories and filtering.
- Add export/import for local progress.
- Add more quiz question types.
- Add IndexedDB once `localStorage` starts feeling limiting.
- Add GitHub Pages deployment workflow.

## Local Data

The app stores progress, notes, and quiz attempts in your browser under these keys:

- `mlp.notes`
- `mlp.progress`
- `mlp.quizAttempts`

Use the reset button in the app header to clear local study data.
