import { swaggerUI } from "@hono/swagger-ui";
import { Hono } from "hono";
import { openAPIRouteHandler } from "hono-openapi";
import pkg from "../package.json" with { type: "json" };
import type { AppConfig } from "./lib/config.ts";
import { createGitHubClient } from "./lib/github.ts";
import {
	createGeneratorRoute,
	createHeatmapRoute,
	createStatsRoute,
	createTopLangsRoute,
} from "./routes/index.ts";
import type {
	ContributionData,
	LanguageStats,
	UserStats,
} from "./types/index.ts";

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
	const heatmapCache = config.variables.cache.enabled
		? config.getCache<ContributionData>(
				"heatmap",
				config.variables.cache.ttl,
				config.variables.cache.maxSize,
			)
		: null;

	app.get("/", (c) =>
		c.json({ repo: "dan-online/edge-readme-stats", version: pkg.version }),
	);

	app.route("/stats", createStatsRoute(client, config, statsCache));
	app.route("/langs", createTopLangsRoute(client, config, langsCache));
	app.route("/heatmap", createHeatmapRoute(client, config, heatmapCache));
	app.route("/generator", createGeneratorRoute());

	app.get(
		"/openapi",
		openAPIRouteHandler(app, {
			documentation: {
				info: {
					title: "edge-readme-stats",
					version: pkg.version,
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
