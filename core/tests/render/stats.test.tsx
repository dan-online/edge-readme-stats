import { themes } from "@edge-readme-stats/core/lib/themes";
import { StatsCard } from "@edge-readme-stats/core/render/cards/stats";
import { describe, expect, it } from "vitest";

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

	it("renders correctly with default options", () => {
		const svg = (
			<StatsCard
				username="testuser"
				stats={mockStats}
				theme={themes.default}
				showIcons={true}
				hideRank={false}
				hideBorder={false}
				hide={[]}
			/>
		);
		expect(svg.toString()).toMatchSnapshot();
	});

	it("hides rank when hideRank is true", () => {
		const svg = (
			<StatsCard
				username="testuser"
				stats={mockStats}
				theme={themes.default}
				showIcons={true}
				hideRank={true}
				hideBorder={false}
				hide={[]}
			/>
		);
		expect(svg.toString()).not.toContain("A+");
	});

	it("hides specified stats", () => {
		const svg = (
			<StatsCard
				username="testuser"
				stats={mockStats}
				theme={themes.default}
				showIcons={true}
				hideRank={false}
				hideBorder={false}
				hide={["stars", "commits"]}
			/>
		);
		const output = svg.toString();
		expect(output).not.toContain("Total Stars");
		expect(output).not.toContain("Total Commits");
		expect(output).toContain("Total PRs");
	});
});
