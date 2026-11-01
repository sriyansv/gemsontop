import React from 'react';
import {AbsoluteFill, Audio, staticFile} from 'remotion';
import {World} from './World';

export const FILM_FRAMES = 1350;
export const Film: React.FC<{audio?: boolean}> = ({audio = true}) => (
	<AbsoluteFill>
		<World />
		{audio ? <Audio src={staticFile('audio/royal-score.wav')} /> : null}
	</AbsoluteFill>
);
