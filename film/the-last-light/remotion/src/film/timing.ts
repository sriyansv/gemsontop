// Locked timeline (PRODUCTION_BIBLE.md §3): 45 s × 30 fps = 1,350 frames.
export const FPS = 30;
export const SCENES = [
	{id: 'S1', name: 'The Silence', from: 0, dur: 240},
	{id: 'S2', name: 'The Frog Boss', from: 240, dur: 240},
	{id: 'S3', name: 'The Signal', from: 480, dur: 270},
	{id: 'S4', name: 'The Awakening', from: 750, dur: 390},
	{id: 'S5', name: 'The Last Light', from: 1140, dur: 210},
] as const;
export const TOTAL = 1350;
