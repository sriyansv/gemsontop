// Builds Fiber_Optic_Splicing_OTDR_Link_Loss.pptx
// Usage:  node diagrams.js && node build_deck.js
// Lab photos: put them in ../photos/ as otdr_settings.jpg and otdr_result.jpg
// (.jpeg / .png also accepted). Without them, dashed photo frames are drawn.
const fs = require("fs");
const path = require("path");
const pptxgen = require("pptxgenjs");
const sharp = require("sharp");

const ROOT = path.join(__dirname, "..");
const A = f => path.join(ROOT, "Presentation_Assets", f);
const OUTFILE = path.join(ROOT, "Fiber_Optic_Splicing_OTDR_Link_Loss.pptx");

// ---------- palette & type ----------
const BG = "F6F5F2", DARK = "1C2433", INK = "2B2B2B", NAVY = "1F3352", ORANGE = "B9561F",
  TEAL = "2E7D7A", GREY = "6B7079", RULE = "D3D0C8", WHITE = "FFFFFF", PALE = "E8ECF2", MUTED = "A3AEBD",
  SOFTORANGE = "F2B48A", PAPER = "FFFFFF";
const HEAD = "Cambria", BODY = "Calibri";
const THEME = {
  name: "Fiber Lab", headFontFace: HEAD, bodyFontFace: BODY,
  colors: { dk1: INK, lt1: WHITE, dk2: NAVY, lt2: BG, accent1: NAVY, accent2: ORANGE, accent3: TEAL, accent4: "7D838C", accent5: "C9C6BF", accent6: "4E6A78", hlink: TEAL, folHlink: "6B5A8E" }
};

// ---------- photos ----------
async function findPhoto(base) {
  for (const ext of [".jpg", ".jpeg", ".png", ".JPG", ".JPEG", ".PNG"]) {
    const f = path.join(ROOT, "photos", base + ext);
    if (fs.existsSync(f)) {
      // apply EXIF orientation only (no other change), save a copy for the deck
      const out = A("lab_" + base + ".jpg");
      await sharp(f).rotate().jpeg({ quality: 92 }).toFile(out);
      const m = await sharp(out).metadata();
      return { file: out, w: m.width, h: m.height };
    }
  }
  return null;
}

(async () => {
  const PHOTOS = { settings: await findPhoto("otdr_settings"), result: await findPhoto("otdr_result") };

  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5
  pres.author = "B.Tech student, OFC Lab";
  pres.title = "Fusion Splicing, OTDR Testing & Link Loss Measurement";
  pres.theme = { headFontFace: HEAD, bodyFontFace: BODY };

  const footer = (dark) => ([
    { text: { text: "Optical Fiber Communication Lab  ·  Fusion Splicing, OTDR & Link Loss", options: { x: 0.6, y: 7.03, w: 8, h: 0.3, fontFace: BODY, fontSize: 9, color: dark ? "7F8A9B" : "9A9DA3", margin: 0 } } },
  ]);
  pres.defineSlideMaster({
    title: "CONTENT", background: { color: BG },
    objects: [...footer(false), { placeholder: { options: { name: "title", type: "title", x: 0.6, y: 0.5, w: 12.1, h: 0.75, fontFace: HEAD, fontSize: 30, bold: true, color: NAVY, valign: "middle", align: "left", margin: 0 }, text: "" } }],
    slideNumber: { x: 12.1, y: 7.0, w: 0.6, h: 0.3, fontFace: BODY, fontSize: 10, color: "9A9DA3", align: "right" },
  });
  pres.defineSlideMaster({
    title: "CONTENT_DARK", background: { color: DARK },
    objects: [...footer(true), { placeholder: { options: { name: "title", type: "title", x: 0.6, y: 0.5, w: 12.1, h: 0.75, fontFace: HEAD, fontSize: 30, bold: true, color: WHITE, valign: "middle", align: "left", margin: 0 }, text: "" } }],
    slideNumber: { x: 12.1, y: 7.0, w: 0.6, h: 0.3, fontFace: BODY, fontSize: 10, color: "7F8A9B", align: "right" },
  });
  pres.defineSlideMaster({ title: "COVER", background: { color: DARK }, objects: [] });

  // ---------- helpers ----------
  const T = (s, str, o) => s.addText(str, Object.assign({ fontFace: BODY, fontSize: 14, color: INK, margin: 0, valign: "top", isTextBox: true }, o));
  const tag = (s, str, dark) => T(s, str, { x: 0.6, y: 0.22, w: 8, h: 0.28, fontSize: 11, bold: true, color: dark ? SOFTORANGE : ORANGE, charSpacing: 2 });
  const newSlide = (section, title, partTag, dark = false) => {
    const s = pres.addSlide({ masterName: dark ? "CONTENT_DARK" : "CONTENT", sectionTitle: section });
    s.addText(title, { placeholder: "title" });
    if (partTag) tag(s, partTag, dark);
    return s;
  };
  const img = (s, f, x, y, w, h, alt) => s.addImage({ path: A(f), x, y, w, h, altText: alt || f });
  // image keeping aspect ratio inside a box (centered)
  const imgFit = (s, f, x, y, w, h, nat, alt) => {
    const r = nat[0] / nat[1]; let iw = w, ih = w / r; if (ih > h) { ih = h; iw = h * r; }
    s.addImage({ path: A(f), x: x + (w - iw) / 2, y: y + (h - ih) / 2, w: iw, h: ih, altText: alt || f });
  };
  const badge = (s, n, x, y, d = 0.42, fill = NAVY, color = WHITE, size = 14) => {
    s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: fill }, line: { color: fill } });
    T(s, String(n), { x, y, w: d, h: d, align: "center", valign: "middle", bold: true, fontSize: size, color });
  };
  const rule = (s, x, y, w, color = RULE) => s.addShape(pres.shapes.LINE, { x, y, w, h: 0, line: { color, width: 1 } });
  const vrule = (s, x, y, h, color = RULE) => s.addShape(pres.shapes.LINE, { x, y, w: 0, h, line: { color, width: 1 } });
  const note = (s, str, x, y, w, h, dark = false, color) => {
    s.addShape(pres.shapes.RECTANGLE, { x, y, w, h, fill: { color: dark ? "26314A" : "ECEAE4" }, line: { color: dark ? "26314A" : "ECEAE4" } });
    T(s, str, { x: x + 0.18, y: y + 0.1, w: w - 0.36, h: h - 0.2, fontSize: 13, color: color || (dark ? PALE : INK), valign: "middle" });
  };
  const photoSlot = (s, key, x, y, w, h, label, dark = false) => {
    const p = PHOTOS[key];
    if (p) {
      const r = p.w / p.h; let iw = w, ih = w / r; if (ih > h) { ih = h; iw = h * r; }
      const px = x + (w - iw) / 2, py = y + (h - ih) / 2;
      s.addShape(pres.shapes.RECTANGLE, { x: px - 0.05, y: py - 0.05, w: iw + 0.1, h: ih + 0.1, fill: { color: WHITE }, line: { color: "BDB9B0", width: 0.75 }, shadow: { type: "outer", color: "000000", opacity: 0.18, blur: 4, offset: 2, angle: 90 } });
      s.addImage({ path: p.file, x: px, y: py, w: iw, h: ih, altText: label });
    } else {
      s.addShape(pres.shapes.RECTANGLE, { x, y, w, h, fill: { color: dark ? "232E42" : "FBFAF8" }, line: { color: dark ? "7F8A9B" : "9A9DA3", width: 1.25, dashType: "dash" } });
      T(s, [
        { text: "LAB PHOTO", options: { bold: true, fontSize: 12, color: dark ? SOFTORANGE : ORANGE, charSpacing: 2, breakLine: true } },
        { text: label, options: { fontSize: 14, color: dark ? PALE : INK, breakLine: true } },
        { text: "Insert the original photograph here (right-click → Change Picture), or place it in photos/ and rebuild.", options: { fontSize: 11, color: dark ? MUTED : GREY } },
      ], { x: x + 0.3, y: y + 0.3, w: w - 0.6, h: h - 0.6, align: "center", valign: "middle" });
    }
  };
  const tableStyle = (rows, opts = {}) => rows.map((r, i) => r.map((c, j) => {
    const cell = typeof c === "object" && c !== null && c.text !== undefined ? c : { text: String(c) };
    cell.options = Object.assign({
      fontFace: BODY, fontSize: opts.fs || 13, color: INK, valign: "middle",
      fill: { color: i === 0 ? NAVY : (i % 2 ? WHITE : "F0EEE9") },
      margin: [0.04, 0.1, 0.04, 0.1], border: [{ type: "solid", color: "D9D6CF", pt: 0.75 }, { type: "none" }, { type: "solid", color: "D9D6CF", pt: 0.75 }, { type: "none" }],
    }, i === 0 ? { bold: true, color: WHITE, fontSize: (opts.fs || 13) - 0 } : {}, (opts.boldCol === j && i > 0) ? { bold: true } : {}, cell.options || {});
    return cell;
  }));

  // =====================================================================
  // 1. TITLE
  pres.addSection({ title: "Fusion Splicing" });
  let s = pres.addSlide({ masterName: "COVER", sectionTitle: "Fusion Splicing" });
  T(s, "B.TECH  ·  LABORATORY DEMONSTRATION", { x: 0.7, y: 0.65, w: 8, h: 0.3, fontSize: 12, bold: true, color: SOFTORANGE, charSpacing: 3 });
  T(s, "Fusion Splicing, OTDR Testing & Link Loss Measurement", { x: 0.7, y: 1.05, w: 10.5, h: 1.75, fontFace: HEAD, fontSize: 40, bold: true, color: WHITE, valign: "top" });
  T(s, "Optical Fiber Communication Laboratory", { x: 0.7, y: 2.85, w: 9, h: 0.45, fontFace: HEAD, fontSize: 20, italic: true, color: MUTED });
  ["Student name", "Roll number", "Department", "College", "Faculty"].forEach((f, i) => {
    T(s, f, { x: 0.7, y: 4.05 + i * 0.5, w: 1.6, h: 0.32, fontSize: 13, color: MUTED });
    T(s, "Your " + f.toLowerCase() + " here", { x: 2.35, y: 4.05 + i * 0.5, w: 3.6, h: 0.32, fontSize: 14, color: PALE, italic: true, objectName: "field_" + i });
    rule(s, 2.35, 4.05 + i * 0.5 + 0.34, 3.6, "4A566B");
  });
  img(s, "title_cable.png", 6.35, 3.85, 6.5, 2.8, "Cut-away illustration of an optical fiber cable");
  T(s, [{ text: "A ", options: { bold: true, color: SOFTORANGE } }, { text: "Fusion splicing     " }, { text: "B ", options: { bold: true, color: SOFTORANGE } }, { text: "OTDR testing     " }, { text: "C ", options: { bold: true, color: SOFTORANGE } }, { text: "Link loss" }],
    { x: 0.7, y: 3.35, w: 9, h: 0.35, fontSize: 14, color: PALE });
  s.addNotes("Three parts: join the fiber (A), test it with an OTDR (B), and work out the link loss (C).");

  // 2. BASICS
  s = newSlide("Fusion Splicing", "Optical Fiber and Fusion Splicing", "PART A  ·  FUSION SPLICING");
  img(s, "fiber_structure.png", 0.45, 1.4, 7.9, 3.37, "Optical fiber structure and total internal reflection");
  T(s, "Light travels in the tiny core. The cladding has a slightly lower refractive index, so light keeps reflecting back into the core (total internal reflection).", { x: 0.6, y: 5.0, w: 7.5, h: 0.9, fontSize: 14 });
  vrule(s, 8.6, 1.45, 5.3);
  const basics = [
    ["What is splicing?", "Joining two fibers end-to-end so light passes from one core into the other."],
    ["Fusion splicing", "An electric arc melts the two glass ends into one piece. The joint is permanent, with very low loss (typically below 0.1 dB)."],
    ["Why alignment matters", "The core is only about 9 µm wide. Dirty, angled or offset ends lose light at the joint."],
  ];
  basics.forEach((b, i) => {
    T(s, b[0], { x: 8.95, y: 1.45 + i * 1.75, w: 3.8, h: 0.35, fontSize: 15, bold: true, color: NAVY });
    T(s, b[1], { x: 8.95, y: 1.82 + i * 1.75, w: 3.8, h: 1.3, fontSize: 13.5 });
  });
  s.addNotes("Single-mode core ≈ 8–9 µm, cladding 125 µm, coating 250 µm.");


  // 6. EQUIPMENT
  s = newSlide("Fusion Splicing", "Equipment Required for Fusion Splicing", "PART A  ·  FUSION SPLICING");
  const tools = [
    ["tool_splicer.png", "Fusion splicer", "Aligns the two fibers with cameras and motors, then fuses them with an electric arc."],
    ["tool_stripper.png", "Fiber stripper", "Removes the jacket, buffer and 250 µm coating without scratching the glass."],
    ["tool_cleaver.png", "Precision cleaver", "Cuts the bare fiber so the end is flat and at 90° to its length."],
    ["tool_cleaning.png", "Cleaning kit", "99% isopropyl alcohol and lint-free wipes remove dust and oil from the glass."],
    ["tool_sleeve.png", "Heat-shrink sleeve", "A tube with a steel rod that shrinks over the joint to protect it."],
    ["tool_cable.png", "Optical fiber cable", "The fiber to be joined; check its type before you start."],
  ];
  tools.forEach((t, i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const x = 0.6 + col * 4.15, y = 1.35 + row * 2.8;
    img(s, t[0], x, y, 2.95, 1.84, t[1] + " illustration");
    T(s, t[1], { x, y: y + 1.9, w: 3.85, h: 0.32, fontSize: 15, bold: true, color: NAVY });
    T(s, t[2], { x, y: y + 2.22, w: 3.85, h: 0.5, fontSize: 12.5 });
  });
  T(s, "ILLUSTRATIONS — real models differ", { x: 6.2, y: 0.22, w: 6.5, h: 0.28, fontSize: 11, bold: true, color: ORANGE, align: "right", charSpacing: 1 });
  s.addNotes("Also keep a fiber scrap bin, safety glasses and a splice tray ready before starting.");

  // PROCEDURE (2 slides, 7 steps each)
  const steps = {
    1: ["Prepare the cable", "Check the fiber type and mark how much jacket to remove."],
    2: ["Remove the jacket", "Strip the outer jacket; cut the aramid yarn with scissors."],
    3: ["Slide on the sleeve", "Put the heat-shrink sleeve on one fiber now — it can't be added later."],
    4: ["Strip the coating", "Remove the 250 µm coating in one smooth pull (about 3–4 cm)."],
    5: ["Clean the fiber", "Wipe the bare glass once with 99% IPA on a lint-free wipe."],
    6: ["Cleave the ends", "Cut a flat, square end (within about 1°). Bin the offcut."],
    7: ["Load the splicer", "Lay both fibers in the V-grooves, tips near the electrodes. Close the clamps."],
    8: ["Align the cores", "Cameras view the fibers in X and Y; the splicer lines up the cores."],
    9: ["Fuse with the arc", "A short cleaning arc, then the main arc melts the ends into one."],
    10: ["Inspect the splice", "Check the joint on screen. The loss shown is only an estimate."],
    11: ["Move the sleeve", "Slide the sleeve so the joint sits in its centre."],
    12: ["Heat-shrink", "Shrink the sleeve in the heater. Let it cool before handling."],
    13: ["Test the joint", "Measure the real loss with an OTDR or a power meter."],
  };
  const stepImg = { 1: "step01_prepare", 2: "step02_jacket", 3: "step03_sleeve", 4: "step04_strip", 5: "step05_clean", 6: "step06_cleave", 7: "step07_place", 8: "step08_align", 9: "step09_arc", 10: "step10_inspect", 11: "step11_sleeve_move", 12: "step12_heat", 13: "step14_test" };
  const darkStep = n => n >= 8 && n <= 10;
  const procSlide = (title, tagTxt, nums, noteTxt, noteCols = 1) => {
    const sl = newSlide("Fusion Splicing", title, tagTxt);
    nums.forEach((n, i) => {
      const col = i % 4, row = Math.floor(i / 4);
      const x = 0.6 + col * 3.1, y = 1.35 + row * 2.75, w = 2.9;
      imgFit(sl, stepImg[n] + ".png", x, y, w, 1.45, darkStep(n) ? [800, 410] : [800, 362], steps[n][0]);
      badge(sl, n, x, y + 1.55, 0.38, NAVY, WHITE, 12);
      T(sl, steps[n][0], { x: x + 0.48, y: y + 1.55, w: 2.4, h: 0.38, fontSize: 14.5, bold: true, color: NAVY, valign: "middle" });
      T(sl, steps[n][1], { x, y: y + 2.0, w: 2.85, h: 0.65, fontSize: 12.5 });
    });
    note(sl, noteTxt, 0.6 + (4 - noteCols) * 3.1, 1.35 + 2.75 + 0.1, 2.9 + (noteCols - 1) * 3.1, 2.4, false);
    return sl;
  };
  s = procSlide("Fusion Splicing Procedure (1/2)", "PART A  ·  FUSION SPLICING  ·  STEPS 1–7", [1, 2, 3, 4, 5, 6, 7],
    "Safety: bare-fiber offcuts are tiny glass needles. Pick them up with tape and put them in the scrap bin.");
  s.addNotes("Step 3 is the most commonly forgotten. The cleave quality decides the splice quality.");
  s = procSlide("Fusion Splicing Procedure (2/2)", "PART A  ·  FUSION SPLICING  ·  STEPS 8–13", [8, 9, 10, 11, 12, 13],
    "The splicer's loss value is an estimate from its camera image. Record the measured loss from step 13. (Screen views are illustrations; we did not record a splice-loss value.)", 2);
  s.addNotes("Screens shown are drawings of a typical splicer display, not screenshots from our machine.");

  // =====================================================================
  // OTDR — WHAT & HOW (dark)
  pres.addSection({ title: "OTDR Testing" });
  s = newSlide("OTDR Testing", "What Is an OTDR and How It Works", "PART B  ·  OTDR TESTING", true);
  T(s, [{ text: "OTDR", options: { bold: true, color: SOFTORANGE } }, { text: " = Optical Time Domain Reflectometer. It finds the " }, { text: "length, losses and faults", options: { bold: true } }, { text: " of a fiber from just one end — it sends light pulses and times the light that comes back." }],
    { x: 0.6, y: 1.3, w: 12.1, h: 0.85, fontFace: HEAD, fontSize: 19, color: WHITE });
  img(s, "otdr_principle.png", 1.0, 2.3, 11.3, 4.52, "OTDR working principle diagram");
  s.addNotes("Rayleigh backscatter comes from every point and shows gradual loss. Fresnel reflection is a strong echo at a glass–air surface (connector, break, open end).");

  // CONNECT & RUN
  s = newSlide("OTDR Testing", "Connecting and Running the OTDR Test", "PART B  ·  OTDR TESTING");
  img(s, "otdr_connection.png", 1.6, 1.25, 10.1, 2.65, "OTDR to launch cable to fiber under test to receive cable");
  const col = (x, w, head, items, color) => {
    T(s, head, { x, y: 4.05, w, h: 0.35, fontSize: 15, bold: true, color: color || NAVY });
    T(s, items.map((t, i) => ({ text: t, options: { bullet: { type: "number" }, breakLine: i < items.length - 1 } })), { x, y: 4.45, w, h: 2.4, fontSize: 12.5, paraSpaceAfter: 3 });
  };
  col(0.6, 3.9, "Connect", ["Switch on the OTDR.", "Inspect and clean all connectors.", "Connect launch cable (if available), then the fiber under test.", "Check connections are firm.", "Make sure no live signal is on the fiber."]);
  col(4.75, 3.9, "Run the test", ["Open the Test Setting menu.", "Set wavelength, range, pulse width, time, resolution, power mode.", "Return to the main screen.", "Press AVG to start the averaged test.", "Wait, then read the trace and event table."], ORANGE);
  T(s, "Why launch / receive cables?", { x: 8.9, y: 4.05, w: 3.8, h: 0.35, fontSize: 15, bold: true, color: NAVY });
  T(s, "The strong reflection at the OTDR port hides the first few metres (dead zone). A launch cable moves the first connector out of it; a receive cable lets the last connector be measured.", { x: 8.9, y: 4.45, w: 3.8, h: 1.6, fontSize: 12.5 });
  T(s, "⚠  Never look into the OTDR port or a fiber end — the laser light is invisible.", { x: 8.9, y: 6.15, w: 3.8, h: 0.6, fontSize: 12, bold: true, color: ORANGE });
  s.addNotes("Averaging (AVG) repeats the pulse many times during the test time and averages the results, giving a clean trace.");

  // 17. TEST SETTINGS
  s = newSlide("OTDR Testing", "OTDR Test Settings We Used", "PART B  ·  OTDR TESTING");
  const settings = [
    ["Parameter", "Our value", "What it means"],
    ["Test wavelength selection", "1310/1550 nm", "Wavelength(s) of laser light used for the test"],
    ["Test range", "10 km", "Longest distance shown; set longer than the fiber"],
    ["Pulse width", "50 ns", "Pulse length: short = fine detail, long = reaches farther"],
    ["Test mode", "Manual", "We chose the settings ourselves (not Auto)"],
    ["Test time", "50 seconds", "Averaging time: longer gives a smoother trace"],
    ["Resolution", "Standard", "How finely the trace points are spaced"],
    ["Launch cable setting", "None", "No launch cable length entered or removed"],
    ["End cable setting", "None", "No receive (end) cable entered"],
    ["Power mode", "Standard", "Instrument power option, left at default"],
  ];
  s.addTable(tableStyle(settings, { fs: 12.5, boldCol: 1 }), { x: 0.6, y: 1.4, w: 7.5, colW: [2.25, 1.45, 3.8], rowH: 0.47 });
  photoSlot(s, "settings", 8.45, 1.4, 4.25, 4.7, "Photo 1 — test-settings screen");
  T(s, "Values copied exactly from our settings screen (Photo 1).", { x: 8.45, y: 6.2, w: 4.25, h: 0.5, fontSize: 11, color: GREY, italic: true });
  T(s, "Short pulse + long averaging = a clear, detailed trace for a short (few-km) fiber like ours.", { x: 0.6, y: 6.3, w: 7.5, h: 0.4, fontSize: 13, italic: true, color: TEAL });
  s.addNotes("The settings allowed 1310 and 1550 nm. The result screen we photographed shows the 1310 nm measurement.");

  // 19. UNDERSTANDING THE GRAPH
  s = newSlide("OTDR Testing", "Understanding the OTDR Graph", "PART B  ·  OTDR TESTING");
  photoSlot(s, "result", 0.6, 1.4, 6.6, 5.1, "Photo 2 — our OTDR trace (1310 nm)");
  const read = [
    ["X-axis", "Distance along the fiber, in kilometres."],
    ["Y-axis", "Level of the returned signal, in dB."],
    ["Sloping straight line", "Normal fiber attenuation — the light weakens a little every km."],
    ["Sudden downward step", "A loss event: possibly a splice, bend or other loss point."],
    ["Upward spike", "A reflection: usually a connector or the fiber end."],
    ["Sharp drop to noise", "End of the measured fiber link."],
  ];
  read.forEach((r, i) => {
    const y = 1.4 + i * 0.8;
    s.addShape(pres.shapes.OVAL, { x: 7.6, y: y + 0.08, w: 0.2, h: 0.2, fill: { color: i < 2 ? NAVY : i === 2 ? TEAL : ORANGE }, line: { color: WHITE } });
    T(s, r[0], { x: 7.95, y, w: 4.8, h: 0.33, fontSize: 14.5, bold: true, color: NAVY });
    T(s, r[1], { x: 7.95, y: y + 0.33, w: 4.8, h: 0.42, fontSize: 13 });
  });
  T(s, "We only mark events that the OTDR actually shows on our screen and event table. We do not guess faults that are not on the trace.", { x: 7.6, y: 6.25, w: 5.1, h: 0.6, fontSize: 11.5, italic: true, color: GREY });
  s.addNotes("Point to each part of the trace on the photo while explaining.");

  // 20. OUR OBSERVATIONS
  s = newSlide("OTDR Testing", "Our OTDR Observations", "PART B  ·  OTDR TESTING");
  const obs = [
    ["Parameter", "Observed value"],
    ["Test wavelength", "1310 nm"],
    ["Pulse width", "50 ns"],
    ["Fiber distance", "4.822 km"],
    ["Total loss", "1.550 dB"],
    ["Displayed attenuation slope", "0.317 dB/km"],
    ["Optical Return Loss (ORL)", "29.37 dB"],
    ["Instrument result", { text: "PASS", options: { bold: true, color: TEAL } }],
  ];
  s.addTable(tableStyle(obs, { fs: 15, boldCol: 1 }), { x: 0.6, y: 1.4, w: 6.0, colW: [3.5, 2.5], rowH: 0.5 });
  T(s, "All values read directly from the result screen (Photo 2). Nothing here is calculated.", { x: 0.6, y: 5.5, w: 6.0, h: 0.35, fontSize: 11, italic: true, color: GREY });
  note(s, "What PASS means: the measured results were within the thresholds set in the instrument. It is not proof that the link meets every possible performance requirement.", 0.6, 5.95, 6.0, 0.85, false);
  photoSlot(s, "result", 7.0, 1.4, 5.7, 5.4, "Photo 2 — result screen");
  s.addNotes("ORL is the ratio of light sent in to light reflected back, in dB. A higher ORL means less reflection.");

  // =====================================================================
  // LINK LOSS — MEANING, FORMULAS, METHOD
  pres.addSection({ title: "Link Loss" });
  s = newSlide("Link Loss", "Link Loss: Meaning and Formulas", "PART C  ·  LINK LOSS");
  T(s, "Link loss is the total drop in optical power as light travels through a fiber link (fiber + splices + connectors). Fiber attenuation is the loss per km.", { x: 0.6, y: 1.3, w: 7.3, h: 0.85, fontSize: 14.5, italic: true, color: INK });
  const eq = (y, runs, used) => {
    s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y, w: 7.3, h: 1.15, fill: { color: WHITE }, line: { color: "D9D6CF", width: 1 } });
    T(s, runs, { x: 0.8, y: y + 0.08, w: 7.0, h: 0.65, fontFace: HEAD, fontSize: 20, color: NAVY, valign: "middle" });
    T(s, used, { x: 0.8, y: y + 0.75, w: 7.0, h: 0.32, fontSize: 11.5, color: GREY, italic: true });
  };
  eq(2.3, [{ text: "Link Loss (dB) = P" }, { text: "in", options: { subscript: true } }, { text: " (dBm) − P" }, { text: "out", options: { subscript: true } }, { text: " (dBm)" }], "End-to-end insertion loss — measured with a light source and an optical power meter.");
  eq(3.6, [{ text: "Attenuation (dB/km) = " }, { text: "Total Loss (dB) / Length (km)", options: { bold: true } }], "Average loss for every kilometre of the link.");
  note(s, "An OTDR does not use the first formula. It estimates loss from backscattered light and gives the section loss (dB) in its event table or between the A–B cursors.", 0.6, 5.0, 7.3, 1.0, false);
  img(s, "trace_cursors.png", 8.25, 1.3, 4.5, 2.34, "Example trace with A and B cursors");
  T(s, "With the OTDR", { x: 8.25, y: 3.85, w: 4.5, h: 0.35, fontSize: 15, bold: true, color: NAVY });
  const ol = ["Run the averaged (AVG) test.", "Put cursor A at the start and B at the end of the link.", "Read the A–B loss in dB and the length in km.", "Divide loss by length for dB/km."];
  T(s, ol.map((t, i) => ({ text: t, options: { bullet: { type: "number" }, breakLine: i < ol.length - 1 } })), { x: 8.25, y: 4.25, w: 4.5, h: 1.8, fontSize: 13, paraSpaceAfter: 4 });
  T(s, "Trace above is an example, not our measurement.", { x: 8.25, y: 6.15, w: 4.5, h: 0.3, fontSize: 11, italic: true, color: GREY });
  s.addNotes("dBm is power relative to 1 mW; dBm − dBm gives a loss in dB.");

  // 25. CALCULATION
  s = newSlide("Link Loss", "Calculation Using Our Readings", "PART C  ·  LINK LOSS");
  T(s, "GIVEN  (measured)", { x: 0.6, y: 1.4, w: 3.5, h: 0.3, fontSize: 11, bold: true, color: TEAL, charSpacing: 2 });
  T(s, [{ text: "Fiber length, L = ", options: {} }, { text: "4.822 km", options: { bold: true, breakLine: true } }, { text: "Total loss = " }, { text: "1.550 dB", options: { bold: true } }], { x: 0.6, y: 1.75, w: 3.6, h: 0.9, fontSize: 16, paraSpaceAfter: 6 });
  T(s, "CALCULATION", { x: 0.6, y: 2.95, w: 3.5, h: 0.3, fontSize: 11, bold: true, color: ORANGE, charSpacing: 2 });
  T(s, [
    { text: "Average attenuation = Total loss / L", options: { breakLine: true } },
    { text: "= 1.550 dB / 4.822 km", options: { breakLine: true } },
    { text: "≈ 0.3214 dB/km", options: { bold: true, color: ORANGE } },
  ], { x: 0.6, y: 3.3, w: 4.2, h: 1.6, fontSize: 18, fontFace: HEAD, paraSpaceAfter: 8 });
  // comparison callouts
  vrule(s, 5.05, 1.45, 5.2);
  T(s, "0.3214", { x: 5.45, y: 1.35, w: 3.2, h: 0.9, fontFace: HEAD, fontSize: 48, bold: true, color: ORANGE });
  T(s, "dB/km  ·  calculated by us\n(total loss ÷ length)", { x: 5.45, y: 2.25, w: 3.2, h: 0.65, fontSize: 13, color: GREY });
  T(s, "0.317", { x: 9.2, y: 1.35, w: 3.2, h: 0.9, fontFace: HEAD, fontSize: 48, bold: true, color: TEAL });
  T(s, "dB/km  ·  attenuation slope\nshown by the OTDR (measured)", { x: 9.2, y: 2.25, w: 3.5, h: 0.65, fontSize: 13, color: GREY });
  T(s, "Why are they slightly different?", { x: 5.45, y: 3.25, w: 7.2, h: 0.4, fontSize: 16, bold: true, color: NAVY });
  T(s, [
    { text: "The OTDR's slope is a straight-line fit over a smooth part of the trace. It leaves out events such as splices and connectors.", options: { bullet: true, breakLine: true } },
    { text: "Total loss covers the whole section, so any event loss inside it is included.", options: { bullet: true, breakLine: true } },
    { text: "So 0.317 is NOT simply 1.550 ÷ 4.822 — the two numbers come from different methods.", options: { bullet: true } },
  ], { x: 5.45, y: 3.7, w: 7.25, h: 1.9, fontSize: 14, paraSpaceAfter: 6 });
  note(s, "Difference = 0.3214 − 0.317 ≈ 0.004 dB/km (about 1.4%). Check: 0.317 dB/km × 4.822 km ≈ 1.529 dB, which is about 0.02 dB less than the measured 1.550 dB.", 0.6, 5.85, 12.1, 0.8, false);
  s.addNotes("Both values are close to what we expect for single-mode fiber at 1310 nm, which is roughly 0.3 to 0.4 dB/km.");

  // =====================================================================
  // RESULTS & CONCLUSION
  pres.addSection({ title: "Results" });
  s = newSlide("Results", "Results and Conclusion", "RESULTS");
  [["4.822", "km", "fiber length"], ["1.550", "dB", "total loss"], ["PASS", "", "instrument result"]].forEach((st, i) => {
    const y = 1.35 + i * 1.55;
    T(s, [{ text: st[0], options: { fontSize: 44, bold: true, color: i === 2 ? TEAL : NAVY } }, { text: st[1] ? " " + st[1] : "", options: { fontSize: 20, color: GREY } }], { x: 0.6, y, w: 4.0, h: 0.85, fontFace: HEAD, valign: "bottom" });
    T(s, st[2] + "  ·  at 1310 nm", { x: 0.6, y: y + 0.88, w: 4.0, h: 0.3, fontSize: 13, color: GREY });
  });
  vrule(s, 4.75, 1.4, 4.85);
  T(s, "Discussion", { x: 5.1, y: 1.35, w: 7.6, h: 0.35, fontSize: 15, bold: true, color: NAVY });
  T(s, [
    { text: "Average attenuation ≈ 0.321 dB/km (calculated); OTDR slope 0.317 dB/km.", options: { bullet: true, breakLine: true } },
    { text: "PASS only means the results were inside the instrument's set thresholds.", options: { bullet: true, breakLine: true } },
    { text: "Launch/end cables were 'None', so the first and last connector losses are not accurate.", options: { bullet: true } },
  ], { x: 5.1, y: 1.75, w: 7.6, h: 1.55, fontSize: 13.5, paraSpaceAfter: 4 });
  T(s, "Conclusion", { x: 5.1, y: 3.45, w: 7.6, h: 0.35, fontSize: 15, bold: true, color: NAVY });
  T(s, [
    { text: "Fusion splicing joins fibers permanently using an electric arc; clean, square cleaves give low loss.", options: { bullet: { type: "number" }, breakLine: true } },
    { text: "An OTDR measures length and loss and locates faults from one end of the fiber.", options: { bullet: { type: "number" }, breakLine: true } },
    { text: "Link loss is read from the OTDR trace; our link: 1.550 dB over 4.822 km at 1310 nm.", options: { bullet: { type: "number" } } },
  ], { x: 5.1, y: 3.85, w: 7.6, h: 1.55, fontSize: 13.5, paraSpaceAfter: 4 });
  rule(s, 0.6, 6.35, 12.1);
  T(s, "References: G. Keiser, Optical Fiber Communications (McGraw-Hill) · J. M. Senior, Optical Fiber Communications (Pearson) · FOA Online Reference Guide, thefoa.org/tech/ref · ITU-T G.652 · TIA-568.3-D · lab OTDR and splicer manuals.", { x: 0.6, y: 6.42, w: 12.1, h: 0.5, fontSize: 10.5, color: GREY });
  s.addNotes("All values are from the OTDR result screen except 0.321 dB/km, which we calculated (1.550 ÷ 4.822).");

  // 30. THANK YOU
  s = pres.addSlide({ masterName: "COVER", sectionTitle: "Results" });
  T(s, "Thank You", { x: 0.7, y: 2.3, w: 11.9, h: 1.3, fontFace: HEAD, fontSize: 60, bold: true, color: WHITE });
  T(s, "Questions?", { x: 0.7, y: 3.6, w: 11.9, h: 0.6, fontFace: HEAD, fontSize: 26, italic: true, color: SOFTORANGE });
  T(s, "Fusion Splicing, OTDR Testing & Link Loss Measurement  ·  Optical Fiber Communication Laboratory", { x: 0.7, y: 6.6, w: 11.9, h: 0.35, fontSize: 12, color: MUTED });
  s.addShape(pres.shapes.LINE, { x: 0.7, y: 4.55, w: 11.9, h: 0, line: { color: "7FA5AB", width: 3 } });
  s.addShape(pres.shapes.LINE, { x: 0.7, y: 4.55, w: 5.2, h: 0, line: { color: SOFTORANGE, width: 3 } });

  await pres.writeFile({ fileName: OUTFILE });
  try {
    const glob = require("path");
    const skill = process.env.PPTX_SKILL;
    if (skill) { const { applyTheme } = require(path.join(skill, "scripts/apply_theme.js")); await applyTheme(OUTFILE, THEME); }
  } catch (e) { console.warn("theme not applied:", e.message); }
  console.log("written", OUTFILE, "photos:", !!PHOTOS.settings, !!PHOTOS.result);
})();
