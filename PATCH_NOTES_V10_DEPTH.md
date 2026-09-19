# SHRUNK V10 — THE TABLE FEELS REAL

V10 is a presentation-only depth/material pass built on the final V9 release candidate.

## Intent
Make SHRUNK feel more like a handcrafted miniature tabletop world without changing gameplay.

## Added
- richer wood/workbench depth on Home
- warmer desk-light falloff and edge vignette
- layered paper, curled corners, tape, notebook holes and contact shadows
- stronger physical progression-card treatment
- more tactile game cards and accent materials
- Fingerboard ambient depth, paper session card, control-surface material, stronger contact shadowing
- Marble Run desk-light/material pass and layered paper UI
- Tabletop Racing miniature-controller material pass and richer track ambience
- Desk Shot desk-light/material pass and layered paper UI
- stronger modal/HUD/button depth while retaining mobile readability

## Frozen
No gameplay, progression, routing, physics, controls, obstacle geometry, challenge logic, economy logic or One Home event code was changed.

The complete V9 frozen `.mjs` hash list is preserved in `V10_FROZEN_MJS_SHA256.txt`.

## Mobile rules
- overlays are pointer-events:none
- short-landscape media rules reduce depth effects
- no new scroll owner
- no CSS rotation or fake landscape
- safe-area logic remains unchanged
- no new gameplay DOM overlays
