import React from 'react';
import {Composition, Still} from 'remotion';
import {RigTurnaround} from './sheets/RigTurnaround';
import {RigPoses} from './sheets/RigPoses';
import {RigTest} from './sheets/RigTest';
import {RigCompare} from './sheets/RigCompare';
import {Film} from './film/Film';
import {SCENES, TOTAL} from './film/timing';
import {S1Silence} from './film/scenes/S1Silence';
import {S2Boss} from './film/scenes/S2Boss';
import {S3Signal} from './film/scenes/S3Signal';
import {S4Awakening} from './film/scenes/S4Awakening';
import {S5LastLight} from './film/scenes/S5LastLight';

const SCENE_COMPONENTS = [S1Silence, S2Boss, S3Signal, S4Awakening, S5LastLight];

export const Root: React.FC = () => (
	<>
		<Still id="RigTurnaround" component={RigTurnaround} width={1920} height={1080} />
		<Still id="RigPoses" component={RigPoses} width={1920} height={1080} />
		<Still id="RigCompare" component={RigCompare} width={1920} height={1080} />
		<Composition id="RigTest" component={RigTest} durationInFrames={360} fps={30} width={1920} height={1080} />
		<Composition id="Film" component={Film} durationInFrames={TOTAL} fps={30} width={1920} height={1080} />
		{SCENES.map((s, i) => (
			<Composition key={s.id} id={s.id} component={SCENE_COMPONENTS[i]} durationInFrames={s.dur} fps={30} width={1920} height={1080} />
		))}
	</>
);
