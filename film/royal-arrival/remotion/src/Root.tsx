import React from 'react';
import {Composition, Still} from 'remotion';
import {CastLineup} from './royal/CastLineup';
import {Storyboard, KeyArt} from './royal/Storyboard';
import {Film, FILM_FRAMES} from './royal/Film';

export const Root: React.FC = () => (
	<>
		<Still id="CastLineup" component={CastLineup} width={1920} height={1080} />
		<Still id="Storyboard" component={Storyboard} width={1920} height={1080} />
		<Still id="KeyArt" component={KeyArt} width={1920} height={1080} />
		<Composition id="RoyalArrival" component={Film} durationInFrames={FILM_FRAMES} fps={30} width={1920} height={1080} defaultProps={{audio: true}} />
	</>
);
