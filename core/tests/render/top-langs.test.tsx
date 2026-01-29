import {
	CSS_VAR_THEME,
	generateThemeStyles,
} from "@edge-readme-stats/core/lib/themes";
import { describe, expect, it } from "vitest";
import { TopLangsCard } from "../../src/render/cards/langs";

describe("TopLangsCard", () => {
	const mockLanguages = [
		{ name: "TypeScript", percentage: 45, color: "#3178c6" },
		{ name: "JavaScript", percentage: 30, color: "#f1e05a" },
		{ name: "Python", percentage: 15, color: "#3572A5" },
		{ name: "Rust", percentage: 10, color: "#dea584" },
	];

	it("renders default layout correctly", () => {
		const svg = (
			<TopLangsCard
				username="testuser"
				languages={mockLanguages}
				theme={CSS_VAR_THEME}
				themeStyles={generateThemeStyles("light")}
				hideBorder={false}
				layout="compact"
				langsCount={5}
				locale="en"
			/>
		);
		expect(svg.toString()).toMatchSnapshot();
	});

	it("renders compact layout correctly", () => {
		const svg = (
			<TopLangsCard
				username="testuser"
				languages={mockLanguages}
				theme={CSS_VAR_THEME}
				themeStyles={generateThemeStyles("light")}
				hideBorder={false}
				layout="compact"
				langsCount={5}
				locale="en"
			/>
		);
		expect(svg.toString()).toMatchSnapshot();
	});

	it("limits languages to langsCount", () => {
		const svg = (
			<TopLangsCard
				username="testuser"
				languages={mockLanguages}
				theme={CSS_VAR_THEME}
				themeStyles={generateThemeStyles("light")}
				hideBorder={false}
				layout="compact"
				langsCount={2}
				locale="en"
			/>
		);
		const output = svg.toString();
		expect(output).toContain("TypeScript");
		expect(output).toContain("JavaScript");
		expect(output).not.toContain("Python");
	});
});
