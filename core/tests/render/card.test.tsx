import { generateThemeStyles } from "@edge-readme-stats/core/lib/themes";
import { Card } from "@edge-readme-stats/core/render/components/card";
import { describe, expect, it } from "vitest";

const testTheme = {
	bg: "#fff",
	title: "#000",
	text: "#333",
	icon: "#666",
	border: "#ccc",
};

describe("Card component", () => {
	it("renders with default dimensions", () => {
		const svg = (
			<Card
				title="Test Card"
				theme={testTheme}
				themeStyles={generateThemeStyles()}
			>
				<text>Content</text>
			</Card>
		);
		expect(svg.toString()).toContain("Test Card");
		expect(svg.toString()).toContain('width="495"');
	});

	it("renders without border when border is false", () => {
		const svg = (
			<Card
				title="Test"
				theme={testTheme}
				themeStyles={generateThemeStyles()}
				border={false}
			>
				<text>Content</text>
			</Card>
		);
		expect(svg.toString()).not.toContain("stroke=");
	});

	it("uses custom dimensions", () => {
		const svg = (
			<Card
				title="Test"
				theme={testTheme}
				themeStyles={generateThemeStyles()}
				width={300}
				height={200}
			>
				<text>Content</text>
			</Card>
		);
		expect(svg.toString()).toContain('width="300"');
		expect(svg.toString()).toContain('height="200"');
	});
});
