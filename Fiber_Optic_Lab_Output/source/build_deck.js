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
  pres.title = "Fiber Optic Splicing, OTDR Testing & Link Loss Measurement";
  pres.theme = { headFontFace: HEAD, bodyFontFace: BODY };

  const footer = (dark) => ([
    { text: { text: "Optical Fiber Communication Lab  ·  Splicing, OTDR & Link Loss", options: { x: 0.6, y: 7.03, w: 8, h: 0.3, fontFace: BODY, fontSize: 9, color: dark ? "7F8A9B" : "9A9DA3", margin: 0 } } },
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
  pres.addSection({ title: "Introduction" });
  let s = pres.addSlide({ masterName: "COVER", sectionTitle: "Introduction" });
  T(s, "B.TECH  ·  LABORATORY DEMONSTRATION", { x: 0.7, y: 0.65, w: 8, h: 0.3, fontSize: 12, bold: true, color: SOFTORANGE, charSpacing: 3 });
  T(s, "Fiber Optic Splicing, OTDR Testing & Link Loss Measurement", { x: 0.7, y: 1.05, w: 10.5, h: 1.75, fontFace: HEAD, fontSize: 40, bold: true, color: WHITE, valign: "top" });
  T(s, "Optical Fiber Communication Laboratory", { x: 0.7, y: 2.85, w: 9, h: 0.45, fontFace: HEAD, fontSize: 20, italic: true, color: MUTED });
  const fields = [["Student name", ""], ["Roll number", ""], ["Department", ""], ["College", ""], ["Faculty", ""]];
  fields.forEach((f, i) => {
    T(s, f[0], { x: 0.7, y: 4.05 + i * 0.5, w: 1.6, h: 0.32, fontSize: 13, color: MUTED });
    T(s, "Your " + f[0].toLowerCase() + " here", { x: 2.35, y: 4.05 + i * 0.5, w: 3.6, h: 0.32, fontSize: 14, color: PALE, italic: true, objectName: "field_" + i });
    rule(s, 2.35, 4.05 + i * 0.5 + 0.34, 3.6, "4A566B");
  });
  img(s, "title_cable.png", 6.35, 3.85, 6.5, 2.8, "Cut-away illustration of an optical fiber cable");
  s.addNotes("Introduce the topic and the three experiments. Fill in your own name, roll number and faculty name.");

  // 2. WHAT WE WILL LEARN
  s = newSlide("Introduction", "What We Will Learn", "OVERVIEW");
  const exps = [
    ["A", "Fiber optic splicing", "Join two optical fibers so light can pass from one to the other with very little loss."],
    ["B", "Testing fiber with an OTDR", "Send light pulses into the fiber and read the returned light to find its length, losses and faults."],
    ["C", "Link loss using the OTDR", "Read the total loss of the fiber link in dB and work out the average loss per kilometre."],
  ];
  exps.forEach((e, i) => {
    const x = 0.6 + i * 4.2;
    T(s, e[0], { x, y: 1.55, w: 1.0, h: 1.0, fontFace: HEAD, fontSize: 60, bold: true, color: ORANGE });
    T(s, "Experiment " + e[0], { x, y: 2.65, w: 3.6, h: 0.3, fontSize: 12, bold: true, color: GREY, charSpacing: 1 });
    T(s, e[1], { x, y: 2.95, w: 3.6, h: 0.45, fontFace: HEAD, fontSize: 20, bold: true, color: NAVY });
    T(s, e[2], { x, y: 3.45, w: 3.5, h: 1.1, fontSize: 15 });
    if (i < 2) s.addShape(pres.shapes.LINE, { x: x + 2.0, y: 2.05, w: 1.9, h: 0, line: { color: "BDB9B0", width: 1.5, endArrowType: "triangle" } });
  });
  rule(s, 0.6, 4.95, 12.1);
  T(s, "How the experiments connect", { x: 0.6, y: 5.15, w: 4, h: 0.35, fontSize: 15, bold: true, color: NAVY });
  T(s, "A splice is only useful if we can prove it is good. So after joining fibers (A), we use the OTDR to look along the fiber and see where the light is lost (B). Then we use the same trace to read the total loss of the link and compare it with the fiber's length (C).",
    { x: 0.6, y: 5.55, w: 11.6, h: 1.0, fontSize: 15 });
  s.addNotes("The three parts follow the real order of work in the field: install (splice), test (OTDR), and report the numbers (link loss).");

  // 3. UNDERSTANDING OPTICAL FIBER
  pres.addSection({ title: "Part A — Splicing" });
  s = newSlide("Part A — Splicing", "Understanding Optical Fiber", "PART A  ·  FIBER SPLICING");
  img(s, "fiber_structure.png", 0.45, 1.45, 8.9, 3.8, "Optical fiber cross-section and side view showing total internal reflection");
  T(s, "Why use fiber for communication?", { x: 9.7, y: 1.5, w: 3.1, h: 0.7, fontFace: HEAD, fontSize: 17, bold: true, color: NAVY });
  T(s, [
    { text: "Very low loss, so signals go many km without a repeater", options: { bullet: true, breakLine: true } },
    { text: "Huge bandwidth — lots of data at once", options: { bullet: true, breakLine: true } },
    { text: "Not affected by electrical noise or lightning", options: { bullet: true, breakLine: true } },
    { text: "Thin, light and hard to tap", options: { bullet: true } },
  ], { x: 9.7, y: 2.3, w: 3.05, h: 3.0, fontSize: 14, paraSpaceAfter: 8 });
  rule(s, 0.6, 5.45, 12.1);
  T(s, [{ text: "What is it? ", options: { bold: true, color: NAVY } }, { text: "A very thin strand of pure glass (about the thickness of a hair) that carries information as light." }], { x: 0.6, y: 5.65, w: 5.8, h: 0.9, fontSize: 14 });
  T(s, [{ text: "How does light stay inside? ", options: { bold: true, color: NAVY } }, { text: "The core's glass bends light a little more than the cladding's. Light that hits the edge at a shallow angle reflects back in, again and again." }], { x: 6.8, y: 5.65, w: 5.9, h: 0.9, fontSize: 14 });
  s.addNotes("Core sizes: single-mode about 8–9 µm, multimode 50 or 62.5 µm. Cladding is 125 µm for both. Coating is usually 250 µm.");

  // 4. WHAT IS SPLICING
  s = newSlide("Part A — Splicing", "What Is Fiber Optic Splicing?", "PART A  ·  FIBER SPLICING");
  img(s, "splice_before_after.png", 0.45, 1.5, 7.6, 3.04, "Before and after splicing diagram");
  T(s, [{ text: "The core is only about 9 µm wide", options: { bold: true, color: ORANGE, breakLine: true } }, { text: "— roughly a tenth of a human hair. If the two cores are off by even a few micrometres, part of the light misses the second core and is lost.", options: { color: INK } }],
    { x: 0.6, y: 4.95, w: 7.2, h: 1.3, fontSize: 16, fontFace: HEAD, italic: true });
  const qa = [
    ["Meaning", "Splicing is joining two optical fibers end-to-end so light passes from one into the other."],
    ["Why join fibers?", "Cables come in fixed lengths, cables get cut or damaged, and pigtails must be joined to the main cable."],
    ["Where is it used?", "Long-distance links, FTTH (fiber to the home), joint closures, patch panels and repair work."],
    ["Why alignment matters", "Light only travels in the tiny core. Good alignment and clean, flat ends give low loss."],
  ];
  qa.forEach((q, i) => {
    const y = 1.5 + i * 1.3;
    T(s, q[0], { x: 8.55, y, w: 4.2, h: 0.35, fontSize: 15, bold: true, color: NAVY });
    T(s, q[1], { x: 8.55, y: y + 0.36, w: 4.2, h: 0.85, fontSize: 14 });
  });
  vrule(s, 8.3, 1.55, 5.0);
  s.addNotes("Explain that a splice is permanent, unlike a connector which can be unplugged.");

  // 5. TYPES OF SPLICING
  s = newSlide("Part A — Splicing", "Types of Splicing", "PART A  ·  FIBER SPLICING");
  img(s, "splice_types.png", 1.2, 1.35, 10.9, 2.57, "Fusion splice and mechanical splice sketches");
  const cmp = [
    ["", "Fusion splicing", "Mechanical splicing"],
    ["How it joins", "Glass ends are melted together by an electric arc", "Fiber ends are held face-to-face in a small housing with gel"],
    ["Typical loss", "Very low — often below 0.1 dB", "Higher — often a few tenths of a dB"],
    ["Back-reflection", "Very low", "Low, but higher than fusion (depends on gel)"],
    ["Tools & cost", "Fusion splicer — costly machine", "Simple tools — low cost"],
    ["Best for", "Backbone and long links, many splices", "Quick repairs and a few splices"],
  ];
  s.addTable(tableStyle(cmp, { fs: 13, boldCol: 0 }), { x: 0.6, y: 4.05, w: 12.1, colW: [2.3, 4.9, 4.9], rowH: 0.38 });
  T(s, "Loss values are typical figures from fiber-optic training guides (e.g. FOA). Real loss depends on the fibers, the tools and the person splicing.", { x: 0.6, y: 6.45, w: 12.1, h: 0.35, fontSize: 11, color: GREY, italic: true });
  s.addNotes("Both methods need the same preparation: strip, clean, cleave. The difference is how the ends are held together.");

  // 6. EQUIPMENT
  s = newSlide("Part A — Splicing", "Equipment Required for Fusion Splicing", "PART A  ·  FIBER SPLICING");
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

  // 7–10. PROCEDURE
  const steps = {
    1: ["Prepare the cable", "Check the fiber type (single-mode or multimode) printed on the cable. Cut a clean, straight end and mark how much jacket to remove. Work on a clean, flat table."],
    2: ["Remove the outer jacket", "Score the jacket with a jacket stripper and slide it off. Cut the aramid yarn with sharp scissors — never with the cleaver."],
    3: ["Slide on the protection sleeve", "Put the heat-shrink sleeve onto ONE fiber now and push it well away from the end. If you forget, you will have to break the splice and start again."],
    4: ["Strip the fiber coating", "Use the smallest notch of the stripper. Hold it square and pull in one smooth stroke to expose the 125 µm glass (about 3–4 cm, as the cleaver guide says)."],
    5: ["Clean the bare fiber", "Wipe the glass once, towards the tip, with a lint-free wipe and 99% isopropyl alcohol. Do not touch it again after cleaning."],
    6: ["Cleave both fiber ends", "Set the length on the cleaver scale, place the fiber and close the lid. A good cleave is flat and square (usually within 1°). Drop the offcut into the scrap bin at once."],
    7: ["Place fibers in the splicer", "Lay each fiber in its V-groove with the tip just short of the electrodes. Close the clamps and the wind cover gently. The clean tip must not touch anything."],
    8: ["Align both fiber cores", "The splicer's cameras look at the fibers from two directions (X and Y). It checks the end faces and the gap, then moves the fibers until the cores line up."],
    9: ["Fuse with the electric arc", "A short arc first cleans the ends. The fibers are pushed together and the main arc melts the glass into one piece. This takes only a few seconds."],
    10: ["Inspect and check estimated loss", "Look at the joint on screen for bubbles, thin or fat spots, or offset cores. The loss shown is the splicer's estimate from the picture — not a real measurement."],
    11: ["Move the sleeve over the joint", "Open the clamps, lift the fiber with gentle tension, and slide the sleeve so the joint sits in the middle."],
    12: ["Heat-shrink the sleeve", "Put the sleeve in the heater and run the heat cycle. It shrinks and grips the joint. Let it cool before handling."],
    13: ["Arrange in the splice tray", "Press the sleeve into the tray holder and coil the spare fiber in large loops. Never bend it sharply."],
    14: ["Test the connection", "Test with an OTDR or a light source and power meter. Record the actual measured loss — not the splicer's estimate."],
  };
  const stepImg = { 1: "step01_prepare.png", 2: "step02_jacket.png", 3: "step03_sleeve.png", 4: "step04_strip.png", 5: "step05_clean.png", 6: "step06_cleave.png", 7: "step07_place.png", 8: "step08_align.png", 9: "step09_arc.png", 10: "step10_inspect.png", 11: "step11_sleeve_move.png", 12: "step12_heat.png", 13: "step13_tray.png", 14: "step14_test.png" };
  const R_LIGHT = 800 / 362, R_DARK = 800 / 410;

  // slide 7: steps 1–4, 2x2 (image left, text right)
  s = newSlide("Part A — Splicing", "Fusion Splicing (1/4): Preparing the Fiber", "PART A  ·  FUSION SPLICING PROCEDURE  ·  STEPS 1–4");
  [1, 2, 3, 4].forEach((n, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = 0.6 + col * 6.25, y = 1.45 + row * 2.75;
    const w = 3.3, h = w / R_LIGHT;
    img(s, stepImg[n], x, y + 0.1, w, h, steps[n][0]);
    badge(s, n, x + 3.5, y);
    T(s, steps[n][0], { x: x + 4.05, y: y + 0.02, w: 1.95, h: 0.72, fontSize: 15, bold: true, color: NAVY, valign: "top" });
    T(s, steps[n][1], { x: x + 3.5, y: y + 0.8, w: 2.5, h: 1.8, fontSize: 12.5 });
  });
  vrule(s, 6.6, 1.5, 5.2); rule(s, 0.6, 4.05, 12.1);
  s.addNotes("Step 3 is the most commonly forgotten step in the lab. Always put the sleeve on first.");

  // slide 8: steps 5–7, three columns
  s = newSlide("Part A — Splicing", "Fusion Splicing (2/4): Clean, Cleave, Load", "PART A  ·  FUSION SPLICING PROCEDURE  ·  STEPS 5–7");
  [5, 6, 7].forEach((n, i) => {
    const x = 0.6 + i * 4.15, w = 3.85, h = w / R_LIGHT;
    img(s, stepImg[n], x, 1.5, w, h, steps[n][0]);
    badge(s, n, x, 3.55);
    T(s, steps[n][0], { x: x + 0.55, y: 3.55, w: 3.3, h: 0.42, fontSize: 16, bold: true, color: NAVY, valign: "middle" });
    T(s, steps[n][1], { x, y: 4.15, w: 3.75, h: 1.5, fontSize: 13.5 });
  });
  note(s, "Safety: bare fiber offcuts are tiny glass needles. They can enter the skin or eyes. Pick them up with tape and put them in the scrap bin — never on the floor or table.", 0.6, 5.85, 12.1, 0.75, false, INK);
  s.addNotes("The quality of the cleave decides the quality of the splice. Most splicers reject a cleave angle above about 1°.");

  // slide 9: steps 8–10 dark
  s = newSlide("Part A — Splicing", "Fusion Splicing (3/4): Inside the Splicer", "PART A  ·  FUSION SPLICING PROCEDURE  ·  STEPS 8–10", true);
  [8, 9, 10].forEach((n, i) => {
    const x = 0.6 + i * 4.15, w = 3.85, h = w / R_DARK;
    img(s, stepImg[n], x, 1.45, w, h, steps[n][0]);
    badge(s, n, x, 3.65, 0.42, ORANGE);
    T(s, steps[n][0], { x: x + 0.55, y: 3.65, w: 3.3, h: 0.42, fontSize: 16, bold: true, color: WHITE, valign: "middle" });
    T(s, steps[n][1], { x, y: 4.25, w: 3.75, h: 1.6, fontSize: 13.5, color: PALE });
  });
  T(s, "Screen drawings are illustrations of a typical splicer display, not screenshots from our machine. We did not record a splice-loss value, so none is shown.", { x: 0.6, y: 6.15, w: 12.1, h: 0.5, fontSize: 11, color: MUTED, italic: true });
  s.addNotes("Some low-cost splicers align the cladding instead of the core. Core alignment usually gives lower loss.");

  // slide 10: steps 11–14, four columns
  s = newSlide("Part A — Splicing", "Fusion Splicing (4/4): Protect and Test", "PART A  ·  FUSION SPLICING PROCEDURE  ·  STEPS 11–14");
  [11, 12, 13, 14].forEach((n, i) => {
    const x = 0.6 + i * 3.1, w = 2.9, h = w / R_LIGHT;
    img(s, stepImg[n], x, 1.5, w, h, steps[n][0]);
    badge(s, n, x, 3.05);
    T(s, steps[n][0], { x: x + 0.52, y: 3.0, w: 2.38, h: 0.6, fontSize: 14.5, bold: true, color: NAVY, valign: "middle" });
    T(s, steps[n][1], { x, y: 3.75, w: 2.85, h: 2.0, fontSize: 13 });
  });
  rule(s, 0.6, 5.9, 12.1);
  T(s, [{ text: "Quick order check:  ", options: { bold: true, color: ORANGE } }, { text: "prepare → jacket off → sleeve on → strip → clean → cleave → load → align → fuse → inspect → sleeve over → heat → tray → test" }], { x: 0.6, y: 6.05, w: 12.1, h: 0.6, fontSize: 13 });
  s.addNotes("In the lab, after testing, write the measured loss in your record. The splicer estimate is only a guide.");

  // 11. MECHANICAL SPLICING
  s = newSlide("Part A — Splicing", "Mechanical Splicing", "PART A  ·  FIBER SPLICING");
  img(s, "mech_splice.png", 0.45, 1.45, 6.6, 3.43, "Mechanical splice cut-away diagram");
  T(s, "No arc and no machine. The two fibers are pushed into a small housing. A V-groove lines them up, and a gel with nearly the same refractive index as glass fills the tiny gap so less light is reflected or lost.",
    { x: 0.6, y: 5.1, w: 6.3, h: 1.4, fontSize: 14 });
  const mech = [["Strip", "Remove coating to the length given by the splice maker."], ["Clean", "Wipe the bare glass with alcohol and a lint-free wipe."], ["Cleave", "Make a flat, square end."], ["Insert", "Push the first fiber into one side, up to the middle."], ["Align", "Push in the second fiber until the ends meet; a slight bow shows contact."], ["Lock", "Close the cam or lid to clamp both fibers."], ["Test", "Measure the loss with an OTDR or power meter."]];
  mech.forEach((m, i) => {
    const y = 1.45 + i * 0.74;
    badge(s, i + 1, 7.45, y, 0.38, i === 5 ? ORANGE : NAVY, WHITE, 12);
    T(s, m[0], { x: 7.98, y: y - 0.02, w: 1.1, h: 0.42, fontSize: 15, bold: true, color: NAVY, valign: "middle" });
    T(s, m[1], { x: 9.1, y: y - 0.02, w: 3.65, h: 0.62, fontSize: 13, valign: "top" });
  });
  s.addNotes("Mechanical splices are popular for quick restoration because they need very little equipment.");

  // 12. PRECAUTIONS
  s = newSlide("Part A — Splicing", "Splicing Precautions and Common Mistakes", "PART A  ·  FIBER SPLICING");
  T(s, "PROBLEM", { x: 2.3, y: 1.3, w: 4, h: 0.3, fontSize: 11, bold: true, color: GREY, charSpacing: 2 });
  T(s, "WHAT TO DO", { x: 7.65, y: 1.3, w: 4, h: 0.3, fontSize: 11, bold: true, color: TEAL, charSpacing: 2 });
  const errs = [
    ["err_dirt.png", "Dirty fiber ends", "Dust or skin oil burns in the arc and causes bubbles and high loss.", "Clean with 99% IPA just before cleaving. Do not touch bare glass."],
    ["err_cleave.png", "Poor cleaving", "Angled, chipped or lipped ends do not fuse well.", "Keep the blade clean, rotate it when worn, and re-cleave any bad end."],
    ["err_align.png", "Incorrect alignment", "If cores are offset, part of the light misses the next core.", "Seat fibers properly in the V-grooves; clean the grooves; let the splicer align."],
    ["err_bend.png", "Sharp fiber bends", "Light leaks out at tight bends (worse at 1550 nm).", "Keep large loops in the tray and follow the bend-radius guides."],
    ["err_shard.png", "Unsafe fiber fragments", "Glass slivers can enter skin and eyes.", "Wear safety glasses, use a scrap bin, don't eat or drink at the bench."],
  ];
  errs.forEach((e, i) => {
    const y = 1.65 + i * 1.03;
    img(s, e[0], 0.6, y + 0.05, 1.45, 0.82, e[1]);
    T(s, e[1], { x: 2.3, y, w: 4.6, h: 0.35, fontSize: 15, bold: true, color: NAVY });
    T(s, e[2], { x: 2.3, y: y + 0.36, w: 4.7, h: 0.55, fontSize: 13 });
    s.addShape(pres.shapes.LINE, { x: 7.05, y: y + 0.45, w: 0.4, h: 0, line: { color: TEAL, width: 1.5, endArrowType: "triangle" } });
    T(s, e[3], { x: 7.65, y: y + 0.1, w: 5.05, h: 0.75, fontSize: 13.5, valign: "middle" });
    if (i < 4) rule(s, 0.6, y + 0.98, 12.1);
  });
  s.addNotes("These five problems cause most failed splices in student labs.");

  // =====================================================================
  // 13. WHAT IS AN OTDR (dark)
  pres.addSection({ title: "Part B — OTDR Testing" });
  s = newSlide("Part B — OTDR Testing", "What Is an OTDR?", "PART B  ·  OPTICAL FIBER TESTING USING OTDR", true);
  T(s, [{ text: "OTDR", options: { bold: true, color: SOFTORANGE } }, { text: " stands for " }, { text: "Optical Time Domain Reflectometer", options: { bold: true } }, { text: ". It is used to find the length, losses and faults in an optical fiber." }],
    { x: 0.6, y: 1.5, w: 11.5, h: 1.3, fontFace: HEAD, fontSize: 24, color: WHITE });
  const otdrUse = [["Length", "How long the fiber is, and where each event is (in km)."], ["Loss", "How much light is lost along the fiber and at each splice or connector (in dB)."], ["Faults", "Where a break, bad splice or sharp bend is, so a repair team knows where to dig."]];
  otdrUse.forEach((u, i) => {
    const x = 0.6 + i * 4.15;
    T(s, u[0], { x, y: 3.2, w: 3.8, h: 0.6, fontFace: HEAD, fontSize: 28, bold: true, color: SOFTORANGE });
    rule(s, x, 3.9, 3.6, "4A566B");
    T(s, u[1], { x, y: 4.05, w: 3.6, h: 1.1, fontSize: 15, color: PALE });
  });
  note(s, "Why it is so useful in practice: the OTDR needs access to only ONE end of the fiber. A power meter test needs equipment at both ends.", 0.6, 5.55, 12.1, 0.8, true);
  s.addNotes("Think of an OTDR as a radar for fiber: it sends a pulse and listens for echoes.");

  // 14. HOW OTDR WORKS (dark)
  s = newSlide("Part B — OTDR Testing", "How an OTDR Works", "PART B  ·  OPTICAL FIBER TESTING USING OTDR", true);
  img(s, "otdr_principle.png", 0.9, 1.35, 11.5, 4.6, "OTDR working principle diagram");
  const howSteps = ["Sends a short light pulse into the fiber", "Some light is scattered or reflected back", "The OTDR's detector receives the returned light", "It measures how long the light takes to return", "It works out distance and signal loss", "It draws the result as a graph (trace)"];
  howSteps.forEach((h, i) => {
    const x = 0.6 + i * 2.03;
    T(s, String(i + 1), { x, y: 6.05, w: 0.3, h: 0.35, fontSize: 18, bold: true, color: SOFTORANGE, fontFace: HEAD });
    T(s, h, { x: x + 0.32, y: 6.05, w: 1.62, h: 0.8, fontSize: 12, color: PALE });
  });
  s.addNotes("Rayleigh backscatter is weak but comes from every point, so it shows the fiber's gradual loss. Fresnel reflection is a strong echo from a glass–air surface, e.g. a connector or the open fiber end (about 4% of the light, roughly −14 dB, for a flat clean end).");

  // 15. EQUIPMENT USED
  s = newSlide("Part B — OTDR Testing", "Equipment Used in Our Experiment", "PART B  ·  OPTICAL FIBER TESTING USING OTDR");
  T(s, [{ text: "FiberShot Pro Series OTDR", options: { bold: true, color: NAVY } }, { text: "  —  the instrument used in our lab. Both photos below were taken by us during the experiment.", options: { color: GREY } }], { x: 0.6, y: 1.3, w: 12.1, h: 0.4, fontSize: 15 });
  photoSlot(s, "settings", 0.6, 1.9, 5.9, 4.25, "Photo 1 — OTDR test-settings screen");
  photoSlot(s, "result", 6.8, 1.9, 5.9, 4.25, "Photo 2 — OTDR trace and result screen");
  T(s, [{ text: "Photo 1 · ", options: { bold: true, color: ORANGE } }, { text: "Test-setting menu: wavelength, range, pulse width, test time, resolution, launch/end cable and power mode." }], { x: 0.6, y: 6.25, w: 5.9, h: 0.6, fontSize: 12 });
  T(s, [{ text: "Photo 2 · ", options: { bold: true, color: ORANGE } }, { text: "Trace with distance, total loss, attenuation slope, ORL and the PASS result." }], { x: 6.8, y: 6.25, w: 5.9, h: 0.6, fontSize: 12 });
  s.addNotes("Original photographs from the lab. They are only cropped — no reading on the screen has been changed.");

  // 16. CONNECTING THE OTDR
  s = newSlide("Part B — OTDR Testing", "Connecting the OTDR", "PART B  ·  OPTICAL FIBER TESTING USING OTDR");
  img(s, "otdr_connection.png", 0.9, 1.3, 11.5, 3.02, "OTDR to launch cable to fiber under test to receive cable");
  const conn = ["Switch on the instrument and let it start up.", "Inspect and clean every connector end face.", "Connect the launch cable to the OTDR port (if available).", "Connect the fiber under test.", "Check that all connections are firm and secure.", "Make sure the fiber has no live signal on it (unless using a live-fiber OTDR setup)."];
  conn.forEach((c, i) => {
    const col = i < 3 ? 0 : 1, row = i % 3;
    const x = 0.6 + col * 3.95, y = 4.5 + row * 0.72;
    badge(s, i + 1, x, y, 0.36, NAVY, WHITE, 12);
    T(s, c, { x: x + 0.48, y: y - 0.03, w: 3.35, h: 0.66, fontSize: 13 });
  });
  T(s, "Why launch and receive cables?", { x: 8.75, y: 4.45, w: 4.0, h: 0.35, fontSize: 14, bold: true, color: NAVY });
  T(s, "Right after the OTDR port there is a 'dead zone' where the strong reflection blinds the detector. A launch cable moves the first connector out of this zone so it can be measured. A receive cable does the same for the far-end connector.", { x: 8.75, y: 4.85, w: 3.95, h: 1.55, fontSize: 12 });
  T(s, "⚠  Never look into the OTDR port or a fiber end — the laser light is invisible and can harm your eyes. Use an inspection scope.", { x: 0.6, y: 6.6, w: 12.1, h: 0.32, fontSize: 12, bold: true, color: ORANGE });
  s.addNotes("A live signal on the fiber can damage the OTDR detector and gives a wrong trace. In our test, the launch and end cable settings were 'None'.");

  // 17. TEST SETTINGS
  s = newSlide("Part B — OTDR Testing", "OTDR Test Settings We Used", "PART B  ·  OPTICAL FIBER TESTING USING OTDR");
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

  // 18. PERFORMING THE TEST
  s = newSlide("Part B — OTDR Testing", "Performing the OTDR Test", "PART B  ·  OPTICAL FIBER TESTING USING OTDR");
  const perf = ["Open the Test Setting menu.", "Select the wavelength.", "Set the measurement range.", "Select the pulse width.", "Set the test duration.", "Select resolution and power mode.", "Return to the main test screen.", "Press AVG to start the averaged test.", "Wait for the test to finish.", "Observe the trace and the event table."];
  perf.forEach((p, i) => {
    const col = i < 5 ? 0 : 1, row = i % 5;
    const x = 0.6 + col * 4.25, y = 1.5 + row * 0.98;
    const hi = i === 7;
    badge(s, i + 1, x, y, 0.5, hi ? ORANGE : NAVY, WHITE, 15);
    T(s, p, { x: x + 0.68, y: y - 0.02, w: 3.4, h: 0.55, fontSize: 15, valign: "middle", bold: hi, color: hi ? ORANGE : INK });
    if (row < 4) vrule(s, x + 0.25, y + 0.55, 0.38);
  });
  // AVG key panel
  s.addShape(pres.shapes.RECTANGLE, { x: 9.3, y: 1.45, w: 3.4, h: 4.85, fill: { color: "ECEAE4" }, line: { color: "ECEAE4" } });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 10.2, y: 1.85, w: 1.6, h: 0.85, rectRadius: 0.12, fill: { color: "3E4654" }, line: { color: "2B2B2B", width: 1 }, shadow: { type: "outer", color: "000000", opacity: 0.3, blur: 3, offset: 2, angle: 90 } });
  T(s, "AVG", { x: 10.2, y: 1.85, w: 1.6, h: 0.85, fontSize: 24, bold: true, color: WHITE, align: "center", valign: "middle" });
  T(s, "Why 'average'?", { x: 9.5, y: 2.95, w: 3.0, h: 0.35, fontSize: 15, bold: true, color: NAVY });
  T(s, "The returned light is very weak and noisy. The OTDR repeats the pulse many times during the test time (50 s for us) and averages the results. Noise cancels out and the trace becomes clean.", { x: 9.5, y: 3.35, w: 3.0, h: 2.8, fontSize: 13 });
  s.addNotes("While the test runs, do not move or bend the fiber.");

  // 19. UNDERSTANDING THE GRAPH
  s = newSlide("Part B — OTDR Testing", "Understanding the OTDR Graph", "PART B  ·  OPTICAL FIBER TESTING USING OTDR");
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
  s = newSlide("Part B — OTDR Testing", "Our OTDR Observations", "PART B  ·  OPTICAL FIBER TESTING USING OTDR");
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

  // 21. COMMON EVENTS (examples)
  s = newSlide("Part B — OTDR Testing", "Common OTDR Events", "PART B  ·  OPTICAL FIBER TESTING USING OTDR");
  T(s, "EXAMPLE DIAGRAMS — drawn for learning, not from our experiment", { x: 6.2, y: 0.22, w: 6.5, h: 0.28, fontSize: 11, bold: true, color: ORANGE, align: "right", charSpacing: 1 });
  const evs = [
    ["ev_splice.png", "Fusion splice", "Small step down. No spike, because a fused joint hardly reflects."],
    ["ev_connector.png", "Connector", "Spike (reflection from the glass gap) followed by a step (loss)."],
    ["ev_bend.png", "Sharp bend", "Step down with no spike. The loss is bigger at 1550 nm than at 1310 nm."],
    ["ev_break.png", "Fiber break", "Trace ends earlier than the known length and falls to noise."],
    ["ev_end.png", "Fiber end", "Reflection at the expected length, then only noise."],
  ];
  evs.forEach((e, i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const x = 0.6 + col * 4.15, y = 1.4 + row * 2.75;
    img(s, e[0], x, y, 3.3, 1.84, e[1] + " example trace");
    T(s, e[1], { x, y: y + 1.9, w: 3.8, h: 0.32, fontSize: 15, bold: true, color: NAVY });
    T(s, e[2], { x, y: y + 2.2, w: 3.8, h: 0.5, fontSize: 12 });
  });
  note(s, "Reflective events (connector, end, break with a gap) show a spike.\n\nNon-reflective events (fusion splice, bend) show only a step.", 8.9, 4.3, 3.8, 2.2, false);
  s.addNotes("A bend and a splice look alike at one wavelength. Testing at both 1310 and 1550 nm helps tell them apart.");

  // =====================================================================
  // 22. WHAT IS LINK LOSS (dark)
  pres.addSection({ title: "Part C — Link Loss" });
  s = newSlide("Part C — Link Loss", "What Is Optical Link Loss?", "PART C  ·  LINK LOSS MEASUREMENT USING OTDR", true);
  T(s, "Link loss is the total reduction in optical signal power as light travels through a fiber link.", { x: 0.6, y: 1.35, w: 12.1, h: 0.55, fontFace: HEAD, fontSize: 20, italic: true, color: WHITE });
  img(s, "link_loss.png", 0.5, 2.1, 8.3, 2.9, "Link loss diagram");
  T(s, "Total link loss", { x: 9.2, y: 2.2, w: 3.5, h: 0.4, fontSize: 17, bold: true, color: SOFTORANGE });
  T(s, "Unit: dB. Everything lost from one end to the other — fiber + splices + connectors.", { x: 9.2, y: 2.6, w: 3.5, h: 1.0, fontSize: 13.5, color: PALE });
  T(s, "Fiber attenuation", { x: 9.2, y: 3.75, w: 3.5, h: 0.4, fontSize: 17, bold: true, color: "7FD0D6" });
  T(s, "Unit: dB/km. How much the fiber itself loses per kilometre. It is the slope of the trace.", { x: 9.2, y: 4.15, w: 3.5, h: 1.0, fontSize: 13.5, color: PALE });
  note(s, "Example (not our data): 10 km of fiber at 0.35 dB/km loses 3.5 dB in the glass alone. Add each connector and splice loss to get the total link loss.", 0.6, 5.5, 12.1, 0.8, true);
  s.addNotes("dB is a ratio; dBm is power compared with 1 mW. Loss in dB can be added along the link.");

  // 23. PROCEDURE (link loss)
  s = newSlide("Part C — Link Loss", "Procedure to Measure Link Loss Using OTDR", "PART C  ·  LINK LOSS MEASUREMENT USING OTDR");
  const llp = ["Clean and inspect the fiber connectors.", "Connect the OTDR to the fiber link.", "Use launch / receive cables when required.", "Open the test settings.", "Select wavelength, range and pulse width.", "Start the averaged (AVG) measurement.", "Observe the trace.", "Find the start and the end of the link.", "Use the event table or the A–B loss cursors.", "Read the section loss in dB.", "Record the fiber length and the loss.", "Repeat at another wavelength if required."];
  llp.forEach((p, i) => {
    const col = i < 6 ? 0 : 1, row = i % 6;
    const x = 0.6 + col * 3.6, y = 1.45 + row * 0.8;
    T(s, String(i + 1).padStart(2, "0"), { x, y, w: 0.5, h: 0.4, fontSize: 17, bold: true, color: ORANGE, fontFace: HEAD });
    T(s, p, { x: x + 0.55, y: y + 0.02, w: 2.9, h: 0.7, fontSize: 13.5 });
  });
  img(s, "trace_cursors.png", 7.85, 1.35, 4.9, 2.55, "Example trace with A and B loss cursors");
  T(s, "Example: cursors A and B placed at the start and end of the fiber section.", { x: 7.85, y: 3.95, w: 4.9, h: 0.5, fontSize: 11, italic: true, color: GREY });
  note(s, "Important: the OTDR estimates loss from the backscattered light. It does not directly measure the power sent in at one end and received at the other end — that is a power-meter test.", 7.85, 4.6, 4.9, 1.6, false);
  s.addNotes("Place cursor A after the launch dead zone and cursor B just before the end reflection.");

  // 24. FORMULA
  s = newSlide("Part C — Link Loss", "Link Loss Formulas", "PART C  ·  LINK LOSS MEASUREMENT USING OTDR");
  const eqBox = (y, eq, used) => {
    s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y, w: 7.4, h: 1.25, fill: { color: WHITE }, line: { color: "D9D6CF", width: 1 } });
    T(s, eq, { x: 0.85, y: y + 0.1, w: 7.0, h: 0.75, fontFace: HEAD, fontSize: 22, color: NAVY, valign: "middle" });
    T(s, used, { x: 0.85, y: y + 0.82, w: 7.0, h: 0.35, fontSize: 12, color: GREY, italic: true });
  };
  eqBox(1.45, [{ text: "Link Loss (dB) = P", options: {} }, { text: "in", options: { subscript: true } }, { text: " (dBm) − P" }, { text: "out", options: { subscript: true } }, { text: " (dBm)" }], "Basic end-to-end insertion loss — used with a light source and an optical power meter.");
  T(s, "With an OTDR, we do not use this formula. The link or section loss (dB) is read from the event table or from the A–B loss-measurement cursors.", { x: 0.6, y: 2.9, w: 7.4, h: 0.85, fontSize: 14, color: TEAL, bold: true });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 3.9, w: 7.4, h: 1.6, fill: { color: WHITE }, line: { color: "D9D6CF", width: 1 } });
  T(s, [{ text: "Average Attenuation (dB/km) =", options: { breakLine: true } }, { text: "Total Loss (dB)  ÷  Fiber Length (km)", options: { bold: true } }], { x: 0.85, y: 4.0, w: 7.0, h: 1.05, fontFace: HEAD, fontSize: 22, color: NAVY, valign: "middle" });
  T(s, "Gives the average loss for every kilometre of the link.", { x: 0.85, y: 5.1, w: 7.0, h: 0.32, fontSize: 12, color: GREY, italic: true });
  T(s, "Terms", { x: 8.5, y: 1.45, w: 4.2, h: 0.4, fontSize: 17, bold: true, color: NAVY });
  const terms = [["P_in", "Optical power sent into the link, in dBm."], ["P_out", "Optical power received at the far end, in dBm."], ["dBm", "Power compared with 1 mW (0 dBm = 1 mW)."], ["dB", "A ratio — how much power is lost."], ["Total Loss", "Loss of the measured section, in dB."], ["Fiber Length", "Length of that section, in km."]];
  terms.forEach((t, i) => {
    const y = 1.95 + i * 0.68;
    const lbl = t[0] === "P_in" ? [{ text: "P" }, { text: "in", options: { subscript: true } }] : t[0] === "P_out" ? [{ text: "P" }, { text: "out", options: { subscript: true } }] : t[0];
    T(s, lbl, { x: 8.5, y, w: 1.45, h: 0.6, fontSize: 14, bold: true, color: ORANGE });
    T(s, t[1], { x: 9.95, y, w: 2.8, h: 0.6, fontSize: 13 });
  });
  T(s, "Because dBm − dBm gives dB, the loss comes out in dB, not dBm.", { x: 0.6, y: 5.7, w: 7.4, h: 0.4, fontSize: 13, italic: true, color: GREY });
  s.addNotes("Example for the first formula: if −5 dBm goes in and −7 dBm comes out, the loss is 2 dB.");

  // 25. CALCULATION
  s = newSlide("Part C — Link Loss", "Calculation Using Our Readings", "PART C  ·  LINK LOSS MEASUREMENT USING OTDR");
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

  // 26. OBSERVATION REPORT (sheet)
  pres.addSection({ title: "Results" });
  s = newSlide("Results", "Experiment Observation Report", "RESULTS");
  s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 1.35, w: 12.1, h: 5.5, fill: { color: PAPER }, line: { color: "BDB9B0", width: 1 }, shadow: { type: "outer", color: "000000", opacity: 0.12, blur: 6, offset: 2, angle: 90 } });
  T(s, "OBSERVATION SHEET", { x: 0.9, y: 1.5, w: 4, h: 0.3, fontSize: 12, bold: true, color: ORANGE, charSpacing: 3 });
  T(s, "Date: ____________     Batch: ________", { x: 7.6, y: 1.5, w: 4.9, h: 0.3, fontSize: 12, color: GREY, align: "right" });
  T(s, [{ text: "Experiment: ", options: { bold: true } }, { text: "Optical fiber testing and link loss measurement using OTDR" }], { x: 0.9, y: 1.88, w: 11.5, h: 0.32, fontSize: 14 });
  T(s, [{ text: "Equipment: ", options: { bold: true } }, { text: "FiberShot Pro Series OTDR, fiber under test, connector cleaning kit" }], { x: 0.9, y: 2.22, w: 11.5, h: 0.32, fontSize: 14 });
  const sheet = [
    ["Parameter", "Value", "Parameter", "Value"],
    ["Test wavelength", "1310 nm", "Measured fiber length", "4.822 km"],
    ["Test range", "10 km", "Total loss", "1.550 dB"],
    ["Pulse width", "50 ns", "Attenuation slope (displayed)", "0.317 dB/km"],
    ["Test time", "50 s", "Optical Return Loss", "29.37 dB"],
    ["Launch / end cable", "None / None", "Instrument result", { text: "PASS", options: { bold: true, color: TEAL } }],
    ["Average attenuation (calculated)", { text: "0.3214 dB/km", options: { color: ORANGE, bold: true } }, "Resolution / power mode", "Standard / Standard"],
  ];
  s.addTable(sheet.map((r, i) => r.map((c, j) => {
    const cell = typeof c === "object" ? c : { text: c };
    cell.options = Object.assign({ fontFace: BODY, fontSize: 12.5, color: INK, valign: "middle", margin: [0.03, 0.1, 0.03, 0.1], border: { type: "solid", color: "9A9DA3", pt: 0.75 }, fill: { color: i === 0 ? "ECEAE4" : WHITE }, bold: i === 0 || j % 2 === 1 }, cell.options || {});
    return cell;
  })), { x: 0.9, y: 2.7, w: 11.5, colW: [3.0, 2.75, 3.0, 2.75], rowH: 0.4 });
  T(s, [{ text: "Conclusion: ", options: { bold: true } }, { text: "The OTDR measured a 4.822 km fiber with 1.550 dB total loss at 1310 nm (average ≈ 0.321 dB/km). The instrument showed PASS against its set thresholds." }], { x: 0.9, y: 5.65, w: 11.5, h: 0.6, fontSize: 13 });
  T(s, "Student's signature ____________________", { x: 0.9, y: 6.38, w: 5, h: 0.3, fontSize: 12, color: GREY });
  T(s, "Faculty's signature ____________________", { x: 7.4, y: 6.38, w: 5, h: 0.3, fontSize: 12, color: GREY, align: "right" });
  s.addNotes("Splice loss is not listed because we did not record a measured splice-loss value.");

  // 27. RESULTS & DISCUSSION
  s = newSlide("Results", "Results and Discussion", "RESULTS");
  const stats = [["4.822", "km", "fiber length"], ["1.550", "dB", "total loss"], ["PASS", "", "instrument result"]];
  stats.forEach((st, i) => {
    const y = 1.4 + i * 1.75;
    T(s, [{ text: st[0], options: { fontSize: 48, bold: true, color: i === 2 ? TEAL : NAVY } }, { text: st[1] ? " " + st[1] : "", options: { fontSize: 22, color: GREY } }], { x: 0.6, y, w: 4.2, h: 0.95, fontFace: HEAD, valign: "bottom" });
    T(s, st[2] + "  ·  at 1310 nm", { x: 0.6, y: y + 0.98, w: 4.2, h: 0.3, fontSize: 13, color: GREY });
    if (i < 2) rule(s, 0.6, y + 1.5, 3.8);
  });
  vrule(s, 5.0, 1.45, 5.2);
  const disc = [
    ["What the test showed", "The OTDR found the fiber to be about 4.822 km long, with a total loss of 1.550 dB."],
    ["PASS", "The instrument showed PASS. This only means the results were inside the thresholds set in the OTDR."],
    ["What we learned", "The test showed how an OTDR inspects a link from one end: length, loss and events from a single trace."],
    ["Limitation", "Launch and end cable settings were 'None'. So the loss of the first and last connectors cannot be measured accurately — they fall in the dead zone or at the end reflection."],
    ["Improvement", "Repeat with launch and receive cables, and at 1550 nm, to compare results."],
  ];
  disc.forEach((d, i) => {
    const y = 1.4 + i * 1.05;
    T(s, d[0], { x: 5.4, y, w: 7.3, h: 0.32, fontSize: 15, bold: true, color: i === 3 ? ORANGE : NAVY });
    T(s, d[1], { x: 5.4, y: y + 0.32, w: 7.3, h: 0.7, fontSize: 13.5 });
  });
  s.addNotes("Keep the discussion honest: the PASS depends on the thresholds stored in the instrument.");

  // 28. CONCLUSION
  s = newSlide("Results", "Conclusion", "WHAT WE LEARNED");
  const conc = ["Fiber splicing joins two optical fibers so light can continue from one to the other.", "Fusion splicing uses heat from an electric arc to make a permanent, very low-loss joint.", "An OTDR measures fiber length and loss, and finds faults — from one end of the fiber.", "Link loss can be estimated from OTDR trace measurements (event table or A–B cursors).", "Proper cleaning, cleaving, alignment and testing give a good fiber connection."];
  conc.forEach((c, i) => {
    const y = 1.45 + i * 1.03;
    T(s, String(i + 1), { x: 0.6, y, w: 0.8, h: 0.85, fontFace: HEAD, fontSize: 40, bold: true, color: i % 2 ? TEAL : ORANGE, valign: "middle" });
    T(s, c, { x: 1.5, y, w: 7.0, h: 0.85, fontSize: 17, valign: "middle" });
    if (i < 4) rule(s, 1.5, y + 0.95, 7.0);
  });
  [["A", "Join", "splice the fibers"], ["B", "Test", "look inside with an OTDR"], ["C", "Measure", "read and report the loss"]].forEach((c, i) => {
    const y = 1.75 + i * 1.6;
    s.addShape(pres.shapes.OVAL, { x: 9.3, y, w: 0.95, h: 0.95, fill: { color: i === 1 ? TEAL : NAVY }, line: { color: WHITE } });
    T(s, c[0], { x: 9.3, y, w: 0.95, h: 0.95, fontFace: HEAD, fontSize: 28, bold: true, color: WHITE, align: "center", valign: "middle" });
    T(s, c[1], { x: 10.45, y: y + 0.08, w: 2.3, h: 0.4, fontFace: HEAD, fontSize: 20, bold: true, color: NAVY });
    T(s, c[2], { x: 10.45, y: y + 0.48, w: 2.3, h: 0.4, fontSize: 13, color: GREY });
    if (i < 2) s.addShape(pres.shapes.LINE, { x: 9.775, y: y + 1.0, w: 0, h: 0.55, line: { color: "BDB9B0", width: 1.5, endArrowType: "triangle" } });
  });
  s.addNotes("Summarise in one line: a good link needs a good splice, and a test to prove it.");

  // 29. REFERENCES
  s = newSlide("Results", "References", "REFERENCES");
  const refs1 = [
    "G. Keiser, Optical Fiber Communications, 5th ed., McGraw-Hill Education.",
    "J. M. Senior, Optical Fiber Communications: Principles and Practice, 3rd ed., Pearson Education, 2009.",
    "ITU-T Recommendation G.652 — Characteristics of a single-mode optical fibre and cable. itu.int",
    "IEC 61746-1 — Calibration of optical time-domain reflectometers (OTDR), Part 1: single-mode fibres. iec.ch",
    "IEC 60825-1 — Safety of laser products. iec.ch",
  ];
  const refs2 = [
    "The Fiber Optic Association (FOA) Online Reference Guide — sections on fusion splicing, mechanical splicing, and OTDR testing. thefoa.org/tech/ref/",
    "ANSI/TIA-568.3-D — Optical Fiber Cabling and Components Standard (loss limits for splices and connectors).",
    "User manual of the FiberShot Pro Series OTDR used in the lab (for menu names and settings).",
    "User manuals of the fusion splicer and cleaver available in the lab (for strip and cleave lengths).",
  ];
  T(s, "Textbooks and standards", { x: 0.6, y: 1.4, w: 5.8, h: 0.35, fontSize: 15, bold: true, color: NAVY });
  T(s, refs1.map((r, i) => ({ text: r, options: { bullet: { type: "number" }, breakLine: i < refs1.length - 1 } })), { x: 0.6, y: 1.85, w: 5.8, h: 4.6, fontSize: 13, paraSpaceAfter: 9 });
  T(s, "Practical guides and documentation", { x: 6.9, y: 1.4, w: 5.8, h: 0.35, fontSize: 15, bold: true, color: NAVY });
  T(s, refs2.map((r, i) => ({ text: r, options: { bullet: { type: "number", startAt: 6 }, breakLine: i < refs2.length - 1 } })), { x: 6.9, y: 1.85, w: 5.8, h: 4.6, fontSize: 13, paraSpaceAfter: 9 });
  T(s, "All diagrams in this presentation were drawn by us for this lab. The two OTDR photographs were taken during our experiment.", { x: 0.6, y: 6.45, w: 12.1, h: 0.35, fontSize: 11, italic: true, color: GREY });
  s.addNotes("Add the exact edition and year of the manuals available in your lab.");

  // 30. THANK YOU
  s = pres.addSlide({ masterName: "COVER", sectionTitle: "Results" });
  T(s, "Thank You", { x: 0.7, y: 2.3, w: 11.9, h: 1.3, fontFace: HEAD, fontSize: 60, bold: true, color: WHITE });
  T(s, "Questions?", { x: 0.7, y: 3.6, w: 11.9, h: 0.6, fontFace: HEAD, fontSize: 26, italic: true, color: SOFTORANGE });
  T(s, "Fiber Optic Splicing, OTDR Testing & Link Loss Measurement  ·  Optical Fiber Communication Laboratory", { x: 0.7, y: 6.6, w: 11.9, h: 0.35, fontSize: 12, color: MUTED });
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
