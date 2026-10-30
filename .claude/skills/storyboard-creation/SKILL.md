---
name: storyboard-creation
description: "Film and video storyboarding with shot vocabulary, continuity rules, and panel layout. Covers shot types, camera angles, movement, 180-degree rule, and annotation format. Use for: video planning, film pre-production, ad storyboards, music video planning, animation. Triggers: storyboard, storyboarding, shot list, film planning, video planning, pre production, shot composition, camera angles, scene planning, visual script, animatic, storyboard panels, video storyboard"
---

# Storyboard Creation

Plan shots and build storyboards for free: draw panels as SVG/React (or Remotion stills rendered with `npx remotion still`), then assemble them into an animatic in Remotion. No paid image-generation APIs.

> Adapted from 101-skills/superpowers (MIT). The original's paid inference.sh/`belt` generation steps were removed.


## Shot Types

| Abbreviation | Name | Framing | When to Use |
|-------------|------|---------|-------------|
| **ECU** | Extreme Close-Up | Eyes only, a detail | Intense emotion, revealing detail |
| **CU** | Close-Up | Face fills frame | Emotion, reaction, dialogue |
| **MCU** | Medium Close-Up | Head and shoulders | Interviews, conversations |
| **MS** | Medium Shot | Waist up | General dialogue, action |
| **MLS** | Medium Long Shot | Knees up | Walking, casual interaction |
| **LS** | Long Shot | Full body | Character in environment |
| **WS** | Wide Shot | Environment dominant | Establishing location, scale |
| **EWS** | Extreme Wide Shot | Vast landscape | Epic scope, isolation, transitions |

## Camera Angles

| Angle | Effect | When to Use |
|-------|--------|-------------|
| **Eye Level** | Neutral, natural | Default for most scenes |
| **High Angle** | Subject looks small, vulnerable | Showing weakness, overview |
| **Low Angle** | Subject looks powerful, dominant | Authority, heroism, threat |
| **Bird's Eye** | God-like overview | Maps, establishing geography |
| **Worm's Eye** | Extreme power, awe | Architecture, towering figures |
| **Dutch Angle** | Unease, disorientation | Tension, madness, action |
| **Over-the-Shoulder (OTS)** | Viewer positioned with character | Conversations, POV |

## Camera Movement

| Movement | Description | Emotion |
|----------|-------------|---------|
| **Pan** | Camera rotates horizontally (on tripod) | Scanning, following, revealing |
| **Tilt** | Camera rotates vertically (on tripod) | Revealing height, power |
| **Dolly** | Camera moves toward/away from subject | Intimacy (in), distance (out) |
| **Truck** | Camera moves laterally | Following alongside, revealing |
| **Crane/Jib** | Camera moves up or down vertically | Grand reveals, transitions |
| **Zoom** | Lens focal length changes (camera stays) | Focus shift, dramatic emphasis |
| **Steadicam/Gimbal** | Smooth handheld tracking | Immersion, following action |
| **Handheld** | Deliberate camera shake | Urgency, documentary feel, chaos |
| **Static** | Camera doesn't move | Stability, observation, tension |

In storyboards, indicate movement with arrows drawn on panels.

## Continuity Rules

### The 180-Degree Rule

Imagine a line (axis) between two characters in conversation. The camera must stay on ONE side of that line.

```
         Character A        Character B
              ●─────────────────●
             /                   \
           /     CAMERA ZONE      \
         /     (stay on this side)  \
       📷          📷          📷
     Camera 1   Camera 2   Camera 3
```

**Crossing the line** confuses the viewer about spatial relationships. Only cross intentionally (with a neutral shot in between or a visible camera move).

### Match on Action

When cutting between two angles of the same action, the action must continue seamlessly:

```
Panel A: Hand reaches for door handle (medium shot)
Panel B: Hand grabs door handle (close-up)
         ↑ Action continues from same point
```

### Eyeline Match

When a character looks at something, the next shot should show what they're looking at, from their approximate point of view.

```
Panel A: Character looks up and to the right
Panel B: The object they see, framed from slightly below-left
```

### Screen Direction

If a character moves left-to-right in one shot, they should continue left-to-right in the next. Reversing direction implies they turned around.

## Panel Layout

### Standard Formats

| Layout | Panels | Use For |
|--------|--------|---------|
| 2x3 (6 panels) | 6 per page | Detailed scenes, dialogue |
| 3x3 (9 panels) | 9 per page | Action sequences, montages |
| 2x2 (4 panels) | 4 per page | Key moments, presentations |
| Single | 1 per page | Hero shots, critical moments |

### Panel Annotation Format

Each panel should include:

```
┌────────────────────────────────────┐
│ SCENE 3 — SHOT 2                   │ ← Scene and shot number
│                                    │
│   [Generated image here]           │ ← Visual
│                                    │
├────────────────────────────────────┤
│ Shot: MS, eye level                │ ← Shot type and angle
│ Movement: Slow dolly in            │ ← Camera movement
│ Duration: 4 sec                    │ ← Estimated duration
│ Action: Sarah opens the letter     │ ← What happens
│ Dialogue: "This changes everything"│ ← Any spoken lines
│ SFX: Paper rustling, clock ticking │ ← Sound effects
│ Music: Tension builds              │ ← Music cue
└────────────────────────────────────┘
```

## Storyboard Workflow

### Step 1: Shot List

Before generating images, write a shot list:

```
SCENE 1 — OFFICE, DAY

1.1  WS  - Establishing shot of office building exterior, morning
1.2  MS  - Sarah walks through office, carrying coffee
1.3  CU  - Sarah's face, notices something on her desk
1.4  ECU - An envelope on the desk, unfamiliar handwriting
1.5  MS  - Sarah picks up envelope, opens it
1.6  CU  - Sarah's eyes widen as she reads
1.7  ECU - Key phrase on the letter (insert text)
```

## Style Consistency Tips

- Use the **same style suffix** across all panels (lens, color grade, lighting)
- Reuse the **same SVG/React character component** (built from the `character-consistency` sheet) in every panel
- Keep the **same aspect ratio** for all panels
- Generate **more panels than you need** and select the best
- If a panel doesn't match the style, fix the shared component or palette tokens

## Common Mistakes

| Mistake | Problem | Fix |
|---------|---------|-----|
| Crossing the 180-degree line | Confuses spatial relationships | Stay on one side or use neutral shot |
| All same shot type | Visually boring, no rhythm | Vary between CU, MS, WS |
| No establishing shot | Viewer doesn't know where they are | Start scenes with WS or EWS |
| Too many shots per scene | Pacing drags | 5-8 shots per scene is typical |
| Inconsistent style between panels | Looks like different projects | Use same style prompt suffix |
| Missing annotations | Panels are ambiguous | Always note shot type, movement, action |

### Step 2: Draw Panels (free)

- One React/SVG component per panel at 1920x1080, using shared palette tokens and character components.
- Render stills: `npx remotion still src/index.ts Panel-1-1 out/panel_1_1.png`.

### Step 3: Assemble Board / Animatic

- Lay panels in a grid composition and render one still for the board, or
- Chain panels with `<Series>` at their planned durations and `npx remotion render` for a timed animatic.

## Related Skills

`remotion-best-practices`, `character-consistency`, `video-prompt-director`, `animation-filmmaker`
