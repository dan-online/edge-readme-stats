import { resolveLocale, t } from "../../lib/i18n.ts";
import type { HeatmapQuery } from "../../routes/heatmap.tsx";
import { sizeScales } from "../../routes/schemas.ts";
import type { ContributionData, Theme } from "../../types/index.ts";
import { Card } from "../components/card.tsx";
import {
	getCompactDimensions,
	HeatmapCompact,
} from "../components/heatmap-compact.tsx";
import { getGridDimensions, HeatmapGrid } from "../components/heatmap-grid.tsx";
import { StreakStats } from "../components/streak-stats.tsx";

interface HeatmapCardProps {
	query: HeatmapQuery;
	data: ContributionData;
	theme: Theme;
	themeStyles: string;
}

export function HeatmapCard({
	query,
	data,
	theme,
	themeStyles,
}: HeatmapCardProps) {
	const locale = resolveLocale(query.lang, null);
	const i18n = t(locale).heatmap;
	const showStats = query.total || query.current_streak || query.longest_streak;

	const statsHeight = showStats ? 45 : 0;

	let contentWidth: number;
	let contentHeight: number;

	if (query.layout === "compact") {
		const dims = getCompactDimensions(data.weeks);
		contentWidth = dims.width;
		contentHeight = dims.height;
	} else {
		const dims = getGridDimensions(data.weeks.length);
		contentWidth = dims.width;
		contentHeight = dims.height;
	}

	const cardWidth = Math.max(contentWidth + 50, 350);
	const cardHeight = 60 + statsHeight + contentHeight + 20;
	const scale = sizeScales[query.size];

	return (
		<Card
			title={i18n.title(query.username)}
			theme={theme}
			themeStyles={themeStyles}
			width={cardWidth}
			height={cardHeight}
			scale={scale}
			border={query.border}
			animate={query.animations}
		>
			{showStats && (
				<g transform="translate(0, 0)">
					<StreakStats
						total={data.totalContributions}
						currentStreak={data.currentStreak}
						longestStreak={data.longestStreak}
						theme={theme}
						showTotal={query.total}
						showCurrentStreak={query.current_streak}
						showLongestStreak={query.longest_streak}
						labels={{
							totalContributions: i18n.totalContributions,
							currentStreak: i18n.currentStreak,
							longestStreak: i18n.longestStreak,
							days: i18n.days,
						}}
					/>
				</g>
			)}
			<g transform={`translate(0, ${statsHeight})`}>
				{query.layout === "compact" ? (
					<HeatmapCompact weeks={data.weeks} theme={theme} />
				) : (
					<HeatmapGrid weeks={data.weeks} theme={theme} />
				)}
			</g>
		</Card>
	);
}
