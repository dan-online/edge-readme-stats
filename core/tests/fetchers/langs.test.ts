import { fetchTopLanguages } from "@edge-readme-stats/core/fetchers/langs";
import type { GitHubClient } from "@edge-readme-stats/core/lib/github";
import { describe, expect, it, vi } from "vitest";

describe("langs fetcher", () => {
	it("fetches and aggregates language stats", async () => {
		const mockClient: GitHubClient = {
			graphql: vi.fn().mockResolvedValue({
				user: {
					repositories: {
						nodes: [
							{
								languages: {
									edges: [
										{
											size: 5000,
											node: { name: "TypeScript", color: "#3178c6" },
										},
										{
											size: 2000,
											node: { name: "JavaScript", color: "#f1e05a" },
										},
									],
								},
							},
							{
								languages: {
									edges: [
										{
											size: 3000,
											node: { name: "TypeScript", color: "#3178c6" },
										},
										{ size: 1000, node: { name: "Python", color: "#3572A5" } },
									],
								},
							},
						],
					},
				},
			}),
		};

		const languages = await fetchTopLanguages(mockClient, "testuser", []);

		if (!languages[0]) {
			throw new Error("No languages returned");
		}

		expect(languages[0].name).toBe("TypeScript");
		expect(languages[0].percentage).toBeCloseTo(72.7, 1);
		expect(languages).toHaveLength(3);
	});

	it("excludes hidden languages", async () => {
		const mockClient: GitHubClient = {
			graphql: vi.fn().mockResolvedValue({
				user: {
					repositories: {
						nodes: [
							{
								languages: {
									edges: [
										{
											size: 5000,
											node: { name: "TypeScript", color: "#3178c6" },
										},
										{ size: 2000, node: { name: "HTML", color: "#e34c26" } },
									],
								},
							},
						],
					},
				},
			}),
		};

		const languages = await fetchTopLanguages(mockClient, "testuser", ["HTML"]);

		if (!languages[0]) {
			throw new Error("No languages returned");
		}

		expect(languages).toHaveLength(1);
		expect(languages[0].name).toBe("TypeScript");
		expect(languages[0].percentage).toBe(100);
	});
});
