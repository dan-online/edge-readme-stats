import {
	CSS_VAR_THEME,
	generateThemeStyles,
} from "@edge-readme-stats/core/lib/themes";
import { StatsCard } from "@edge-readme-stats/core/render/cards/stats";
import { describe, expect, it } from "vitest";
import type { StatsQuery } from "../../src/routes/stats";

describe("StatsCard", () => {
	const mockStats = {
		username: "testuser",
		totalStars: 1234,
		totalCommits: 5678,
		totalPRs: 123,
		totalIssues: 45,
		totalContributions: 890,
		rank: { level: "A+", percentile: 85 },
	};

	const baseQuery: StatsQuery = {
		username: "testuser",
		icons: true,
		rank: true,
		border: true,
		animations: true,
		stars: true,
		commits: true,
		prs: true,
		issues: true,
		contribs: true,
		lang: "en",
		theme: "light",
		hide: [],
	};

	it("renders correctly with default options", () => {
		const svg = (
			<StatsCard
				query={baseQuery}
				stats={mockStats}
				theme={CSS_VAR_THEME}
				themeStyles={generateThemeStyles("light")}
			/>
		);
		expect(svg.toString()).toMatchSnapshot();
	});

	it("hides rank when rank is false", () => {
		const svg = (
			<StatsCard
				query={{ ...baseQuery, rank: false }}
				stats={mockStats}
				theme={CSS_VAR_THEME}
				themeStyles={generateThemeStyles("light")}
			/>
		);
		expect(svg.toString()).not.toContain("A+");
	});

	it("hides specified stats", () => {
		const svg = (
			<StatsCard
				query={{ ...baseQuery, stars: false, commits: false }}
				stats={mockStats}
				theme={CSS_VAR_THEME}
				themeStyles={generateThemeStyles("light")}
			/>
		);
		const output = svg.toString();
		expect(output).not.toContain("Stars:");
		expect(output).not.toContain("Commits:");
		expect(output).toContain("PRs:");
	});
});
