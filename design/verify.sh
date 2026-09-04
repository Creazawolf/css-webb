#!/bin/bash
cd /home/user/css-webb/design
B="/tmp/claude-0/bundled-skills/2.1.260/dc58fe50a6a3d962c5fc5b05997c9146/design"
node "$B/seed-canvas.mjs" --template "$B/payload.template.html" --out matchtidningen.html \
  --title "Matchtidningen" \
  --artboard Main.dc.html --artboard Matchcenter.dc.html --artboard Artikel.dc.html \
  --artboard Navigation.dc.html --artboard Mobil.dc.html --canvas canvas.json
node "$B/seed-canvas.mjs" --check matchtidningen.html
echo "--- render ---"
node verify.mjs
