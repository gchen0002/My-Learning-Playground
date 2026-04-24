# AGENTS.md

## Project Intent

My Learning Playground is a simple local-first learning platform. It should help the owner practice CRUD thinking, implementation design, and beginner system design through lessons, quizzes, prompts, notes, and progress tracking.

Keep the app approachable. Prefer clear code and visible learning structure over clever abstractions.

## Current Architecture

- `src/content.ts` contains hardcoded learning content.
- `src/storage.ts` owns local persistence and CRUD-like operations.
- `src/App.tsx` owns the prototype UI and view state.
- `src/styles.css` owns global styling.

The app currently uses `localStorage`. Do not add a backend unless the user explicitly asks for one.

## Development Commands

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Coding Guidelines

- Keep TypeScript types close to the data they describe.
- Keep data operations in `storage.ts` or a future service module, not deeply inside UI components.
- Preserve the local-first GitHub Pages direction.
- Avoid adding routing, auth, databases, or heavy frameworks until there is a concrete need.
- Make the learning flow more useful before making the UI more decorative.
- Keep copy plain and beginner-friendly.

## Suggested Next Work

- Split large UI sections from `App.tsx` once the prototype grows.
- Add tests around scoring, progress updates, and note CRUD.
- Add import/export for local data.
- Add more challenge templates for common interview prompts.
