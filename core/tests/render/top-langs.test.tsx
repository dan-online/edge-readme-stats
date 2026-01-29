import {
	CSS_VAR_THEME,
	generateThemeStyles,
} from "@edge-readme-stats/core/lib/themes";
import { describe, expect, it } from "vitest";
import { TopLangsCard } from "../../src/render/cards/langs";
import type { TopLangsQuery } from "../../src/routes/langs";

describe("TopLangsCard", () => {
	const mockLanguages = [
		{ name: "TypeScript", percentage: 45, color: "#3178c6" },
		{ name: "JavaScript", percentage: 30, color: "#f1e05a" },
		{ name: "Python", percentage: 15, color: "#3572A5" },
		{ name: "Rust", percentage: 10, color: "#dea584" },
	];

	const baseQuery: TopLangsQuery = {
		username: "testuser",
		border: true,
		animations: true,
		layout: "compact",
		langs_count: 5,
		lang: "en",
		size: "lg",
		hide: [],
		theme: "light",
	};

	it("renders default layout correctly", () => {
		const svg = (
			<TopLangsCard
				query={baseQuery}
				languages={mockLanguages}
				theme={CSS_VAR_THEME}
				themeStyles={generateThemeStyles("light")}
			/>
		);
		expect(svg.toString()).toMatchSnapshot();
	});

	it("renders compact layout correctly", () => {
		const svg = (
			<TopLangsCard
				query={baseQuery}
				languages={mockLanguages}
				theme={CSS_VAR_THEME}
				themeStyles={generateThemeStyles("light")}
			/>
		);
		expect(svg.toString()).toMatchSnapshot();
	});

	it("limits languages to langsCount", () => {
		const svg = (
			<TopLangsCard
				query={{ ...baseQuery, langs_count: 2 }}
				languages={mockLanguages}
				theme={CSS_VAR_THEME}
				themeStyles={generateThemeStyles("light")}
			/>
		);
		const output = svg.toString();
		expect(output).toContain("TypeScript");
		expect(output).toContain("JavaScript");
		expect(output).not.toContain("Python");
	});
});
