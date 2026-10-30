import React from 'react';
import {FrogBoss} from '../rig/FrogBoss';
import {walkPose, type PoseName} from '../rig/poses';
import type {ExpressionName} from '../rig/expressions';
import {Panel, SheetFrame} from './Sheet';

const Armchair: React.FC = () => (
	<svg viewBox="0 0 400 620" style={{position: 'absolute', height: '100%'}}>
		<rect x={46} y={300} width={308} height={290} rx={40} fill="#3A1D16" stroke="#0A0A0A" strokeWidth={7} />
		<rect x={20} y={420} width={84} height={170} rx={34} fill="#4A261C" stroke="#0A0A0A" strokeWidth={7} />
		<rect x={296} y={420} width={84} height={170} rx={34} fill="#4A261C" stroke="#0A0A0A" strokeWidth={7} />
		{[110, 170, 230, 290].map((x) => <circle key={x} cx={x} cy={350} r={5} fill="#1C0D09" />)}
	</svg>
);

type Row = {label: string; turn: number; pose: PoseName | ReturnType<typeof walkPose>; ex: ExpressionName; chair?: boolean; glassesOff?: boolean};
const ROW: Row[] = [
	{label: 'COOL · HANDS IN POCKETS', turn: 0, pose: 'pockets', ex: 'neutral'},
	{label: 'STRATEGIST · HANDS CLASPED', turn: -20, pose: 'clasped', ex: 'calculating'},
	{label: 'POINTING', turn: 25, pose: 'point', ex: 'smirk'},
	{label: 'ADJUSTING GLASSES', turn: 0, pose: 'adjustGlasses', ex: 'serious'},
	{label: 'SHRUG', turn: -10, pose: 'shrug', ex: 'smirk'},
	{label: 'WALK · CONTACT', turn: 90, pose: walkPose(0.25), ex: 'neutral'},
	{label: 'WALK · PASSING', turn: 70, pose: walkPose(0), ex: 'neutral'},
	{label: 'SITTING (SCENE 2)', turn: 30, pose: 'sit', ex: 'neutral', chair: true},
	{label: 'SCENE 4 · GLASSES IN HAND', turn: 15, pose: 'holdGlasses', ex: 'heartbroken', glassesOff: true},
	{label: 'SCENE 5 · AT PEACE', turn: -15, pose: 'pockets', ex: 'warm'},
];

export const RigPoses: React.FC = () => (
	<SheetFrame title="CHARACTER RIG · POSES" subtitle="SAME RIG · ANY ANGLE · ANY POSE">
		{ROW.map((r, i) => (
			<Panel key={r.label} x={56 + (i % 5) * 364} y={110 + Math.floor(i / 5) * 470} w={352} h={455} label={r.label}>
				{r.chair ? <Armchair /> : null}
				<FrogBoss turn={r.turn} pose={r.pose} expression={r.ex} glassesOff={r.glassesOff} style={{height: '100%', position: 'relative'}} />
			</Panel>
		))}
	</SheetFrame>
);
