# webext-reactive-store

[![npm version](https://img.shields.io/npm/v/webext-reactive-store)](https://npmjs.com/package/webext-reactive-store)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![CI Status](https://img.shields.io/github/actions/workflow/status/theluckystrike/webext-reactive-store/ci.yml?branch=main)](https://github.com/theluckystrike/webext-reactive-store/actions)
[![Discord](https://img.shields.io/badge/Discord-Zovo-blueviolet.svg?logo=discord)](https://discord.gg/zovo)
[![Website](https://img.shields.io/badge/Website-zovo.one-blue)](https://zovo.one)
[![GitHub Stars](https://img.shields.io/github/stars/theluckystrike/webext-reactive-store?style=social)](https://github.com/theluckystrike/webext-reactive-store)

> A reactive state management library for Chrome extensions using the observer pattern with chrome.storage sync.

## Overview

**webext-reactive-store** is a reactive state management library for Chrome extensions. It uses the observer pattern with chrome.storage sync to automatically keep state synchronized across all extension contexts (popup, background, content scripts).

Part of the [Zovo](https://zovo.one) developer tools family.

## Features

- ✅ **Reactive Updates** - Subscribe to state changes
- ✅ **Automatic Sync** - Sync across extension contexts
- ✅ **Immutable Updates** - Safe state mutations
- ✅ **TypeScript** - Full type support
- ✅ **Middleware** - Extend with custom logic
- ✅ **Persistence** - Automatic chrome.storage sync

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

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/store-improvement`
3. **Make** your changes
4. **Test** your changes: `npm test`
5. **Commit** your changes: `git commit -m 'Add new feature'`
6. **Push** to the branch: `git push origin feature/store-improvement`
7. **Submit** a Pull Request

## Built by Zovo

Part of the [Zovo](https://zovo.one) developer tools family — privacy-first Chrome extensions built by developers, for developers.

## See Also

### Related Zovo Repositories

- [webext-bridge](https://github.com/theluckystrike/webext-bridge) - Cross-context messaging
- [webext-options-page](https://github.com/theluckystrike/webext-options-page) - Pre-built options page
- [chrome-storage-plus](https://github.com/theluckystrike/chrome-storage-plus) - Type-safe storage wrapper
- [chrome-extension-starter-mv3](https://github.com/theluckystrike/chrome-extension-starter-mv3) - Extension template
- [zovo-extension-template](https://github.com/theluckystrike/zovo-extension-template) - Privacy-first extension template

### Zovo Chrome Extensions

- [Zovo Tab Manager](https://chrome.google.com/webstore/detail/zovo-tab-manager) - Manage tabs efficiently
- [Zovo Focus](https://chrome.google.com/webstore/detail/zovo-focus) - Block distractions
- [Zovo Permissions Scanner](https://chrome.google.com/webstore/detail/zovo-permissions-scanner) - Check extension privacy grades

Visit [zovo.one](https://zovo.one) for more information.

## License

MIT — [Zovo](https://zovo.one)

---

*Built by developers, for developers. No compromises on privacy.*
