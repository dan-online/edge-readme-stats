import {
	getTheme,
	resolveTheme,
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

	it("getTheme returns default for unknown theme", () => {
		const theme = getTheme("nonexistent");
		expect(theme).toEqual(themes.default);
	});

	it("resolveTheme merges custom colors", () => {
		const theme = resolveTheme("default", { bg_color: "ff0000" });
		expect(theme.bg).toBe("#ff0000");
		expect(theme.title).toBe(themes.default.title);
	});

	it("resolveTheme handles 3-char hex", () => {
		const theme = resolveTheme("default", { bg_color: "f00" });
		expect(theme.bg).toBe("#ff0000");
	});
});
