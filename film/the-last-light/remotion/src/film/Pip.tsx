import React from 'react';
import {useCurrentFrame} from 'remotion';

/** Pip: a tiny firefly. Speaks only in light. intensity 0..1, size = body length in px. */
export const Pip: React.FC<{x: number; y: number; size?: number; intensity: number; flip?: boolean}> = ({x, y, size = 40, intensity, flip}) => {
	const f = useCurrentFrame();
	const flap = Math.abs(Math.sin(f * 1.7));
	const s = size / 40;
	const glow = 0.25 + 0.75 * intensity;
	return (
		<svg
			width={size * 8}
			height={size * 8}
			viewBox="-160 -160 320 320"
			style={{position: 'absolute', left: x - size * 4, top: y - size * 4, overflow: 'visible', transform: flip ? 'scaleX(-1)' : undefined}}
		>
			<defs>
				<radialGradient id="pipHalo">
					<stop offset="0%" stopColor="#FFE9A8" stopOpacity={0.9} />
					<stop offset="35%" stopColor="#FFD36B" stopOpacity={0.35} />
					<stop offset="100%" stopColor="#FFB23A" stopOpacity={0} />
				</radialGradient>
			</defs>
			<g transform={`scale(${s})`}>
				<circle r={150 * glow} fill="url(#pipHalo)" opacity={glow} />
				{/* wings */}
				<g opacity={0.75}>
					<ellipse cx={-4} cy={-14} rx={16} ry={6 + 10 * flap} fill="#DDEFF2" stroke="#0A0A0A" strokeWidth={2} transform="rotate(-25)" />
					<ellipse cx={6} cy={-14} rx={16} ry={6 + 10 * (1 - flap)} fill="#DDEFF2" stroke="#0A0A0A" strokeWidth={2} transform="rotate(20)" />
				</g>
				{/* body + glowing abdomen */}
				<ellipse cx={14} cy={0} rx={12} ry={9} fill="#2A2F33" stroke="#0A0A0A" strokeWidth={3} />
				<circle cx={22} cy={-3} r={3} fill="#fff" />
				<ellipse cx={-10} cy={4} rx={16} ry={12} fill={`rgba(255,${190 + 50 * intensity},${80 + 60 * intensity},1)`} stroke="#0A0A0A" strokeWidth={3} />
				<ellipse cx={-12} cy={2} rx={9} ry={6} fill="#FFF6D6" opacity={0.4 + 0.6 * intensity} />
				<path d="M20,-8 Q28,-22 36,-20 M16,-8 Q18,-24 26,-26" stroke="#0A0A0A" strokeWidth={2} fill="none" />
			</g>
		</svg>
	);
};
