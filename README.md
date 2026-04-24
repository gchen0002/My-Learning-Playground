# My Learning Playground

A local-first study app for learning CRUD, implementation-style interview questions, and beginner system design principles.

The app is intentionally small: it runs in the browser, saves progress to `localStorage`, and can be hosted as a static site on GitHub Pages.

## What It Includes

- A topic-based learning path for JavaScript, CRUD, implementation design, and simple system design.
- Topic-based lessons with broad explanations, deeper breakdowns, mental models, and linked practice.
- A quiz flow that stores attempts locally.
- JavaScript code drills with starter code, examples, saved attempts, and recommended solutions.
- Exercise prompts with filters, structured answer templates, and checklist scoring.
- Design Mode prompts for requirements, entities, APIs, data flow, bottlenecks, and tradeoffs.
- Mock Interview mode with one JavaScript question, one CRUD prompt, and one system design prompt.
- Optional recommended answers for exercises, design prompts, and mock interviews.
- Notes, progress tracking, import/export, and a dashboard.
- A simple gray-first interface with light and dark mode.

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

Run tests:

```bash
npm run test
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
- Add more quiz question types.
- Add a daily practice queue.
- Add response review rubrics.
- Add IndexedDB once `localStorage` starts feeling limiting.
- Add GitHub Pages deployment workflow.

## Local Data

The app stores progress, notes, and quiz attempts in your browser under these keys:

- `mlp.notes`
- `mlp.progress`
- `mlp.quizAttempts`
- `mlp.exerciseResponses`
- `mlp.drillAttempts`
- `mlp.mockInterviewAttempts`

Use the reset button in the app header to clear local study data.

## Appearance

The app defaults to a dark gray Paper Stack style. Use the Light/Dark switch in the top toolbar to change color mode.
