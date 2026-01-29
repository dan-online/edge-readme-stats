import { fetchContributionData } from "@edge-readme-stats/core/fetchers/heatmap";
import type { GitHubClient } from "@edge-readme-stats/core/lib/github";
import { describe, expect, it, vi } from "vitest";

describe("heatmap fetcher", () => {
	describe("fetchContributionData", () => {
		it("fetches and transforms contribution data", async () => {
			const mockClient: GitHubClient = {
				graphql: vi.fn().mockResolvedValue({
					user: {
						login: "testuser",
						contributionsCollection: {
							contributionCalendar: {
								totalContributions: 150,
								weeks: [
									{
										contributionDays: [
											{ date: "2024-01-01", contributionCount: 5, weekday: 1 },
											{ date: "2024-01-02", contributionCount: 3, weekday: 2 },
											{ date: "2024-01-03", contributionCount: 0, weekday: 3 },
										],
									},
									{
										contributionDays: [
											{ date: "2024-01-08", contributionCount: 10, weekday: 1 },
											{ date: "2024-01-09", contributionCount: 2, weekday: 2 },
										],
									},
								],
							},
						},
					},
				}),
			};

			const data = await fetchContributionData(mockClient, "testuser", 365);

			expect(data.username).toBe("testuser");
			expect(data.totalContributions).toBe(150);
			expect(data.weeks).toHaveLength(2);
			expect(data.weeks[0]?.contributionDays).toHaveLength(3);
		});

		it("calculates intensity levels correctly", async () => {
			const mockClient: GitHubClient = {
				graphql: vi.fn().mockResolvedValue({
					user: {
						login: "testuser",
						contributionsCollection: {
							contributionCalendar: {
								totalContributions: 20,
								weeks: [
									{
										contributionDays: [
											{ date: "2024-01-01", contributionCount: 0, weekday: 0 },
											{ date: "2024-01-02", contributionCount: 2, weekday: 1 },
											{ date: "2024-01-03", contributionCount: 5, weekday: 2 },
											{ date: "2024-01-04", contributionCount: 8, weekday: 3 },
											{ date: "2024-01-05", contributionCount: 10, weekday: 4 },
										],
									},
								],
							},
						},
					},
				}),
			};

			const data = await fetchContributionData(mockClient, "testuser", 30);

			const days = data.weeks[0]?.contributionDays;
			expect(days?.[0]?.level).toBe(0);
			expect(days?.[1]?.level).toBe(1);
			expect(days?.[2]?.level).toBe(2);
			expect(days?.[3]?.level).toBe(4);
			expect(days?.[4]?.level).toBe(4);
		});
	});
});
