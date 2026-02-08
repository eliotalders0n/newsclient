# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

EATI (Empowering Access to Timely Information) — a React-based news and media platform for Zambia's government communications. Delivers articles, podcasts, video reels, downloadable resources, and ministry information. Deployed as a web app on Firebase Hosting and as a native Android app via Capacitor.

## Commands

- `npm start` — Start development server (localhost:3000)
- `npm run build` — Production build (output to `build/`)
- `npm test` — Run tests (Jest via react-scripts)
- `firebase deploy` — Deploy to Firebase Hosting (site: zanis-app)
- `npx cap sync` — Sync web build to Capacitor native projects

## Architecture

### Auth-Based Routing Split

`App.js` listens to Firebase Auth state and renders one of two route trees:
- **Authenticated** → `LoginRoutes` (`loginroutes.js`) — includes Profile page, hides Header on story pages
- **Unauthenticated** → `Routers` (`routes.js`) — shows Google Sign-In on profile route instead

Both route files define the same set of routes but with different components for profile-related pages. The `Navigation` bottom bar and `Header` are conditionally hidden on `/story/:id` pages.

### Firebase Integration

Uses Firebase compat SDK (`firebase/compat/*`). Single Firebase instance exported from `src/firebase.js`. Services used:
- **Auth** — Google Sign-In (`comps/template/googleSignIn.js`)
- **Firestore** — All data storage
- **Storage** — Media files (podcasts, images, documents)

### Firestore Collections

| Collection | Purpose |
|---|---|
| Articles | News articles (filtered by `status=="approved"`, `video` boolean separates articles from reels) |
| Users | User profiles (firstName, lastName, photoURL) |
| Comments | Article comments (subcollection-style, filtered by articleId) |
| Reactions | Article reactions/likes |
| Ministries | Government ministry listings |
| Podcasts | Podcast episodes with audioURL |
| Resources | Downloadable documents |
| Feedback | User feedback submissions |

### Custom Hooks (`src/comps/hooks/`)

Data-fetching hooks using Firestore `onSnapshot` for real-time updates. Each returns `{ docs }` (or `{ docs, audioData }` for podcasts). These are the primary data layer — pages consume hooks rather than querying Firestore directly (except `landingPage.js` and `story.js` which do inline fetches).

### Audio Player System

Podcast playback uses a custom audio player (`comps/template/player.js`) with queue management (`QueueComponent.js`), progress bar (`audioProgressBar.js`), and play/pause/skip controls. The player receives `currentSong`, `songIndex`, `onNext`, `onPrev` props.

### UI Stack

- **React Bootstrap** + **Bootstrap Icons** for layout and navigation
- **MUI (Material UI)** for specific components (Skeleton loaders, Typography, Grid)
- **DOMPurify** for sanitizing HTML article content rendered via `dangerouslySetInnerHTML`
- Dark theme by default via `ThemeContext` (`comps/template/themeContext.js`)

### Key Routes

`/` and `/home` — Landing/news feed, `/story/:id` — Article detail, `/podcast` — Podcast player, `/podcastlist/:ministry` — Ministry-filtered podcasts, `/reels` — Video reels, `/resources` — Document library, `/ministries` — Ministry listing, `/chat` — Chat, `/profile` — User profile
