// Costume "looks" for each Elyziuma frog. The body, head, face and proportions are the
// approved v0.4 rig for everyone; only the outfit, eyewear and mouth details change.
export type Look = {
	id: string;
	label: string;
	torso: 'vest' | 'tee' | 'jacket' | 'chef' | 'royal';
	body: string; // torso base colour
	sleeve: string;
	shortSleeve?: boolean; // tee: teal arm below a short sleeve
	cuff: string | null;
	collar: 'shirt' | 'ringer' | 'ermine';
	tie: boolean;
	pants: string;
	eyes: 'sunglasses' | 'round' | '3d' | 'glow' | 'glowPink';
	mouth: 'lips' | 'tongue' | 'fangs';
	toothpick: boolean;
	trim?: string;
};

export const LOOKS = {
	boss: {id: 'boss', label: 'THE FROG BOSS', torso: 'vest', body: '#2F3D3E', sleeve: '#F5F5F5', cuff: '#F5F5F5', collar: 'shirt', tie: true, pants: '#141516', eyes: 'sunglasses', mouth: 'lips', toothpick: true},
	casual: {id: 'casual', label: 'THE CASUAL FROG', torso: 'tee', body: '#5E6E50', sleeve: '#5E6E50', shortSleeve: true, cuff: null, collar: 'ringer', tie: false, pants: '#1D2730', eyes: 'round', mouth: 'tongue', toothpick: false},
	royal: {id: 'royal', label: 'THE ROYAL FROG', torso: 'royal', body: '#5E1838', sleeve: '#5E1838', cuff: '#E9B949', collar: 'ermine', tie: false, pants: '#141516', eyes: 'round', mouth: 'tongue', toothpick: false, trim: '#E9B949'},
	chef: {id: 'chef', label: 'THE CHEF', torso: 'chef', body: '#2A5638', sleeve: '#2A5638', cuff: '#2A5638', collar: 'shirt', tie: false, pants: '#22422D', eyes: 'glowPink', mouth: 'fangs', toothpick: false},
	exec: {id: 'exec', label: 'THE SHADOW EXEC', torso: 'jacket', body: '#24272A', sleeve: '#24272A', cuff: '#F5F5F5', collar: 'shirt', tie: true, pants: '#141516', eyes: 'glow', mouth: 'lips', toothpick: false},
	vision: {id: 'vision', label: 'THE 3D VISIONARY', torso: 'jacket', body: '#8E9193', sleeve: '#8E9193', cuff: '#F5F5F5', collar: 'shirt', tie: true, pants: '#3A3C3E', eyes: '3d', mouth: 'lips', toothpick: true},
} satisfies Record<string, Look>;

export type LookName = keyof typeof LOOKS;
