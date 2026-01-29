import * as v from "valibot";
import type { Locale } from "../lib/i18n";

export const coerceBoolean = v.fallback(
	v.pipe(
		v.string(),
		v.transform((s) => s === "true"),
	),
	false,
);

export interface Theme {
	bg: string;
	title: string;
	text: string;
	icon: string;
	border: string;
}

export interface UserStats {
	username: string;
	totalStars: number;
	totalCommits: number;
	totalPRs: number;
	totalIssues: number;
	totalContributions: number;
	rank: {
		level: string;
		percentile: number;
	};
}

export interface LanguageStats {
	name: string;
	percentage: number;
	color: string;
}

export interface StatsCardOptions {
	username: string;
	stats: UserStats;
	theme: Theme;
	themeStyles: string;
	showIcons: boolean;
	hideRank: boolean;
	hideBorder: boolean;
	hide: string[];
	locale: Locale;
	animate?: boolean;
}

export interface TopLangsCardOptions {
	username: string;
	languages: LanguageStats[];
	theme: Theme;
	themeStyles: string;
	hideBorder: boolean;
	layout: "compact" | "donut";
	langsCount: number;
	locale: Locale;
	animate?: boolean;
}

export interface GitHubGraphQLResponse<T> {
	data: T;
	errors?: Array<{
		message: string;
		type?: string;
	}>;
}
