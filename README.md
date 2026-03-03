# webext-reactive-store

[![npm version](https://img.shields.io/npm/v/webext-reactive-store)](https://npmjs.com/package/webext-reactive-store)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Chrome Web Extension](https://img.shields.io/badge/Chrome-Web%20Extension-orange.svg)](https://developer.chrome.com/docs/extensions/)
[![Discord](https://img.shields.io/badge/Discord-Zovo-blueviolet.svg?logo=discord)](https://discord.gg/zovo)

A reactive state management library for Chrome extensions using the observer pattern with chrome.storage sync.

Part of the [Zovo](https://zovo.one) family of Chrome extension utilities.

## Features

- Reactive state updates with subscribers
- Automatic sync across extension contexts
- Immutable state updates
- TypeScript support
- Middleware support
- Persistence with chrome.storage

## Installation

```bash
npm install webext-reactive-store
```

## Quick Start

### Create a Store

```javascript
import { createStore } from 'webext-reactive-store';

const store = createStore({
  initialState: {
    user: null,
    settings: {
      theme: 'dark',
      notifications: true
    },
    items: []
  }
});
```

### Subscribe to Changes

```javascript
// Subscribe to entire state
store.subscribe((state) => {
  console.log('State changed:', state);
});

// Subscribe to specific slice
store.subscribe('user', (user) => {
  console.log('User changed:', user);
});

store.subscribe('settings.theme', (theme) => {
  console.log('Theme changed to:', theme);
});
```

### Update State

```javascript
// Update entire state
store.setState({ user: { name: 'John' } });

// Update with updater function
store.setState((state) => ({
  ...state,
  user: { ...state.user, name: 'Jane' }
}));

// Nested updates
store.setState('settings.theme', 'light');

store.setState('items', (items) => [...items, newItem]);
```

### Use in Background

```javascript
// background.js
import { createStore } from 'webext-reactive-store';

const store = createStore({ initialState: { count: 0 } });

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'INCREMENT') {
    store.setState('count', (c) => c + 1);
  }
});
```

### Use in Content Script

```javascript
// content-script.js
import { createStore } from 'webext-reactive-store';

const store = createStore({ 
  initialState: { count: 0 },
  storage: 'sync' // or 'local'
});

// React to background changes
store.subscribe('count', (count) => {
  document.getElementById('counter').textContent = count;
});
```

## API

### createStore(options)

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| initialState | object | {} | Initial state object |
| storage | string | 'local' | Storage area ('local' or 'sync') |
| middleware | array | [] | Middleware functions |

### store Methods

| Method | Description |
|--------|-------------|
| `getState()` | Get current state |
| `setState(updater)` | Update state |
| `subscribe(listener)` | Subscribe to all changes |
| `subscribe(path, listener)` | Subscribe to path changes |
| `unsubscribe(listener)` | Unsubscribe from changes |
| `reset()` | Reset to initial state |

### Middleware

```javascript
const loggerMiddleware = (store) => (next) => (action) => {
  console.log('Before:', store.getState());
  next(action);
  console.log('After:', store.getState());
};

const store = createStore({
  initialState: { ... },
  middleware: [loggerMiddleware]
});
```

## TypeScript

```typescript
interface AppState {
  user: User | null;
  settings: Settings;
  items: Item[];
}

const store = createStore<AppState>({
  initialState: {
    user: null,
    settings: { theme: 'dark' },
    items: []
  }
});

// Fully typed subscriptions
store.subscribe('user', (user) => {
  // user is typed as User | null
});
```

## Chrome Storage Sync

For syncing across devices:

```javascript
const store = createStore({
  initialState: { theme: 'dark' },
  storage: 'sync' // Uses chrome.storage.sync
});

// Changes automatically sync across devices
store.setState('theme', 'light');
```

## Browser Support

- Chrome 88+
- Edge 88+
- Chromium-based browsers

## Contributing

Contributions are welcome! Please read our [contributing guidelines](CONTRIBUTING.md) before submitting PRs.

## See Also

### Related Zovo Repositories

- [zovo-extension-template](https://github.com/theluckystrike/zovo-extension-template) - Boilerplate for building privacy-first Chrome extensions
- [zovo-types-webext](https://github.com/theluckystrike/zovo-types-webext) - Comprehensive TypeScript type definitions
- [webext-bridge](https://github.com/theluckystrike/webext-bridge) - Cross-context messaging
- [webext-storage-sync](https://github.com/theluckystrike/webext-storage-sync) - Cross-device storage sync

Visit [zovo.one](https://zovo.one) for more information.

## License

MIT - [Zovo](https://zovo.one)
