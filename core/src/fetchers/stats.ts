import type { GitHubClient } from "../lib/github.ts";
import type { UserStats } from "../types/index.ts";

const STATS_QUERY = `
query userStats($username: String!) {
  user(login: $username) {
    login
    repositories(first: 100, ownerAffiliations: OWNER, orderBy: {field: STARGAZERS, direction: DESC}) {
      totalCount
      nodes {
        stargazerCount
      }
    }
    pullRequests(first: 1) {
      totalCount
    }
    issues(first: 1) {
      totalCount
    }
    contributionsCollection {
      totalCommitContributions
      totalPullRequestContributions
      totalIssueContributions
      restrictedContributionsCount
    }
  }
}
`;

interface StatsResponse {
	user: {
		login: string;
		repositories: {
			totalCount: number;
			nodes: Array<{ stargazerCount: number }>;
		};
		pullRequests: { totalCount: number };
		issues: { totalCount: number };
		contributionsCollection: {
			totalCommitContributions: number;
			totalPullRequestContributions: number;
			totalIssueContributions: number;
			restrictedContributionsCount: number;
		};
	};
}

interface RankInput {
	totalCommits: number;
	totalPRs: number;
	totalIssues: number;
	totalStars: number;
	totalContributions: number;
}

export function calculateRank(stats: RankInput): {
	level: string;
	percentile: number;
} {
	// Scoring algorithm inspired by github-readme-stats
	const score =
		stats.totalCommits * 1 +
		stats.totalPRs * 3 +
		stats.totalIssues * 2 +
		stats.totalStars * 5 +
		stats.totalContributions * 0.5;

	if (score >= 10000) return { level: "S", percentile: 99 };
	if (score >= 5000) return { level: "A++", percentile: 95 };
	if (score >= 2500) return { level: "A+", percentile: 90 };
	if (score >= 1000) return { level: "A", percentile: 80 };
	if (score >= 500) return { level: "B+", percentile: 70 };
	if (score >= 250) return { level: "B", percentile: 60 };
	if (score >= 100) return { level: "C+", percentile: 50 };
	return { level: "C", percentile: 40 };
}

export async function fetchUserStats(
	client: GitHubClient,
	username: string,
): Promise<UserStats> {
	const data = await client.graphql<StatsResponse>(STATS_QUERY, { username });
	const user = data.user;

	const totalStars = user.repositories.nodes.reduce(
		(sum, repo) => sum + repo.stargazerCount,
		0,
	);

	const totalCommits = user.contributionsCollection.totalCommitContributions;
	const totalPRs = user.pullRequests.totalCount;
	const totalIssues = user.issues.totalCount;
	const totalContributions =
		user.contributionsCollection.totalPullRequestContributions +
		user.contributionsCollection.totalIssueContributions +
		user.contributionsCollection.restrictedContributionsCount;

	const rank = calculateRank({
		totalCommits,
		totalPRs,
		totalIssues,
		totalStars,
		totalContributions,
	});

	return {
		username: user.login,
		totalStars,
		totalCommits,
		totalPRs,
		totalIssues,
		totalContributions,
		rank,
	};
}
