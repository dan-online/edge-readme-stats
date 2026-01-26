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
	showIcons: boolean;
	hideRank: boolean;
	hideBorder: boolean;
	hide: string[];
	locale?: string;
	animate?: boolean;
}

export interface TopLangsCardOptions {
	username: string;
	languages: LanguageStats[];
	theme: Theme;
	hideBorder: boolean;
	layout: "default" | "compact" | "donut";
	langsCount: number;
	locale?: string;
	animate?: boolean;
}

export interface GitHubGraphQLResponse<T> {
	data: T;
	errors?: Array<{
		message: string;
		type?: string;
	}>;
}
