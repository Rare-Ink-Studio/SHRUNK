# SHRUNK V9 — Handcrafted Tabletop Visual Pass

Base: `SHRUNK-v8-surgical-release-ready.zip`

## Purpose
V9 is presentation-only. It upgrades SHRUNK toward a warm, handcrafted miniature tabletop world while preserving the complete V8 gameplay/progression foundation.

## Changed source
Only CSS presentation files were changed:

- `dist/style.css`
- `dist/games/fingerboard/style.css`
- `fingerboard/dist/style.css`
- `dist/games/desk-shot/style.css`
- `desk-shot/dist/style.css`
- `dist/games/marble-run/style.css`
- `marble-run/dist/style.css`
- `dist/games/tabletop-racing/style.css`
- `tabletop-racing/dist/style.css`

No `.mjs` gameplay, physics, input, routing, viewport, progression, generator, event, challenge, or economy-test logic was modified.

## V9 visual direction
- Warm workbench / real tabletop atmosphere
- Paper challenge sheets and session cards
- Hand-cut SHRUNK wordmark treatment
- Material depth, shadows, tape/paper details, desk texture
- Consistent HUD, pause/dialog and Back-to-SHRUNK presentation
- Distinct game accents while remaining one SHRUNK world
- Fingerboard: premium workbench/session presentation without course changes
- Desk Shot: physical score sheet / tabletop arena presentation
- Marble Run: miniature hand-built course presentation
- Tabletop Racing: miniature tabletop-track presentation with preserved controls

## Mobile rules preserved
The existing responsive shell, portrait gates, safe-area behavior, viewport logic, touch handling, and landscape gameplay code are unchanged.

## Verification performed before packaging
- V8 `.mjs` byte-compare: PASS (0 changed)
- Automated suite: 111/111 PASS
- Master release check: PASS
- CSS parse check: PASS for home + all four game styles
- Static overflow geometry check used 1280x800, 390x844, and 844x390 viewport definitions with no authored CSS parse errors; final physical iPhone acceptance remains required.

## Freeze rule
Do not modify gameplay to accommodate V9 styling. If a visual rule causes a release problem, adjust or remove the visual rule.


## Final acceptance guard
During Work smoke testing, portrait-first entry exposed one Desk Shot rendering crash: the animation loop could draw while the session was correctly orientation-blocked and the canvas still had placeholder 1×1 dimensions. The tape-roll arc therefore received a negative radius and stopped the render loop before landscape recovery.

Final V9 adds one surgical rendering guard to both mirrored Desk Shot `app.mjs` copies:

`if (orientationBlocked || W < 2 || H < 2) return;`

This changes no shot input, physics, scoring, five-shot round logic, progression, or viewport/orientation rules. It only prevents canvas drawing until valid landscape dimensions exist. Desk Shot `engine.mjs` remains byte-identical to the frozen candidate.
