# SHRUNK V9 — Work Handoff

Apply this ZIP to the EXISTING SHRUNK project only.

Project: `appgprj_6a9b8cd3055c8191a67b75d3b121445e`
Existing URL: `https://shrunk-tabletop-sessions.allunder1.chatgpt.site`

V9 development is already complete. Work should not redesign or rebuild it.

## Work job
1. Apply this source to the existing project.
2. Preserve current URL and public access.
3. Run automated suite once — expected `113/113 PASS`.
4. Run master release/build check once — expected `PASS`.
5. Minimal browser smoke only:
   - Home / progression renders
   - Fingerboard loads
   - Desk Shot loads
   - Marble Run loads
   - Tabletop Racing loads
   - Back to SHRUNK works
   - portrait gate / landscape recovery still works, including Desk Shot portrait-first entry
   - no release-blocking clipping or runtime error
6. If green, publish as the next production version.
7. Stop.

## Critical freeze
V8 gameplay/progression JavaScript remains frozen. The only intentional V9-final JavaScript exception is a surgical Desk Shot canvas-render guard discovered during portrait-entry smoke testing. It prevents drawing while orientation-blocked or before valid dimensions exist; it does not change shot mechanics, physics, input, scoring, progression, or viewport rules.

Do not alter Fingerboard course/physics, touch mappings, Racing controls, Marble physics/collisions, Desk Shot mechanics, progression, Daily/Weekly/Boss/Coin logic, One Home event hooks, or routing. If another blocker appears, stop and report it rather than redesigning gameplay.
