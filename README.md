# webext-reactive-store

A reactive state management library for Chrome extensions using the observer pattern with chrome.storage sync.

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

## License

MIT
