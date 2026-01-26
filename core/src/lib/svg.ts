// Approximate character widths for common monospace-ish rendering
const AVG_CHAR_WIDTH_RATIO = 0.6;

export function estimateTextWidth(text: string, fontSize: number): number {
	return text.length * fontSize * AVG_CHAR_WIDTH_RATIO;
}

export function truncateText(
	text: string,
	fontSize: number,
	maxWidth: number,
): string {
	const ellipsis = "...";
	const ellipsisWidth = estimateTextWidth(ellipsis, fontSize);

	if (estimateTextWidth(text, fontSize) <= maxWidth) {
		return text;
	}

	let truncated = text;
	while (
		estimateTextWidth(truncated, fontSize) + ellipsisWidth > maxWidth &&
		truncated.length > 0
	) {
		truncated = truncated.slice(0, -1);
	}

	return truncated + ellipsis;
}

export function formatNumber(num: number): string {
	if (num >= 1_000_000) {
		return `${(num / 1_000_000).toFixed(1)}M`;
	}
	if (num >= 1_000) {
		return `${(num / 1_000).toFixed(1)}k`;
	}
	return num.toString();
}
