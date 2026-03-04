# webext-reactive-store

> Reactive state store for Chrome extensions -- subscriptions, cross-context sync, computed properties, and middleware for MV3.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## Install

```bash
npm install webext-reactive-store
```

## Usage

```ts
import { ReactiveStore } from 'webext-reactive-store';

// Create a store with initial state
const store = new ReactiveStore({
  count: 0,
  theme: 'light',
  user: null as string | null,
});

// Subscribe to a specific key
const unsubscribe = store.subscribe('count', (value, prev) => {
  console.log(`count changed: ${prev} -> ${value}`);
});

// Subscribe to all changes
store.onAny((state, change) => {
  console.log(`${change.key} updated to`, change.value);
});

// Update state
store.set('count', 1);
store.update({ theme: 'dark', user: 'Alice' });

// Read state
console.log(store.get('theme'));      // "dark"
console.log(store.getState());        // { count: 1, theme: "dark", user: "Alice" }

// Add middleware (e.g. logging, validation)
store.use((key, value, prev) => {
  console.log(`[middleware] ${key}: ${prev} -> ${value}`);
  return value; // return modified value or undefined to keep original
});

// Define computed properties
store.defineComputed('isLoggedIn', (state) => state.user !== null);
console.log(store.getComputed('isLoggedIn')); // true

// Enable cross-context sync via chrome.runtime messaging
store.enableSync('my-store-channel');

// Persist to chrome.storage.local
await store.save('my-store-key');
await store.load('my-store-key');

// Unsubscribe when done
unsubscribe();
```

## API

### `class ReactiveStore<T extends Record<string, any>>`

#### `constructor(initial: T)`

Create a new store with the given initial state object.

#### `getState(): Readonly<T>`

Return a shallow copy of the full state object.

#### `get<K extends keyof T>(key: K): T[K]`

Get the value of a single state key.

#### `set<K extends keyof T>(key: K, value: T[K]): void`

Set a single state key. Runs middleware, then notifies key-specific and wildcard (`*`) subscribers.

#### `update(partial: Partial<T>): void`

Update multiple keys at once. Calls `set()` for each key, triggering middleware and subscriptions individually.

#### `subscribe<K extends keyof T>(key: K, callback: (value: T[K], prev: T[K]) => void): () => void`

Subscribe to changes on a specific key. Returns an unsubscribe function.

#### `onAny(callback: (state: T, change: { key: string; value: any; prev: any }) => void): () => void`

Subscribe to all state changes. The callback receives the full state and a change descriptor. Returns an unsubscribe function.

#### `use(middleware: (key: string, value: any, prev: any) => any): this`

Add a middleware function that runs before every state update. The middleware receives the key, new value, and previous value. Return a value to transform the update, or `undefined` to keep the original. Returns `this` for chaining.

#### `defineComputed(name: string, fn: (state: T) => any): this`

Define a computed property that derives a value from the current state. Returns `this` for chaining.

#### `getComputed(name: string): any`

Evaluate and return a computed property by name. Returns `undefined` if the computed property has not been defined.

#### `enableSync(channel?: string): this`

Enable cross-context state synchronization via `chrome.runtime` messaging. All `set()` calls will broadcast changes to other contexts (background, popup, content scripts) listening on the same `channel` (default: `"__store_sync__"`). Returns `this` for chaining.

#### `save(key?: string): Promise<void>`

Persist the current state to `chrome.storage.local` under the given key (default: `"__reactive_store__"`).

#### `load(key?: string): Promise<void>`

Load state from `chrome.storage.local` and merge it into the current state. Uses the given key (default: `"__reactive_store__"`).

## License

MIT
