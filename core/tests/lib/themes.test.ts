import {
	getTheme,
	resolveTheme,
	themeNames,
	themes,
} from "@edge-readme-stats/core/lib/themes";
import { describe, expect, it } from "vitest";

describe("themes", () => {
	it("has 10 core themes", () => {
		expect(Object.keys(themes)).toHaveLength(10);
	});

	it("getTheme returns theme by name", () => {
		const theme = getTheme("dark");
		expect(theme.bg).toBe("#0d1117");
	});

	it("resolveTheme returns default theme for unknown theme name", () => {
		const theme = resolveTheme(undefined);
		expect(theme).toEqual(themes[themeNames[0]]);
	});

	it("resolveTheme merges custom colors", () => {
		const theme = resolveTheme(themeNames[0], { bg_color: "ff0000" });
		expect(theme.bg).toBe("#ff0000");
		expect(theme.title).toBe(themes[themeNames[0]].title);
	});

	it("resolveTheme handles 3-char hex", () => {
		const theme = resolveTheme(themeNames[0], { bg_color: "f00" });
		expect(theme.bg).toBe("#ff0000");
	});
});
