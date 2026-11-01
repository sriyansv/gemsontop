import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Room} from './Room';
import {Crown, FlamePan, Sparkle, Throne} from './props';
import {Place, headTop} from './Place';
import {walkPose, POSES} from '../rig/poses';
import {FONT} from './Sheet';

/** A 1920×1080 frame shrunk into a storyboard cell. */
const Cell: React.FC<{x: number; y: number; n: string; time: string; title: string; note: string; children: React.ReactNode}> = ({x, y, n, time, title, note, children}) => {
	const s = 0.235;
	return (
		<div style={{position: 'absolute', left: x, top: y, width: 1920 * s, fontFamily: FONT}}>
			<div style={{position: 'relative', width: 1920 * s, height: 1080 * s, overflow: 'hidden', borderRadius: 8, border: '1px solid #2A3436'}}>
				<div style={{position: 'absolute', width: 1920, height: 1080, transform: `scale(${s})`, transformOrigin: '0 0'}}>{children}</div>
			</div>
			<div style={{marginTop: 8, display: 'flex', gap: 10, alignItems: 'baseline', color: '#E9ECEC'}}>
				<span style={{fontSize: 22, fontWeight: 900, color: '#E9B949'}}>{n}</span>
				<span style={{fontSize: 15, letterSpacing: 2}}>{title}</span>
				<span style={{fontSize: 13, color: '#7F9494', marginLeft: 'auto'}}>{time}</span>
			</div>
			<div style={{fontSize: 12.5, lineHeight: 1.45, color: '#9FB3B3', marginTop: 4}}>{note}</div>
		</div>
	);
};

const sparkles = (cx: number, cy: number, n: number, rad: number, seed = 1) =>
	Array.from({length: n}, (_, i) => {
		const a = i * 2.4 + seed;
		const r = rad * (0.4 + ((i * 37) % 10) / 16);
		return <Sparkle key={i} x={cx + Math.cos(a) * r} y={cy + Math.sin(a) * r * 0.8} r={8 + (i % 4) * 6} o={0.9} rot={i * 20} />;
	});

export const P1 = () => (
	<AbsoluteFill>
		<Room doors={0.6} lights={0.45} />
		<Place x={520} y={900} h={460} turn={70} pose={walkPose(0.25)} look="casual" />
	</AbsoluteFill>
);
export const P2 = () => {
	const t = headTop(960, 1250, 1300);
	return (
		<AbsoluteFill>
			<Room lights={0.6} />
			<AbsoluteFill style={{background: 'rgba(0,0,0,0.35)'}} />
			<Place x={960} y={1250} h={1300} look="casual" expression="surprised" />
			<Crown x={t.x} y={t.y - 260} w={260} rot={-14} shine={1} />
			<svg width={1920} height={1080} style={{position: 'absolute'}}>
				{[880, 960, 1040].map((x) => <line key={x} x1={x} y1={0} x2={x} y2={60} stroke="#FFE39A" strokeWidth={5} opacity={0.6} />)}
			</svg>
		</AbsoluteFill>
	);
};
export const P3 = () => (
	<AbsoluteFill>
		<Room lights={0.4} />
		<AbsoluteFill style={{background: 'radial-gradient(circle at 50% 55%, rgba(255,227,154,0.75), rgba(255,180,60,0.15) 35%, rgba(0,0,0,0.5) 70%)'}} />
		<div style={{position: 'absolute', inset: 0, clipPath: 'inset(0 50% 0 0)'}}>
			<Place x={960} y={960} h={700} turn={-20} look="casual" expression="surprised" />
		</div>
		<div style={{position: 'absolute', inset: 0, clipPath: 'inset(0 0 0 50%)'}}>
			<Place x={960} y={960} h={700} turn={-20} look="royal" expression="warm" />
		</div>
		<Crown x={960 - 8} y={960 - 700 * 0.82} w={150} shine={1} />
		<svg width={1920} height={1080} style={{position: 'absolute'}}>
			<line x1={960} y1={200} x2={960} y2={1000} stroke="#FFF4CF" strokeWidth={14} style={{filter: 'blur(4px)'}} />
			{sparkles(960, 600, 26, 420)}
		</svg>
	</AbsoluteFill>
);
export const P4 = () => {
	const t = headTop(960, 725, 400, 48);
	return (
		<AbsoluteFill>
			<Room lights={1} />
			<Throne x={960} y={690} w={420} glow={1} />
			<Place x={960} y={725} h={400} pose="sit" look="royal" expression="smirk" />
			<Crown x={t.x} y={t.y + 4} w={78} shine={0.6} />
		</AbsoluteFill>
	);
};
export const P5 = () => {
	const t = headTop(960, 725, 400, 48);
	return (
		<AbsoluteFill>
			<Room doors={1} lights={1} />
			<Throne x={960} y={690} w={420} />
			<Place x={960} y={725} h={400} pose="sit" look="royal" expression="warm" />
			<Crown x={t.x} y={t.y + 4} w={78} />
			<Place x={330} y={930} h={480} turn={25} pose={POSES.point} look="chef" expression="warm" />
			<FlamePan x={248} y={760} s={1.1} flicker={0.5} />
			<AbsoluteFill style={{background: 'radial-gradient(circle at 17% 75%, rgba(255,140,40,0.28), transparent 30%)'}} />
		</AbsoluteFill>
	);
};
export const P6 = () => {
	const t = headTop(960, 725, 400, 48);
	return (
		<AbsoluteFill>
			<Room doors={1} lights={0.7} />
			<Throne x={960} y={690} w={420} />
			<Place x={960} y={725} h={400} pose="sit" look="royal" />
			<Crown x={t.x} y={t.y + 4} w={78} />
			<AbsoluteFill style={{background: 'radial-gradient(ellipse at 30% 80%, rgba(255,255,255,0.12), transparent 35%)'}} />
			<Place x={420} y={960} h={520} turn={20} pose="clasped" look="exec" />
			<Place x={1400} y={960} h={520} turn={-25} look="vision" expression="smirk" />
		</AbsoluteFill>
	);
};
const LINE = [
	{look: 'chef', x: 380, turn: 20},
	{look: 'exec', x: 680, turn: 10},
	{look: 'royal', x: 960, turn: 0},
	{look: 'vision', x: 1240, turn: -10},
	{look: 'boss', x: 1540, turn: -20},
] as const;
export const P7 = () => (
	<AbsoluteFill>
		<Room doors={1} lights={1} />
		<svg width={1920} height={1080} style={{position: 'absolute'}}>
			{[380, 680, 960, 1240, 1540].map((x) => <ellipse key={x} cx={x} cy={1000} rx={150} ry={24} fill="#FFE39A" opacity={0.25} />)}
		</svg>
		{LINE.map((c, i) => (
			<Place key={c.look} x={c.x} y={1000} h={470} turn={c.turn} look={c.look} pose={POSES.shrug} expression={i === 2 ? 'warm' : 'smirk'} css={{transform: `translateY(${i % 2 ? -30 : 0}px) rotate(${i % 2 ? -4 : 4}deg)`}} />
		))}
		<Crown x={960} y={1000 - 470 * 0.82} w={92} />
	</AbsoluteFill>
);
export const P8 = () => (
	<AbsoluteFill>
		<Room doors={1} lights={1} />
		<Throne x={960} y={700} w={460} glow={1} />
		<Place x={960} y={735} h={420} pose="sit" look="royal" expression="warm" />
		<Crown x={960} y={headTop(960, 735, 420, 48).y + 4} w={82} shine={1} />
		{LINE.filter((c) => c.look !== 'royal').map((c, i) => (
			<Place key={c.look} x={[420, 700, 1220, 1500][i]} y={[1010, 960, 960, 1010][i]} h={[500, 460, 460, 500][i]} turn={[30, 15, -15, -30][i]} look={c.look} pose={(['point', 'clasped', 'pockets', 'pockets'] as const)[i]} expression="smirk" />
		))}
		<FlamePan x={360} y={810} s={1.1} flicker={0.8} />
		<svg width={1920} height={1080} style={{position: 'absolute'}}>{sparkles(960, 300, 30, 900, 3)}</svg>
		<div style={{position: 'absolute', top: 40, width: '100%', textAlign: 'center', fontFamily: FONT, fontSize: 110, fontWeight: 900, letterSpacing: 24, color: '#FFE39A', textShadow: '0 0 40px rgba(255,190,90,0.7), 0 6px 0 #6B4A0E'}}>ELYZIUMA</div>
	</AbsoluteFill>
);

export const Storyboard: React.FC = () => (
	<AbsoluteFill style={{background: '#0E1214', fontFamily: FONT}}>
		<div style={{position: 'absolute', left: 40, top: 24, color: '#E9ECEC', fontSize: 34, fontWeight: 900, letterSpacing: 2}}>
			THE ROYAL ARRIVAL <span style={{fontSize: 16, color: '#9FB3B3', letterSpacing: 4, fontWeight: 400}}>STORYBOARD · 45 s · 1,350 FRAMES · KEY FRAMES (STATIC — MOTION NOTED)</span>
		</div>
		<Cell x={40} y={80} n="1" time="0–7 s" title="THE ENTRANCE" note="Doors swing open on a dim hall. The Casual Frog strolls in on a weighty walk cycle, glances around. Camera trucks with him."><P1 /></Cell>
		<Cell x={505} y={80} n="2" time="7–10 s" title="THE CROWN FALLS" note="He looks up. A crown drops from the dark, spinning; streaks; lands on the beat (8.0 s) with a squash on his head + gold ring."><P2 /></Cell>
		<Cell x={970} y={80} n="3" time="10–15 s" title="TRANSFORMATION" note="Spin + light-wipe: tee → royal velvet, ermine and gold. Same face, round glasses and tongue keep him recognisable."><P3 /></Cell>
		<Cell x={1435} y={80} n="4" time="15–20 s" title="THE THRONE" note="Throne rises from the dais in gold light. He walks up, turns, sits with anticipation dip; lights snap to full on the downbeat."><P4 /></Cell>
		<Cell x={40} y={560} n="5" time="20–23 s" title="ENTRANCE · THE CHEF" note="Doors burst open. Chef slides in, pan flares to the beat. Each entrance: whip-pan, freeze-frame name card, signature move."><P5 /></Cell>
		<Cell x={505} y={560} n="6" time="23–32 s" title="EXEC · 3D VISIONARY · BOSS" note="Shadow Exec glides in under eye-glow; 3D Visionary pops lenses; the Frog Boss arrives last — glasses adjust, music hits."><P6 /></Cell>
		<Cell x={970} y={560} n="7" time="32–40 s" title="GROUP DANCE" note="King leaves the throne, joins the line. Two eight-counts: step-touch + shrug, then wave + spin, with offset follow-through."><P7 /></Cell>
		<Cell x={1435} y={560} n="8" time="40–45 s" title="ROYAL GROUP POSE" note="Snap to the group pose around the throne on the last hit. Gold confetti, ELYZIUMA title. Hold, then button chime."><P8 /></Cell>
	</AbsoluteFill>
);

export const KeyArt: React.FC = () => <P8 />;
