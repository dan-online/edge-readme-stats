import type { ContributionWeek, Theme } from "../../types/index.ts";

interface HeatmapGridProps {
	weeks: ContributionWeek[];
	theme: Theme;
}

const CELL_SIZE = 10;
const CELL_GAP = 3;
const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];
const MONTH_LABELS = [
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
const MONTH_ROW_HEIGHT = 15;

function getLevelOpacity(level: 0 | 1 | 2 | 3 | 4): number {
	switch (level) {
		case 0:
			return 0.1;
		case 1:
			return 0.3;
		case 2:
			return 0.5;
		case 3:
			return 0.7;
		case 4:
			return 1;
	}
}

const MIN_MONTH_LABEL_SPACING = 28;

function getMonthLabels(
	weeks: ContributionWeek[],
): { month: string; x: number }[] {
	const labels: { month: string; x: number }[] = [];
	let lastMonth = -1;
	let lastLabelX = -MIN_MONTH_LABEL_SPACING;

	for (const [weekIndex, week] of weeks.entries()) {
		const firstDay = week.contributionDays[0];
		if (!firstDay) continue;

		const date = new Date(firstDay.date);
		const month = date.getMonth();

		if (month !== lastMonth) {
			const x = weekIndex * (CELL_SIZE + CELL_GAP);
			const monthLabel = MONTH_LABELS[month];
			if (monthLabel && x - lastLabelX >= MIN_MONTH_LABEL_SPACING) {
				labels.push({ month: monthLabel, x });
				lastLabelX = x;
			}
			lastMonth = month;
		}
	}

	return labels;
}

export function HeatmapGrid({ weeks, theme }: HeatmapGridProps) {
	const monthLabels = getMonthLabels(weeks);

	return (
		<g>
			<g transform="translate(28, 0)">
				{monthLabels.map((label) => (
					<text
						key={`${label.month}-${label.x}`}
						x={label.x}
						y={10}
						font-family="'Segoe UI', Ubuntu, Sans-Serif"
						font-size="9"
						fill={theme.text}
						opacity="0.7"
					>
						{label.month}
					</text>
				))}
			</g>
			<g transform={`translate(0, ${MONTH_ROW_HEIGHT})`}>
				{DAY_LABELS.map((label, index) => (
					<text
						key={index}
						x="0"
						y={index * (CELL_SIZE + CELL_GAP) + CELL_SIZE - 1}
						font-family="'Segoe UI', Ubuntu, Sans-Serif"
						font-size="9"
						fill={theme.text}
						opacity="0.7"
					>
						{label}
					</text>
				))}
			</g>
			<g transform={`translate(28, ${MONTH_ROW_HEIGHT})`}>
				{weeks.map((week, weekIndex) => (
					<g
						key={weekIndex}
						transform={`translate(${weekIndex * (CELL_SIZE + CELL_GAP)}, 0)`}
					>
						{week.contributionDays.map((day) => (
							<rect
								key={day.date}
								x="0"
								y={day.weekday * (CELL_SIZE + CELL_GAP)}
								width={CELL_SIZE}
								height={CELL_SIZE}
								rx="2"
								fill={theme.icon}
								opacity={getLevelOpacity(day.level)}
							>
								<title>
									{day.date}: {day.contributionCount} contributions
								</title>
							</rect>
						))}
					</g>
				))}
			</g>
		</g>
	);
}

export function getGridDimensions(weeksCount: number): {
	width: number;
	height: number;
} {
	return {
		width: 28 + weeksCount * (CELL_SIZE + CELL_GAP),
		height: MONTH_ROW_HEIGHT + 7 * (CELL_SIZE + CELL_GAP) - CELL_GAP,
	};
}
