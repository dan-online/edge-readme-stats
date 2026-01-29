import { Hono } from "hono";
import { describeRoute, validator } from "hono-openapi";
import * as v from "valibot";
import { fetchContributionData } from "../fetchers/heatmap.ts";
import type { CacheProvider } from "../lib/cache.ts";
import { coerceBooleanTrue } from "../lib/coerce.ts";
import type { AppConfig } from "../lib/config.ts";
import type { GitHubClient } from "../lib/github.ts";
import { GitHubError } from "../lib/github.ts";
import { resolveLocale, t } from "../lib/i18n.ts";
import { CSS_VAR_THEME, generateThemeStyles } from "../lib/themes.ts";
import { HeatmapCard } from "../render/cards/heatmap.tsx";
import { Card } from "../render/components/card.tsx";
import type { ContributionData } from "../types/index.ts";
import { BaseQuerySchema } from "./schemas.ts";

export const HeatmapQuerySchema = v.object({
	...BaseQuerySchema.entries,
	layout: v.fallback(v.picklist(["grid", "compact"]), "grid"),
	time_range: v.fallback(
		v.pipe(
			v.string(),
			v.transform((s) => {
				const n = Number.parseInt(s, 10);
				if (Number.isNaN(n) || n < 1) return 365;
				return Math.min(n, 365);
			}),
		),
		365,
	),
	total: coerceBooleanTrue,
	current_streak: coerceBooleanTrue,
	longest_streak: coerceBooleanTrue,
});

export type HeatmapQuery = v.InferOutput<typeof HeatmapQuerySchema>;

export function createHeatmapRoute(
	client: GitHubClient,
	config: AppConfig,
	cache: CacheProvider<ContributionData> | null,
) {
	const app = new Hono();

	app.get(
		"/",
		describeRoute({
			description: "Generate GitHub contribution heatmap card SVG",
			responses: {
				200: { description: "SVG heatmap card" },
				403: { description: "Username not allowed" },
				404: { description: "User not found" },
				429: { description: "Rate limited" },
			},
		}),
		validator("query", HeatmapQuerySchema),
		async (c) => {
			const query = c.req.valid("query");
			const username = query.username;
			const locale = resolveLocale(query.lang, c.req.header("Accept-Language"));
			const i18n = t(locale);

			if (!config.isUsernameAllowed(username)) {
				const errorSvg = (
					<Card
						title="Error"
						theme={CSS_VAR_THEME}
						themeStyles={generateThemeStyles()}
						width={350}
						height={100}
					>
						<text
							x="0"
							y="20"
							font-family="'Segoe UI', Ubuntu, Sans-Serif"
							font-size="14"
							fill={CSS_VAR_THEME.text}
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
				const cacheKey = `${username.toLowerCase()}:${query.time_range}`;
				let data = await cache?.get(cacheKey);

				if (!data) {
					data = await fetchContributionData(
						client,
						username,
						query.time_range,
					);
					await cache?.set(cacheKey, data);
				}

				const customColors = {
					bg_color: query.bg_color,
					title_color: query.title_color,
					text_color: query.text_color,
					icon_color: query.icon_color,
					border_color: query.border_color,
				};

				const svg = (
					<HeatmapCard
						query={query}
						data={data}
						theme={CSS_VAR_THEME}
						themeStyles={generateThemeStyles(query.theme, customColors)}
					/>
				);

				return c.body(svg.toString(), 200, {
					"Content-Type": "image/svg+xml",
					"Cache-Control": `public, max-age=${config.variables.cache.ttl}`,
				});
			} catch (error) {
				if (error instanceof GitHubError) {
					const isNotFound = error.errors.some((e) => e.type === "NOT_FOUND");
					const errorSvg = (
						<Card
							title="Error"
							theme={CSS_VAR_THEME}
							themeStyles={generateThemeStyles()}
							width={350}
							height={100}
						>
							<text
								x="0"
								y="20"
								font-family="'Segoe UI', Ubuntu, Sans-Serif"
								font-size="14"
								fill={CSS_VAR_THEME.text}
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
