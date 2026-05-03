# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start Vite dev server
npm run build        # Production build
npm run preview      # Preview production build

# CLI helpers (require .env with Firebase credentials)
npm run obtainDataSchema   # Inspect Firestore document field types
npm run analyzeData        # Compute numeric field metrics from Firestore
```

No lint or test scripts are configured.

## Environment

Copy `.env.example` to `.env` and fill in the Firebase project credentials (`VITE_FIREBASE_*`). The app targets the `investmentEvolutions` Firestore collection, `user1` document — both defined in `src/firebase/config.ts`.

## Architecture

**Data flow:** Firestore → `useFirestoreDocument` hook → `App` → `Chart`

The app is a single-view investment portfolio chart. `App.tsx` subscribes to a single Firestore document via `useFirestoreDocument` (real-time `onSnapshot`), then passes the data array to the `Chart` component. There is no router and no state management library.

**Chart modifier system** (`src/components/Chart/modifiers/`): the Chart component builds its D3 visualization by running a sequence of `Modifier<T>` objects against the SVG. Each modifier is a plain object with a `modify(selection, data, scales)` method. Current modifiers: `AddAxis`, `AddShadow`, `AddSegments`, `AddLegend`, `AddTooltip`. To add a visual feature, create a new file implementing the `Modifier` interface and add it to the modifier list in `Chart/index.tsx`.

**Chart data shape:**
```typescript
{
  date: Timestamp;        // Firestore Timestamp
  contributions: number;
  portfolioValue: number;
  dailyReturn: number;
  portofolioIndex: number;  // note: typo in field name is intentional (matches Firestore)
}
```

**TypeScript:** strict mode with `noUnusedLocals` and `noUnusedParameters` — the build will fail if unused identifiers are present.
