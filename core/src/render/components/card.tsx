import type { Child } from "hono/jsx";
import type { Theme } from "../../types/index.ts";

interface CardProps {
	title: string;
	theme: Theme;
	themeStyles: string;
	width?: number;
	height?: number;
	border?: boolean;
	animate?: boolean;
	children: Child;
}

const animationStyles = `
	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}
	@keyframes rankCircleSpin {
		to { stroke-dashoffset: var(--target-offset); }
	}
	.animate-fade { animation: fadeIn 0.3s ease-out forwards; }
	.animate-title { animation: fadeIn 0.4s ease-out forwards; }
	.animate-content { animation: fadeIn 0.5s ease-out forwards; animation-delay: 0.2s; opacity: 0; }
	.animate-rank { animation: fadeIn 0.6s ease-out forwards; animation-delay: 0.3s; opacity: 0; }
	.animate-rank-circle { animation: rankCircleSpin 1s ease-out forwards; animation-delay: 0.5s; }
`;

export function Card({
	title,
	theme,
	themeStyles,
	width = 495,
	height = 195,
	border = true,
	animate = true,
	children,
}: CardProps) {
	const borderRadius = 4.5;

	return (
		<svg
			width={width}
			height={height}
			viewBox={`0 0 ${width} ${height}`}
			xmlns="http://www.w3.org/2000/svg"
			role="img"
			aria-label={title}
		>
			<style>
				{themeStyles}
				{animate && animationStyles}
			</style>
			<rect
				x="0.5"
				y="0.5"
				width={width - 1}
				height={height - 1}
				rx={borderRadius}
				fill={theme.bg}
				class={animate ? "animate-fade" : undefined}
				{...(border ? { stroke: theme.border, "stroke-width": "1" } : {})}
			/>
			<text
				x="25"
				y="35"
				font-family="'Segoe UI', Ubuntu, Sans-Serif"
				font-size="18"
				font-weight="bold"
				fill={theme.title}
				class={animate ? "animate-title" : undefined}
			>
				{title}
			</text>
			<g
				transform="translate(25, 60)"
				class={animate ? "animate-content" : undefined}
			>
				{children}
			</g>
		</svg>
	);
}
