# webext-reactive-store — Reactive State Management
> **Built by [Zovo](https://zovo.one)** | `npm i webext-reactive-store`

Per-key subscriptions, middleware pipeline, computed properties, and cross-context sync via messaging.

```typescript
import { ReactiveStore } from 'webext-reactive-store';
const store = new ReactiveStore({ count: 0, name: '' });
store.subscribe('count', (val) => updateUI(val));
store.use((key, val) => { console.log(key, val); return val; });
store.enableSync();
store.set('count', 42);
```
MIT License
