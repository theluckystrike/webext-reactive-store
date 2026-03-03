/**
 * Reactive Store — Cross-context state with subscriptions and middleware
 */

/**
 * Error class for ReactiveStore operations
 */
export class ReactiveStoreError extends Error {
    constructor(
        message: string,
        public readonly code: 'SYNC_ERROR' | 'STORAGE_ERROR' | 'MIDDLEWARE_ERROR',
        public readonly originalError?: unknown
    ) {
        super(message);
        this.name = 'ReactiveStoreError';
    }
}

/**
 * Options for ReactiveStore
 */
export interface ReactiveStoreOptions {
    /** Callback for sync errors */
    onSyncError?: (error: ReactiveStoreError) => void;
    /** Callback for storage errors */
    onStorageError?: (error: ReactiveStoreError) => void;
    /** Enable silent logging to console (default: false) */
    silentLog?: boolean;
}

export class ReactiveStore<T extends Record<string, any>> {
    private state: T;
    private listeners = new Map<string, Array<(value: any, prev: any) => void>>();
    private middleware: Array<(key: string, value: any, prev: any) => any> = [];
    private computed = new Map<string, (state: T) => any>();
    private options: ReactiveStoreOptions;

    constructor(initial: T, options: ReactiveStoreOptions = {}) { 
        this.state = { ...initial };
        this.options = { silentLog: false, ...options };
    }

    /** Log message if not in silent mode */
    private log(level: 'warn' | 'error', ...args: any[]): void {
        if (!this.options.silentLog) {
            console[level](`[ReactiveStore]`, ...args);
        }
    }

    /** Get entire state */
    getState(): Readonly<T> { return { ...this.state }; }

    /** Get a single key */
    get<K extends keyof T>(key: K): T[K] { return this.state[key]; }

    /** Set a single key */
    set<K extends keyof T>(key: K, value: T[K]): void {
        const prev = this.state[key];
        let next = value;
        
        try {
            for (const mw of this.middleware) {
                try {
                    next = mw(key as string, next, prev) ?? next;
                } catch (mwError) {
                    this.log('error', `Middleware error for key '${String(key)}':`, mwError);
                    throw new ReactiveStoreError(
                        `Middleware error: ${mwError instanceof Error ? mwError.message : String(mwError)}`,
                        'MIDDLEWARE_ERROR',
                        mwError
                    );
                }
            }
        } catch (error) {
            if (error instanceof ReactiveStoreError) {
                this.log('error', error.message);
            }
            // Still proceed with the value even if middleware fails
        }
        
        this.state[key] = next;
        this.listeners.get(key as string)?.forEach((fn) => {
            try {
                fn(next, prev);
            } catch (fnError) {
                this.log('error', `Listener error for key '${String(key)}':`, fnError);
            }
        });
        this.listeners.get('*')?.forEach((fn) => {
            try {
                fn(this.state, { key, value: next, prev });
            } catch (fnError) {
                this.log('error', `Listener error for '*':`, fnError);
            }
        });
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
            chrome.runtime.sendMessage({ type: channel, payload: { key, value } })
                .catch((error) => {
                    const syncError = new ReactiveStoreError(
                        `Failed to sync '${String(key)}' to other contexts: ${error.message || String(error)}`,
                        'SYNC_ERROR',
                        error
                    );
                    this.log('warn', syncError.message);
                    this.options.onSyncError?.(syncError);
                });
        }) as any;
        return this;
    }

    /** Save to storage */
    async save(key: string = '__reactive_store__'): Promise<void> {
        try {
            await chrome.storage.local.set({ [key]: this.state });
        } catch (error) {
            const storageError = new ReactiveStoreError(
                `Failed to save state: ${error instanceof Error ? error.message : String(error)}`,
                'STORAGE_ERROR',
                error
            );
            this.log('error', storageError.message);
            this.options.onStorageError?.(storageError);
            throw storageError;
        }
    }

    /** Load from storage */
    async load(key: string = '__reactive_store__'): Promise<void> {
        try {
            const result = await chrome.storage.local.get(key);
            if (result[key]) {
                this.state = { ...this.state, ...result[key] };
            }
        } catch (error) {
            const storageError = new ReactiveStoreError(
                `Failed to load state: ${error instanceof Error ? error.message : String(error)}`,
                'STORAGE_ERROR',
                error
            );
            this.log('error', storageError.message);
            this.options.onStorageError?.(storageError);
            throw storageError;
        }
    }
}
