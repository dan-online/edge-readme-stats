import { type CacheProvider, getCache } from "./cache.ts";

export type AppConfigVariables = Partial<AppConfig["variables"]>;

export class AppConfig {
	variables: {
		github: {
			token?: string;
		};

		whitelist: {
			usernames: Set<string>;
		};

		cache: {
			ttl: number;
			maxSize: number;
			enabled: boolean;
		};
	} = {
		github: {},
		whitelist: {
			usernames: new Set(),
		},
		cache: {
			ttl: 3600, // 1 hour
			maxSize: 1000,
			enabled: true,
		},
	};

	getCache: <T>(
		name: string,
		ttlSeconds: number,
		maxSize: number,
	) => CacheProvider<T> = getCache;

	constructor(variables: AppConfigVariables = {}) {
		this.variables = { ...this.variables, ...variables };
	}

	cache(getCache: AppConfig["getCache"]): AppConfig {
		this.getCache = getCache;

		return this;
	}

	env(env: Record<string, string | undefined>): AppConfig {
		if (env.GITHUB_TOKEN) {
			this.variables.github = this.variables.github || {};
			this.variables.github.token = env.GITHUB_TOKEN;
		}

		if (env.WHITELIST_USERNAMES) {
			this.variables.whitelist.usernames = new Set(
				env.WHITELIST_USERNAMES.split(",").map((u) => u.trim().toLowerCase()),
			);
		}

		if (env.CACHE_TTL) {
			this.variables.cache = this.variables.cache || {};
			const ttl = parseInt(env.CACHE_TTL, 10);
			if (!Number.isNaN(ttl)) {
				this.variables.cache.ttl = ttl;
			}
		}

		if (env.CACHE_MAX_SIZE) {
			this.variables.cache = this.variables.cache || {};
			const maxSize = parseInt(env.CACHE_MAX_SIZE, 10);
			if (!Number.isNaN(maxSize)) {
				this.variables.cache.maxSize = maxSize;
			}
		}

		if (env.CACHE_ENABLED) {
			this.variables.cache = this.variables.cache || {};
			this.variables.cache.enabled = env.CACHE_ENABLED === "true";
		}

		return this;
	}

	/** Check if a username is allowed (O(1) with Set) */
	isUsernameAllowed(username: string): boolean {
		if (this.variables.whitelist.usernames.size === 0) {
			return true;
		}

		return this.variables.whitelist.usernames.has(username.toLowerCase());
	}
}
