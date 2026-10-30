import {Config} from '@remotion/cli/config';

// Optional: point at a local Chrome (e.g. REMOTION_BROWSER=/path/to/chrome-headless-shell).
if (process.env.REMOTION_BROWSER) {
	Config.setBrowserExecutable(process.env.REMOTION_BROWSER);
}
Config.setVideoImageFormat('jpeg');
