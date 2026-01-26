import { Card } from "@edge-readme-stats/core/render/components/card";
import { describe, expect, it } from "vitest";

describe("Card component", () => {
	it("renders with default dimensions", () => {
		const svg = (
			<Card
				title="Test Card"
				theme={{
					bg: "#fff",
					title: "#000",
					text: "#333",
					icon: "#666",
					border: "#ccc",
				}}
			>
				<text>Content</text>
			</Card>
		);
		expect(svg.toString()).toContain("Test Card");
		expect(svg.toString()).toContain('width="495"');
	});

	it("renders without border when hideBorder is true", () => {
		const svg = (
			<Card
				title="Test"
				theme={{
					bg: "#fff",
					title: "#000",
					text: "#333",
					icon: "#666",
					border: "#ccc",
				}}
				hideBorder
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
				theme={{
					bg: "#fff",
					title: "#000",
					text: "#333",
					icon: "#666",
					border: "#ccc",
				}}
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
