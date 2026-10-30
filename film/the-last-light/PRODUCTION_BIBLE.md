# THE LAST LIGHT — A FROG BOSS STORY
### Production Bible v0.1 (Phase 1: for approval)

An original fan film inspired by Elyziuma, made for the Elyziuma Community Creative Challenge. It is not official, sponsored or endorsed by Elyziuma, and "Frog Boss" and the story are fan interpretation, not canon.

---

## 0. Reference map

| File | Role | Used for |
|---|---|---|
| `references/C-frog-boss-character-sheet.png` | **Master design. Never altered.** | Outfit, proportions, all four views, poses, palette hexes |
| `references/A-glowing-eyes-hands-clasped.jpg` | Mascot identity (official profile) | Glowing horizontal eye bars, clasped-hands "strategist" pose, flat 2D line style |
| `references/E-3d-glasses-grey-suit.jpg` | Mascot variant | Head silhouette (twin brow bumps), mouth shape, collar/tie construction |
| `references/B-round-glasses-green-tee.jpg` | Mascot variant | Cel-shading approach (one shadow tone + one rim highlight), line weight |
| `references/D-chef-flaming-pan.jpg` | Mascot variant | Full-body 2D proportions; how glowing eyes read at small scale |

Only the reference files are kept here. The originals are untouched.

---

## 1. Understanding of the mascot

**What makes him recognisable at a glance:**
1. **Silhouette:** a wide, soft trapezoid-dome head that flows into the body with almost no neck, and two small brow bumps at the crown. Body is stocky and pear-shaped. Head is about 40% of standing height.
2. **The mouth:** a thick, glossy red (`#C73A32`) "sausage" lip spanning ~70% of face width, drooping at both corners. It is the main expression carrier.
3. **The eyes:** two white horizontal glowing bars (refs A, D). They make him read as calm and all-seeing.
4. **Teal skin** (`#0F6B6F`) with a lighter rim highlight along the dome.
5. **Formal composure:** a white collar and black tie, always neat.

**Canonical film design (resolves the sheet vs. mascot conflict):**
The sheet shows opaque sunglasses and the profile shows glowing eyes. The brief wants both, so in the film **the eye bars glow faintly through the dark lenses** as two soft white horizontal slits.
- Calm or neutral: dim glow (~35%).
- Focused or calculating: glow brightens.
- Emotional beats (Scene 12): glow flickers.
- Scene 13 turning point: he **takes the glasses off for the first time**, and the full glowing eyes appear.

He puts them back on in Scene 18, but with the glow fully visible through the lenses. The idea is "same frog, different perspective" carried by the design itself.

**Outfit (from sheet C; fixed in every scene):** white shirt `#F5F5F5`, black tie `#0B0B0B`, a geometric triangle vest (purple `#8A3B6B` / vest-teal `#4B8B8A` / grey `#2F3D3E`, three grey buttons), dark trousers `#0B0B0B`, polished black shoes, sunglasses `#1E2B27`.

**Cigarette:** small, static and unlit, tucked at the left mouth corner. There is no smoke and it is never used. *Director's note: because this goes to a community contest, I recommend replacing it with a toothpick or omitting it in the final cut. The design reads without it. Your call; it is kept by default.*

**Character Brief (per `character-consistency`); role line carried into every shot:**
> FROG BOSS: stocky teal frog (#0F6B6F), wide dome head with two small brow bumps, thick drooping glossy red lips (#C73A32), dark sunglasses (#1E2B27) with two faint white horizontal eye-glows behind the lenses, white shirt, black tie, geometric purple/teal/grey triangle vest with three grey buttons, black trousers, polished black shoes; thick black ink outline, flat cel shading with one shadow tone and one teal rim light; calm, unhurried body language.

---

## 2. Visual direction

**Style:** premium flat 2D with ink outlines, built as layered vector art (SVG/React in Remotion). It is cel-shaded like refs A/B/E, not the 3D render look of the sheet. The sheet is used for **design truth**, not render style.
- Characters: 3–4px black ink line at 1080p, one shadow tone, one rim light, no gradients on skin.
- Backgrounds: painterly vector with soft gradients, 5–7 parallax layers, atmospheric haze between layers.
- Finish: a subtle animated film grain (SVG turbulence, ~4% opacity), a soft vignette, and a light-bloom pass on all practical lights.

**The Quiet (visual rule):** it is never a creature. It is a **grade**. Wherever it spreads, saturation is driven toward 0, contrast flattens, edges lose ink weight, and lights go out in a ripple. Sound drops 6 dB per wave with a high-frequency roll-off.

**Recurring motifs:**
- **Vest triangle:** every district's architecture hides triangles, which become the final city mosaic.
- **Three-beat light:** short–long–short (●—●) for Pip's flashes, the beacon, Luma's notes and window blinks.
- **Bridges:** each one is an SVG path whose lights are individual nodes, so it can go dark or light node by node.

**Colour script:**

| Act | Dominant | Accent | Saturation |
|---|---|---|---|
| I — City goes dark | deep teal `#0B2E33`, charcoal `#111417` | warm window amber `#F2B45A` (dwindling) | 60% → 20% |
| II — Journey | per district: Mara murals (full spectrum, half greyed), Brik amber `#D9822B`, Luma blue/violet `#3B4FA0`/`#7A4FA0` | Pip gold `#FFD36B` | 30–70%, swinging |
| III — City returns | all palette, burgundy `#8A3B6B` + teal + gold together | sunrise `#FFB27A` | 20% → 100% |

**Lighting guide:** one motivated key per shot (window, beacon, Pip, lamp). Pip is always a real light source on nearby faces. The Frog Boss's lens glints are reserved for decisive moments.

**Camera and animation guide:** camera moves are eased and motivated (push-ins for realisations, slow pull-backs for scale). No zoom-on-still shots: every shot has character or environment motion. The animation-principle skills apply: anticipation before every jump or stand, squash/stretch only on Pip and landings (the Boss stays solid and weighty), and follow-through on the tie and vest hem. The Boss moves at 70% of the speed of others, which is his personality in timing.

---

## 3. 18-scene master timeline (exactly 45:00)

| # | Scene | In | Out | Dur | Act |
|---|---|---|---|---|---|
| 1 | Before the First Silence | 00:00 | 02:00 | 2:00 | I |
| 2 | The Frog Above the Noise | 02:00 | 04:30 | 2:30 | I |
| 3 | A Visitor at the Window | 04:30 | 07:00 | 2:30 | I |
| 4 | The Map That Wouldn't Hold | 07:00 | 10:00 | 3:00 | I |
| 5 | The First Bridge | 10:00 | 13:00 | 3:00 | I |
| 6 | The Artist of Lost Colors | 13:00 | 15:30 | 2:30 | II |
| 7 | The Mechanic Who Stopped Listening | 15:30 | 18:00 | 2:30 | II |
| 8 | The Station of Unheard Things | 18:00 | 20:30 | 2:30 | II |
| 9 | The Long Crossing | 20:30 | 23:00 | 2:30 | II |
| 10 | The Quiet Arrives | 23:00 | 25:30 | 2:30 | II |
| 11 | The False Dawn | 25:30 | 28:00 | 2:30 | II |
| 12 | The Map Burns | 28:00 | 31:00 | 3:00 | II |
| 13 | The Unplanned Answer | 31:00 | 34:00 | 3:00 | II |
| 14 | One Small Light | 34:00 | 36:30 | 2:30 | III |
| 15 | The City Answers | 36:30 | 39:00 | 2:30 | III |
| 16 | A Thousand Small Signals | 39:00 | 42:00 | 3:00 | III |
| 17 | The Quiet Listens | 42:00 | 43:30 | 1:30 | III |
| 18 | Same Frog, Different Perspectives | 43:30 | 45:00 | 1:30 | III |

At 30 fps that is 81,000 frames. Each scene is its own Remotion composition (`Scene01` … `Scene18`), and a `Master` composition chains them with `<Series>`.

---

## 4. Scene 1 storyboard: Before the First Silence (00:00–02:00, 3,600 frames)

| Shot | Time | Frames | Shot / camera | Action | Sound |
|---|---|---|---|---|---|
| 1.1 | 00:00–00:08 | 0–240 | Black | Nothing. Real silence. | Silence (−∞) |
| 1.2 | 00:08–00:18 | 240–540 | ECU, static | A tiny gold mote fades in and pulses **short–long–short** (first plant of the motif). | A single soft high note per pulse |
| 1.3 | 00:18–00:36 | 540–1080 | Slow pull-back → EWS | The mote is revealed as one window among thousands. The city on floating islands resolves, with 7 parallax layers, cloud-piercing towers and drifting islands. | Score enters: solo cello, then strings |
| 1.4 | 00:36–00:54 | 1080–1620 | Tracking fly-through, low over a bridge | Transport pods glide, bridge lights chase, rooftop gardens sway. | Narration: *"Every city has a heartbeat."* City ambience rises |
| 1.5 | 00:54–01:08 | 1620–2040 | MS, crane down over shops | Citizens (silhouettes) pass lanterns and blink lights across a gap between districts, as the three-beat signal between neighbours. | *"You might find it in the streets, in the lights, in the voices passing through the night."* |
| 1.6 | 01:08–01:18 | 2040–2340 | WS, locked off | One distant light goes out. Hold. | Woodwinds drop out. *"But sometimes…"* |
| 1.7 | 01:18–01:34 | 2340–2820 | WS, slow push | A second light goes out, then a whole bridge goes dark node by node, left to right. Grade saturation drops 60% → 30%. | Strings thin, ambience muffles |
| 1.8 | 01:34–01:46 | 2820–3180 | EWS, slow push toward the centre | The central beacon stutters: short–long–… and the third beat never comes. | One sustained note. *"…the most beautiful cities don't realise what they're losing until the silence arrives."* |
| 1.9 | 01:46–01:52 | 3180–3360 | Same | The beacon dims to an ember. | Note cuts. Silence. |
| 1.10 | 01:52–02:00 | 3360–3600 | Black → title | Cut to black. **THE LAST LIGHT** rises in gold, lit by a single mote, then fades. | One low resonant swell, then silence |

**Transition:** hard cut from black into Scene 2, an interior push-in on the rooftop office window.

**Animation plan (Remotion):**
- `<CityBackdrop layers={7} />` contains procedurally placed islands and towers, deterministic via `random(seed)`. Each window is a node with an `on` curve, so lights die from a schedule array.
- `<Bridge path nodes>` is an SVG path with light nodes, where darkness is set by `interpolate(frame, [start, start+N], …)` per node.
- `<QuietGrade amount>` is a CSS `filter: saturate() contrast()` on the scene root, keyed to the act colour script.
- The camera is a single `<Camera x y zoom>` wrapper with eased `interpolate` keyframes. Parallax comes from each layer's `depth` multiplier.
- `<Grain />` is SVG `feTurbulence` with the seed bumped per frame.

---

## 5. Technical limitations (honest)

1. **Length vs. hand-animation quality.** 45 minutes of character acting is a studio-scale job. In this code-based pipeline, environments, light, camera, motifs and the Quiet scale very well. Character acting is built from **posed SVG rigs** (head, eyes, mouth shapes, arms and limbs as separate parts) based on the sheet's poses, plus eased transitions. That gives consistent, appealing limited animation (TV-feature level), not frame-by-frame feature animation. The rigs keep the character 100% consistent, which is what matters most.
2. **Voices.** I can't provide real voice actors. Temporary voices can be made free and offline with Piper TTS (MIT; check each voice model's licence), but they will sound synthetic. For the contest cut, record community volunteers. The scratch track and subtitles (SRT) can be fully timed in advance.
3. **Music.** I can write and synthesise original cues in code (including the three-note motif) as temp score, but not a convincing orchestra. Options: a volunteer composer, or CC0 cinematic tracks with the motif layered on top.
4. **Rendering 45 minutes here.** Rendering per scene is feasible but slow in this container. Long renders should run on your machine (`npx remotion render Scene01`), one scene at a time, then go through `Master` or an ffmpeg concat.
5. **No paid generation.** The `video-prompt-director` skill targets Seedance (paid), so only its shot-contract method is used, not generation. The same goes for `character-consistency`: the sheet is the identity reference, and the SVG rig is how consistency is enforced.
6. **Licensing.** Remotion is free for individuals and companies of up to 3 people. Use only CC0/free-licence sounds and fonts.

**Delivery commitment:** Phase 1 (this doc plus the Frog Boss rig for approval), then the Scene 1–2 proof-of-style render, then scenes in order. A storyboard or prototype will never be presented as the finished film.

---

## 6. Approval needed before Phase 2–4
- [ ] Eye solution: glow through the lenses, plus the glasses-off reveal in Scene 13
- [ ] Cigarette: keep static (default), swap for a toothpick, or omit
- [ ] Flat ink 2D style (refs A/B/E) rather than the sheet's 3D render look
