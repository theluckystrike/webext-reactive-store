# webext-reactive-store

[![npm version](https://img.shields.io/npm/v/@theluckystrike/webext-reactive-store?color=green)](https://www.npmjs.com/package/@theluckystrike/webext-reactive-store)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)](https://www.typescriptlang.org/)
[![Last Commit](https://img.shields.io/github/last-commit/theluckystrike/webext-reactive-store)](https://github.com/theluckystrike/webext-reactive-store/commits/main)

A reactive state store for Chrome extensions — featuring subscriptions, cross-context sync, computed properties, and middleware, all built for Manifest V3.

## Overview

`webext-reactive-store` provides a simple yet powerful way to manage reactive state across your Chrome extension's different contexts (popup, background script, content scripts). It bridges the gap between isolated contexts with automatic synchronization and persistent storage.

### Key Features

- **Reactive State** — Subscribe to state changes with an intuitive observer pattern
- **Cross-Context Sync** — Automatically sync state between popup, background, and content scripts
- **Computed Properties** — Derive values from state that automatically update
- **Middleware** — Transform or validate state updates with middleware functions
- **Persistence** — Save and load state from `chrome.storage.local`
- **TypeScript First** — Full type safety out of the box

## Installation

```bash
npm install @theluckystrike/webext-reactive-store
```

Or using yarn:

```bash
yarn add @theluckystrike/webext-reactive-store
```

## Quick Start

```typescript
import { ReactiveStore } from '@theluckystrike/webext-reactive-store';

interface AppState {
  count: number;
  theme: 'light' | 'dark';
  user: string | null;
}

const store = new ReactiveStore<AppState>({
  count: 0,
  theme: 'light',
  user: null,
});

// Subscribe to a specific key
const unsubscribe = store.subscribe('count', (value, prev) => {
  console.log(`Count changed from ${prev} to ${value}`);
});

// Update state
store.set('count', 1);
store.update({ theme: 'dark', user: 'Alice' });

// Read state
store.get('theme');     // "dark"
store.getState();       // { count: 1, theme: "dark", user: "Alice" }

unsubscribe();
```

## Cross-Context Usage

One of the most powerful features is synchronizing state across your extension's different contexts.

### Background Script (Central Store)

```typescript
// background.ts
import { ReactiveStore } from '@theluckystrike/webext-reactive-store';

interface AppState {
  isAuthenticated: boolean;
  user: { id: string; name: string } | null;
  settings: { notifications: boolean; theme: string };
}

const store = new ReactiveStore<AppState>({
  isAuthenticated: false,
  user: null,
  settings: { notifications: true, theme: 'light' },
});

// Enable cross-context sync
store.enableSync('my-extension-sync');

// Load persisted state on startup
store.load();

// Save state when it changes
store.onAny(() => store.save());
```

### Popup Script

```typescript
// popup.ts
import { ReactiveStore } from '@theluckystrike/webext-reactive-store';

interface AppState {
  isAuthenticated: boolean;
  user: { id: string; name: string } | null;
  settings: { notifications: boolean; theme: string };
}

const store = new ReactiveStore<AppState>({
  isAuthenticated: false,
  user: null,
  settings: { notifications: true, theme: 'light' },
});

// Connect to the same sync channel
store.enableSync('my-extension-sync');

// React to background changes
store.subscribe('isAuthenticated', (value) => {
  if (value) {
    console.log('User logged in!');
  }
});

// Load initial state
store.load();

// Update state (automatically syncs to background)
store.set('settings', { ...store.get('settings'), theme: 'dark' });
```

### Content Script

```typescript
// content.ts
import { ReactiveStore } from '@theluckystrike/webext-reactive-store';

interface AppState {
  theme: 'light' | 'dark';
}

const store = new ReactiveStore<AppState>({
  theme: 'light',
});

// Listen for theme changes from popup/background
store.enableSync('my-extension-sync');

store.subscribe('theme', (theme) => {
  document.documentElement.setAttribute('data-theme', theme);
});
```

## API Reference

### Constructor

```typescript
new ReactiveStore<T>(initial: T)
```

Creates a new store with the given initial state.

### State Access

| Method | Description |
|--------|-------------|
| `getState(): Readonly<T>` | Returns a shallow copy of the entire state |
| `get<K extends keyof T>(key: K): T[K]` | Returns the value for a single key |

### State Mutation

| Method | Description |
|--------|-------------|
| `set<K extends keyof T>(key: K, value: T[K]): void` | Sets a single key. Runs middleware, then notifies subscribers |
| `update(partial: Partial<T>): void` | Sets multiple keys atomically |

### Subscriptions

| Method | Description |
|--------|-------------|
| `subscribe<K extends keyof T>(key: K, callback: (value: T[K], prev: T[K]) => void): () => void` | Subscribe to changes on a specific key. Returns unsubscribe function |
| `onAny(callback: (state: T, change: { key: string; value: any; prev: any }) => void): () => void` | Subscribe to all state changes. Returns unsubscribe function |

### Middleware

```typescript
store.use((key, value, prev) => {
  // Transform the value
  if (key === 'count') {
    return value * 2;
  }
  return value;
});
```

Middleware runs before each state update. Return a value to transform the update.

### Computed Properties

```typescript
store.defineComputed('isLoggedIn', (state) => state.user !== null);
store.defineComputed('themeClass', (state) => `theme-${state.theme}`);

store.getComputed('isLoggedIn'); // boolean
```

Computed properties are derived values that update automatically when their dependencies change.

### Persistence

```typescript
// Save state to chrome.storage.local
await store.save('my-store-key');

// Load state from chrome.storage.local
await store.load('my-store-key');
```

### Cross-Context Sync

```typescript
store.enableSync('my-channel'); // Default channel: "__store_sync__"
```

Enables state synchronization between all extension contexts using `chrome.runtime` messaging.

## Project Structure

```
webext-reactive-store/
├── src/
│   ├── index.ts          # Main exports
│   ├── store.ts          # ReactiveStore implementation
│   └── store.test.ts     # Unit tests
├── package.json
├── tsconfig.json
├── LICENSE
└── README.md
```

## License

MIT — see [LICENSE](LICENSE) for details.

---

Built at [zovo.one](https://zovo.one) by [theluckystrike](https://github.com/theluckystrike)
