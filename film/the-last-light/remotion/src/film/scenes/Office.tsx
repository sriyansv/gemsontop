import React from 'react';
import {AbsoluteFill} from 'remotion';
import {City, type CityProps} from '../City';

/** Rooftop office: the city seen through a tall paned window, dark floor, teal spill. */
export const Office: React.FC<{city: CityProps; cityScale?: number; children?: React.ReactNode}> = ({city, cityScale = 1.15, children}) => (
	<AbsoluteFill style={{background: '#05080A'}}>
		<AbsoluteFill style={{transform: `scale(${cityScale})`, transformOrigin: '50% 40%'}}>
			<City {...city} />
		</AbsoluteFill>
		<svg width={1920} height={1080} style={{position: 'absolute'}}>
			<defs>
				<linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor="#0B1A1D" />
					<stop offset="1" stopColor="#020405" />
				</linearGradient>
			</defs>
			{/* window frame + mullions */}
			<path d="M0,0 H1920 V1080 H0 Z M120,60 H1800 V820 H120 Z" fill="#070C0E" fillRule="evenodd" />
			{[540, 960, 1380].map((x) => <rect key={x} x={x - 7} y={60} width={14} height={760} fill="#070C0E" />)}
			<rect x={120} y={430} width={1680} height={10} fill="#070C0E" />
			<rect x={120} y={60} width={1680} height={760} fill="none" stroke="#1B3439" strokeWidth={4} />
			{/* glass reflections */}
			<path d="M260,60 L420,60 L200,820 L120,820 L120,560 Z" fill="#9FD6D6" opacity={0.035} />
			<path d="M1500,60 L1560,60 L1360,820 L1300,820 Z" fill="#9FD6D6" opacity={0.03} />
			<rect x={0} y={800} width={1920} height={280} fill="url(#floor)" />
			<rect x={0} y={800} width={1920} height={4} fill="#2E9A9C" opacity={0.25} />
		</svg>
		{children}
	</AbsoluteFill>
);

/** Low club armchair seen from behind (back only reaches his shoulders). */
export const ChairBack: React.FC<{x: number; y: number; w: number}> = ({x, y, w}) => (
	<svg width={w} height={w * 0.7} viewBox="0 0 400 280" style={{position: 'absolute', left: x, top: y}}>
		<path d="M30,60 Q30,10 90,10 L310,10 Q370,10 370,60 L370,270 L30,270 Z" fill="#2B1510" stroke="#0A0A0A" strokeWidth={8} />
		<path d="M0,120 Q0,90 40,90 L60,90 L60,270 L0,270 Z M400,120 Q400,90 360,90 L340,90 L340,270 L400,270 Z" fill="#3A1D16" stroke="#0A0A0A" strokeWidth={8} />
		<path d="M60,40 Q200,30 340,40" stroke="#5A3125" strokeWidth={6} fill="none" opacity={0.7} />
	</svg>
);
