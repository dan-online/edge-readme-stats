import ky from "ky";
import type { GitHubGraphQLResponse } from "../types/index.ts";
import { inflight } from "./inflight.ts";

export class GitHubError extends Error {
	constructor(public errors: Array<{ message: string; type?: string }>) {
		super(`GitHub API Error: ${errors[0]?.message ?? "Unknown error"}`);
		this.name = "GitHubError";
	}
}

export function createGitHubClient(token?: string) {
	const client = ky.create({
		prefixUrl: "https://api.github.com",
		retry: {
			limit: 3,
			statusCodes: [408, 429, 500, 502, 503, 504],
			backoffLimit: 3000,
		},
		timeout: 10000,
		headers: {
			Accept: "application/vnd.github.v4+json",
			Authorization: token ? `bearer ${token}` : undefined,
			"User-Agent": "edge-readme-stats", // GitHub requires a User-Agent header
			"Accept-Encoding": "gzip, deflate, br, zstd", // Enable compression
		},
	});

	return {
		async graphql<T>(
			query: string,
			variables: Record<string, unknown> = {},
		): Promise<T> {
			const response = await inflight(
				`github-graphql-${JSON.stringify({ query, variables })}`,
				async () => {
					const res = await client
						.post("graphql", { json: { query, variables } })
						.json<GitHubGraphQLResponse<T>>();

					if (res.errors?.length) {
						throw new GitHubError(res.errors);
					}

					return res.data;
				},
			);

			return response;
		},
	};
}

export type GitHubClient = ReturnType<typeof createGitHubClient>;
