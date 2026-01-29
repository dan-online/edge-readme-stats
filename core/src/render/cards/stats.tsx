import { resolveLocale, t } from "../../lib/i18n.ts";
import type { StatsQuery } from "../../routes/stats.tsx";
import type { Theme, UserStats } from "../../types/index.ts";
import { Card } from "../components/card.tsx";
import { Rank } from "../components/rank.tsx";
import { StatRow } from "../components/stat-row.tsx";

interface StatsCardProps {
	query: StatsQuery;
	stats: UserStats;
	theme: Theme;
	themeStyles: string;
}

export function StatsCard({
	query,
	stats,
	theme,
	themeStyles,
}: StatsCardProps) {
	const locale = resolveLocale(query.lang, null);
	const i18n = t(locale).stats;

	const statRows = [
		query.stars && {
			key: "stars",
			icon: "star",
			label: i18n.totalStars,
			value: stats.totalStars,
		},
		query.commits && {
			key: "commits",
			icon: "commit",
			label: i18n.totalCommits,
			value: stats.totalCommits,
		},
		query.prs && {
			key: "prs",
			icon: "pr",
			label: i18n.totalPRs,
			value: stats.totalPRs,
		},
		query.issues && {
			key: "issues",
			icon: "issue",
			label: i18n.totalIssues,
			value: stats.totalIssues,
		},
		query.contribs && {
			key: "contribs",
			icon: "contrib",
			label: i18n.contributions,
			value: stats.totalContributions,
		},
	].filter(Boolean) as {
		key: string;
		icon: string;
		label: string;
		value: number;
	}[];

	const cardWidth = query.rank ? 495 : 350;

	return (
		<Card
			title={i18n.title(query.username)}
			theme={theme}
			themeStyles={themeStyles}
			width={cardWidth}
			height={195}
			border={query.border}
			animate={query.animations}
		>
			<g>
				{statRows.map((row, index) => (
					<StatRow
						key={row.key}
						icon={row.icon}
						label={row.label}
						value={row.value}
						theme={theme}
						showIcon={query.icons}
						y={index * 25}
					/>
				))}
			</g>
			{query.rank && (
				<Rank
					level={stats.rank.level}
					percentile={stats.rank.percentile}
					theme={theme}
					x={cardWidth - 165}
					y={-5}
					animate={query.animations}
				/>
			)}
		</Card>
	);
}
