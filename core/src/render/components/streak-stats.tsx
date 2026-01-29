import { estimateTextWidth, formatNumber } from "../../lib/svg.ts";
import type { Theme } from "../../types/index.ts";

interface StreakStatsProps {
	total: number;
	currentStreak: number;
	longestStreak: number;
	theme: Theme;
	showTotal: boolean;
	showCurrentStreak: boolean;
	showLongestStreak: boolean;
	labels: {
		totalContributions: string;
		currentStreak: string;
		longestStreak: string;
		days: string;
	};
}

interface StatItemProps {
	label: string;
	value: string;
	theme: Theme;
	x: number;
}

function StatItem({ label, value, theme, x }: StatItemProps) {
	return (
		<g transform={`translate(${x}, 0)`}>
			<text
				x="0"
				y="0"
				font-family="'Segoe UI', Ubuntu, Sans-Serif"
				font-size="11"
				fill={theme.text}
				opacity="0.8"
			>
				{label}
			</text>
			<text
				x="0"
				y="18"
				font-family="'Segoe UI', Ubuntu, Sans-Serif"
				font-size="16"
				font-weight="bold"
				fill={theme.text}
			>
				{value}
			</text>
		</g>
	);
}

export function StreakStats({
	total,
	currentStreak,
	longestStreak,
	theme,
	showTotal,
	showCurrentStreak,
	showLongestStreak,
	labels,
}: StreakStatsProps) {
	const stats = [
		showTotal && {
			key: "total",
			label: labels.totalContributions,
			value: formatNumber(total),
		},
		showCurrentStreak && {
			key: "current_streak",
			label: labels.currentStreak,
			value: `${currentStreak} ${labels.days}`,
		},
		showLongestStreak && {
			key: "longest_streak",
			label: labels.longestStreak,
			value: `${longestStreak} ${labels.days}`,
		},
	].filter(Boolean) as { key: string; label: string; value: string }[];

	const statsWithPositions = stats.reduce<
		{ key: string; label: string; value: string; x: number }[]
	>((acc, stat) => {
		const prevStat = acc[acc.length - 1];
		const prevX = prevStat ? prevStat.x : 0;
		const prevWidth = prevStat
			? Math.max(
					50,
					estimateTextWidth(prevStat.label, 11),
					estimateTextWidth(prevStat.value, 16),
				)
			: 0;
		const x = prevStat ? Math.round(prevX + prevWidth + 20) : 0;
		acc.push({ ...stat, x });
		return acc;
	}, []);

	return (
		<g>
			{statsWithPositions.map((stat) => (
				<StatItem
					key={stat.key}
					label={stat.label}
					value={stat.value}
					theme={theme}
					x={stat.x}
				/>
			))}
		</g>
	);
}
