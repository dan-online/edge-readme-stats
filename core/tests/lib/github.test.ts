import { describe, expect, it, vi } from "vitest";

// Mock ky before importing
vi.mock("ky", () => ({
	default: {
		create: vi.fn(() => ({
			post: vi.fn(),
		})),
	},
}));

import {
	createGitHubClient,
	GitHubError,
} from "@edge-readme-stats/core/lib/github";

describe("GitHub client", () => {
	it("creates client with token", () => {
		const client = createGitHubClient("test-token");
		expect(client).toBeDefined();
		expect(client.graphql).toBeDefined();
	});

	it("creates client without token", () => {
		const client = createGitHubClient();
		expect(client).toBeDefined();
	});

	it("GitHubError contains error details", () => {
		const errors = [{ message: "Not found", type: "NOT_FOUND" }];
		const error = new GitHubError(errors);
		expect(error.message).toBe("GitHub API Error: Not found");
		expect(error.errors).toEqual(errors);
	});
});
