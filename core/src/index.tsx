import { swaggerUI } from "@hono/swagger-ui";
import { Hono } from "hono";
import { openAPIRouteHandler } from "hono-openapi";
import type { AppConfig } from "./lib/config.ts";
import { createGitHubClient } from "./lib/github.ts";
import { createGeneratorRoute } from "./routes/generator.tsx";
import { createTopLangsRoute } from "./routes/langs.tsx";
import { createStatsRoute } from "./routes/stats.tsx";
import type { LanguageStats, UserStats } from "./types/index.ts";

export { clearAllCaches, MemoryCache } from "./lib/cache.ts";
export type { AppConfigVariables as AppConfigOptions } from "./lib/config.ts";
export { AppConfig } from "./lib/config.ts";

export function createApp(config: AppConfig) {
	const app = new Hono();
	const client = createGitHubClient(config.variables.github.token);

	const statsCache = config.variables.cache.enabled
		? config.getCache<UserStats>(
				"stats",
				config.variables.cache.ttl,
				config.variables.cache.maxSize,
			)
		: null;
	const langsCache = config.variables.cache.enabled
		? config.getCache<LanguageStats[]>(
				"langs",
				config.variables.cache.ttl,
				config.variables.cache.maxSize,
			)
		: null;

	app.get("/health", (c) =>
		c.json({
			status: "ok",
			cache: config.variables.cache.enabled
				? {
						enabled: true,
						ttl: config.variables.cache.ttl,
						statsEntries: statsCache?.size ?? 0,
						langsEntries: langsCache?.size ?? 0,
					}
				: { enabled: false },
			whitelist:
				config.variables.whitelist.usernames.size > 0
					? { enabled: true, count: config.variables.whitelist.usernames.size }
					: { enabled: false },
		}),
	);

	app.route("/stats", createStatsRoute(client, config, statsCache));
	app.route("/langs", createTopLangsRoute(client, config, langsCache));
	app.route("/generator", createGeneratorRoute());

	app.get(
		"/openapi",
		openAPIRouteHandler(app, {
			documentation: {
				info: {
					title: "edge-readme-stats",
					version: "0.1.0",
					description: "Fast, edge-native GitHub stats cards for your README",
				},
			},
		}),
	);

	app.get(
		"/docs",
		swaggerUI({
			url: "/openapi",
		}),
	);

	return app;
}

export type App = ReturnType<typeof createApp>;
