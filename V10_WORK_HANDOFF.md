# SHRUNK V10 — WORK HANDOFF

Apply `SHRUNK-v10-depth-release-candidate.zip` to the EXISTING SHRUNK — Tabletop Sessions project.

Project ID: appgprj_6a9b8cd3055c8191a67b75d3b121445e
Production lineage: https://shrunk-tabletop-sessions.allunder1.chatgpt.site

## This candidate is already built
V10 is a visual-depth/material layer on top of the final V9 candidate.

DO NOT redesign, rebuild, refactor, add features, or rewrite gameplay.

## Frozen systems
Preserve every existing V9/V8 mechanic, including:
- frozen Fingerboard THE TABLE course/physics/controls/tricks/grinds
- Racing LEFT GAS + slide-up BOOST / RIGHT STEER / pause / scoring
- Marble movement/collisions/checkpoints/timer
- Desk Shot five-shot drag/aim/release loop and portrait render guard
- V8 Daily/Weekly/Boss/Coin progression and One Home event hooks
- routing, Back to SHRUNK, public URL and mobile/orientation behavior

## V10 scope
Presentation only:
- deeper tabletop/workbench materials
- richer paper/card depth
- stronger contact shadows
- warm desk-light ambience
- tactile HUD/control/pause surfaces
- consistent physical SHRUNK presentation

## Required verification
1. Run full tests once. Expected: 115/115 PASS.
2. Run release/build check once. Expected: PASS.
3. Minimal visual smoke:
   - Home landscape + portrait
   - Fingerboard loads, controls remain reachable
   - Marble Run loads
   - Tabletop Racing loads
   - Desk Shot loads and portrait→landscape recovery still works
   - Back to SHRUNK works
   - no clipping/horizontal scroll/runtime errors
4. If green, publish over the existing SHRUNK site, preserving URL and public access.
5. Stop.

If a V10 style causes a blocker, change only the offending CSS rule. Do not change mechanics to accommodate styling.
