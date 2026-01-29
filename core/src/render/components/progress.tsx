interface ProgressBarProps {
	percentage: number;
	color: string;
	x: number;
	y: number;
	width?: number;
	height?: number;
}

export function ProgressBar({
	percentage,
	color,
	x,
	y,
	width = 300,
	height = 8,
}: ProgressBarProps) {
	const fillWidth = (percentage / 100) * width;

	return (
		<g transform={`translate(${x}, ${y})`}>
			<rect width={width} height={height} rx={height / 2} fill="#ddd" />
			<rect width={fillWidth} height={height} rx={height / 2} fill={color} />
		</g>
	);
}

interface MultiProgressProps {
	segments: { percentage: number; color: string }[];
	x: number;
	y: number;
	width?: number;
	height?: number;
}

export function MultiProgress({
	segments,
	x,
	y,
	width = 300,
	height = 8,
}: MultiProgressProps) {
	let offset = 0;

	return (
		<g transform={`translate(${x}, ${y})`}>
			<rect width={width} height={height} rx={height / 2} fill="#ddd" />
			{segments.map((segment, index) => {
				const segmentWidth = (segment.percentage / 100) * width;
				const rect = (
					<rect
						key={index}
						x={offset}
						width={segmentWidth}
						height={height}
						fill={segment.color}
						rx={offset === 0 ? height / 2 : 0}
					/>
				);
				offset += segmentWidth;
				return rect;
			})}
		</g>
	);
}
