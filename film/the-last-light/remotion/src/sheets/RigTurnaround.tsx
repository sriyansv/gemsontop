import React from 'react';
import {FrogBoss} from '../rig/FrogBoss';
import type {ExpressionName} from '../rig/expressions';
import {C} from '../rig/tokens';
import {Panel, SheetFrame} from './Sheet';

const VIEWS: [string, number][] = [
	['FRONT', 0],
	['3/4 VIEW', 40],
	['SIDE VIEW', 90],
	['3/4 BACK', 140],
	['BACK VIEW', 180],
];

const FACES: [string, ExpressionName][] = [
	['NEUTRAL', 'neutral'],
	['CALCULATING', 'calculating'],
	['SMIRK', 'smirk'],
	['SERIOUS', 'serious'],
	['SURPRISED', 'surprised'],
	['HEARTBROKEN', 'heartbroken'],
	['WARM', 'warm'],
	['TALKING', 'talking'],
];

const SWATCHES: [string, string][] = [
	['SKIN', C.skin], ['LIPS', C.lips], ['GLASSES', C.glasses], ['SHIRT', C.shirt],
	['TIE / PANTS', C.tie], ['VEST PURPLE', C.vestPurple], ['VEST TEAL', C.vestTeal], ['VEST GRAY', C.vestGray],
];

export const RigTurnaround: React.FC = () => (
	<SheetFrame title="CHARACTER RIG · TURNAROUND + EXPRESSIONS" subtitle="FLAT 2D · INK + CEL · SHEET-ACCURATE PROPORTIONS">
		{VIEWS.map(([label, turn], i) => (
			<Panel key={label} x={56 + i * 280} y={110} w={264} h={500} label={label}>
				<FrogBoss turn={turn} style={{height: '100%'}} />
			</Panel>
		))}
		<div style={{position: 'absolute', left: 1480, top: 110, width: 384, height: 500}}>
			<div style={{fontSize: 15, letterSpacing: 3, color: '#9FB3B3', marginBottom: 14}}>COLOUR PALETTE (FROM SHEET)</div>
			<div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12}}>
				{SWATCHES.map(([n, c]) => (
					<div key={n} style={{display: 'flex', alignItems: 'center', gap: 10}}>
						<div style={{width: 54, height: 34, borderRadius: 5, background: c, border: '1px solid #333'}} />
						<div style={{fontSize: 12, letterSpacing: 1.5, color: '#B9C7C7'}}>{n}<br /><span style={{color: '#6F8383'}}>{c.toUpperCase()}</span></div>
					</div>
				))}
			</div>
			<div style={{marginTop: 26, fontSize: 15, letterSpacing: 3, color: '#9FB3B3'}}>LOCKED IDENTITY</div>
			<ul style={{fontSize: 15, lineHeight: 1.65, color: '#C9D4D4', paddingLeft: 20, marginTop: 8}}>
				<li>Flat-top dome head, twin brow bumps</li>
				<li>Thick drooping red lips</li>
				<li>White eye-glow behind dark lenses</li>
				<li>Triangle vest · white shirt · black tie</li>
				<li>Subtle static toothpick (no smoking)</li>
				<li>Glasses come off only in Scene 4</li>
			</ul>
		</div>
		{FACES.map(([label, ex], i) => (
			<Panel key={label} x={56 + i * 227} y={632} w={215} h={240} label={label}>
				<FrogBoss crop="head" expression={ex} style={{height: '100%'}} />
			</Panel>
		))}
		<Panel x={56} y={890} w={442} h={160} label="BLINK · HALF / CLOSED">
			<FrogBoss crop="head" blink={0.5} style={{height: '100%'}} />
			<FrogBoss crop="head" blink={1} style={{height: '100%'}} />
		</Panel>
		<Panel x={510} y={890} w={442} h={160} label="GLOW: DIM → CALCULATING → MAX">
			<FrogBoss crop="head" glow={0.15} style={{height: '100%'}} />
			<FrogBoss crop="head" glow={1} expression="calculating" style={{height: '100%'}} />
		</Panel>
		<Panel x={964} y={890} w={442} h={160} label="3/4 + SIDE FACE CHECK">
			<FrogBoss crop="head" turn={40} expression="smirk" style={{height: '100%'}} />
			<FrogBoss crop="head" turn={90} expression="talking" style={{height: '100%'}} />
		</Panel>
		<Panel x={1418} y={890} w={446} h={160} label="SCENE 4 · GLASSES OFF (REVEAL)">
			<FrogBoss crop="head" glassesOff expression="heartbroken" style={{height: '100%'}} />
			<FrogBoss crop="head" glassesOff expression="warm" style={{height: '100%'}} />
		</Panel>
	</SheetFrame>
);
