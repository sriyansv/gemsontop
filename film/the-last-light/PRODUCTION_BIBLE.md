# THE LAST LIGHT — A FROG BOSS STORY
### Production Bible v0.2 (45-second short)

An original fan film inspired by Elyziuma, made for the Elyziuma Community Creative Challenge. It is not official, sponsored or endorsed by Elyziuma, and "Frog Boss" and the story are fan interpretation, not canon.

## Format (locked)
- **Duration:** exactly 45 s, which is **1,350 frames at 30 fps**
- **Picture:** 1920 × 1080, 16:9
- **Cast:** Frog Boss (main) and Pip, a tiny glowing firefly. No other characters.
- **Dialogue:** none required. The story is told visually. At most one optional whispered line.
- **Pipeline:** Remotion, SVG and CSS, rendered locally for free. One composition per scene plus `Film` (`<Series>`).

---

## 0. Reference map
| File | Role |
|---|---|
| `references/C-frog-boss-character-sheet.png` | **Master design, never altered**: proportions, costume, colours, angles |
| `references/A-glowing-eyes-hands-clasped.jpg` | Mascot identity: glowing eye bars, clasped-hands pose, flat 2D line |
| `references/E-3d-glasses-grey-suit.jpg` | Head silhouette, mouth, collar and tie |
| `references/B-round-glasses-green-tee.jpg` | Cel-shading approach, line weight |
| `references/D-chef-flaming-pan.jpg` | Full-body 2D proportions; glow at small scale |

## 1. Approved character identity (locked)
- **Silhouette:** a rounded gumdrop head with a flat crown and two brow bumps, flowing straight into a stocky, pear-shaped body.
- **Mouth:** thick, glossy, drooping red lips (`#C73A32`), the main expression carrier.
- **Eyes:** dark sunglasses (`#1E2B27`) with the **white eye-glow faintly visible through the lenses**. The glow brightens slightly when he is calculating and in emotional beats.
- **Outfit:** white shirt, black tie, a geometric purple/teal/grey triangle vest, black trousers and polished shoes.
- **Toothpick:** a small static toothpick (it replaced the cigarette). There is no smoking anywhere.
- **Style:** flat 2D, clean ink outlines, one shadow tone plus one rim light, and painted multi-layer backgrounds with grain and bloom.
- **Expressions** move only the mouth and eye-glow bars. The face is never redesigned or humanised.
- **The glasses come off exactly once, in Scene 4.**

**Pip:** a firefly about 1/12 of the Boss's height. Gold (`#FFD36B`) body glow with flickering wings. Pip "speaks" only in light pulses.

**Motif:** the **three-beat light**, short–long–short (●—●). It is the film's only "language".

## 2. Colour script
| Scene | Grade |
|---|---|
| 1 The Silence | Deep teal and charcoal; amber windows dying out; saturation 60% → 15% |
| 2 The Frog Boss | Near-monochrome teal; the eye-glow is the only white light |
| 3 The Signal | Pip's gold enters as the first warm colour |
| 4 The Awakening | Silence beat in cold neutral, then gold spreading node by node |
| 5 The Last Light | Full palette: gold, teal, burgundy, sunrise |

## 3. Timeline (exactly 1,350 frames)
| # | Scene | Seconds | Frames | Length |
|---|---|---|---|---|
| 1 | The Silence | 0–8 | 0–239 | 240 |
| 2 | The Frog Boss | 8–16 | 240–479 | 240 |
| 3 | The Signal | 16–25 | 480–749 | 270 |
| 4 | The Awakening | 25–38 | 750–1139 | 390 |
| 5 | The Last Light | 38–45 | 1140–1349 | 210 |

## 4. Shot list
**Scene 1 — The Silence (0–8 s).**
- *1A, 0–2 s:* black; a gold mote pulses short–long–short.
- *1B, 2–6 s:* a pull-back reveals the floating-island city at night, with parallax layers and drifting bridges.
- *1C, 6–8 s:* the windows die in a ripple, a bridge goes dark node by node, and the central beacon stutters on its third beat.
- *Sound:* a soft pad that loses voices until there is silence.

**Scene 2 — The Frog Boss (8–16 s).**
- *2A, 8–11 s:* rooftop, back view. The Boss sits silhouetted against the dying city on a slow push-in.
- *2B, 11–16 s:* 3/4 medium close-up. Hands clasped, he watches a holographic map of districts going dark. The eye-glow brightens behind the lenses as he calculates. A tiny smirk fades to serious.
- *Sound:* wind, a low drone and a single clock-like tick.

**Scene 3 — The Signal (16–25 s).**
- *3A:* Pip bumps against the glass, weakly flashing ●—●.
- *3B:* the Boss stands and reaches out a finger. Pip lands on it.
- *3C:* a close-up on Pip's gold flash reflected in the dark lenses. Pip's light is dying.
- *Sound:* wing flutter and three tiny chimes (the motif).

**Scene 4 — The Awakening (25–38 s).**
- *4A, about 25–27 s:* anticipation. His hand rises to the glasses and the score thins.
- *4B, 27–32 s:* **the reveal: he removes the sunglasses. Music, ambience and sound effects all stop. About 5 s of total silence** on a close-up of his full glowing eyes and expression.
- *4C, 32–38 s:* he lifts Pip, and his eyes and Pip pulse the three-beat together. One window answers, then another. A chain of lights runs across the bridges and forms the **vest-triangle mosaic** over the city. The score returns and builds.

**Scene 5 — The Last Light (38–45 s).**
- *5A:* the beacon ignites and a gold wave sweeps the city. The Boss and Pip are seen from behind, glasses back on with the glow clearly visible.
- *5B, 42–45 s:* title: **THE LAST LIGHT · A Frog Boss Story · "Same frog. Different perspectives."**, then the small line *"An original fan film inspired by Elyziuma · @Elyziumaa"*.
- *Sound:* a crescendo, then a soft final chime.

## 5. Sound
The score is original, synthesised in code or taken from a CC0 source. The three-note motif is the hook. Silence is a tool. The Scene 4 reveal silence is a hard rule.

## 6. Rig
- **Code:** `remotion/src/rig/`
- **Sheets:** `remotion/out/rig-turnaround.png` and `rig-poses.png`. Motion test: `rig-test.mp4`.
- **Regenerate:** `cd remotion && npm install && npm run sheets && npm run rigtest`
- **Status:** v0.2, awaiting approval before the film is produced.
