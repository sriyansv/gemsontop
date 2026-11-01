import React from 'react';
import {Still} from 'remotion';
import {CastLineup} from './royal/CastLineup';
import {Storyboard, KeyArt} from './royal/Storyboard';

export const Root: React.FC = () => (
	<>
		<Still id="CastLineup" component={CastLineup} width={1920} height={1080} />
		<Still id="Storyboard" component={Storyboard} width={1920} height={1080} />
		<Still id="KeyArt" component={KeyArt} width={1920} height={1080} />
	</>
);
