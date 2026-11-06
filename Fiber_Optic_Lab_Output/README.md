# Fusion Splicing, OTDR Testing & Link Loss — Lab Presentation

| File | What it is |
|---|---|
| `Fiber_Optic_Splicing_OTDR_Link_Loss.pptx` | 15-slide editable presentation (16:9): fusion splicing, OTDR testing, link loss |
| `Presentation_Preview.pdf` | PDF render of the slides |
| `Fiber_Optic_Lab_Report.pdf` | Lab report: Experiments 1–3 (aim, apparatus, theory, procedure, observations, calculation, result, precautions) |
| `Presentation_Assets/` | Original diagrams drawn for this lab (SVG + PNG) |
| `photos/` | Drop the two original OTDR photos here (see `photos/README.txt`) |
| `source/` | Build scripts: `diagrams.js`, `build_deck.js`, `build_report.py`, `render.sh` |

## Lab photos
The two OTDR photographs were not available when this was built, so slides 9, 10 and 11
(and the report) show dashed "LAB PHOTO" frames. Either
- in PowerPoint: delete the dashed frame and insert the photo in its place, or
- save the photos as `photos/otdr_settings.jpg` and `photos/otdr_result.jpg` and run `source/render.sh`
  (needs `pptxgenjs` + `sharp` for Node, `reportlab` + `Pillow` for Python, LibreOffice for the preview).

## Data used (from the lab photos)
1310 nm · 50 ns · 10 km range · 50 s · 4.822 km · 1.550 dB total loss · 0.317 dB/km slope · ORL 29.37 dB · PASS.
Calculated: 1.550 / 4.822 ≈ 0.3214 dB/km. No splice-loss value is reported because none was measured.
