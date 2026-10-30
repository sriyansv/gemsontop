import React from 'react';
import {AbsoluteFill, Audio, Series, staticFile} from 'remotion';
import {SCENES} from './timing';
import {S1Silence} from './scenes/S1Silence';
import {S2Boss} from './scenes/S2Boss';
import {S3Signal} from './scenes/S3Signal';
import {S4Awakening} from './scenes/S4Awakening';
import {S5LastLight} from './scenes/S5LastLight';

const COMPONENTS = [S1Silence, S2Boss, S3Signal, S4Awakening, S5LastLight];

export const Film: React.FC = () => (
	<AbsoluteFill style={{background: '#000'}}>
		<Series>
			{SCENES.map((s, i) => {
				const Scene = COMPONENTS[i];
				return (
					<Series.Sequence key={s.id} durationInFrames={s.dur} name={`${s.id} ${s.name}`}>
						<Scene />
					</Series.Sequence>
				);
			})}
		</Series>
		<Audio src={staticFile('audio/score.wav')} />
	</AbsoluteFill>
);
