import {
	calculateRank,
	fetchUserStats,
} from "@edge-readme-stats/core/fetchers/stats";
import type { GitHubClient } from "@edge-readme-stats/core/lib/github";
import { describe, expect, it, vi } from "vitest";

describe("stats fetcher", () => {
	describe("calculateRank", () => {
		it("returns S rank for exceptional stats", () => {
			const rank = calculateRank({
				totalCommits: 10000,
				totalPRs: 1000,
				totalIssues: 500,
				totalStars: 5000,
				totalContributions: 2000,
			});
			expect(rank.level).toBe("S");
			expect(rank.percentile).toBeGreaterThan(90);
		});

		it("returns lower rank for modest stats", () => {
			const rank = calculateRank({
				totalCommits: 50,
				totalPRs: 5,
				totalIssues: 2,
				totalStars: 10,
				totalContributions: 20,
			});
			expect(["B", "B+", "C", "C+"]).toContain(rank.level);
		});
	});

	describe("fetchUserStats", () => {
		it("fetches and transforms user stats", async () => {
			const mockClient: GitHubClient = {
				graphql: vi.fn().mockResolvedValue({
					user: {
						login: "testuser",
						repositories: {
							totalCount: 10,
							nodes: [{ stargazerCount: 100 }, { stargazerCount: 50 }],
						},
						pullRequests: { totalCount: 25 },
						issues: { totalCount: 15 },
						contributionsCollection: {
							totalCommitContributions: 500,
							totalPullRequestContributions: 25,
							totalIssueContributions: 15,
							restrictedContributionsCount: 100,
						},
					},
				}),
			};

			const stats = await fetchUserStats(mockClient, "testuser");

			expect(stats.username).toBe("testuser");
			expect(stats.totalStars).toBe(150);
			expect(stats.totalCommits).toBe(500);
			expect(stats.totalPRs).toBe(25);
			expect(stats.totalIssues).toBe(15);
			expect(stats.rank).toBeDefined();
		});
	});
});
