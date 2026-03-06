# webext-reactive-store

Reactive state store for Chrome extensions. Subscriptions, cross-context sync, computed properties, and middleware, all built for Manifest V3.

INSTALL

```bash
npm install webext-reactive-store
```

QUICK START

```ts
import { ReactiveStore } from 'webext-reactive-store';

const store = new ReactiveStore({
  count: 0,
  theme: 'light',
  user: null as string | null,
});

// subscribe to a specific key
const unsub = store.subscribe('count', (value, prev) => {
  console.log(`count changed from ${prev} to ${value}`);
});

// update state
store.set('count', 1);
store.update({ theme: 'dark', user: 'Alice' });

// read state
store.get('theme');    // "dark"
store.getState();      // { count: 1, theme: "dark", user: "Alice" }

unsub();
```

LISTENING TO ALL CHANGES

```ts
store.onAny((state, change) => {
  console.log(`${change.key} updated to`, change.value);
});
```

onAny fires on every key update. The callback receives the full state snapshot and a change object with key, value, and prev fields.

MIDDLEWARE

```ts
store.use((key, value, prev) => {
  console.log(`[mw] ${key}: ${prev} -> ${value}`);
  return value;
});
```

Middleware runs before each state update. Return a value to transform the update. Return undefined to keep the original value. Multiple middleware functions run in order and can be chained with store.use().use().

COMPUTED PROPERTIES

```ts
store.defineComputed('isLoggedIn', (state) => state.user !== null);

store.getComputed('isLoggedIn'); // true
```

Computed properties are evaluated on read against the current state. Returns undefined if the named computed has not been defined.

CROSS-CONTEXT SYNC

```ts
store.enableSync('my-channel');
```

Enables state synchronization between background, popup, and content script contexts using chrome.runtime messaging. Every set() call broadcasts the change to all other contexts listening on the same channel. The default channel is "__store_sync__".

PERSISTENCE

```ts
await store.save('my-key');
await store.load('my-key');
```

save() writes the full state to chrome.storage.local under the given key. load() reads it back and merges into the current state. Both default to "__reactive_store__" when no key is provided.

API REFERENCE

ReactiveStore<T extends Record<string, any>>

constructor(initial: T)
  Creates a new store seeded with the initial state object.

getState(): Readonly<T>
  Returns a shallow copy of the full state.

get<K extends keyof T>(key: K): T[K]
  Returns the value for a single key.

set<K extends keyof T>(key: K, value: T[K]): void
  Sets a single key. Runs all middleware, then notifies key-specific subscribers and wildcard subscribers.

update(partial: Partial<T>): void
  Sets multiple keys. Calls set() internally for each entry.

subscribe<K extends keyof T>(key: K, cb: (value: T[K], prev: T[K]) => void): () => void
  Subscribes to changes on one key. Returns an unsubscribe function.

onAny(cb: (state: T, change: { key: string; value: any; prev: any }) => void): () => void
  Subscribes to all state changes. Returns an unsubscribe function.

use(mw: (key: string, value: any, prev: any) => any): this
  Registers middleware. Returns this for chaining.

defineComputed(name: string, fn: (state: T) => any): this
  Defines a computed property. Returns this for chaining.

getComputed(name: string): any
  Evaluates and returns a computed property. Returns undefined if not defined.

enableSync(channel?: string): this
  Turns on cross-context sync via chrome.runtime messaging. Default channel is "__store_sync__". Returns this for chaining.

save(key?: string): Promise<void>
  Persists state to chrome.storage.local. Default key is "__reactive_store__".

load(key?: string): Promise<void>
  Loads and merges state from chrome.storage.local. Default key is "__reactive_store__".

LICENSE

MIT. See LICENSE file.

---

Built at zovo.one, a Chrome extension studio by theluckystrike.
