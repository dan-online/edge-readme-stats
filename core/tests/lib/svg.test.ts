import {
	estimateTextWidth,
	formatNumber,
	truncateText,
} from "@edge-readme-stats/core/lib/svg";
import { describe, expect, it } from "vitest";

describe("svg utilities", () => {
	it("estimates text width", () => {
		const width = estimateTextWidth("Hello", 12);
		expect(width).toBeGreaterThan(0);
		expect(width).toBeLessThan(100);
	});

	it("longer text has greater width", () => {
		const short = estimateTextWidth("Hi", 12);
		const long = estimateTextWidth("Hello World", 12);
		expect(long).toBeGreaterThan(short);
	});

	it("truncates text that exceeds max width", () => {
		const result = truncateText("This is a very long text", 12, 50);
		expect(result).toContain("...");
		expect(result.length).toBeLessThan("This is a very long text".length);
	});

	it("does not truncate short text", () => {
		const result = truncateText("Hi", 12, 100);
		expect(result).toBe("Hi");
	});

	it("formats large numbers with M suffix", () => {
		expect(formatNumber(1500000)).toBe("1.5M");
	});

	it("formats thousands with k suffix", () => {
		expect(formatNumber(1500)).toBe("1.5k");
	});

	it("formats small numbers as-is", () => {
		expect(formatNumber(999)).toBe("999");
	});
});
