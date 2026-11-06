// Original technical diagrams for the Fiber Optic Lab presentation.
// Every drawing here is hand-built SVG, rendered to PNG with sharp.
// Run: node diagrams.js   ->  writes ../Presentation_Assets/*.png (+ .svg)
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const OUT = path.join(__dirname, "..", "Presentation_Assets");
fs.mkdirSync(OUT, { recursive: true });

// palette (matches deck)
const INK = "#2B2B2B", NAVY = "#1F3352", ORANGE = "#C8642B", TEAL = "#2E7D7A",
  GREY = "#7D838C", LGREY = "#C9C6BF", PAPER = "#F6F5F2", GLASS = "#D6E8EA",
  CORE = "#F4C7A5", COAT = "#A9B4C0", JACKET = "#3D4A5C", KEV = "#E2C35A", WHITE = "#FFFFFF";
const FONT = "Carlito, Calibri, Arial, sans-serif";

function svg(w, h, body, bg) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
<defs>
${["INK", "NAVY", "ORANGE", "TEAL", "GREY", "WHITE"].map(k => {
    const c = { INK, NAVY, ORANGE, TEAL, GREY, WHITE }[k];
    return `<marker id="ar${k}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="${c}"/></marker>`;
  }).join("\n")}
<pattern id="hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="8" stroke="${LGREY}" stroke-width="3"/></pattern>
</defs>
${bg ? `<rect width="${w}" height="${h}" fill="${bg}"/>` : ""}
${body}
</svg>`;
}
const mk = c => ({ [INK]: "INK", [NAVY]: "NAVY", [ORANGE]: "ORANGE", [TEAL]: "TEAL", [GREY]: "GREY", [WHITE]: "WHITE" }[c] || "INK");
function arrow(x1, y1, x2, y2, c = INK, sw = 3, dash = "", both = false) {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${sw}" ${dash ? `stroke-dasharray="${dash}"` : ""} marker-end="url(#ar${mk(c)})" ${both ? `marker-start="url(#ar${mk(c)})"` : ""}/>`;
}
function line(x1, y1, x2, y2, c = INK, sw = 2, dash = "") {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${sw}" ${dash ? `stroke-dasharray="${dash}"` : ""}/>`;
}
function text(x, y, t, { size = 22, color = INK, weight = 400, anchor = "start", italic = false } = {}) {
  const lines = String(t).split("\n");
  return lines.map((l, i) => `<text x="${x}" y="${y + i * size * 1.2}" font-family="${FONT}" font-size="${size}" fill="${color}" font-weight="${weight}" text-anchor="${anchor}" ${italic ? 'font-style="italic"' : ""}>${l.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</text>`).join("");
}
function rect(x, y, w, h, { fill = "none", stroke = INK, sw = 2, r = 0, dash = "" } = {}) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" ${dash ? `stroke-dasharray="${dash}"` : ""}/>`;
}
function circle(cx, cy, r, { fill = "none", stroke = INK, sw = 2 } = {}) {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
}
// horizontal fiber: coated section [x1,xs], bare glass [xs,x2]
function fiberH(x1, x2, y, { coatTo = null, coatFrom = null, glass = 14, coat = 30, core = 4, light = false } = {}) {
  let s = "";
  if (coatTo !== null) s += rect(x1, y - coat / 2, coatTo - x1, coat, { fill: COAT, stroke: "#6E7A88", sw: 1.5 });
  if (coatFrom !== null) s += rect(coatFrom, y - coat / 2, x2 - coatFrom, coat, { fill: COAT, stroke: "#6E7A88", sw: 1.5 });
  const gx1 = coatTo !== null ? coatTo : x1, gx2 = coatFrom !== null ? coatFrom : x2;
  s += rect(gx1, y - glass / 2, gx2 - gx1, glass, { fill: GLASS, stroke: "#7FA5AB", sw: 1.2 });
  s += rect(x1, y - core / 2, x2 - x1, core, { fill: light ? ORANGE : CORE, stroke: "none", sw: 0 });
  return s;
}
function stepBadge(x, y, n, c = NAVY) {
  return circle(x, y, 22, { fill: c, stroke: "none" }) + text(x, y + 8, String(n), { size: 24, color: WHITE, weight: 700, anchor: "middle" });
}

const D = {};

// ---------- Title illustration: cable cut-away (for dark background) ----------
D.title_cable = () => {
  const W = 1300, H = 560, y = 280;
  let s = "";
  // jacket
  s += `<path d="M40,${y - 70} L520,${y - 70} L520,${y + 70} L40,${y + 70} Z" fill="#33415A" stroke="#8FA1BC" stroke-width="2"/>`;
  s += `<ellipse cx="520" cy="${y}" rx="22" ry="70" fill="#2A3548" stroke="#8FA1BC" stroke-width="2"/>`;
  // aramid yarn
  for (let i = 0; i < 9; i++) {
    const yy = y - 44 + i * 11;
    s += `<path d="M520,${yy} C600,${yy - 8} 640,${yy + 10} 720,${yy + (i % 2 ? 6 : -6)}" stroke="${KEV}" stroke-width="3" fill="none" opacity="0.85"/>`;
  }
  // tight buffer 900um
  s += rect(520, y - 24, 330, 48, { fill: "#E7E3D8", stroke: "#B9B3A3", sw: 2, r: 6 });
  // coating 250um
  s += rect(850, y - 14, 200, 28, { fill: COAT, stroke: "#C9D2DC", sw: 1.5 });
  // glass
  s += rect(1050, y - 7, 200, 14, { fill: "#BFDDE2", stroke: "#E8F4F6", sw: 1 });
  s += rect(520, y - 2.5, 730, 5, { fill: ORANGE, stroke: "none", sw: 0 });
  // light exiting
  s += `<path d="M1250,${y} L1295,${y - 30} L1295,${y + 30} Z" fill="${ORANGE}" opacity="0.35"/>`;
  const L = (x, ty, t, lx) => line(x, y - 10, x, ty + 8, "#C9D2DC", 1.5) + text(lx ?? x, ty, t, { size: 26, color: "#E8ECF2", anchor: "middle" });
  s += line(280, y - 70, 280, 130, "#C9D2DC", 1.5) + text(280, 118, "Outer jacket", { size: 26, color: "#E8ECF2", anchor: "middle" });
  s += line(650, y - 40, 650, 420 - 220, "#C9D2DC", 1.5) + text(650, 188, "Aramid yarn (strength)", { size: 26, color: "#E8ECF2", anchor: "middle" });
  s += line(760, y + 24, 760, 420, "#C9D2DC", 1.5) + text(760, 452, "Buffer (900 µm)", { size: 26, color: "#E8ECF2", anchor: "middle" });
  s += line(950, y - 14, 950, 200, "#C9D2DC", 1.5) + text(950, 188, "Coating (250 µm)", { size: 26, color: "#E8ECF2", anchor: "middle" });
  s += line(1150, y + 7, 1150, 420, "#C9D2DC", 1.5) + text(1150, 452, "Glass fiber (125 µm)", { size: 26, color: "#E8ECF2", anchor: "middle" });
  s += text(650, 535, "Illustration — layers not to scale", { size: 20, color: "#9AA6B6", anchor: "middle", italic: true });
  return svg(W, H, s);
};

// ---------- Fiber cross-section + TIR ----------
D.fiber_structure = () => {
  const W = 1500, H = 640;
  let s = "";
  const cx = 230, cy = 300;
  s += circle(cx, cy, 190, { fill: COAT, stroke: "#6E7A88", sw: 2 });
  s += circle(cx, cy, 120, { fill: GLASS, stroke: "#7FA5AB", sw: 2 });
  s += circle(cx, cy, 26, { fill: CORE, stroke: ORANGE, sw: 2 });
  const lab = (x1, y1, x2, y2, t, sub) => line(x1, y1, x2, y2, INK, 1.5) + circle(x1, y1, 4, { fill: INK, stroke: "none" }) +
    text(x2 + 8, y2 + 6, t, { size: 26, weight: 700, color: NAVY }) + text(x2 + 8, y2 + 34, sub, { size: 21, color: GREY });
  s += lab(cx + 10, cy - 10, 470, 130, "Core", "≈ 8–9 µm (single-mode)\nlight travels here");
  s += lab(cx + 80, cy + 60, 470, 300, "Cladding", "125 µm glass, slightly\nlower refractive index");
  s += lab(cx + 150, cy + 100, 470, 470, "Coating", "250 µm plastic layer,\nprotects the glass");
  s += text(cx, 580, "Cross-section (not to scale)", { size: 22, color: GREY, anchor: "middle", italic: true });
  // longitudinal
  const x0 = 830, x1 = 1460, yc = 300, hc = 46, hg = 150;
  s += rect(x0, yc - hg / 2 - 30, x1 - x0, hg + 60, { fill: COAT, stroke: "#6E7A88", sw: 2 });
  s += rect(x0, yc - hg / 2, x1 - x0, hg, { fill: GLASS, stroke: "#7FA5AB", sw: 2 });
  s += rect(x0, yc - hc / 2, x1 - x0, hc, { fill: CORE, stroke: ORANGE, sw: 1.5 });
  // zigzag ray
  const pts = []; let x = x0 + 10, up = true, yy = yc + hc / 2;
  pts.push([x0 - 60, yc + 60]);
  pts.push([x, yy]);
  while (x < x1 - 80) { x += 95; yy = up ? yc - hc / 2 : yc + hc / 2; pts.push([x, yy]); up = !up; }
  s += `<polyline points="${pts.map(p => p.join(",")).join(" ")}" fill="none" stroke="${ORANGE}" stroke-width="4" marker-end="url(#arORANGE)"/>`;
  s += text(x0 - 70, yc + 95, "light in", { size: 22, color: ORANGE, weight: 700 });
  s += line(x0 + 105, yc - hc / 2, x0 + 105, yc - hc / 2 - 110, INK, 1.5) +
    text(x0 + 115, yc - hc / 2 - 115, "Total internal reflection at the core–cladding boundary", { size: 22, color: INK });
  s += text(x0, 530, "Core index n₁ is a little higher than cladding index n₂.", { size: 23, color: INK });
  s += text(x0, 562, "Light hitting the boundary at a shallow angle bounces back", { size: 23, color: INK });
  s += text(x0, 594, "into the core, so it stays trapped and travels long distances.", { size: 23, color: INK });
  s += text(x0 + 10, yc - hg / 2 - 40, "Side view", { size: 22, color: GREY, italic: true });
  return svg(W, H, s);
};

// ---------- Before / after splice ----------
D.splice_before_after = () => {
  const W = 1400, H = 560;
  let s = "";
  s += text(40, 60, "BEFORE — two separate fibers", { size: 26, weight: 700, color: NAVY });
  s += fiberH(60, 640, 150, { coatTo: 420, light: true }) + fiberH(700, 1300, 150, { coatFrom: 880 });
  s += arrow(560, 110, 640, 140, ORANGE, 2.5);
  s += `<path d="M640,150 L690,128 L690,172 Z" fill="${ORANGE}" opacity="0.3"/>`;
  s += text(660, 220, "gap → light escapes,", { size: 22, anchor: "middle", color: ORANGE }) + text(660, 246, "nothing reaches the other side", { size: 22, anchor: "middle", color: ORANGE });
  s += text(40, 340, "AFTER — one continuous path", { size: 26, weight: 700, color: NAVY });
  s += fiberH(60, 1300, 430, { coatTo: 420, coatFrom: 880, light: true });
  s += `<ellipse cx="660" cy="430" rx="40" ry="12" fill="none" stroke="${TEAL}" stroke-width="3" stroke-dasharray="6 4"/>`;
  s += line(660, 418, 660, 360, TEAL, 1.5) + text(670, 360, "splice point (cores lined up and joined)", { size: 22, color: TEAL });
  s += arrow(1150, 430, 1290, 430, ORANGE, 3);
  s += text(1300, 480, "light continues", { size: 22, color: ORANGE, anchor: "end" });
  s += text(60, 530, "Bare glass is shown without coating near the joint, as during splicing.", { size: 20, color: GREY, italic: true });
  return svg(W, H, s);
};

// ---------- Tool illustrations ----------
const toolBox = (body, label) => svg(500, 340, body + text(250, 330, label, { size: 22, color: GREY, anchor: "middle", italic: true }));
D.tool_splicer = () => {
  let s = "";
  s += rect(70, 150, 360, 140, { fill: "#3E4654", stroke: INK, sw: 2, r: 18 });
  s += `<path d="M110,150 L150,40 L390,40 L420,150 Z" fill="#4C5566" stroke="${INK}" stroke-width="2"/>`;
  s += rect(168, 55, 210, 80, { fill: "#16202E", stroke: "#8FA1BC", sw: 2, r: 4 });
  s += line(180, 82, 268, 82, "#9FD3D8", 6) + line(278, 82, 366, 82, "#9FD3D8", 6);
  s += line(180, 112, 268, 112, "#9FD3D8", 6) + line(278, 112, 366, 112, "#9FD3D8", 6);
  s += rect(110, 175, 200, 40, { fill: "#5B6576", stroke: "#2A303A", sw: 2, r: 6 });
  s += text(210, 202, "fiber clamps / V-groove", { size: 15, color: "#E6E9EE", anchor: "middle" });
  s += rect(330, 175, 80, 40, { fill: "#C8642B", stroke: "#2A303A", sw: 2, r: 6 });
  s += text(370, 202, "heater", { size: 16, color: WHITE, anchor: "middle" });
  for (let i = 0; i < 5; i++) s += circle(130 + i * 34, 255, 11, { fill: "#8C96A6", stroke: "#2A303A", sw: 1.5 });
  return toolBox(s, "Fusion splicer (illustration)");
};
D.tool_stripper = () => {
  let s = "";
  s += `<path d="M90,280 L210,150 L232,170 L120,295 Z" fill="${ORANGE}" stroke="${INK}" stroke-width="2"/>`;
  s += `<path d="M410,280 L290,150 L268,170 L380,295 Z" fill="${ORANGE}" stroke="${INK}" stroke-width="2"/>`;
  s += circle(250, 150, 14, { fill: "#9AA2AE", stroke: INK, sw: 2 });
  s += `<path d="M205,145 L230,40 L270,40 L295,145 Z" fill="#9AA2AE" stroke="${INK}" stroke-width="2"/>`;
  s += line(250, 40, 250, 135, INK, 2);
  [60, 88, 116].forEach((y, i) => { s += circle(250, y, 5 + i * 2, { fill: WHITE, stroke: INK, sw: 1.5 }); });
  s += line(262, 60, 345, 60, INK, 1) + text(350, 66, "3 notches:", { size: 18, color: INK });
  s += text(350, 88, "jacket / buffer", { size: 16, color: GREY }) + text(350, 108, "/ coating", { size: 16, color: GREY });
  return toolBox(s, "Fiber stripper (illustration)");
};
D.tool_cleaver = () => {
  let s = "";
  s += rect(90, 150, 320, 120, { fill: "#C7CDD6", stroke: INK, sw: 2, r: 10 });
  s += `<path d="M110,150 L130,80 L370,80 L390,150 Z" fill="#E4E7EC" stroke="${INK}" stroke-width="2"/>`;
  s += line(40, 200, 460, 200, "#6E7A88", 6) + line(250, 200, 460, 200, "#7FA5AB", 3);
  s += rect(140, 185, 70, 30, { fill: "#5B6576", stroke: INK, sw: 1.5, r: 4 });
  s += text(175, 240, "fiber holder", { size: 15, color: INK, anchor: "middle" });
  s += circle(300, 225, 18, { fill: "#8C96A6", stroke: INK, sw: 1.5 });
  s += text(300, 262, "blade wheel", { size: 15, color: INK, anchor: "middle" });
  s += rect(420, 160, 60, 80, { fill: "#E9E6DF", stroke: INK, sw: 1.5, r: 6 });
  s += text(450, 150, "scrap bin", { size: 15, color: INK, anchor: "middle" });
  return toolBox(s, "Precision cleaver (illustration)");
};
D.tool_cleaning = () => {
  let s = "";
  s += rect(70, 120, 110, 170, { fill: "#EEF3F6", stroke: INK, sw: 2, r: 14 });
  s += rect(95, 80, 60, 40, { fill: "#C9D2DC", stroke: INK, sw: 2, r: 6 });
  s += text(125, 210, "IPA", { size: 26, weight: 700, color: NAVY, anchor: "middle" }) + text(125, 236, "99%", { size: 18, color: GREY, anchor: "middle" });
  s += rect(220, 170, 200, 120, { fill: WHITE, stroke: INK, sw: 2, r: 6 });
  s += `<path d="M300,170 C310,130 340,130 345,170" fill="${WHITE}" stroke="${INK}" stroke-width="2"/>`;
  s += text(320, 240, "lint-free wipes", { size: 20, color: INK, anchor: "middle" });
  s += line(430, 110, 470, 290, "#9AA2AE", 5) + `<ellipse cx="430" cy="105" rx="9" ry="16" fill="${WHITE}" stroke="${INK}" stroke-width="2" transform="rotate(-13 430 105)"/>`;
  s += text(470, 95, "swab", { size: 16, color: GREY, anchor: "end" });
  return toolBox(s, "Cleaning kit (illustration)");
};
D.tool_sleeve = () => {
  let s = "";
  s += rect(70, 150, 360, 60, { fill: "#E7EEF2", stroke: INK, sw: 2, r: 28 });
  s += rect(90, 170, 320, 6, { fill: "#8C96A6", stroke: "none", sw: 0 });
  s += line(20, 192, 480, 192, "#7FA5AB", 3);
  s += line(240, 176, 240, 110, INK, 1) + text(240, 100, "steel strength rod", { size: 18, anchor: "middle" });
  s += line(330, 192, 330, 255, INK, 1) + text(330, 272, "fiber passes through", { size: 18, anchor: "middle" });
  s += arrow(70, 60, 430, 60, GREY, 2, "", true) + text(250, 50, "usually 40 mm or 60 mm long", { size: 18, color: GREY, anchor: "middle" });
  return toolBox(s, "Heat-shrink protection sleeve (illustration)");
};
D.tool_cable = () => {
  let s = "";
  s += `<path d="M40,250 C120,240 140,150 240,140" stroke="${JACKET}" stroke-width="44" fill="none" stroke-linecap="butt"/>`;
  s += `<path d="M240,140 L300,135" stroke="${KEV}" stroke-width="30" fill="none"/>`;
  s += `<path d="M300,135 L380,132" stroke="#E7E3D8" stroke-width="16" fill="none"/>`;
  s += `<path d="M380,132 L470,130" stroke="#7FA5AB" stroke-width="4" fill="none"/>`;
  s += text(130, 300, "jacket", { size: 17, anchor: "middle" }) + text(270, 100, "aramid", { size: 17, anchor: "middle" }) +
    text(340, 175, "buffer", { size: 17, anchor: "middle" }) + text(440, 110, "fiber", { size: 17, anchor: "middle" });
  return toolBox(s, "Optical fiber cable (illustration)");
};

// ---------- Procedure step drawings (800 x 470) ----------
const SW = 800, SH = 470;
D.step01_prepare = () => {
  let s = "";
  s += rect(40, 200, 720, 60, { fill: JACKET, stroke: INK, sw: 2, r: 30 });
  s += line(470, 180, 470, 285, ORANGE, 3, "8 6");
  s += text(470, 170, "mark", { size: 24, color: ORANGE, anchor: "middle", weight: 700 });
  s += arrow(470, 320, 760, 320, GREY, 2, "", true) + text(615, 350, "length to be stripped", { size: 22, color: GREY, anchor: "middle" });
  s += text(40, 410, "Check the fiber type (single-mode / multimode) and cut", { size: 23 }) + text(40, 440, "a clean, straight end. Measure and mark the strip length.", { size: 23 });
  return svg(SW, SH, s);
};
D.step02_jacket = () => {
  let s = "";
  s += rect(30, 190, 400, 70, { fill: JACKET, stroke: INK, sw: 2, r: 12 });
  for (let i = 0; i < 6; i++) s += `<path d="M430,${200 + i * 10} C500,${190 + i * 12} 540,${205 + i * 8} 600,${195 + i * 12}" stroke="${KEV}" stroke-width="3" fill="none"/>`;
  s += rect(430, 212, 340, 26, { fill: "#E7E3D8", stroke: "#B9B3A3", sw: 1.5, r: 6 });
  s += rect(560, 120, 190, 50, { fill: "none", stroke: GREY, sw: 2, r: 8, dash: "6 5" });
  s += text(655, 152, "cut jacket off", { size: 22, color: GREY, anchor: "middle" });
  s += arrow(655, 172, 655, 205, GREY, 2);
  s += text(230, 300, "outer jacket", { size: 21, anchor: "middle", color: INK });
  s += text(520, 300, "aramid yarn", { size: 21, anchor: "middle", color: "#9C7F1A" });
  s += text(690, 280, "buffered fiber", { size: 21, anchor: "middle", color: INK });
  s += text(30, 400, "Score the jacket with a jacket stripper and pull it off.", { size: 23 }) + text(30, 430, "Trim the aramid yarn with sharp scissors (not the cleaver).", { size: 23 });
  return svg(SW, SH, s);
};
D.step03_sleeve = () => {
  let s = "";
  s += fiberH(30, 770, 200, { coat: 30, glass: 14 });
  s += rect(140, 170, 220, 60, { fill: "#E7EEF2", stroke: INK, sw: 2, r: 28 });
  s += rect(155, 186, 190, 5, { fill: "#8C96A6", stroke: "none", sw: 0 });
  s += arrow(380, 130, 180, 130, ORANGE, 3);
  s += text(280, 115, "slide it well away from the end", { size: 22, color: ORANGE, anchor: "middle" });
  s += text(250, 275, "protection sleeve", { size: 22, anchor: "middle" });
  s += text(30, 390, "Put the sleeve on ONE fiber now. Once the fibers are", { size: 23 }) + text(30, 420, "joined, there is no way to add it.", { size: 23, weight: 700, color: NAVY });
  return svg(SW, SH, s);
};
D.step04_strip = () => {
  let s = "";
  s += fiberH(30, 760, 210, { coatTo: 430 });
  s += `<path d="M380,110 L430,175 L455,175 L470,110 Z" fill="#9AA2AE" stroke="${INK}" stroke-width="2"/>`;
  s += `<path d="M380,310 L430,245 L455,245 L470,310 Z" fill="#9AA2AE" stroke="${INK}" stroke-width="2"/>`;
  s += arrow(520, 120, 720, 120, ORANGE, 3) + text(620, 105, "pull straight", { size: 22, color: ORANGE, anchor: "middle" });
  s += line(600, 217, 600, 270, INK, 1) + text(600, 292, "bare glass (125 µm)", { size: 21, anchor: "middle" });
  s += line(200, 225, 200, 270, INK, 1) + text(200, 292, "coating (250 µm)", { size: 21, anchor: "middle" });
  s += text(30, 380, "Use the smallest notch of the stripper. Hold it square", { size: 23 }) + text(30, 410, "to the fiber and pull in one smooth stroke.", { size: 23 }) +
    text(30, 440, "Strip length: follow the cleaver/splicer guide (about 3–4 cm).", { size: 21, color: GREY });
  return svg(SW, SH, s);
};
D.step05_clean = () => {
  let s = "";
  s += fiberH(30, 760, 210, { coatTo: 300 });
  s += `<path d="M420,150 C460,140 520,140 560,150 L560,270 C520,280 460,280 420,270 Z" fill="${WHITE}" stroke="${INK}" stroke-width="2"/>`;
  s += text(490, 300, "wipe + IPA", { size: 22, anchor: "middle" });
  s += arrow(470, 110, 740, 110, TEAL, 3) + text(605, 95, "wipe once, toward the tip", { size: 22, color: TEAL, anchor: "middle" });
  s += text(30, 390, "Wipe the bare glass with a lint-free wipe and 99% isopropyl", { size: 23 }) + text(30, 420, "alcohol. Do not touch the glass again after cleaning.", { size: 23 });
  return svg(SW, SH, s);
};
D.step06_cleave = () => {
  let s = "";
  // good vs bad ends
  s += text(30, 40, "Fiber in the cleaver", { size: 23, weight: 700, color: NAVY });
  s += rect(30, 70, 360, 150, { fill: "#E4E7EC", stroke: INK, sw: 2, r: 8 });
  s += fiberH(30, 390, 145, { coatTo: 150 });
  s += `<path d="M300,175 L315,152 L330,175 Z" fill="#8C96A6" stroke="${INK}" stroke-width="1.5"/>`;
  s += line(315, 120, 315, 175, ORANGE, 2, "5 4") + text(210, 100, "blade scores, then fiber breaks", { size: 19, color: ORANGE, anchor: "middle" });
  s += text(430, 40, "What the end should look like", { size: 23, weight: 700, color: NAVY });
  const end = (y, pth, lbl, c) => fiberH(430, 620, y, { glass: 40, core: 10 }).replace(/<rect x="430"[^>]*fill="#D6E8EA"[^>]*\/>/, "") +
    `<path d="M430,${y - 20} L${pth}" fill="${GLASS}" stroke="#7FA5AB" stroke-width="1.5"/>` + text(640, y + 7, lbl, { size: 21, color: c, weight: 700 });
  s += fiberH(430, 620, 110, { glass: 40, core: 10 }) + text(640, 117, "flat, ~90° ✓", { size: 21, color: TEAL, weight: 700 });
  s += `<polygon points="430,160 640,160 600,200 430,200" fill="${GLASS}" stroke="#7FA5AB" stroke-width="1.5"/>` + rect(430, 176, 190, 10, { fill: CORE, stroke: "none", sw: 0 }) + text(660, 187, "angled ✗", { size: 21, color: ORANGE, weight: 700 });
  s += `<polygon points="430,230 610,230 610,245 625,250 610,256 610,270 430,270" fill="${GLASS}" stroke="#7FA5AB" stroke-width="1.5"/>` + rect(430, 246, 180, 10, { fill: CORE, stroke: "none", sw: 0 }) + text(640, 257, "lip / chip ✗", { size: 21, color: ORANGE, weight: 700 });
  return svg(SW, SH, s);
};
D.step07_place = () => {
  let s = "";
  s += text(30, 40, "Top view inside the splicer", { size: 22, color: GREY, italic: true });
  s += rect(60, 70, 680, 280, { fill: "#E9E6DF", stroke: INK, sw: 2, r: 12 });
  s += rect(120, 185, 200, 50, { fill: "#B8BEC8", stroke: INK, sw: 1.5, r: 4 }) + rect(480, 185, 200, 50, { fill: "#B8BEC8", stroke: INK, sw: 1.5, r: 4 });
  s += text(220, 265, "V-groove + clamp", { size: 19, anchor: "middle" }) + text(580, 265, "V-groove + clamp", { size: 19, anchor: "middle" });
  s += fiberH(20, 385, 210, { coatTo: 230, glass: 12, coat: 26 }) + fiberH(415, 780, 210, { coatFrom: 570, glass: 12, coat: 26 });
  s += `<path d="M400,95 L400,165" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="M400,255 L400,325" stroke="${INK}" stroke-width="10" stroke-linecap="round"/>`;
  s += text(415, 120, "electrodes", { size: 19, color: GREY });
  s += text(30, 400, "Lay each fiber in its V-groove with the tip just short of the", { size: 23 }) + text(30, 430, "electrodes. Close the clamps and the wind cover gently.", { size: 23 });
  return svg(SW, SH, s);
};
// splicer screen for align (dark style)
D.step08_align = () => {
  const W = 800, H = 470; let s = "";
  s += rect(20, 20, 760, 380, { fill: "#101822", stroke: "#56637A", sw: 3, r: 12 });
  const view = (x, lbl, off) => {
    let v = rect(x, 60, 340, 280, { fill: "#16222F", stroke: "#3A4759", sw: 1.5 });
    v += text(x + 12, 88, lbl, { size: 20, color: "#9AA6B6" });
    v += rect(x, 165 - 30, 160, 60, { fill: "#4E6A78", stroke: "none", sw: 0 }) + rect(x, 165 - 6, 160, 12, { fill: "#C6E3E8", stroke: "none", sw: 0 });
    v += rect(x + 180, 165 - 30 + off, 160, 60, { fill: "#4E6A78", stroke: "none", sw: 0 }) + rect(x + 180, 165 - 6 + off, 160, 12, { fill: "#C6E3E8", stroke: "none", sw: 0 });
    return v;
  };
  s += view(40, "X view", 0) + view(420, "Y view", 0);
  s += text(400, 380, "Gap set, ends checked, cores lined up in both views", { size: 21, color: "#9FD3D8", anchor: "middle" });
  s += line(210, 230, 210, 290, "#E8A06A", 1.5) + text(210, 312, "gap", { size: 18, color: "#E8A06A", anchor: "middle" });
  s += text(400, 445, "Camera views on the splicer screen (illustration)", { size: 20, color: GREY, anchor: "middle", italic: true });
  return svg(W, H, s);
};
D.step09_arc = () => {
  const W = 800, H = 470; let s = "";
  s += rect(20, 20, 760, 380, { fill: "#101822", stroke: "#56637A", sw: 3, r: 12 });
  s += rect(40, 180, 340, 60, { fill: "#4E6A78", stroke: "none", sw: 0 }) + rect(420, 180, 340, 60, { fill: "#4E6A78", stroke: "none", sw: 0 });
  s += `<ellipse cx="400" cy="210" rx="60" ry="55" fill="#F2A65A" opacity="0.35"/><ellipse cx="400" cy="210" rx="30" ry="34" fill="#FFD9A8" opacity="0.8"/>`;
  s += rect(40, 204, 720, 12, { fill: "#C6E3E8", stroke: "none", sw: 0 });
  s += `<path d="M400,50 L400,120" stroke="#8C96A6" stroke-width="12" stroke-linecap="round"/><path d="M400,300 L400,370" stroke="#8C96A6" stroke-width="12" stroke-linecap="round"/>`;
  s += `<path d="M400,125 L390,145 L408,160 L392,178 L404,190" stroke="#FFD9A8" stroke-width="4" fill="none"/>`;
  s += `<path d="M404,230 L392,245 L408,262 L392,280 L400,296" stroke="#FFD9A8" stroke-width="4" fill="none"/>`;
  s += text(60, 80, "1. short cleaning arc", { size: 21, color: "#C9D2DC" }) + text(60, 108, "2. fibers pushed together", { size: 21, color: "#C9D2DC" }) + text(60, 136, "3. main arc fuses the glass", { size: 21, color: "#C9D2DC" });
  s += text(400, 445, "Arc fusion (illustration)", { size: 20, color: GREY, anchor: "middle", italic: true });
  return svg(W, H, s);
};
D.step10_inspect = () => {
  const W = 800, H = 470; let s = "";
  s += rect(20, 20, 760, 380, { fill: "#101822", stroke: "#56637A", sw: 3, r: 12 });
  s += rect(40, 170, 720, 60, { fill: "#4E6A78", stroke: "none", sw: 0 }) + rect(40, 194, 720, 12, { fill: "#C6E3E8", stroke: "none", sw: 0 });
  s += rect(470, 50, 280, 90, { fill: "#1C2A3A", stroke: "#56637A", sw: 1.5, r: 6 });
  s += text(490, 85, "Est. loss:  _ . _ _  dB", { size: 24, color: "#FFFFFF" }) + text(490, 120, "(splicer estimate)", { size: 18, color: "#9AA6B6" });
  s += text(60, 290, "Look for: bubbles, thin neck, fat joint, offset cores", { size: 21, color: "#E8A06A" });
  s += text(60, 320, "If the joint looks bad → break it and splice again", { size: 21, color: "#C9D2DC" });
  s += text(400, 445, "Inspection screen (illustration — value left blank)", { size: 20, color: GREY, anchor: "middle", italic: true });
  return svg(W, H, s);
};
D.step11_sleeve_move = () => {
  let s = "";
  s += fiberH(30, 770, 200, { coatTo: 300, coatFrom: 500 });
  s += `<ellipse cx="400" cy="200" rx="24" ry="10" fill="none" stroke="${TEAL}" stroke-width="2.5" stroke-dasharray="5 4"/>`;
  s += rect(80, 170, 200, 60, { fill: "#E7EEF2", stroke: GREY, sw: 2, r: 28, dash: "7 5" });
  s += rect(290, 170, 220, 60, { fill: "#E7EEF2", stroke: INK, sw: 2.5, r: 28 }) + rect(305, 186, 190, 5, { fill: "#8C96A6", stroke: "none", sw: 0 });
  s += arrow(180, 130, 380, 130, ORANGE, 3) + text(280, 115, "slide over the joint", { size: 22, color: ORANGE, anchor: "middle" });
  s += text(400, 275, "joint centred, coating covered on both sides", { size: 21, anchor: "middle" });
  s += text(30, 390, "Lift the fiber out carefully, keeping it straight with light", { size: 23 }) + text(30, 420, "tension. Centre the sleeve over the bare glass.", { size: 23 });
  return svg(SW, SH, s);
};
D.step12_heat = () => {
  let s = "";
  s += rect(160, 130, 480, 150, { fill: "#5B6576", stroke: INK, sw: 2, r: 12 });
  s += rect(200, 175, 400, 60, { fill: "#2A303A", stroke: INK, sw: 1.5, r: 8 });
  s += line(20, 205, 780, 205, "#7FA5AB", 3);
  s += rect(250, 188, 300, 34, { fill: "#C9D2DC", stroke: INK, sw: 1.5, r: 16 });
  for (let i = 0; i < 4; i++) s += `<path d="M${290 + i * 70},160 C${280 + i * 70},145 ${300 + i * 70},135 ${290 + i * 70},115" stroke="${ORANGE}" stroke-width="3" fill="none"/>`;
  s += text(400, 320, "heater oven", { size: 22, anchor: "middle" });
  s += text(30, 390, "Place the sleeve in the heater and start the heat cycle.", { size: 23 }) + text(30, 420, "Let it cool before handling — the sleeve is hot.", { size: 23, color: ORANGE, weight: 700 });
  return svg(SW, SH, s);
};
D.step13_tray = () => {
  let s = "";
  s += rect(60, 40, 680, 300, { fill: "#E9E6DF", stroke: INK, sw: 2, r: 26 });
  s += `<ellipse cx="400" cy="190" rx="290" ry="110" fill="none" stroke="#7FA5AB" stroke-width="4"/>`;
  s += `<ellipse cx="400" cy="190" rx="270" ry="95" fill="none" stroke="#7FA5AB" stroke-width="4"/>`;
  for (let i = 0; i < 4; i++) s += rect(300, 150 + i * 22, 200, 14, { fill: i === 1 ? "#C9D2DC" : "#D8D4CB", stroke: GREY, sw: 1, r: 7 });
  s += text(400, 136, "sleeve holder", { size: 20, anchor: "middle" });
  s += line(680, 190, 760, 120, INK, 1) + text(760, 110, "loose loops", { size: 20, anchor: "end" });
  s += text(30, 400, "Press the sleeve into the holder. Coil spare fiber in large", { size: 23 }) + text(30, 430, "loops so it is never bent sharply.", { size: 23 });
  return svg(SW, SH, s);
};
D.step14_test = () => {
  let s = "";
  s += rect(30, 140, 170, 120, { fill: "#3E4654", stroke: INK, sw: 2, r: 10 }) + text(115, 210, "OTDR", { size: 26, weight: 700, color: WHITE, anchor: "middle" });
  s += line(200, 200, 760, 200, "#7FA5AB", 4) + circle(480, 200, 9, { fill: TEAL, stroke: "none" });
  s += text(480, 180, "our splice", { size: 21, color: TEAL, anchor: "middle" });
  // mini trace (illustrative)
  s += `<polyline points="230,290 470,312 480,325 740,350" fill="none" stroke="${NAVY}" stroke-width="3"/>`;
  s += text(230, 280, "example trace: small step at the splice", { size: 19, color: GREY, italic: true });
  s += text(30, 420, "Check the finished link with an OTDR (or light source", { size: 23 }) + text(30, 450, "+ power meter). Record the real measured loss.", { size: 23 });
  return svg(SW, SH, s);
};

// ---------- Mistake icons (300 x 180) ----------
const MW = 300, MH = 170;
D.err_dirt = () => svg(MW, MH, fiberH(10, 230, 85, { glass: 30, core: 8 }) + [[230, 70], [228, 98], [235, 84], [222, 76]].map(([x, y]) => circle(x, y, 5, { fill: "#6B5A3E", stroke: "none" })).join("") + text(150, 150, "dust on the end face", { size: 20, color: GREY, anchor: "middle" }));
D.err_cleave = () => svg(MW, MH, `<polygon points="10,65 260,65 220,105 10,105" fill="${GLASS}" stroke="#7FA5AB" stroke-width="1.5"/>` + rect(10, 81, 230, 8, { fill: CORE, stroke: "none", sw: 0 }) + text(150, 150, "angled end face", { size: 20, color: GREY, anchor: "middle" }));
D.err_align = () => svg(MW, MH, rect(10, 55, 135, 40, { fill: GLASS, stroke: "#7FA5AB", sw: 1.5 }) + rect(10, 71, 135, 8, { fill: CORE, stroke: "none", sw: 0 }) +
  rect(155, 70, 135, 40, { fill: GLASS, stroke: "#7FA5AB", sw: 1.5 }) + rect(155, 86, 135, 8, { fill: CORE, stroke: "none", sw: 0 }) + text(150, 150, "cores offset", { size: 20, color: GREY, anchor: "middle" }));
D.err_bend = () => svg(MW, MH, `<path d="M10,120 C120,120 150,20 190,60 C220,90 200,125 290,120" fill="none" stroke="#7FA5AB" stroke-width="8"/>` +
  arrow(170, 40, 200, 10, ORANGE, 2.5) + arrow(160, 45, 145, 12, ORANGE, 2.5) + text(150, 158, "light leaks at a tight bend", { size: 20, color: GREY, anchor: "middle" }));
D.err_shard = () => svg(MW, MH, `<path d="M40,90 L130,70" stroke="#7FA5AB" stroke-width="4"/><path d="M60,110 L115,118" stroke="#7FA5AB" stroke-width="4"/>` +
  rect(180, 40, 90, 85, { fill: "#E9E6DF", stroke: INK, sw: 2, r: 6 }) + text(225, 90, "bin", { size: 22, anchor: "middle", weight: 700 }) + arrow(135, 85, 175, 85, ORANGE, 2.5) +
  text(150, 155, "glass slivers → sealed bin", { size: 20, color: GREY, anchor: "middle" }));

// ---------- OTDR principle (dark) ----------
D.otdr_principle = () => {
  const W = 1600, H = 640; let s = "";
  const L = "#E8ECF2", M = "#9AA6B6";
  s += rect(30, 90, 520, 400, { fill: "#202B3C", stroke: "#56637A", sw: 2, r: 14 });
  s += text(50, 75, "OTDR (inside view, simplified)", { size: 22, color: M, italic: true });
  const blk = (x, y, w, h, t, c = "#2E3B50") => rect(x, y, w, h, { fill: c, stroke: "#8FA1BC", sw: 1.5, r: 8 }) + text(x + w / 2, y + h / 2 + 8, t, { size: 22, color: L, anchor: "middle" });
  s += blk(60, 120, 180, 70, "Pulse laser");
  s += blk(320, 230, 180, 80, "Coupler");
  s += blk(60, 340, 180, 70, "Photodetector");
  s += blk(60, 430 - 5, 450, 50, "Timer + processor → graph", "#33415A");
  s += `<path d="M240,155 L410,155 L410,230" stroke="${ORANGE}" stroke-width="3" fill="none" marker-end="url(#arORANGE)"/>`;
  s += `<path d="M380,310 L380,375 L240,375" stroke="#7FD0D6" stroke-width="3" fill="none" marker-end="url(#arTEAL)"/>`;
  s += line(150, 410, 150, 425, M, 2);
  s += rect(550, 255, 30, 30, { fill: "#8FA1BC", stroke: "none" }) + text(565, 330, "port", { size: 18, color: M, anchor: "middle" });
  s += line(500, 270, 550, 270, "#8FA1BC", 3);
  // fiber
  s += line(580, 270, 1540, 270, "#7FA5AB", 10);
  s += circle(1100, 270, 10, { fill: "#C9D2DC", stroke: "none" }) + text(1100, 245, "connector / splice", { size: 20, color: M, anchor: "middle" });
  s += rect(1530, 250, 20, 40, { fill: "#C9D2DC", stroke: "none" }) + text(1540, 330, "fiber end", { size: 20, color: M, anchor: "middle" });
  // forward pulse
  s += rect(800, 230, 70, 18, { fill: ORANGE, stroke: "none", r: 4 });
  s += arrow(880, 225, 1010, 225, ORANGE, 3) + text(835, 210, "① light pulse goes out", { size: 22, color: "#F2B48A", anchor: "middle", weight: 700 });
  // backscatter
  for (let i = 0; i < 6; i++) s += arrow(700 + i * 120, 300, 640 + i * 120, 300, "#2E7D7A", 2.5).replace(/stroke="#2E7D7A"/, 'stroke="#7FD0D6"');
  s += text(830, 345, "② Rayleigh backscattering: a tiny part of the light is", { size: 21, color: "#7FD0D6" });
  s += text(830, 372, "scattered back from every point along the fiber", { size: 21, color: "#7FD0D6" });
  s += `<path d="M1540,310 C1500,420 1300,420 1280,420" stroke="#F2B48A" stroke-width="3" fill="none" marker-end="url(#arORANGE)"/>`;
  s += text(1100, 455, "③ Fresnel reflection: a strong echo where the glass", { size: 21, color: "#F2B48A" });
  s += text(1100, 482, "meets air or a gap (connector, break, open end)", { size: 21, color: "#F2B48A" });
  s += text(30, 570, "④ Time of the echo → distance:", { size: 25, color: L, weight: 700 });
  s += text(400, 570, "d = (c × t) / (2 n)", { size: 30, color: "#F2B48A", weight: 700 });
  s += text(30, 608, "c = speed of light in vacuum, t = round-trip time, n = group index of the fiber (≈ 1.47). Divide by 2 because light goes out and back.", { size: 21, color: M });
  return svg(W, H, s);
};

// ---------- OTDR connection ----------
D.otdr_connection = () => {
  const W = 1600, H = 420; let s = "";
  s += rect(20, 120, 200, 140, { fill: "#3E4654", stroke: INK, sw: 2, r: 12 }) + text(120, 200, "OTDR", { size: 30, weight: 700, color: WHITE, anchor: "middle" });
  const spool = (cx, r, label, sub, c, dash) => {
    let v = circle(cx, 190, r, { fill: "none", stroke: c, sw: 6 }) + circle(cx, 190, r - 14, { fill: "none", stroke: c, sw: 6 }) + circle(cx, 190, r - 28, { fill: "none", stroke: c, sw: 6 });
    if (dash) v = `<g opacity="0.55">${v}</g>`;
    return v + text(cx, 190 + r + 40, label, { size: 24, weight: 700, color: NAVY, anchor: "middle" }) + text(cx, 190 + r + 70, sub, { size: 20, color: GREY, anchor: "middle" });
  };
  s += line(220, 190, 360, 190, "#7FA5AB", 5);
  s += spool(440, 70, "Launch cable", "hides the dead zone", TEAL);
  s += line(510, 190, 680, 190, "#7FA5AB", 5) + rect(585, 176, 18, 28, { fill: INK, stroke: "none" });
  s += spool(800, 110, "Fiber under test", "the link we measure", NAVY);
  s += line(910, 190, 1240, 190, "#7FA5AB", 5) + rect(1110, 176, 18, 28, { fill: INK, stroke: "none" });
  s += spool(1320, 70, "Receive cable", "(optional) shows the far-end connector", TEAL, true);
  s += text(594, 160, "C1", { size: 20, anchor: "middle", weight: 700 }) + text(1119, 160, "C2", { size: 20, anchor: "middle", weight: 700 });
  s += text(20, 40, "Connection order", { size: 24, color: GREY, italic: true });
  return svg(W, H, s);
};

// ---------- trace helper ----------
// segs: [{x:km, y:dB}] polyline points in data units; spikes as extra points
function traceSvg(W, H, pts, { xmax, ymin, ymax, pad = [70, 20, 30, 50], color = NAVY, grid = true, axes = true, xl = "Distance (km)", yl = "Level (dB)", sw = 3 } = {}) {
  const [l, t, r, b] = pad;
  const X = x => l + (x / xmax) * (W - l - r), Y = y => t + (1 - (y - ymin) / (ymax - ymin)) * (H - t - b);
  let s = "";
  if (axes) {
    s += line(l, t, l, H - b, INK, 2) + line(l, H - b, W - r, H - b, INK, 2);
    if (xl) s += text((l + W - r) / 2, H - 8, xl, { size: 20, color: GREY, anchor: "middle" });
    if (yl) s += `<text x="22" y="${(t + H - b) / 2}" font-family="${FONT}" font-size="20" fill="${GREY}" text-anchor="middle" transform="rotate(-90 22 ${(t + H - b) / 2})">${yl}</text>`;
  }
  s += `<polyline points="${pts.map(p => `${X(p[0]).toFixed(1)},${Y(p[1]).toFixed(1)}`).join(" ")}" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linejoin="round"/>`;
  return { s, X, Y };
}
function noiseTail(x0, x1, base, amp, n = 60) {
  const p = []; let seed = 7;
  for (let i = 0; i <= n; i++) { seed = (seed * 9301 + 49297) % 233280; p.push([x0 + (x1 - x0) * i / n, base + (seed / 233280 - 0.5) * amp]); }
  return p;
}

// Event examples (each 520 x 300)
const EW = 520, EH = 290;
const evOpts = { xmax: 10, ymin: 0, ymax: 30, pad: [40, 20, 15, 40], xl: "distance →", yl: "dB" };
D.ev_splice = () => { const p = [[0, 26], [5, 24.5], [5.05, 23.6], [10, 22.1]]; const { s, X, Y } = traceSvg(EW, EH, p, evOpts); return svg(EW, EH, s + text(X(5) + 10, Y(25.5) - 10, "small drop, no spike", { size: 20, color: ORANGE })); };
D.ev_connector = () => { const p = [[0, 26], [5, 24.5], [5.02, 29], [5.15, 23.6], [10, 22.1]]; const { s, X, Y } = traceSvg(EW, EH, p, evOpts); return svg(EW, EH, s + text(X(5.4), Y(28.5), "spike + drop", { size: 20, color: ORANGE })); };
D.ev_bend = () => { const p = [[0, 26], [5, 24.5], [5.2, 22], [10, 20.5]]; const { s, X, Y } = traceSvg(EW, EH, p, evOpts); return svg(EW, EH, s + text(X(5.4), Y(25), "drop, larger at 1550 nm", { size: 20, color: ORANGE })); };
D.ev_break = () => { const p = [[0, 26], [4, 24.8], [4.02, 28], [4.1, 6], ...noiseTail(4.1, 10, 5, 3)]; const { s, X, Y } = traceSvg(EW, EH, p, evOpts); return svg(EW, EH, s + text(X(4.4), Y(24), "trace ends early", { size: 20, color: ORANGE }) + text(X(4.4), Y(24) + 24, "→ signal falls to noise", { size: 20, color: ORANGE })); };
D.ev_end = () => { const p = [[0, 26], [8, 23.6], [8.02, 28.5], [8.1, 6], ...noiseTail(8.1, 10, 5, 3, 20)]; const { s, X, Y } = traceSvg(EW, EH, p, evOpts); return svg(EW, EH, s + text(X(1), Y(18), "reflection at the expected", { size: 20, color: ORANGE }) + text(X(1), Y(18) + 24, "length, then noise", { size: 20, color: ORANGE })); };

// Reading a trace (generic, labeled example) for the procedure slide
D.trace_cursors = () => {
  const W = 1000, H = 520;
  const p = [[0, 27], [0.05, 29.5], [0.3, 25.5], [4.8, 23.0], [4.82, 27.5], [4.9, 6], ...noiseTail(4.9, 6, 5, 3, 30)];
  const o = { xmax: 6, ymin: 0, ymax: 32, pad: [80, 30, 30, 70] };
  const { s, X, Y } = traceSvg(W, H, p, o);
  let t = s;
  t += line(X(0.3), Y(31), X(0.3), Y(0), TEAL, 2.5, "8 6") + text(X(0.3) + 8, Y(30.5), "A", { size: 28, color: TEAL, weight: 700 });
  t += line(X(4.8), Y(31), X(4.8), Y(0), TEAL, 2.5, "8 6") + text(X(4.8) - 30, Y(30.5), "B", { size: 28, color: TEAL, weight: 700 });
  t += arrow(X(0.3), Y(14), X(4.8), Y(14), TEAL, 2.5, "", true) + text(X(2.55), Y(14) - 12, "section length (B − A)", { size: 22, color: TEAL, anchor: "middle" });
  t += line(X(4.8), Y(25.5), X(5.5), Y(25.5), ORANGE, 1.5, "4 4") + arrow(X(5.4), Y(25.5), X(5.4), Y(23.0), ORANGE, 2.5, "", true);
  t += text(X(5.48), Y(24.6), "loss A→B", { size: 21, color: ORANGE });
  t += text(X(0.5), Y(29.5), "launch end", { size: 19, color: GREY }) + text(X(4.6), Y(21), "far end", { size: 19, color: GREY, anchor: "end" });
  t += text(W - 30, 30, "EXAMPLE — not our trace", { size: 22, color: ORANGE, anchor: "end", weight: 700 });
  return svg(W, H, t);
};

// Link loss diagram
D.link_loss = () => {
  const W = 1600, H = 560; let s = "";
  const L = "#E8ECF2", M = "#C3CCD8";
  s += rect(30, 80, 180, 110, { fill: "#2E3B50", stroke: "#8FA1BC", sw: 2, r: 10 }) + text(120, 128, "Light", { size: 24, color: L, anchor: "middle" }) + text(120, 158, "source", { size: 24, color: L, anchor: "middle" });
  s += rect(1390, 80, 180, 110, { fill: "#2E3B50", stroke: "#8FA1BC", sw: 2, r: 10 }) + text(1480, 128, "Power", { size: 24, color: L, anchor: "middle" }) + text(1480, 158, "meter", { size: 24, color: L, anchor: "middle" });
  s += line(210, 135, 1390, 135, "#7FA5AB", 6);
  const ev = (x, t) => rect(x - 9, 118, 18, 34, { fill: "#C9D2DC", stroke: "none" }) + text(x, 100, t, { size: 26, color: M, anchor: "middle" });
  s += ev(330, "connector") + ev(800, "splice") + ev(1270, "connector");
  s += text(560, 175, "fiber", { size: 26, color: M, anchor: "middle" }) + text(1040, 175, "fiber", { size: 26, color: M, anchor: "middle" });
  s += text(120, 230, "P_in", { size: 26, color: "#F2B48A", anchor: "middle", weight: 700 }) + text(1480, 230, "P_out", { size: 26, color: "#F2B48A", anchor: "middle", weight: 700 });
  // staircase power level
  const y0 = 280, Yd = v => y0 + v * 70; // v in dB loss
  const pts = [[210, 0], [325, 0.08], [335, 0.5], [795, 1.0], [805, 1.1], [1265, 1.6], [1275, 2.0], [1390, 2.05]];
  s += line(210, y0 - 10, 210, 450, M, 1.5) + text(200, y0 + 5, "high", { size: 24, color: M, anchor: "end" }) + text(200, 440, "low", { size: 24, color: M, anchor: "end" });
  s += `<polyline points="${pts.map(p => `${p[0]},${Yd(p[1])}`).join(" ")}" fill="none" stroke="#F2B48A" stroke-width="4"/>`;
  s += text(230, 470, "optical power along the link (sketch)", { size: 26, color: M, italic: true });
  s += text(560, Yd(0.75) - 20, "slope = fiber attenuation (dB/km)", { size: 27, color: "#7FD0D6", anchor: "middle" });
  s += text(800, Yd(1.1) + 40, "steps = event losses (dB)", { size: 27, color: "#7FD0D6", anchor: "middle" });
  s += arrow(1440, Yd(0), 1440, Yd(2.05), "#FFFFFF", 2.5, "", true) + text(1460, Yd(1.05), "total", { size: 27, color: L }) + text(1460, Yd(1.05) + 26, "link loss", { size: 27, color: L });
  s += line(1390, Yd(0), 1450, Yd(0), M, 1, "4 4") + line(210, Yd(0), 1450, Yd(0), M, 1, "4 4");
  return svg(W, H, s);
};

// ---------- render ----------
(async () => {
  for (const [name, fn] of Object.entries(D)) {
    let code = fn();
    if (name.startsWith("tool_")) code = code.replace(/height="340" viewBox="0 0 500 340"/, `height="312" viewBox="0 0 500 312"`);
    if (name.startsWith("step")) { // instructions live in the slide as editable text; crop drawing only
      const h = ["step08_align", "step09_arc", "step10_inspect"].includes(name) ? 410 : 362;
      code = code.replace(/height="470" viewBox="0 0 800 470"/, `height="${h}" viewBox="0 0 800 ${h}"`);
    }
    fs.writeFileSync(path.join(OUT, name + ".svg"), code);
    if (["otdr_principle", "link_loss", "title_cable"].includes(name)) { // dark-background copy for the printed report
      const bgc = code.replace(/(<\/defs>)/, '$1<rect width="100%" height="100%" fill="#1C2433"/>');
      await sharp(Buffer.from(bgc), { density: 192 }).png().toFile(path.join(OUT, name + "_bg.png"));
    }
    await sharp(Buffer.from(code), { density: 192 }).png().toFile(path.join(OUT, name + ".png"));
  }
  console.log("rendered", Object.keys(D).length, "diagrams");
})();
