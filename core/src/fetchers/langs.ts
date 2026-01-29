import type { GitHubClient } from "../lib/github.ts";
import type { LanguageStats } from "../types/index.ts";

const LANGS_QUERY = `
query userLanguages($username: String!) {
  user(login: $username) {
    repositories(first: 100, ownerAffiliations: OWNER, isFork: false) {
      nodes {
        languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
          edges {
            size
            node {
              name
              color
            }
          }
        }
      }
    }
  }
}
`;

interface LangsResponse {
	user: {
		repositories: {
			nodes: Array<{
				languages: {
					edges: Array<{
						size: number;
						node: { name: string; color: string | null };
					}>;
				};
			}>;
		};
	};
}

const DEFAULT_COLORS: Record<string, string> = {
	TypeScript: "#3178c6",
	JavaScript: "#f1e05a",
	Python: "#3572A5",
	Rust: "#dea584",
	Go: "#00ADD8",
	Java: "#b07219",
	"C++": "#f34b7d",
	C: "#555555",
	Ruby: "#701516",
	PHP: "#4F5D95",
};

export async function fetchTopLanguages(
	client: GitHubClient,
	username: string,
	hide: string[],
): Promise<LanguageStats[]> {
	const data = await client.graphql<LangsResponse>(LANGS_QUERY, { username });
	const hideSet = new Set(hide.map((l) => l.toLowerCase()));

	const langBytes = new Map<string, { bytes: number; color: string }>();

	for (const repo of data.user.repositories.nodes) {
		for (const edge of repo.languages.edges) {
			const name = edge.node.name;
			if (hideSet.has(name.toLowerCase())) continue;

			const existing = langBytes.get(name) ?? {
				bytes: 0,
				color: edge.node.color ?? DEFAULT_COLORS[name] ?? "#858585",
			};
			existing.bytes += edge.size;
			langBytes.set(name, existing);
		}
	}

	const sorted = Array.from(langBytes.entries()).sort(
		(a, b) => b[1].bytes - a[1].bytes,
	);

	const totalBytes = sorted.reduce((sum, [, data]) => sum + data.bytes, 0);

	return sorted.map(([name, data]) => ({
		name,
		percentage: (data.bytes / totalBytes) * 100,
		color: data.color,
	}));
}
