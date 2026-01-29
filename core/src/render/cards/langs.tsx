import { t } from "../../lib/i18n.ts";
import type { LanguageStats, TopLangsCardOptions } from "../../types/index.ts";
import { Card } from "../components/card.tsx";
import { MultiProgress } from "../components/progress.tsx";

interface LanguageRowProps {
	lang: LanguageStats;
	theme: { text: string };
	y: number;
}

function LanguageRow({ lang, theme, y }: LanguageRowProps) {
	return (
		<g transform={`translate(0, ${y})`}>
			<circle cx="5" cy="-4" r="5" fill={lang.color} />
			<text
				x="15"
				y="0"
				font-family="'Segoe UI', Ubuntu, Sans-Serif"
				font-size="12"
				fill={theme.text}
			>
				{lang.name}
			</text>
			<text
				x="150"
				y="0"
				font-family="'Segoe UI', Ubuntu, Sans-Serif"
				font-size="12"
				fill={theme.text}
			>
				{lang.percentage.toFixed(1)}%
			</text>
		</g>
	);
}

function polarToCartesian(
	cx: number,
	cy: number,
	radius: number,
	angleInDegrees: number,
) {
	const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;
	return {
		x: cx + radius * Math.cos(angleInRadians),
		y: cy + radius * Math.sin(angleInRadians),
	};
}

function describeArc(
	cx: number,
	cy: number,
	outerRadius: number,
	innerRadius: number,
	startAngle: number,
	endAngle: number,
) {
	const outerStart = polarToCartesian(cx, cy, outerRadius, endAngle);
	const outerEnd = polarToCartesian(cx, cy, outerRadius, startAngle);
	const innerStart = polarToCartesian(cx, cy, innerRadius, endAngle);
	const innerEnd = polarToCartesian(cx, cy, innerRadius, startAngle);

	const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

	return [
		"M",
		outerStart.x,
		outerStart.y,
		"A",
		outerRadius,
		outerRadius,
		0,
		largeArcFlag,
		0,
		outerEnd.x,
		outerEnd.y,
		"L",
		innerEnd.x,
		innerEnd.y,
		"A",
		innerRadius,
		innerRadius,
		0,
		largeArcFlag,
		1,
		innerStart.x,
		innerStart.y,
		"Z",
	].join(" ");
}

interface DonutSegmentProps {
	cx: number;
	cy: number;
	outerRadius: number;
	innerRadius: number;
	startAngle: number;
	endAngle: number;
	color: string;
}

function DonutSegment({
	cx,
	cy,
	outerRadius,
	innerRadius,
	startAngle,
	endAngle,
	color,
}: DonutSegmentProps) {
	const d = describeArc(cx, cy, outerRadius, innerRadius, startAngle, endAngle);
	return <path d={d} fill={color} />;
}

export function TopLangsCard({
	languages,
	theme,
	hideBorder,
	layout,
	langsCount,
	locale,
	animate = true,
}: TopLangsCardOptions) {
	const i18n = t(locale).topLangs;
	const displayLangs = languages.slice(0, langsCount);

	if (layout === "compact") {
		return (
			<Card
				title={i18n.title}
				theme={theme}
				width={400}
				height={120}
				hideBorder={hideBorder}
				animate={animate}
			>
				<MultiProgress
					segments={displayLangs.map((l) => ({
						percentage: l.percentage,
						color: l.color,
					}))}
					x={0}
					y={0}
					width={350}
				/>
				<g transform="translate(0, 25)">
					{displayLangs.map((lang, i) => (
						<g
							key={lang.name}
							transform={`translate(${(i % 3) * 120}, ${Math.floor(i / 3) * 20})`}
						>
							<circle cx="5" cy="-4" r="5" fill={lang.color} />
							<text
								x="15"
								y="0"
								font-family="'Segoe UI', Ubuntu, Sans-Serif"
								font-size="11"
								fill={theme.text}
							>
								{lang.name} {lang.percentage.toFixed(1)}%
							</text>
						</g>
					))}
				</g>
			</Card>
		);
	}

	if (layout === "donut") {
		const outerRadius = 70;
		const innerRadius = 45;
		const cx = outerRadius;
		const cy = outerRadius;
		const legendX = outerRadius * 2 + 30;

		const totalPercentage = displayLangs.reduce(
			(sum, lang) => sum + lang.percentage,
			0,
		);
		let currentAngle = 0;
		const segments = displayLangs.map((lang) => {
			const startAngle = currentAngle;
			const sweepAngle = (lang.percentage / totalPercentage) * 360;
			currentAngle += sweepAngle;
			return {
				...lang,
				startAngle,
				endAngle: startAngle + sweepAngle - 0.3,
			};
		});

		const legendHeight = displayLangs.length * 25;
		const donutDiameter = outerRadius * 2;
		const cardHeight = Math.max(donutDiameter + 70, legendHeight + 70);

		return (
			<Card
				title={i18n.title}
				theme={theme}
				width={400}
				height={cardHeight}
				hideBorder={hideBorder}
				animate={animate}
			>
				<g>
					{segments.map((seg) => (
						<DonutSegment
							key={seg.name}
							cx={cx}
							cy={cy}
							outerRadius={outerRadius}
							innerRadius={innerRadius}
							startAngle={seg.startAngle}
							endAngle={seg.endAngle}
							color={seg.color}
						/>
					))}
				</g>
				<g transform={`translate(${legendX}, 10)`}>
					{displayLangs.map((lang, index) => (
						<g key={lang.name} transform={`translate(0, ${index * 25})`}>
							<circle cx="5" cy="-4" r="5" fill={lang.color} />
							<text
								x="15"
								y="0"
								font-family="'Segoe UI', Ubuntu, Sans-Serif"
								font-size="12"
								fill={theme.text}
							>
								{lang.name}
							</text>
							<text
								x="150"
								y="0"
								font-family="'Segoe UI', Ubuntu, Sans-Serif"
								font-size="12"
								fill={theme.text}
								text-anchor="end"
							>
								{lang.percentage.toFixed(1)}%
							</text>
						</g>
					))}
				</g>
			</Card>
		);
	}

	const cardHeight = 90 + displayLangs.length * 25;

	return (
		<Card
			title={i18n.title}
			theme={theme}
			width={350}
			height={cardHeight}
			hideBorder={hideBorder}
			animate={animate}
		>
			{displayLangs.map((lang, index) => (
				<LanguageRow key={lang.name} lang={lang} theme={theme} y={index * 25} />
			))}
		</Card>
	);
}
