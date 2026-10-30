import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {FrogBoss, type FrogBossProps} from '../rig/FrogBoss';

/** Animated film grain + vignette, applied over every shot. */
export const Finish: React.FC<{vignette?: number}> = ({vignette = 0.55}) => {
	const f = useCurrentFrame();
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			<AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(0,0,0,${vignette}) 100%)`}} />
			<svg width="1920" height="1080" style={{position: 'absolute', opacity: 0.07, mixBlendMode: 'overlay'}}>
				<filter id="grain">
					<feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={f % 24} />
				</filter>
				<rect width="1920" height="1080" filter="url(#grain)" />
			</svg>
		</AbsoluteFill>
	);
};

/** Place the rig on screen: (x, y) = top-left of the 400×620 rig box, h = rendered height. */
export const Boss: React.FC<FrogBossProps & {x: number; y: number; h: number; breathe?: number; css?: React.CSSProperties}> = ({
	x, y, h, breathe = 0, css, ...rig
}) => {
	const f = useCurrentFrame();
	const b = 1 + 0.006 * breathe * Math.sin(f / 22);
	return (
		<div style={{position: 'absolute', left: x, top: y, width: (h * 400) / 620, height: h, transform: `scaleY(${b})`, transformOrigin: '50% 95%', ...css}}>
			<FrogBoss {...rig} style={{width: '100%', height: '100%'}} />
		</div>
	);
};

/** Convert rig units to screen pixels for a Boss placed at (x, y, h). */
export const rigToScreen = (x: number, y: number, h: number, px: number, py: number) => ({x: x + (px * h) / 620, y: y + (py * h) / 620});

export const Fade: React.FC<{o: number; color?: string}> = ({o, color = '#000'}) =>
	o > 0 ? <AbsoluteFill style={{background: color, opacity: o}} /> : null;
