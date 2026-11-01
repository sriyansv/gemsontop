import React from 'react';
import {Img, staticFile} from 'remotion';
import {Panel, SheetFrame} from './Sheet';
import {Frog} from '../rig/FrogBoss';
import {LOOKS, type LookName} from '../rig/looks';
import {Crown} from './props';
import type {ExpressionName} from '../rig/expressions';
import type {PoseName} from '../rig/poses';

const CAST: {look: LookName; ref: string; ex: ExpressionName; pose: PoseName; role: string}[] = [
	{look: 'casual', ref: 'refs/casual-round-glasses-tee.jpg', ex: 'neutral', pose: 'pockets', role: 'Walks in · becomes royal'},
	{look: 'chef', ref: 'refs/chef-glowing-eyes.jpg', ex: 'warm', pose: 'point', role: 'Entrance 1 · flaming pan'},
	{look: 'exec', ref: 'refs/shadow-exec-glowing-eyes.jpg', ex: 'neutral', pose: 'clasped', role: 'Entrance 2 · hands clasped'},
	{look: 'vision', ref: 'refs/3d-glasses-grey-suit.jpg', ex: 'smirk', pose: 'pockets', role: 'Entrance 3 · 3D glasses'},
	{look: 'boss', ref: 'refs/frog-boss-2d-vest.jpg', ex: 'smirk', pose: 'adjustGlasses', role: 'Entrance 4 · finale entrance'},
];

export const CastLineup: React.FC = () => (
	<SheetFrame title="CAST · LOOKS vs REFS (FAN LABELS)" subtitle="ONE BODY · SIX LOOKS">
		{CAST.map((c, i) => (
			<Panel key={c.look} x={56 + i * 300} y={110} w={288} h={600} label={LOOKS[c.look].label}>
				<div style={{position: 'absolute', top: 8, left: 8, width: 92, height: 92, borderRadius: 8, overflow: 'hidden', border: '2px solid #333'}}>
					<Img src={staticFile(c.ref)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
				</div>
				<Frog look={c.look} expression={c.ex} pose={c.pose} style={{height: '100%'}} />
				<div style={{position: 'absolute', bottom: -2, width: '100%', textAlign: 'center', fontSize: 12, color: '#7F9494', letterSpacing: 1}}>{c.role}</div>
			</Panel>
		))}
		<Panel x={1556} y={110} w={308} h={600} label="THE ROYAL FROG (AFTER)">
			<div style={{position: 'absolute', inset: 0}}>
				<Frog look="royal" expression="warm" pose="pockets" style={{height: '100%', width: '100%'}} />
				<Crown x={154} y={103} w={96} shine={0.6} />
			</div>
		</Panel>
		{CAST.map((c, i) => (
			<Panel key={`h-${c.look}`} x={56 + i * 300} y={726} w={288} h={300} label="FACE">
				<Frog crop="head" look={c.look} expression={c.ex} style={{height: '100%'}} />
			</Panel>
		))}
		<Panel x={1556} y={726} w={308} h={300} label="ROYAL · SAME FACE + CROWN">
			<div style={{position: 'absolute', inset: 0}}>
				<Frog crop="head" look="royal" expression="warm" style={{height: '100%', width: '100%'}} />
				<Crown x={154} y={44} w={110} />
			</div>
		</Panel>
	</SheetFrame>
);
