<div align="center">

# webext-reactive-store

Reactive state store for Chrome extensions. Subscriptions, cross-context sync, computed properties, and middleware for MV3.

[![npm version](https://img.shields.io/npm/v/webext-reactive-store)](https://www.npmjs.com/package/webext-reactive-store)
[![npm downloads](https://img.shields.io/npm/dm/webext-reactive-store)](https://www.npmjs.com/package/webext-reactive-store)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/webext-reactive-store)

[Installation](#installation) · [Quick Start](#quick-start) · [API](#api) · [License](#license)

</div>

---

## Features

- **Reactive** -- subscribe to state changes with fine-grained selectors
- **Cross-context sync** -- state syncs across background, popup, and content scripts
- **Computed properties** -- derived state that updates automatically
- **Middleware** -- logging, persistence, validation, and custom transforms
- **Immutable updates** -- safe state mutations without side effects
- **TypeScript** -- fully typed state, actions, and selectors

## Installation

```bash
npm install webext-reactive-store
```

<details>
<summary>Other package managers</summary>

```bash
pnpm add webext-reactive-store
# or
yarn add webext-reactive-store
```

</details>

## Quick Start

```typescript
import { createStore } from "webext-reactive-store";

const store = createStore({
  count: 0,
  user: null as string | null,
});

store.subscribe("count", (value) => console.log("Count:", value));
store.set("count", store.get("count") + 1);
```

## API

| Method | Description |
|--------|-------------|
| `createStore(initial)` | Create a reactive store with initial state |
| `get(key)` | Read a value |
| `set(key, value)` | Update a value (notifies subscribers) |
| `subscribe(key, callback)` | Subscribe to changes on a key |
| `computed(deps, fn)` | Create a computed property |
| `use(middleware)` | Add middleware to the store pipeline |



## Part of @zovo/webext

This package is part of the [@zovo/webext](https://github.com/theluckystrike) family -- typed, modular utilities for Chrome extension development:

| Package | Description |
|---------|-------------|
| [webext-storage](https://github.com/theluckystrike/webext-storage) | Typed storage with schema validation |
| [webext-messaging](https://github.com/theluckystrike/webext-messaging) | Type-safe message passing |
| [webext-tabs](https://github.com/theluckystrike/webext-tabs) | Tab query helpers |
| [webext-cookies](https://github.com/theluckystrike/webext-cookies) | Promise-based cookies API |
| [webext-i18n](https://github.com/theluckystrike/webext-i18n) | Internationalization toolkit |

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License -- see [LICENSE](LICENSE) for details.

---

<div align="center">

Built by [theluckystrike](https://github.com/theluckystrike) · [zovo.one](https://zovo.one)

</div>
