#!/bin/bash
# Rebuild diagrams + deck, then render Presentation_Preview.pdf
set -e
cd "$(dirname "$0")"
node diagrams.js
node build_deck.js
python3 build_report.py
cd ..
python3 "$PPTX_SKILL/scripts/office/validate.py" Fiber_Optic_Splicing_OTDR_Link_Loss.pptx
TMP=$(mktemp -d)
python3 "$PPTX_SKILL/scripts/office/soffice.py" --headless --convert-to pdf --outdir "$TMP" Fiber_Optic_Splicing_OTDR_Link_Loss.pptx >/dev/null 2>&1
cp "$TMP/Fiber_Optic_Splicing_OTDR_Link_Loss.pdf" Presentation_Preview.pdf
echo "preview written"
