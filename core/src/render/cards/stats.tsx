import type { Locale } from "../../lib/i18n.ts";
import { t } from "../../lib/i18n.ts";
import type { StatsCardOptions } from "../../types/index.ts";
import { Card } from "../components/card.tsx";
import { Rank } from "../components/rank.tsx";
import { StatRow } from "../components/stat-row.tsx";

export function StatsCard({
	username,
	stats,
	theme,
	showIcons,
	hideRank,
	hideBorder,
	hide,
	locale,
	animate = true,
}: StatsCardOptions) {
	const i18n = t(locale).stats;
	const hideSet = new Set(hide);

	const statRows = [
		{
			key: "stars",
			icon: "star",
			label: i18n.totalStars,
			value: stats.totalStars,
		},
		{
			key: "commits",
			icon: "commit",
			label: i18n.totalCommits,
			value: stats.totalCommits,
		},
		{ key: "prs", icon: "pr", label: i18n.totalPRs, value: stats.totalPRs },
		{
			key: "issues",
			icon: "issue",
			label: i18n.totalIssues,
			value: stats.totalIssues,
		},
		{
			key: "contribs",
			icon: "contrib",
			label: i18n.contributions,
			value: stats.totalContributions,
		},
	].filter((row) => !hideSet.has(row.key));

	const cardWidth = hideRank ? 350 : 495;

	return (
		<Card
			title={i18n.title(username)}
			theme={theme}
			width={cardWidth}
			height={195}
			hideBorder={hideBorder}
			animate={animate}
		>
			<g>
				{statRows.map((row, index) => (
					<StatRow
						key={row.key}
						icon={row.icon}
						label={row.label}
						value={row.value}
						theme={theme}
						showIcon={showIcons}
						y={index * 25}
					/>
				))}
			</g>
			{!hideRank && (
				<Rank
					level={stats.rank.level}
					percentile={stats.rank.percentile}
					theme={theme}
					x={cardWidth - 165}
					y={-5}
					animate={animate}
				/>
			)}
		</Card>
	);
}
