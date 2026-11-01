# ELYZIUMA: THE ROYAL ARRIVAL 👑
### Creative direction + storyboard v0.1 (Phases 1–3, for review; no production yet)

An original fan film inspired by Elyziuma. It is not official, sponsored or endorsed. Character names below are descriptive fan labels, not official names.

**Format:** 45 s · 1,350 frames · 1920×1080 · 30 fps · Remotion, rendered locally · no paid services.
**Project:** `film/royal-arrival/`, separate from THE LAST LIGHT, which is untouched. The rig was **copied**, not shared, so changes here can't affect that film.

---

## 1. Repository inspection (Phase 1)
| Found | Use |
|---|---|
| `film/the-last-light/remotion/src/rig/`: approved Frog Boss rig v0.4 (turnable SVG body, expressions, poses, pose blending) | Copied to `royal-arrival/remotion/src/rig/` and extended with a **look system**: outfit, sleeves, collar, eyewear, mouth and trousers per character. Body, head, face and proportions stay exactly v0.4. |
| THE LAST LIGHT film tooling: synthesised score pipeline, pose blending (`lerpPose`), finishing FX | Reused as patterns for production |
| Elyziuma references you supplied (6 images) | Saved to `royal-arrival/references/`; the source of truth for each look |
| `shortfilm/assets/*.png` (emma, jampzey, meiv, pix, safz, shaq, tulip, zera) | **Not used.** These are Alpha GEMS community avatars, not Elyziuma, and several look like existing NFT and anime characters |

**Usable cast:** every Elyziuma reference is the same frog mascot in a different outfit. So the "different characters" are distinct **looks** on one approved body. That keeps identity consistent and makes the silhouettes differ through costume, eyewear and props.

| Look (fan label) | Reference | Signature |
|---|---|---|
| **The Casual Frog** → **The Royal Frog** | round-glasses green tee | Round black glasses, tongue out. He keeps both after the transformation, so he stays recognisable. |
| **The Chef** | flaming-pan chef | Pink-white glowing eyes, fanged grin, green coat with chevron pattern, grey apron, flaming pan |
| **The Shadow Exec** | glowing eyes, hands clasped | White eye-glow, black suit, hands clasped |
| **The 3D Visionary** | 3D glasses, grey suit | Red/cyan 3D glasses, grey suit, toothpick |
| **The Frog Boss** | character sheet + 2D vest art | Approved design: sunglasses, triangle vest, toothpick |

## 2. Music + beat map
- **Tempo:** 120 BPM, so one beat is **15 frames**, one bar is 2 s, and one eight-count is 4 s.
- **Score:** original and synthesised locally, like THE LAST LIGHT: royal brass-style stabs, a harpsichord arpeggio, timpani, claps and a bass groove. No commercial music.

| Time | Frame | Music | Picture sync |
|---|---|---|---|
| 0–7 s | 0–209 | Mysterious royal pad, low strings, soft footsteps | Doors, entrance walk |
| 7.0 s | 210 | Harp gliss up, everything else drops | He looks up; the crown appears |
| **8.0 s** | **240** | **Timpani hit + bell** | **Crown lands** (squash, gold ring) |
| 10–14 s | 300–419 | Riser + swirling arpeggio | Transformation spin |
| **14.0 s** | **420** | **Brass fanfare stab** | **Royal reveal** |
| **19.0 s** | **570** | Downbeat, bass enters | **He sits on the throne**; lights snap to full |
| 20 / 23 / 26 s | 600 / 690 / 780 | A stab plus a signature sound each: sizzle, whoosh, synth zap | Chef / Exec / 3D Visionary entrances |
| **29.0 s** | **870** | Drop: full groove | **Frog Boss entrance** (glasses adjust on the hit) |
| 32–40 s | 960–1199 | Two eight-counts, peak energy | Group dance |
| **40.0 s** | **1200** | Final brass + cymbal hit | **Group pose** |
| 40–45 s | 1200–1349 | Ring-out, button chime at 44 s | Title hold, fade |

## 3. Shot list
| # | Time / frames | Shot | Camera | Action and animation notes |
|---|---|---|---|---|
| 1 | 0–7 s · 0–209 | Wide hall, dim | Slow dolly-in, then a truck with him | The doors swing open (ease-out, overshoot). The Casual Frog walks in with a weighty walk cycle and a small bob, stops centre, looks around (head turns). |
| 2 | 7–10 s · 210–299 | Medium close-up, low angle | Tilt up with his look | Anticipation: he looks up. The crown falls from the dark, spinning, with motion streaks and an arc. **Lands at frame 240**: the crown squashes (a 6-frame squash then settle), his body dips, a gold ring of light shoots out. Expression: surprised, then a grin. |
| 3 | 10–15 s · 300–449 | Medium, centred | Slow 180° orbit, then push-in | A transformation spin: two full turns using the rig's turnaround. A vertical light-wipe sweeps across him and the outfit changes from tee to royal look behind it. A spiral of particles, a sparkle burst on the reveal at **frame 420**. A confident pose. |
| 4 | 15–20 s · 450–599 | Wide, then medium | Crane up as the throne rises | The throne rises from the dais in gold light. He walks up the carpet, turns (anticipation dip), sits. **The lights snap to full at frame 570.** |
| 5 | 20–23 s · 600–689 | Doors, then medium | Whip-pan to the doors | The doors burst open. **The Chef** slides in; the pan flares on the beat with fire follow-through. Freeze-frame and name card (8 frames). |
| 6 | 23–26 s · 690–779 | Medium | Low dolly | **The Shadow Exec** glides in; the room dims briefly so his eye-glow pops; hands clasp on the beat. Name card. |
| 7 | 26–29 s · 780–869 | Medium | Snap zoom | **The 3D Visionary** struts in; the lenses flash red/cyan on the beat; a smirk. Name card. |
| 8 | 29–32 s · 870–959 | Hero shot, low angle | Slow push-in | **The Frog Boss** arrives last: hands in pockets, then a glasses adjust on the drop. The other frogs react (heads turn). |
| 9 | 32–36 s · 960–1079 | Wide, line of five | Static, then a gentle sway | **Eight-count 1:** the king leaves the throne and joins the centre. Step-touch (4 beats), then a shoulder shrug and bounce (4 beats). Positions are staggered by one frame for organic follow-through. |
| 10 | 36–40 s · 1080–1199 | Wide, then low angle | Orbit 20° | **Eight-count 2:** a wave across the line (a 2-frame offset per character), point to camera, a full spin using the turnaround, then a pose prep. Squash on landings. |
| 11 | 40–45 s · 1200–1349 | The key-art frame | Slow pull-back | The **group pose** snaps on the hit around the throne. Gold confetti, the ELYZIUMA title, a button chime, fade. |

## 4. Crown transformation plan (the hook)
1. **Anticipation (frames 210–228):** he glances up and the music drops out.
2. **Fall (frames 228–240):** the crown follows a quadratic arc with 1.5 turns of rotation, motion streaks behind it, and a shadow growing on his head.
3. **Impact (frame 240):** the crown squashes to 85% for 3 frames then overshoots to 104%. His body dips 2% on the hit. A gold shock ring and 12 sparkles burst out.
4. **Build (frames 300–420):** a two-turn spin; the camera orbits the other way.
5. **Swap (frames 390–420):** a vertical light-wipe crosses his body. Behind it the look changes from `casual` to `royal`: velvet coat, ermine collar, gold trim, buttons and jabot. Face, glasses and tongue stay.
6. **Reveal (frame 420):** a fanfare stab, a sparkle burst, he settles into a confident pose. The crown glints.

## 5. Choreography (frames 960–1199, 120 BPM)
| Counts | Move | Notes |
|---|---|---|
| 1–4 | Step-touch left and right | Body bobs 3% on each step; the vest or coat hem follows a frame late |
| 5–8 | Shoulder shrug and bounce | Uses the `shrug` pose; squash on the downbeat |
| 1–4 | A wave running down the line | Each frog starts 2 frames after the one beside it |
| 5–6 | Point to camera | Uses the `point` pose |
| 7–8 | Full spin, then land | Uses the turnaround; lands into the final pose on frame 1200 |

## 6. Missing assets and limitations (please review)
1. **Character names:** I'm using descriptive fan labels. If these frogs have official names, tell me and I'll use them.
2. **Cigarette:** the new 2D vest reference has a cigarette. I've kept the **toothpick** we approved for the Frog Boss, and given the 3D Visionary one too, since their reference shows a thin stick. No smoking anywhere.
3. **Walk and dance quality:** the motion is built from rig poses, blends and the turnaround, plus squash/stretch and offset timing. It will look like stylised limited animation, not hand-drawn frame-by-frame dancing.
4. **Chef's pan:** in the stills it's only placed near his hand. In production it will be attached to the hand point so it moves with him.
5. **Profile lips:** the forward lip bulb at 3/4 and side angles is the accepted v0.4 look.
6. **Music:** the score will be synthesised in code. It can be punchy and on the beat, but it won't sound like a real orchestra.

## 7. Preview renders (Phase 3)
- `remotion/out/castlineup.png`: every look beside its reference, plus face crops and the royal look with the crown
- `remotion/out/storyboard.png`: 8 key frames with timings and motion notes
- `remotion/out/keyart.png`: the final group-pose frame at full resolution (room, throne, lighting style)
- To re-render: `cd remotion && npm install && npx remotion still CastLineup out/castlineup.png` (and the same for `Storyboard` and `KeyArt`)

**Status:** waiting for your review of the creative direction before full production (Phase 4).
