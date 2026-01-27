import { Hono } from "hono";
import { describeRoute, validator } from "hono-openapi";
import * as v from "valibot";
import { fetchUserStats } from "../fetchers/stats.ts";
import type { CacheProvider } from "../lib/cache.ts";
import type { AppConfig } from "../lib/config.ts";
import type { GitHubClient } from "../lib/github.ts";
import { GitHubError } from "../lib/github.ts";
import { resolveLocale, t } from "../lib/i18n.ts";
import { resolveTheme } from "../lib/themes.ts";
import { StatsCard } from "../render/cards/stats.tsx";
import { Card } from "../render/components/card.tsx";
import { coerceBoolean, type UserStats } from "../types/index.ts";
import { BaseQuerySchema } from "./schemas.ts";

export const StatsQuerySchema = v.object({
	...BaseQuerySchema.entries,
	show_icons: coerceBoolean,
	hide_rank: coerceBoolean,
});

export function createStatsRoute(
	client: GitHubClient,
	config: AppConfig,
	cache: CacheProvider<UserStats> | null,
) {
	const app = new Hono();

	app.get(
		"/",
		describeRoute({
			description: "Generate GitHub stats card SVG",
			responses: {
				200: { description: "SVG stats card" },
				403: { description: "Username not allowed" },
				404: { description: "User not found" },
				429: { description: "Rate limited" },
			},
		}),
		validator("query", StatsQuerySchema),
		async (c) => {
			const query = c.req.valid("query");
			const username = query.username;
			const locale = resolveLocale(query.lang, c.req.header("Accept-Language"));
			const i18n = t(locale);

			if (!config.isUsernameAllowed(username)) {
				const errorTheme = resolveTheme();
				const errorSvg = (
					<Card title="Error" theme={errorTheme} width={350} height={100}>
						<text
							x="0"
							y="20"
							font-family="'Segoe UI', Ubuntu, Sans-Serif"
							font-size="14"
							fill={errorTheme.text}
						>
							{i18n.errors.usernameNotAllowed}
						</text>
					</Card>
				);
				return c.body(errorSvg.toString(), 403, {
					"Content-Type": "image/svg+xml",
				});
			}

			try {
				const cacheKey = username.toLowerCase();
				let stats = await cache?.get(cacheKey);

				if (!stats) {
					stats = await fetchUserStats(client, username);
					await cache?.set(cacheKey, stats);
				}

				const theme = resolveTheme(query.theme, {
					bg_color: query.bg_color,
					title_color: query.title_color,
					text_color: query.text_color,
					icon_color: query.icon_color,
					border_color: query.border_color,
				});

				const svg = (
					<StatsCard
						username={username}
						stats={stats}
						theme={theme}
						showIcons={query.show_icons}
						hideRank={query.hide_rank}
						hideBorder={query.hide_border}
						hide={query.hide}
						locale={locale}
						animate={!query.disable_animations}
					/>
				);

				return c.body(svg.toString(), 200, {
					"Content-Type": "image/svg+xml",
					"Cache-Control": `public, max-age=${config.variables.cache.ttl}`,
				});
			} catch (error) {
				if (error instanceof GitHubError) {
					const isNotFound = error.errors.some((e) => e.type === "NOT_FOUND");
					const errorTheme = resolveTheme();
					const errorSvg = (
						<Card title="Error" theme={errorTheme} width={350} height={100}>
							<text
								x="0"
								y="20"
								font-family="'Segoe UI', Ubuntu, Sans-Serif"
								font-size="14"
								fill={errorTheme.text}
							>
								{isNotFound
									? i18n.errors.userNotFound
									: i18n.errors.serverError}
							</text>
						</Card>
					);
					return c.body(errorSvg.toString(), isNotFound ? 404 : 500, {
						"Content-Type": "image/svg+xml",
					});
				}
				throw error;
			}
		},
	);

	return app;
}
