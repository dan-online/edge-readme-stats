interface CacheEntry<T> {
	value: T;
	expiresAt: number;
}

export interface CacheProvider<T> {
	get(key: string): T | undefined | Promise<T | undefined>;
	set(key: string, value: T): void | Promise<void>;
	delete(key: string): void | Promise<void>;
	clear(): void | Promise<void>;
	has(key: string): boolean | Promise<boolean>;
	size(): number | Promise<number>;
}

export class MemoryCache<T = unknown> {
	private cache = new Map<string, CacheEntry<T>>();
	private readonly ttlMs: number;
	private readonly maxSize: number;

	constructor(ttlSeconds: number, maxSize: number) {
		this.ttlMs = ttlSeconds * 1000;
		this.maxSize = maxSize;
	}

	get(key: string): T | undefined {
		this.prune();

		const entry = this.cache.get(key);
		if (!entry) return undefined;

		if (Date.now() > entry.expiresAt) {
			this.cache.delete(key);
			return undefined;
		}

		return entry.value;
	}

	set(key: string, value: T): void {
		if (this.cache.size >= this.maxSize) {
			this.evictOldest();
		}

		this.cache.set(key, {
			value,
			expiresAt: Date.now() + this.ttlMs,
		});
	}

	has(key: string): boolean {
		return this.get(key) !== undefined;
	}

	delete(key: string) {
		this.cache.delete(key);
	}

	clear(): void {
		this.cache.clear();
	}

	private evictOldest(): void {
		const now = Date.now();
		let oldestKey: string | undefined;
		let oldestTime = Infinity;

		for (const [key, entry] of this.cache) {
			if (now > entry.expiresAt) {
				this.cache.delete(key);
				continue;
			}
			if (entry.expiresAt < oldestTime) {
				oldestTime = entry.expiresAt;
				oldestKey = key;
			}
		}

		if (this.cache.size >= this.maxSize && oldestKey) {
			this.cache.delete(oldestKey);
		}
	}

	private prune() {
		const now = Date.now();

		for (const [key, entry] of this.cache) {
			if (now > entry.expiresAt) {
				this.cache.delete(key);
			}
		}
	}

	size(): number {
		this.prune();
		return this.cache.size;
	}
}

const caches: Record<string, MemoryCache<unknown>> = {};

export function getCache<T>(
	name: string,
	ttlSeconds: number,
	maxSize: number,
): MemoryCache<T> {
	if (!caches[name]) {
		caches[name] = new MemoryCache<T>(ttlSeconds, maxSize);
	}
	return caches[name] as MemoryCache<T>;
}

export function clearAllCaches(): void {
	for (const cache of Object.values(caches)) {
		cache.clear();
	}
}
