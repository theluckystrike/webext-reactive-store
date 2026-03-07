import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ReactiveStore } from './index';

// Mock chrome API
const chromeMock = {
  runtime: {
    onMessage: { addListener: vi.fn() },
    sendMessage: vi.fn().mockResolvedValue({}),
  },
  storage: {
    local: {
      get: vi.fn(),
      set: vi.fn(),
    },
  },
};
(globalThis as any).chrome = chromeMock;

describe('ReactiveStore', () => {
  interface State { count: number; theme: string; }
  let store: ReactiveStore<State>;

  beforeEach(() => {
    store = new ReactiveStore({ count: 0, theme: 'light' });
    vi.clearAllMocks();
  });

  it('should initialize with state', () => {
    expect(store.getState()).toEqual({ count: 0, theme: 'light' });
  });

  it('should get and set values', () => {
    store.set('count', 1);
    expect(store.get('count')).toBe(1);
  });

  it('should update multiple keys', () => {
    store.update({ count: 5, theme: 'dark' });
    expect(store.getState()).toEqual({ count: 5, theme: 'dark' });
  });

  it('should notify subscribers', () => {
    const cb = vi.fn();
    store.subscribe('count', cb);
    store.set('count', 10);
    expect(cb).toHaveBeenCalledWith(10, 0);
  });

  it('should unsubscribe', () => {
    const cb = vi.fn();
    const unsub = store.subscribe('count', cb);
    unsub();
    store.set('count', 10);
    expect(cb).not.toHaveBeenCalled();
  });

  it('should handle onAny', () => {
    const cb = vi.fn();
    store.onAny(cb);
    store.set('theme', 'blue');
    expect(cb).toHaveBeenCalledWith(
      { count: 0, theme: 'blue' },
      { key: 'theme', value: 'blue', prev: 'light' }
    );
  });

  it('should use middleware', () => {
    store.use((key, val) => (key === 'count' ? val * 2 : val));
    store.set('count', 5);
    expect(store.get('count')).toBe(10);
  });

  it('should define and get computed properties', () => {
    store.defineComputed('isDark', s => s.theme === 'dark');
    expect(store.getComputed('isDark')).toBe(false);
    store.set('theme', 'dark');
    expect(store.getComputed('isDark')).toBe(true);
  });

  it('should save to storage', async () => {
    await store.save('my-store');
    expect(chromeMock.storage.local.set).toHaveBeenCalledWith({ 'my-store': { count: 0, theme: 'light' } });
  });

  it('should load from storage', async () => {
    chromeMock.storage.local.get.mockResolvedValue({ 'my-store': { count: 99 } });
    await store.load('my-store');
    expect(store.get('count')).toBe(99);
  });

  it('should enable sync', () => {
    store.enableSync('my-channel');
    store.set('count', 42);
    expect(chromeMock.runtime.sendMessage).toHaveBeenCalledWith({
      type: 'my-channel',
      payload: { key: 'count', value: 42 }
    });
    expect(chromeMock.runtime.onMessage.addListener).toHaveBeenCalled();
  });
});
