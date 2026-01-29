import type { ContributionWeek, Theme } from "../../types/index.ts";

interface HeatmapCompactProps {
	weeks: ContributionWeek[];
	theme: Theme;
}

interface MonthData {
	month: string;
	year: number;
	count: number;
}

const MONTH_NAMES = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec",
];

function aggregateByMonth(weeks: ContributionWeek[]): MonthData[] {
	const monthMap = new Map<string, MonthData>();

	for (const week of weeks) {
		for (const day of week.contributionDays) {
			const date = new Date(day.date);
			const key = `${date.getFullYear()}-${date.getMonth()}`;

			if (!monthMap.has(key)) {
				const monthName = MONTH_NAMES[date.getMonth()];
				if (monthName) {
					monthMap.set(key, {
						month: monthName,
						year: date.getFullYear(),
						count: 0,
					});
				}
			}

			const existing = monthMap.get(key);
			if (existing) {
				existing.count += day.contributionCount;
			}
		}
	}

	return Array.from(monthMap.values()).sort((a, b) => {
		if (a.year !== b.year) return a.year - b.year;
		return MONTH_NAMES.indexOf(a.month) - MONTH_NAMES.indexOf(b.month);
	});
}

const BAR_HEIGHT = 16;
const BAR_GAP = 6;
const MAX_BAR_WIDTH = 280;
const LABEL_WIDTH = 50;

export function HeatmapCompact({ weeks, theme }: HeatmapCompactProps) {
	const monthData = aggregateByMonth(weeks);
	const maxCount = Math.max(...monthData.map((m) => m.count), 1);

	return (
		<g>
			{monthData.map((data, index) => {
				const barWidth = (data.count / maxCount) * MAX_BAR_WIDTH;
				const y = index * (BAR_HEIGHT + BAR_GAP);

				return (
					<g
						key={`${data.year}-${data.month}`}
						transform={`translate(0, ${y})`}
					>
						<text
							x="0"
							y={BAR_HEIGHT - 4}
							font-family="'Segoe UI', Ubuntu, Sans-Serif"
							font-size="11"
							fill={theme.text}
						>
							{data.month}
						</text>
						<rect
							x={LABEL_WIDTH}
							y="0"
							width={Math.max(barWidth, 2)}
							height={BAR_HEIGHT}
							rx="3"
							fill={theme.icon}
							opacity={0.8}
						/>
						<text
							x={LABEL_WIDTH + Math.max(barWidth, 2) + 8}
							y={BAR_HEIGHT - 4}
							font-family="'Segoe UI', Ubuntu, Sans-Serif"
							font-size="10"
							fill={theme.text}
							opacity="0.7"
						>
							{data.count}
						</text>
					</g>
				);
			})}
		</g>
	);
}

export function getCompactDimensions(weeks: ContributionWeek[]): {
	width: number;
	height: number;
} {
	const monthCount = aggregateByMonth(weeks).length;
	return {
		width: LABEL_WIDTH + MAX_BAR_WIDTH + 50,
		height: monthCount * (BAR_HEIGHT + BAR_GAP) - BAR_GAP,
	};
}
