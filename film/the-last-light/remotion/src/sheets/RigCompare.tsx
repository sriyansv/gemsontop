import React from 'react';
import {Img, staticFile} from 'remotion';
import {FrogBoss} from '../rig/FrogBoss';
import {Panel, SheetFrame} from './Sheet';

const SHEET = {w: 1672, h: 941};

/** Crop a region (in sheet pixels) of the master character sheet into a panel. */
const SheetCrop: React.FC<{x: number; y: number; w: number; h: number}> = ({x, y, w, h}) => (
	<svg viewBox={`${x} ${y} ${w} ${h}`} style={{height: '100%', maxWidth: '100%'}}>
		<image href={staticFile('refs/C-frog-boss-character-sheet.png')} width={SHEET.w} height={SHEET.h} />
	</svg>
);

const VIEWS: {label: string; turn: number; crop: [number, number, number, number]}[] = [
	{label: 'FRONT', turn: 0, crop: [10, 140, 240, 345]},
	{label: 'SIDE', turn: 90, crop: [250, 140, 230, 345]},
	{label: '3/4', turn: 35, crop: [720, 140, 260, 345]},
	{label: 'BACK', turn: 180, crop: [470, 140, 240, 345]},
];

export const RigCompare: React.FC = () => (
	<SheetFrame title="RIG v0.4 vs ORIGINAL REFERENCES" subtitle="TOP: SUPPLIED SHEET · MIDDLE: RIG · BOTTOM: AVATAR REFS vs RIG">
		{VIEWS.map((v, i) => (
			<React.Fragment key={v.label}>
				<Panel x={56 + i * 330} y={105} w={318} h={330} label={`SHEET · ${v.label}`}>
					<SheetCrop x={v.crop[0]} y={v.crop[1]} w={v.crop[2]} h={v.crop[3]} />
				</Panel>
				<Panel x={56 + i * 330} y={445} w={318} h={330} label={`RIG · ${v.label}`}>
					<FrogBoss turn={v.turn} style={{height: '100%'}} />
				</Panel>
			</React.Fragment>
		))}
		<Panel x={1380} y={105} w={484} h={330} label="3/4 BACK · ARMS FIXED">
			<FrogBoss turn={140} style={{height: '100%'}} />
			<FrogBoss turn={220} style={{height: '100%'}} />
		</Panel>
		<Panel x={1380} y={445} w={484} h={330} label="PROFILE CLOSE-UP · MUZZLE + LIPS">
			<FrogBoss turn={90} crop="head" style={{height: '100%'}} />
			<FrogBoss turn={-90} crop="head" expression="smirk" style={{height: '100%'}} />
		</Panel>
		{[
			['AVATAR A', 'refs/A-glowing-eyes-hands-clasped.jpg'],
			['AVATAR E', 'refs/E-3d-glasses-grey-suit.jpg'],
			['AVATAR B', 'refs/B-round-glasses-green-tee.jpg'],
		].map(([l, src], i) => (
			<Panel key={l} x={56 + i * 262} y={785} w={250} h={265} label={l}>
				<Img src={staticFile(src)} style={{height: '100%', borderRadius: 6}} />
			</Panel>
		))}
		<Panel x={842} y={785} w={250} h={265} label="RIG · FRONT FACE">
			<FrogBoss crop="head" style={{height: '100%'}} />
		</Panel>
		<Panel x={1104} y={785} w={250} h={265} label="RIG · SCENE 4 EYES">
			<FrogBoss crop="head" glassesOff expression="calculating" style={{height: '100%'}} />
		</Panel>
		<Panel x={1366} y={785} w={250} h={265} label="SHEET · HEAD CLOSE-UP">
			<SheetCrop x={995} y={505} w={232} h={180} />
		</Panel>
		<Panel x={1628} y={785} w={236} h={265} label="RIG · HEAD 3/4">
			<FrogBoss crop="head" turn={35} style={{height: '100%'}} />
		</Panel>
	</SheetFrame>
);
