import React from 'react';
import {Composition, Still} from 'remotion';
import {RigTurnaround} from './sheets/RigTurnaround';
import {RigPoses} from './sheets/RigPoses';
import {RigTest} from './sheets/RigTest';

export const Root: React.FC = () => (
	<>
		<Still id="RigTurnaround" component={RigTurnaround} width={1920} height={1080} />
		<Still id="RigPoses" component={RigPoses} width={1920} height={1080} />
		<Composition id="RigTest" component={RigTest} durationInFrames={360} fps={30} width={1920} height={1080} />
	</>
);
