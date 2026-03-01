/**
 * Reactive Store — Cross-context state with subscriptions and middleware
 */
export class ReactiveStore<T extends Record<string, any>> {
    private state: T;
    private listeners = new Map<string, Array<(value: any, prev: any) => void>>();
    private middleware: Array<(key: string, value: any, prev: any) => any> = [];
    private computed = new Map<string, (state: T) => any>();

    constructor(initial: T) { this.state = { ...initial }; }

    /** Get entire state */
    getState(): Readonly<T> { return { ...this.state }; }

    /** Get a single key */
    get<K extends keyof T>(key: K): T[K] { return this.state[key]; }

    /** Set a single key */
    set<K extends keyof T>(key: K, value: T[K]): void {
        const prev = this.state[key];
        let next = value;
        for (const mw of this.middleware) next = mw(key as string, next, prev) ?? next;
        this.state[key] = next;
        this.listeners.get(key as string)?.forEach((fn) => fn(next, prev));
        this.listeners.get('*')?.forEach((fn) => fn(this.state, { key, value: next, prev }));
    }

    /** Update multiple keys */
    update(partial: Partial<T>): void {
        (Object.entries(partial) as Array<[keyof T, T[keyof T]]>).forEach(([k, v]) => this.set(k, v));
    }

    /** Subscribe to key changes */
    subscribe<K extends keyof T>(key: K, callback: (value: T[K], prev: T[K]) => void): () => void {
        const k = key as string;
        const list = this.listeners.get(k) || []; list.push(callback); this.listeners.set(k, list);
        return () => { const l = this.listeners.get(k); if (l) this.listeners.set(k, l.filter((fn) => fn !== callback)); };
    }

    /** Subscribe to all changes */
    onAny(callback: (state: T, change: { key: string; value: any; prev: any }) => void): () => void {
        return this.subscribe('*' as any, callback as any);
    }

    /** Add middleware */
    use(middleware: (key: string, value: any, prev: any) => any): this { this.middleware.push(middleware); return this; }

    /** Define computed property */
    defineComputed(name: string, fn: (state: T) => any): this { this.computed.set(name, fn); return this; }

    /** Get computed value */
    getComputed(name: string): any { const fn = this.computed.get(name); return fn ? fn(this.state) : undefined; }

    /** Sync state across contexts via chrome.runtime messaging */
    enableSync(channel: string = '__store_sync__'): this {
        chrome.runtime.onMessage.addListener((msg) => {
            if (msg.type === channel && msg.payload) {
                const { key, value } = msg.payload;
                this.state[key as keyof T] = value;
                this.listeners.get(key)?.forEach((fn) => fn(value, undefined));
            }
        });

        const originalSet = this.set.bind(this);
        this.set = ((key: keyof T, value: T[keyof T]) => {
            originalSet(key, value);
            chrome.runtime.sendMessage({ type: channel, payload: { key, value } }).catch(() => { });
        }) as any;
        return this;
    }

    /** Save to storage */
    async save(key: string = '__reactive_store__'): Promise<void> {
        await chrome.storage.local.set({ [key]: this.state });
    }

    /** Load from storage */
    async load(key: string = '__reactive_store__'): Promise<void> {
        const result = await chrome.storage.local.get(key);
        if (result[key]) this.state = { ...this.state, ...result[key] };
    }
}
