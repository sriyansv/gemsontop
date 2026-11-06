"""Builds Fiber_Optic_Lab_Report.pdf (reportlab).
Usage: python3 build_report.py   (run diagrams.js first)
Lab photos are read from ../photos/otdr_settings.* and ../photos/otdr_result.*
"""
import os, glob
from PIL import Image, ImageOps
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm, mm
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_CENTER
from reportlab.platypus import (BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer, Table, TableStyle,
                                Image as RLImage, PageBreak, KeepTogether, ListFlowable, ListItem, CondPageBreak)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
ASSETS = os.path.join(ROOT, "Presentation_Assets")
OUT = os.path.join(ROOT, "Fiber_Optic_Lab_Report.pdf")

FD = "/usr/share/fonts/truetype/crosextra/"
for name, f in [("Body", "Carlito-Regular.ttf"), ("Body-B", "Carlito-Bold.ttf"), ("Body-I", "Carlito-Italic.ttf"), ("Body-BI", "Carlito-BoldItalic.ttf"),
                ("Head", "Caladea-Regular.ttf"), ("Head-B", "Caladea-Bold.ttf"), ("Head-I", "Caladea-Italic.ttf"), ("Head-BI", "Caladea-BoldItalic.ttf")]:
    pdfmetrics.registerFont(TTFont(name, FD + f))
pdfmetrics.registerFontFamily("Body", normal="Body", bold="Body-B", italic="Body-I", boldItalic="Body-BI")
pdfmetrics.registerFontFamily("Head", normal="Head", bold="Head-B", italic="Head-I", boldItalic="Head-BI")

NAVY = colors.HexColor("#1F3352"); ORANGE = colors.HexColor("#B9561F"); TEAL = colors.HexColor("#2E7D7A")
INK = colors.HexColor("#2B2B2B"); GREY = colors.HexColor("#6B7079"); RULE = colors.HexColor("#D3D0C8"); SHADE = colors.HexColor("#F0EEE9")

st = {
    "body": ParagraphStyle("body", fontName="Body", fontSize=11, leading=15, textColor=INK, spaceAfter=5),
    "small": ParagraphStyle("small", fontName="Body-I", fontSize=9, leading=12, textColor=GREY, spaceAfter=6),
    "cap": ParagraphStyle("cap", fontName="Body-I", fontSize=9, leading=12, textColor=GREY, alignment=TA_CENTER, spaceAfter=8),
    "h1": ParagraphStyle("h1", fontName="Head-B", fontSize=20, leading=25, textColor=NAVY, spaceAfter=4),
    "kicker": ParagraphStyle("kicker", fontName="Body-B", fontSize=9.5, leading=12, textColor=ORANGE, spaceAfter=2),
    "h2": ParagraphStyle("h2", fontName="Head-B", fontSize=13.5, leading=17, textColor=NAVY, spaceBefore=9, spaceAfter=4),
    "h3": ParagraphStyle("h3", fontName="Body-B", fontSize=11, leading=14, textColor=INK, spaceBefore=4, spaceAfter=2),
    "cell": ParagraphStyle("cell", fontName="Body", fontSize=10, leading=12.5, textColor=INK),
    "cellb": ParagraphStyle("cellb", fontName="Body-B", fontSize=10, leading=12.5, textColor=INK),
    "cellh": ParagraphStyle("cellh", fontName="Body-B", fontSize=10, leading=12.5, textColor=colors.white),
    "eq": ParagraphStyle("eq", fontName="Head", fontSize=13, leading=18, textColor=NAVY, alignment=TA_CENTER, spaceBefore=4, spaceAfter=4),
    "note": ParagraphStyle("note", fontName="Body", fontSize=10.5, leading=14, textColor=INK),
}
W = A4[0] - 4.2 * cm


def P(t, s="body"): return Paragraph(t, st[s])


def img(name, width, cap=None, cell=False):
    path = os.path.join(ASSETS, name)
    with Image.open(path) as im: w, h = im.size
    out = [RLImage(path, width=width, height=width * h / w)]
    if cap: out.append(P(cap, "cap"))
    return out if cell else KeepTogether(out)


def bullets(items, numbered=False):
    return ListFlowable([ListItem(P(i), leftIndent=14) for n, i in enumerate(items)],
                        bulletType="1" if numbered else "bullet", start="1" if numbered else None, bulletFontName="Body", bulletFontSize=10.5 if numbered else 8,
                        leftIndent=16, bulletColor=NAVY)


def table(rows, colW, head=True, bold_col=None):
    data = []
    for i, r in enumerate(rows):
        data.append([c if not isinstance(c, str) else P(c, "cellh" if (head and i == 0) else ("cellb" if j == bold_col else "cell")) for j, c in enumerate(r)])
    t = Table(data, colWidths=colW, repeatRows=1 if head else 0)
    style = [("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#B9B5AC")), ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
             ("TOPPADDING", (0, 0), (-1, -1), 4), ("BOTTOMPADDING", (0, 0), (-1, -1), 4), ("LEFTPADDING", (0, 0), (-1, -1), 6)]
    if head: style.append(("BACKGROUND", (0, 0), (-1, 0), NAVY))
    for i in range(1 if head else 0, len(rows)):
        if i % 2 == 0: style.append(("BACKGROUND", (0, i), (-1, i), SHADE))
    t.setStyle(TableStyle(style))
    return t


def note(text):
    t = Table([[P(text, "note")]], colWidths=[W])
    t.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#ECEAE4")), ("LEFTPADDING", (0, 0), (-1, -1), 10),
                           ("RIGHTPADDING", (0, 0), (-1, -1), 10), ("TOPPADDING", (0, 0), (-1, -1), 7), ("BOTTOMPADDING", (0, 0), (-1, -1), 7)]))
    return t


def photo(base, width, height, label):
    for f in sorted(glob.glob(os.path.join(ROOT, "photos", base + ".*"))):
        if f.lower().endswith((".jpg", ".jpeg", ".png")):
            out = os.path.join(ASSETS, "report_" + base + ".jpg")
            with Image.open(f) as im:
                ImageOps.exif_transpose(im).convert("RGB").save(out, quality=92)  # orientation only
            with Image.open(out) as im: w, h = im.size
            s = min(width / w, height / h)
            return [RLImage(out, width=w * s, height=h * s), P(label + " (original lab photograph, cropped only).", "cap")]
    t = Table([[Paragraph("<b>LAB PHOTO</b><br/>" + label + "<br/><font size=8.5 color='#6B7079'>Place the original photograph in photos/ and rebuild, "
                  "or paste it here.</font>", ParagraphStyle("ph", parent=st["cell"], alignment=TA_CENTER))]], colWidths=[width], rowHeights=[height])
    t.setStyle(TableStyle([("BOX", (0, 0), (-1, -1), 0.8, GREY), ("VALIGN", (0, 0), (-1, -1), "MIDDLE"), ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#FBFAF8"))]))
    return [t, P(label, "cap")]


def on_page(c, doc):
    c.saveState()
    c.setFont("Body", 8.5); c.setFillColor(GREY)
    c.drawString(2.1 * cm, 1.2 * cm, "Optical Fiber Communication Lab  ·  Fusion Splicing, OTDR & Link Loss")
    c.drawRightString(A4[0] - 2.1 * cm, 1.2 * cm, "Page %d" % doc.page)
    c.setStrokeColor(RULE); c.setLineWidth(0.5); c.line(2.1 * cm, 1.55 * cm, A4[0] - 2.1 * cm, 1.55 * cm)
    c.restoreState()


def on_cover(c, doc):
    c.saveState(); c.setFillColor(colors.HexColor("#1C2433")); c.rect(0, A4[1] - 15.2 * cm, A4[0], 15.2 * cm, fill=1, stroke=0); c.restoreState()


doc = BaseDocTemplate(OUT, pagesize=A4, leftMargin=2.1 * cm, rightMargin=2.1 * cm, topMargin=2.0 * cm, bottomMargin=2.0 * cm,
                      title="Fiber Optic Lab Report", author="B.Tech student, OFC Lab")
frame = Frame(doc.leftMargin, doc.bottomMargin, W, A4[1] - doc.topMargin - doc.bottomMargin, id="f")
doc.addPageTemplates([PageTemplate(id="cover", frames=[frame], onPage=on_cover), PageTemplate(id="main", frames=[frame], onPage=on_page)])

S = []
# ---------------- cover ----------------
from reportlab.platypus import NextPageTemplate
S.append(NextPageTemplate("main"))
S.append(Spacer(1, 1.2 * cm))
S.append(P("<font color='#F2B48A'>LABORATORY REPORT  ·  OPTICAL FIBER COMMUNICATION</font>", "kicker"))
S.append(Paragraph("Fusion Splicing, OTDR Testing &amp; Optical Link Loss Measurement",
                   ParagraphStyle("ct", fontName="Head-B", fontSize=26, leading=32, textColor=colors.white, spaceBefore=6, spaceAfter=10)))
S.append(Paragraph("Optical Fiber Communication Laboratory", ParagraphStyle("cs", fontName="Head-I", fontSize=14, leading=18, textColor=colors.HexColor("#A3AEBD"))))
S.append(Spacer(1, 0.4 * cm))
S.append(img("title_cable_bg.png", W * 0.95))
S.append(Spacer(1, 1.6 * cm))
info = [["Student name", ""], ["Roll number", ""], ["Department", ""], ["College", ""], ["Faculty", ""], ["Date of experiment", ""]]
t = Table([[P(a, "cellb"), ""] for a, _ in info], colWidths=[4.5 * cm, 9 * cm], rowHeights=[0.9 * cm] * len(info))
t.setStyle(TableStyle([("LINEBELOW", (1, 0), (1, -1), 0.6, GREY), ("VALIGN", (0, 0), (-1, -1), "BOTTOM")]))
S.append(t)
S.append(Spacer(1, 1.0 * cm))
S.append(P("<b>Contents</b>"))
S.append(bullets(["Experiment 1 — Fusion splicing", "Experiment 2 — Optical fiber testing using OTDR",
                  "Experiment 3 — Optical link loss measurement using OTDR", "References"], numbered=True))
S.append(PageBreak())

# ---------------- EXPERIMENT 1 ----------------
S += [P("EXPERIMENT 1", "kicker"), P("Fusion Splicing", "h1")]
S += [P("Aim", "h2"), P("To study and carry out the joining of two optical fibers by fusion splicing.")]
S += [P("Apparatus required", "h2"),
      table([["Item", "Purpose"],
             ["Fusion splicer", "Aligns the fibers and fuses them with an electric arc; has a built-in sleeve heater"],
             ["Fiber stripper (jacket and coating)", "Removes the jacket, buffer and 250 µm coating"],
             ["Precision cleaver", "Gives a flat, square fiber end face"],
             ["Cleaning kit: 99% isopropyl alcohol, lint-free wipes", "Removes dust and oil from bare glass"],
             ["Heat-shrink protection sleeves", "Protect the finished splice"],
             ["Optical fiber cable / pigtails, splice tray", "Fiber to be joined and storage for the joint"],
             ["Scrap bin, safety glasses", "Safe disposal of glass offcuts; eye protection"]], [6.2 * cm, W - 6.2 * cm])]
S += [P("Theory", "h2"),
      P("An optical fiber is a thin strand of glass. Light travels in the <b>core</b> (about 8–9 µm across in single-mode fiber). The core is surrounded by the <b>cladding</b> "
        "(125 µm), which has a slightly lower refractive index, so light hitting the boundary at a shallow angle is reflected back into the core (total internal reflection). "
        "A 250 µm plastic <b>coating</b> protects the glass."),
      img("fiber_structure.png", W, "Fig. 1 — Structure of an optical fiber and total internal reflection (diagram, not to scale)."),
      P("<b>Splicing</b> is joining two fibers end-to-end so that light passes from one core into the other. Because the core is so small, the ends must be clean, flat "
        "and well aligned, or part of the light is lost."),
      img("splice_before_after.png", W * 0.85, "Fig. 2 — Two separate fibers (before) and a spliced fiber (after)."),
      P("<b>Fusion splicing</b> melts the two glass ends together with an electric arc. It makes a permanent joint with very low loss (typically below 0.1 dB) and very low "
        "back-reflection. The splicer aligns the fibers with cameras, fuses them, and shows an estimate of the splice loss."),
]
S += [CondPageBreak(6 * cm), P("Procedure", "h2"),
      bullets(["<b>Prepare the cable.</b> Check the fiber type on the cable. Cut a clean end and mark the length of jacket to remove.",
               "<b>Remove the outer jacket</b> with a jacket stripper. Cut the aramid yarn with sharp scissors (never with the cleaver).",
               "<b>Slide the heat-shrink protection sleeve</b> onto one fiber and move it well away from the end. This must be done before joining.",
               "<b>Strip the fiber coating</b> with the smallest notch of the stripper, in one smooth straight pull (about 3–4 cm, as per the cleaver guide).",
               "<b>Clean the bare fiber</b> with a lint-free wipe and 99% isopropyl alcohol. Do not touch the glass afterwards.",
               "<b>Cleave both fiber ends</b> at the length set on the cleaver scale. A good cleave is flat and square (usually within 1°). Put the offcut in the scrap bin.",
               "<b>Place the fibers in the fusion splicer</b> V-grooves, tips just short of the electrodes. Close the clamps and wind cover.",
               "<b>Align both fiber cores.</b> The splicer views the fibers in X and Y, checks end faces and gap, and moves the fibers until the cores line up.",
               "<b>Apply the electric arc.</b> A short cleaning arc is followed by the main arc that fuses the glass.",
               "<b>Inspect the splice</b> on the screen and note the splicer's <i>estimated</i> loss. Remake the splice if bubbles, thinning or offset are seen.",
               "<b>Move the protection sleeve</b> over the joint so that the splice is in the centre.",
               "<b>Heat-shrink the sleeve</b> in the splicer heater and let it cool.",
               "<b>Arrange the protected fiber in the splice tray</b>, coiling spare fiber in large loops.",
               "<b>Test the completed connection</b> with an OTDR or a light source and power meter, and record the measured loss."], numbered=True)]
grid = Table([[img("step03_sleeve.png", W / 2 - 0.4 * cm, "Fig. 3 — Sleeve placed before joining.", cell=True), img("step06_cleave.png", W / 2 - 0.4 * cm, "Fig. 4 — Cleaving and end-face quality.", cell=True)],
              [img("step07_place.png", W / 2 - 0.4 * cm, "Fig. 5 — Fibers in the V-grooves.", cell=True), img("step09_arc.png", W / 2 - 0.4 * cm, "Fig. 6 — Arc fusion (illustration).", cell=True)],
              [img("step11_sleeve_move.png", W / 2 - 0.4 * cm, "Fig. 7 — Sleeve moved over the joint.", cell=True), img("step13_tray.png", W / 2 - 0.4 * cm, "Fig. 8 — Splice tray.", cell=True)]],
             colWidths=[W / 2, W / 2])
grid.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP")]))
S += [grid]
S += [P("Observation", "h2"),
      P("No measured splice-loss value was recorded during our session, so no splice loss is reported here. The table below is left for recording values when the test is done."),
      table([["Splice no.", "Fiber type", "Splicer estimated loss (dB)", "Measured loss (dB) and method", "Remarks"], ["1", "", "", "", ""], ["2", "", "", "", ""]],
            [2 * cm, 2.8 * cm, 3.6 * cm, 4.4 * cm, W - 12.8 * cm]),
      P("The splicer's value is only an estimate from the camera image. The real loss must be measured with an OTDR or a light source and power meter.", "small")]
S += [P("Result", "h2"), P("The complete fusion splicing procedure (preparation, stripping, cleaning, cleaving, alignment, arc fusion, protection and testing) was "
                          "studied. A splice-loss value is not stated because it was not measured in this session.")]
S += [P("Precautions", "h2"),
      bullets(["Always slide the protection sleeve onto the fiber before splicing.", "Clean the bare fiber just before cleaving; never touch it after cleaning.",
               "Keep the cleaver blade and the splicer V-grooves and electrodes clean.", "Do not bend the fiber sharply; use large loops in the splice tray.",
               "Fiber offcuts are sharp glass needles: wear safety glasses and put them in a sealed scrap bin.",
               "Do not eat or drink at the splicing bench.", "Let the heat-shrink sleeve cool before handling."])]
S.append(CondPageBreak(9 * cm))

# ---------------- EXPERIMENT 2 ----------------
S += [P("EXPERIMENT 2", "kicker"), P("Optical Fiber Testing Using OTDR", "h1")]
S += [P("Aim", "h2"), P("To test an optical fiber using an Optical Time Domain Reflectometer (OTDR) and find its length, loss and events.")]
S += [P("Apparatus required", "h2"), bullets(["FiberShot Pro Series OTDR", "Fiber under test (with connectors)", "Connector cleaning kit and inspection scope",
                                            "Launch and receive cables (if available — not used in our test)"])]
S += [P("Theory", "h2"),
      P("An OTDR sends short light pulses into one end of the fiber and measures the light that comes back. Two effects return light:"),
      bullets(["<b>Rayleigh backscattering</b> — a very small part of the light is scattered back from every point in the glass. Its slow fall with distance shows the fiber's attenuation.",
               "<b>Fresnel reflection</b> — a strong echo where light meets a change in refractive index, such as a connector, a break or the open fiber end."]),
      P("The OTDR measures the time <i>t</i> for each echo to return. The distance is"),
      P("d = (c × t) / (2n)", "eq"),
      P("where <i>c</i> is the speed of light in vacuum, <i>n</i> is the group index of the fiber (about 1.47), and the factor 2 is because the light travels out and back. "
        "The result is drawn as a trace: distance (km) on the X-axis and returned signal level (dB) on the Y-axis."),
      img("otdr_principle_bg.png", W, "Fig. 9 — Working principle of an OTDR (simplified diagram)."),
      P("Right after the OTDR port, the strong front reflection blinds the detector for a short distance (the <i>dead zone</i>). A <b>launch cable</b> moves the first connector out "
        "of this zone; a <b>receive cable</b> lets the far-end connector be measured."),
      img("otdr_connection.png", W, "Fig. 10 — Connection: OTDR → launch cable → fiber under test → receive cable (optional).")]
S += [P("Procedure", "h2"),
      bullets(["Switch on the OTDR.", "Inspect and clean all fiber connectors.", "Connect the launch cable (if available) and then the fiber under test. Check all connections are secure.",
               "Make sure the fiber is not carrying a live signal.", "Open the <b>Test Setting</b> menu. Select wavelength, range, pulse width, test time, resolution and power mode (values below).",
               "Return to the main test screen and press <b>AVG</b> to start the averaged measurement.", "Wait for the test to finish (50 s).", "Observe the trace and the event table and note the readings."], numbered=True)]
S += [P("Test settings used (from Photo 1)", "h2"),
      table([["Parameter", "Value", "Meaning"], ["Test wavelength selection", "1310/1550 nm", "Wavelength(s) used for the test"], ["Test range", "10 km", "Maximum distance displayed"],
             ["Pulse width", "50 ns", "Short pulse: good detail on a short fiber"], ["Test mode", "Manual", "Settings chosen by the user"], ["Test time", "50 seconds", "Averaging time"],
             ["Resolution", "Standard", "Spacing of trace points"], ["Launch cable setting", "None", "No launch cable entered"], ["End cable setting", "None", "No receive cable entered"],
             ["Power mode", "Standard", "Instrument power option"]], [5 * cm, 3.2 * cm, W - 8.2 * cm], bold_col=1)]
S += [CondPageBreak(10 * cm), Spacer(1, 6),
      Table([[photo("otdr_settings", W / 2 - 0.5 * cm, 7 * cm, "Photo 1 — OTDR test-settings screen"),
              photo("otdr_result", W / 2 - 0.5 * cm, 7 * cm, "Photo 2 — OTDR trace and result screen")]], colWidths=[W / 2, W / 2])]
S += [P("Observation table (read from Photo 2)", "h2"),
      table([["Parameter", "Observed value"], ["Test wavelength", "1310 nm"], ["Pulse width", "50 ns"], ["Fiber distance", "4.822 km"], ["Total loss", "1.550 dB"],
             ["Displayed attenuation slope", "0.317 dB/km"], ["Optical Return Loss (ORL)", "29.37 dB"], ["Instrument result", "PASS"]], [7 * cm, 5 * cm], bold_col=1),
      P("All values are measured values read directly from the instrument screen.", "small")]
S += [P("Reading the trace", "h2"),
      P("A sloping straight line shows normal fiber attenuation. A sudden step down is a loss event (splice, bend), and an upward spike is a reflection (connector or fiber end). "
        "A sharp drop into noise marks the end of the fiber. Only the events shown by the instrument on our screen are reported; no other faults are assumed. "
        "The following are example traces for learning, not from our experiment:"),
      Table([[img("ev_splice.png", W / 3 - 0.3 * cm, "Splice (example)", cell=True), img("ev_connector.png", W / 3 - 0.3 * cm, "Connector (example)", cell=True), img("ev_bend.png", W / 3 - 0.3 * cm, "Bend (example)", cell=True)],
             [img("ev_break.png", W / 3 - 0.3 * cm, "Break (example)", cell=True), img("ev_end.png", W / 3 - 0.3 * cm, "Fiber end (example)", cell=True), ""]], colWidths=[W / 3] * 3)]
S += [P("Result", "h2"),
      P("At 1310 nm, the OTDR measured a fiber length of <b>4.822 km</b>, a total loss of <b>1.550 dB</b>, an attenuation slope of <b>0.317 dB/km</b> and an ORL of <b>29.37 dB</b>. "
        "The instrument showed <b>PASS</b>."),
      note("PASS means the measured results were within the thresholds configured in the instrument. It is not proof that every possible performance requirement was met. "
           "Because the launch and end cable settings were 'None', the losses of the first and last connectors could not be measured accurately.")]
S += [P("Precautions", "h2"),
      bullets(["Never look into the OTDR port or a fiber end; the infrared laser light is invisible and can harm the eyes. Use an inspection scope.",
               "Clean and inspect every connector before connecting it to the OTDR.", "Do not connect a fiber carrying live traffic unless the OTDR and setup are made for live-fiber testing.",
               "Set the range longer than the fiber and choose a suitable pulse width.", "Do not move or bend the fiber during the measurement.",
               "Use launch and receive cables when the end connectors must be measured."])]
S.append(PageBreak())

# ---------------- EXPERIMENT 3 ----------------
S += [P("EXPERIMENT 3", "kicker"), P("Optical Link Loss Measurement Using OTDR", "h1")]
S += [P("Aim", "h2"), P("To measure the total loss of an optical fiber link using an OTDR and calculate the average attenuation per kilometre.")]
S += [P("Apparatus required", "h2"), bullets(["FiberShot Pro Series OTDR", "Fiber link under test", "Connector cleaning kit", "Launch / receive cables (when required)"])]
S += [P("Theory", "h2"),
      P("<b>Link loss</b> is the total reduction in optical signal power as light travels through a fiber link. It is given in dB and includes fiber loss, splice loss and connector loss. "
        "<b>Fiber attenuation</b> is the loss of the fiber itself per unit length, in dB/km."),
      img("link_loss_bg.png", W, "Fig. 11 — Losses along a link: slope = fiber attenuation, steps = event losses (sketch)."),
      P("For an end-to-end test with a light source and an optical power meter (insertion-loss test):"),
      P("Link Loss (dB) = P<sub>in</sub> (dBm) − P<sub>out</sub> (dBm)", "eq"),
      P("where P<sub>in</sub> is the power launched into the link and P<sub>out</sub> is the power received at the far end (dBm = power relative to 1 mW). "
        "An OTDR does not measure power at both ends. It <b>estimates</b> loss from the backscattered light, and the link or section loss is read from its event table or "
        "with the A–B loss-measurement cursors. The average attenuation is then:"),
      P("Average Attenuation (dB/km) = Total Loss (dB) / Fiber Length (km)", "eq"),
      img("trace_cursors.png", W * 0.7, "Fig. 12 — Example trace with A–B cursors (educational example, not our trace).")]
S += [P("Procedure", "h2"),
      bullets(["Clean and inspect the fiber connectors.", "Connect the OTDR to the fiber link.", "Use suitable launch and receive cables when required.", "Open the test settings.",
               "Select wavelength, range and pulse width.", "Start the averaged OTDR measurement (AVG).", "Observe the trace.", "Identify the start and end of the link.",
               "Use the event table or the loss-measurement cursors.", "Read the measured section loss in dB.", "Record the fiber length and loss.",
               "Repeat at another wavelength if required."], numbered=True)]
S += [P("Observation table", "h2"),
      table([["Quantity", "Value", "Type"], ["Wavelength", "1310 nm", "Measured (instrument setting)"], ["Fiber length, L", "4.822 km", "Measured"], ["Total loss", "1.550 dB", "Measured"],
             ["Attenuation slope shown by OTDR", "0.317 dB/km", "Measured (displayed)"], ["Average attenuation", "0.3214 dB/km", "Calculated (below)"]],
            [6.5 * cm, 3.5 * cm, W - 10 * cm], bold_col=1)]
S += [P("Calculation", "h2"),
      P("Average attenuation = Total loss / Fiber length = 1.550 dB / 4.822 km ≈ <b>0.3214 dB/km</b>", "eq"),
      P("The OTDR separately displays an attenuation slope of 0.317 dB/km. The two values differ slightly (by about 0.004 dB/km, roughly 1.4%) because they come from different methods: "
        "the slope is a straight-line fit over a part of the trace without events, while the total loss covers the whole section, including any event losses. "
        "So 0.317 dB/km is <i>not</i> the exact quotient of 1.550 and 4.822. As a check, 0.317 dB/km × 4.822 km ≈ 1.529 dB, about 0.02 dB less than the measured total loss.")]
S += [P("Result", "h2"),
      P("The total link loss measured by the OTDR at 1310 nm is <b>1.550 dB</b> over a length of <b>4.822 km</b>. The calculated average attenuation is <b>≈ 0.3214 dB/km</b>, "
        "and the OTDR's displayed attenuation slope is <b>0.317 dB/km</b>. The instrument showed PASS against its configured thresholds.")]
S += [P("Precautions", "h2"),
      bullets(["Clean all connectors before testing; dirt adds loss and reflections.", "Place the A and B cursors outside the dead zone and before the end reflection.",
               "Remember that OTDR loss is an estimate from backscatter; use a light source and power meter for a true end-to-end insertion-loss value.",
               "Use launch/receive cables to include the end connectors in the loss.", "Follow laser safety: never look into a fiber end."])]
S += [P("Overall conclusion", "h2"),
      bullets(["Fiber splicing joins optical fibers; fusion splicing makes a permanent joint using heat from an electric arc.",
               "An OTDR measures fiber length and loss and locates faults from one end of the fiber.",
               "Link loss can be estimated from OTDR trace measurements; our link showed 1.550 dB over 4.822 km at 1310 nm.",
               "Proper cleaning, cleaving, alignment and testing improve the quality of a fiber connection."])]
S += [P("References", "h2"),
      bullets(["G. Keiser, <i>Optical Fiber Communications</i>, 5th ed., McGraw-Hill Education.",
               "J. M. Senior, <i>Optical Fiber Communications: Principles and Practice</i>, 3rd ed., Pearson Education, 2009.",
               "The Fiber Optic Association (FOA), Online Reference Guide — fusion splicing and OTDR testing. https://www.thefoa.org/tech/ref/",
               "ITU-T Recommendation G.652 — Characteristics of a single-mode optical fibre and cable.",
               "IEC 61746-1 — Calibration of optical time-domain reflectometers (OTDR), Part 1: single-mode fibres.",
               "ANSI/TIA-568.3-D — Optical Fiber Cabling and Components Standard.",
               "IEC 60825-1 — Safety of laser products.",
               "User manuals of the FiberShot Pro Series OTDR, fusion splicer and cleaver used in the laboratory."], numbered=True),
      Spacer(1, 10), P("All diagrams in this report were drawn for this lab. Example traces are labelled as examples. The two OTDR photographs are the original photographs from our experiment.", "small")]

doc.build(S)
print("written", OUT)
