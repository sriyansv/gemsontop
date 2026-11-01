import React from 'react';
import {Frog, type FrogBossProps} from '../rig/FrogBoss';

/** Place a frog: (x, y) = feet centre on screen, h = rendered height of the 400×620 rig box. */
export const Place: React.FC<FrogBossProps & {x: number; y: number; h: number; css?: React.CSSProperties}> = ({x, y, h, css, ...rig}) => {
	const w = (h * 400) / 620;
	return (
		<div style={{position: 'absolute', left: x - w / 2, top: y - (h * 598) / 620, width: w, height: h, ...css}}>
			<Frog {...rig} style={{width: '100%', height: '100%'}} />
		</div>
	);
};
/** Top of the head (crown seat) for a frog placed with Place, rig units → screen. */
export const headTop = (x: number, y: number, h: number, bodyDy = 0) => ({x, y: y - (h * 598) / 620 + ((106 + bodyDy) * h) / 620});
