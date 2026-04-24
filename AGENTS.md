# AGENTS.md

## Project Intent

My Learning Playground is a simple local-first learning platform. It should help the owner practice CRUD thinking, implementation design, and beginner system design through lessons, quizzes, prompts, notes, and progress tracking.

Keep the app approachable. Prefer clear code and visible learning structure over clever abstractions.

## Current Architecture

- `src/content.ts` contains hardcoded learning content.
- `src/storage.ts` owns low-level localStorage helpers.
- `src/services.ts` owns CRUD-like operations, scoring, filtering, import/export, and mock interview prompts.
- `src/App.tsx` owns the prototype UI and view state.
- `src/styles.css` owns global styling.
- `src/services.test.ts` covers logic-heavy behavior.

The app currently uses `localStorage`. Do not add a backend unless the user explicitly asks for one.

## Development Commands

```bash
npm install
npm run dev
npm run build
npm run preview
npm run test
```

## Coding Guidelines

- Keep TypeScript types close to the data they describe.
- Keep data operations in `storage.ts` or a future service module, not deeply inside UI components.
- Keep behavior-heavy code in `services.ts` or future service modules so it stays testable.
- Preserve the local-first GitHub Pages direction.
- Avoid adding routing, auth, databases, or heavy frameworks until there is a concrete need.
- Make the learning flow more useful before making the UI more decorative.
- Keep copy plain and beginner-friendly.

## Suggested Next Work

- Split large UI sections from `App.tsx` once the roadmap UI grows further.
- Add tests around design response saving and import validation.
- Add more challenge templates for common interview prompts.
- Add a GitHub Pages deployment workflow.
