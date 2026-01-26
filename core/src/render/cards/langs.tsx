import type { Locale } from "../../lib/i18n.ts";
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

export function TopLangsCard({
	languages,
	theme,
	hideBorder,
	layout,
	langsCount,
	locale = "en",
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
