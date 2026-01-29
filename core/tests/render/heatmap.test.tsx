import {
	CSS_VAR_THEME,
	generateThemeStyles,
} from "@edge-readme-stats/core/lib/themes";
import { HeatmapCard } from "@edge-readme-stats/core/render/cards/heatmap";
import type { ContributionData } from "@edge-readme-stats/core/types/index";
import { describe, expect, it } from "vitest";
import type { HeatmapQuery } from "../../src/routes/heatmap";

describe("HeatmapCard", () => {
	const mockData: ContributionData = {
		username: "testuser",
		totalContributions: 150,
		currentStreak: 7,
		longestStreak: 30,
		weeks: [
			{
				contributionDays: [
					{ date: "2024-01-01", contributionCount: 5, weekday: 0, level: 2 },
					{ date: "2024-01-02", contributionCount: 3, weekday: 1, level: 1 },
					{ date: "2024-01-03", contributionCount: 0, weekday: 2, level: 0 },
					{ date: "2024-01-04", contributionCount: 8, weekday: 3, level: 3 },
					{ date: "2024-01-05", contributionCount: 10, weekday: 4, level: 4 },
					{ date: "2024-01-06", contributionCount: 2, weekday: 5, level: 1 },
					{ date: "2024-01-07", contributionCount: 1, weekday: 6, level: 1 },
				],
			},
			{
				contributionDays: [
					{ date: "2024-01-08", contributionCount: 4, weekday: 0, level: 2 },
					{ date: "2024-01-09", contributionCount: 6, weekday: 1, level: 3 },
				],
			},
		],
	};

	const baseQuery: HeatmapQuery = {
		username: "testuser",
		border: true,
		animations: true,
		layout: "grid",
		time_range: 365,
		total: true,
		current_streak: true,
		longest_streak: true,
		lang: "en",
		hide: [],
		theme: "light",
	};

	it("renders correctly with grid layout", () => {
		const svg = (
			<HeatmapCard
				query={baseQuery}
				data={mockData}
				theme={CSS_VAR_THEME}
				themeStyles={generateThemeStyles("light")}
			/>
		);
		expect(svg.toString()).toMatchSnapshot();
	});

	it("renders correctly with compact layout", () => {
		const svg = (
			<HeatmapCard
				query={{ ...baseQuery, layout: "compact" }}
				data={mockData}
				theme={CSS_VAR_THEME}
				themeStyles={generateThemeStyles("light")}
			/>
		);
		expect(svg.toString()).toMatchSnapshot();
	});

	it("hides specified stats", () => {
		const svg = (
			<HeatmapCard
				query={{
					...baseQuery,
					current_streak: false,
					longest_streak: false,
				}}
				data={mockData}
				theme={CSS_VAR_THEME}
				themeStyles={generateThemeStyles("light")}
			/>
		);
		const output = svg.toString();
		expect(output).toContain("Total");
		expect(output).not.toContain("Current Streak");
		expect(output).not.toContain("Longest Streak");
	});
});
