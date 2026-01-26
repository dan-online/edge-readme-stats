import { type GitHubClient, gql } from "../lib/github.ts";
import type { UserStats } from "../types/index.ts";

const STATS_QUERY = gql`
query userStats($username: String!, $after: String) {
  user(login: $username) {
    login
    repositories(first: 100, after: $after, ownerAffiliations: OWNER, orderBy: {field: STARGAZERS, direction: DESC}) {
      totalCount
      pageInfo {
        hasNextPage
        endCursor
      }
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
			pageInfo: {
				hasNextPage: boolean;
				endCursor: string | null;
			};
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
	// First request
	const data = await client.graphql<StatsResponse>(STATS_QUERY, { username });
	const user = data.user;

	// Paginate through all repositories to get accurate star count
	let totalStars = user.repositories.nodes.reduce(
		(sum, repo) => sum + repo.stargazerCount,
		0,
	);

	let { hasNextPage, endCursor } = user.repositories.pageInfo;
	while (hasNextPage && endCursor) {
		const pageData = await client.graphql<StatsResponse>(STATS_QUERY, {
			username,
			after: endCursor,
		});
		const repos = pageData.user.repositories;

		console.log(repos.nodes.length);

		totalStars += repos.nodes.reduce(
			(sum, repo) => sum + repo.stargazerCount,
			0,
		);

		if (repos.nodes.at(-1)?.stargazerCount === 0) {
			break;
		}

		hasNextPage = repos.pageInfo.hasNextPage;
		endCursor = repos.pageInfo.endCursor;
	}

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
