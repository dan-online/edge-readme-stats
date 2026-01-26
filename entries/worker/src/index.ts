import { AppConfig, createApp } from "@edge-readme-stats/core";

export default {
	fetch(request: Request, env: Env): Response | Promise<Response> {
		let config = new AppConfig().env({ ...env });

		if (env.CACHE) {
			config = config.cache((namespace: string) => ({
				get: async (key: string) => {
					const value = await env.CACHE.get(`${namespace}:${key}`);
					return value ? JSON.parse(value) : null;
				},
				set: async (key: string, value: unknown) => {
					await env.CACHE.put(`${namespace}:${key}`, JSON.stringify(value), {
						expirationTtl: config.variables.cache.ttl,
					});
				},
				delete: async (key: string) => {
					await env.CACHE.delete(`${namespace}:${key}`);
				},
				has: async (key: string) => {
					const value = await env.CACHE.get(`${namespace}:${key}`);

					return value !== null;
				},
				clear: async () => {},
				size: () => -1,
			}));
		}

		const app = createApp(config);

		return app.fetch(request);
	},
};
