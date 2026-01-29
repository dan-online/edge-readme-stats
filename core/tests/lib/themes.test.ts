import {
	getTheme,
	resolveTheme,
	themes,
} from "@edge-readme-stats/core/lib/themes";
import { describe, expect, it } from "vitest";

describe("themes", () => {
	it("has 10 explicit themes (excluding github auto)", () => {
		expect(Object.keys(themes)).toHaveLength(10);
	});

	it("getTheme returns theme by name", () => {
		const theme = getTheme("dark");
		expect(theme.bg).toBe("#0d1117");
	});

	it("getTheme returns light theme for github", () => {
		const theme = getTheme("github");
		expect(theme).toEqual(themes.light);
	});

	it("resolveTheme returns light theme for undefined (github is default)", () => {
		const theme = resolveTheme(undefined);
		expect(theme).toEqual(themes.light);
	});

	it("resolveTheme merges custom colors", () => {
		const theme = resolveTheme("light", { bg_color: "ff0000" });
		expect(theme.bg).toBe("#ff0000");
		expect(theme.title).toBe(themes.light.title);
	});

	it("resolveTheme handles 3-char hex", () => {
		const theme = resolveTheme("light", { bg_color: "f00" });
		expect(theme.bg).toBe("#ff0000");
	});
});
