import React from 'react';
import {AbsoluteFill, Easing, useCurrentFrame} from 'remotion';
import {Boss, Fade, Finish} from '../fx';
import {Pip} from '../Pip';
import {City} from '../City';
import {ramp} from '../lib';
import {FONT} from '../../sheets/Sheet';

// 38–45 s · 5A the beacon ignites, gold wave, sunrise; the Boss in profile, glasses back on · 5B title + credit.
export const S5LastLight: React.FC = () => {
	const f = useCurrentFrame();
	const ignite = ramp(f, 4, 14, 0, 1, Easing.out(Easing.cubic));
	const wave = ramp(f, 6, 95, 0, 1, Easing.out(Easing.quad));
	const dawn = ramp(f, 15, 130, 0, 1);
	const title = ramp(f, 118, 140);
	const cityDim = ramp(f, 112, 140, 1, 0.45);
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<AbsoluteFill style={{filter: `brightness(${cityDim}) saturate(1.15)`, transform: `scale(${ramp(f, 0, 210, 1.08, 1, Easing.out(Easing.sin))})`}}>
				<City windowOn={(w) => 0.85 + 0.15 * Math.sin(w.r * 40 + f / 8)} beacon={0.3 + 1.6 * ignite - 0.5 * ramp(f, 30, 120)} wave={wave} dawn={dawn} mosaic={1.05} pan={{x: 20, y: 0}} />
				<svg width={1920} height={1080} style={{position: 'absolute'}}>
					<path d="M0,960 L860,960 L900,1080 L0,1080 Z" fill="#05090B" />
					<path d="M0,960 L860,960" stroke="#FFD36B" strokeOpacity={0.5} strokeWidth={3} />
				</svg>
				<Boss x={250} y={470} h={560} turn={78} pose="pockets" expression="warm" glow={0.95} breathe={1} css={{filter: `drop-shadow(0 0 ${20 + 20 * ignite}px rgba(255,211,107,0.45))`}} />
				<Pip x={700 + 10 * Math.sin(f / 12)} y={560 + 8 * Math.sin(f / 9)} size={24} intensity={0.9} />
			</AbsoluteFill>
			<Fade o={0.85 * ramp(f, 4, 6, 0, 1, Easing.linear) * ramp(f, 6, 22, 1, 0)} color="#FFF4CF" />
			<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', fontFamily: FONT, color: '#FFE9B0', textAlign: 'center', opacity: title}}>
				<div style={{fontSize: 118, fontWeight: 900, letterSpacing: 26, textShadow: '0 0 40px rgba(255,190,90,0.6)', transform: `translateY(${(1 - title) * 20}px)`}}>THE LAST LIGHT</div>
				<div style={{fontSize: 30, letterSpacing: 14, marginTop: 16, color: '#F5F5F5', opacity: ramp(f, 132, 150)}}>A FROG BOSS STORY</div>
				<div style={{fontSize: 28, fontStyle: 'italic', marginTop: 34, color: '#DDEFF2', opacity: ramp(f, 146, 164)}}>“Same frog. Different perspectives.”</div>
				<div style={{position: 'absolute', bottom: 70, fontSize: 18, letterSpacing: 4, color: '#9FB3B3', opacity: ramp(f, 158, 172)}}>AN ORIGINAL FAN FILM INSPIRED BY ELYZIUMA · @Elyziumaa</div>
			</AbsoluteFill>
			<Finish vignette={0.5} />
			<Fade o={ramp(f, 196, 209, 0, 1)} />
		</AbsoluteFill>
	);
};
