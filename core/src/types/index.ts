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

export interface ContributionDay {
	date: string;
	contributionCount: number;
	weekday: number;
	level: 0 | 1 | 2 | 3 | 4;
}

export interface ContributionWeek {
	contributionDays: ContributionDay[];
}

export interface ContributionData {
	username: string;
	totalContributions: number;
	currentStreak: number;
	longestStreak: number;
	weeks: ContributionWeek[];
}
