import type { Theme } from "../../types/index.ts";

interface RankProps {
	level: string;
	percentile: number;
	theme: Theme;
	x: number;
	y: number;
	animate?: boolean;
}

export function Rank({
	level,
	percentile,
	theme,
	x,
	y,
	animate = true,
}: RankProps) {
	const radius = 52;
	const circumference = 2 * Math.PI * radius;
	const filled = (percentile / 100) * circumference;

	return (
		<g
			transform={`translate(${x}, ${y})`}
			class={animate ? "animate-rank" : undefined}
		>
			<circle
				cx={radius}
				cy={radius}
				r={radius}
				fill="none"
				stroke={theme.border}
				stroke-width="5"
			/>
			<circle
				cx={radius}
				cy={radius}
				r={radius}
				fill="none"
				stroke={theme.icon}
				stroke-width="5"
				stroke-linecap="round"
				stroke-dasharray={`${filled} ${circumference}`}
				stroke-dashoffset={animate ? filled : 0}
				style={animate ? `--target-offset: 0` : undefined}
				transform={`rotate(-90 ${radius} ${radius})`}
				class={animate ? "animate-rank-circle" : undefined}
			/>
			<text
				x={radius}
				y={radius - 5}
				text-anchor="middle"
				font-family="'Segoe UI', Ubuntu, Sans-Serif"
				font-size="26"
				font-weight="bold"
				fill={theme.title}
			>
				{level}
			</text>
			<text
				x={radius}
				y={radius + 18}
				text-anchor="middle"
				font-family="'Segoe UI', Ubuntu, Sans-Serif"
				font-size="13"
				fill={theme.text}
			>
				Top {Math.round(100 - percentile)}%
			</text>
		</g>
	);
}
