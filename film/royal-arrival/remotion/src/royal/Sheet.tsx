import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C} from '../rig/tokens';

export const FONT = 'Helvetica Neue, Arial, sans-serif';

export const SheetFrame: React.FC<{title: string; subtitle: string; children: React.ReactNode}> = ({title, subtitle, children}) => (
	<AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 30%, #1B2226 0%, ${C.bg} 70%)`, fontFamily: FONT, color: '#E9ECEC'}}>
		<div style={{position: 'absolute', left: 56, top: 34, display: 'flex', alignItems: 'baseline', gap: 24}}>
			<div style={{fontSize: 46, fontWeight: 900, letterSpacing: 2}}>THE ROYAL ARRIVAL</div>
			<div style={{fontSize: 20, letterSpacing: 6, color: '#9FB3B3'}}>{title}</div>
		</div>
		<div style={{position: 'absolute', right: 56, top: 46, fontSize: 16, letterSpacing: 3, color: '#6F8383'}}>{subtitle}</div>
		{children}
		<div style={{position: 'absolute', left: 56, bottom: 22, fontSize: 13, letterSpacing: 2, color: '#56696A'}}>
			THE ROYAL ARRIVAL · FAN FILM INSPIRED BY ELYZIUMA · NOT OFFICIAL
		</div>
	</AbsoluteFill>
);

export const Panel: React.FC<{x: number; y: number; w: number; h: number; label: string; children: React.ReactNode}> = ({x, y, w, h, label, children}) => (
	<div style={{position: 'absolute', left: x, top: y, width: w, height: h}}>
		<div style={{position: 'absolute', inset: 0, borderRadius: 10, background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)'}} />
		<div style={{position: 'absolute', inset: '6px 6px 30px 6px', display: 'flex', justifyContent: 'center'}}>{children}</div>
		<div style={{position: 'absolute', bottom: 8, width: '100%', textAlign: 'center', fontSize: 14, letterSpacing: 3, color: '#B9C7C7'}}>{label}</div>
	</div>
);
