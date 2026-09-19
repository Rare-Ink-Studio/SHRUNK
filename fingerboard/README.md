# SHRUNK — Tabletop Sessions

A dependency-free, static, single-player fingerboard game made for two-thumb mobile play. Rebuilt from the agreed SHRUNK/Rollies concept; it does not incorporate the source of the earlier Grok-hosted build.

## Play

Open the deployed page in landscape. The board rolls automatically. Use the left thumb to adjust speed horizontally and tilt vertically. Hold the right thumb for up to 0.34 seconds to load the tail, release to ollie, and press again in the air to catch. An upward flick gives a small additional impulse. Land level to score; clear obstacles for a bonus. A bail resets the board after 0.62 seconds. Best score stays in this browser.

Keyboard: Left/Right or A/D adjusts speed; Up/Down or W/S tilts; Space loads, pops, and catches; P pauses; R restarts. Audio starts muted and can be enabled from the speaker button.

## Structure

- `dist/index.html`: accessible game UI and instruction/pause dialogs.
- `dist/style.css`: responsive SHRUNK visual direction and landscape gate.
- `dist/engine.mjs`: deterministic fixed-step physics, obstacle surfaces, scoring, independent pointer ownership, and viewport orientation predicate.
- `dist/app.mjs`: live Canvas rendering, viewport measurement, audio, input bindings, pause recovery, and browser-local best score.
- `dist/assets/workshop.webp`: original generated workshop backdrop. Board, moving fingers, and obstacle collision geometry render live.

Static files are the authored source. No package installation or build step is required. `node --test tests/engine.test.mjs` runs the mechanics checks. The game uses measured viewport dimensions, visualViewport/resize listeners, and a ResizeObserver. It never rotates a portrait canvas with CSS or attempts to override the phone's orientation lock. Physical iPhone/Safari orientation must be verified on the device.

Current scope is free skate with ollies, kickflips, heelflips, pop shuvits, 180s, adjustable speed, tilt/catch, two cartoon fingers, repeated cardboard/wood/concrete obstacles, scoring, and replay. No grind detection, park editor, wallets, rewards, or online leaderboard are connected.

## Phone gestures and Easy Demo
Phone zoom prevention is automatic; there is no lock button. Fixed viewport metadata and root touch-action combine with non-passive touch-end cancellation. Button taps are activated explicitly after cancelling the touch default. OLLIE stays touch-receivable while airborne (aria-disabled), so repeated taps still reach the guard. Two-thumb pointer handling is unchanged. Scene scale remains independent of browser toolbar height.
Validation: 17 mechanics and touch-handler checks pass. Physical iPhone webview behavior remains to be verified.


## V5 kickflip candidate

Adds one gesture-based trick without changing Easy Demo or the existing ollie flow. In normal DROP IN play, pop an ollie and flick the FRONT/left touch diagonally upward and sideways while airborne to start a kickflip; catch with REAR/right and level for landing.


## V6 heelflip candidate

Adds a second gesture-based flip trick while preserving V5 kickflip behavior: after popping, flick the FRONT/left touch diagonally upward to the right for KICKFLIP or diagonally upward to the left for HEELFLIP. Both require the existing REAR catch and FRONT leveling before landing. Easy Demo remains ollie-only.

## V7 pop shuvit candidate

Adds POP SHUVIT as the first scoop-based trick while preserving ollie, kickflip, heelflip, two-thumb ownership, and Easy Demo. In normal DROP IN play, hold REAR/right to load the tail, sweep that thumb sideways as you release to pop, then catch with REAR and use FRONT to level the landing. The board visually rotates 180 degrees around its vertical axis and scores separately from flip tricks. Easy Demo remains ollie-only.


## V8 180 candidate

Adds 180 as the first body-and-board rotation while preserving ollie, kickflip, heelflip, pop shuvit, two-thumb ownership, and Easy Demo. In normal DROP IN play, pop an ollie and make a deliberate horizontal FRONT/left sweep while airborne (without the upward diagonal used for flips). The board turns 180 degrees, then REAR catches and FRONT levels for the landing. Controls remain in the same screen zones after landing so the move adds rotation without destabilizing the established mobile input model. Easy Demo remains ollie-only.


## V10 — 360 Shuvit
Adds a stronger rear-thumb scoop gesture for a full 360 shuvit. A moderate scoop remains Pop Shuvit. Existing ollie, kickflip, heelflip, pop shuvit, 180, Easy Demo, multitouch, and mobile behavior are preserved.


## V10 combo
Adds VARIAL KICKFLIP: pop-shuvit rear scoop followed by the existing front kickflip flick while airborne. Both the 180° shuv rotation and full kickflip must complete before catch/landing. Easy Demo remains ollie-only.

## V11 — Varial Heelflip candidate
Adds gesture-composed VARIAL HEELFLIP: Pop Shuvit rear scoop + opposite FRONT heelflip flick. Preserves all V10 moves, independent two-thumb ownership, landing/catch rules, and ollie-only Easy Demo. Full suite: 49/49 passing; production static release check passes.


## V12 combo addition
- 360 Flip / Tre Flip: strong REAR 360 scoop + FRONT kickflip flick while airborne.
- Preserves V11 gestures and Easy Demo ollie-only behavior.


## V13 — Inward Heelflip
Strong 360 rear scoop plus the opposite FRONT heel flick now combines into INWARD HEELFLIP. It uses the same catch/level/landing rules as the other combo tricks. Easy Demo remains ollie-only.


## V15 — Line / Session Scoring
- THE TABLE now tracks a live line score across obstacle clears and landed tricks.
- Clean consecutive landings build a line streak bonus.
- Bails break the clean streak while preserving the in-progress session score.
- Crossing RUN OUT completes the line and awards a clean-line or recovery finish bonus.
- Empty run-outs do not create phantom points.
- Existing V14 obstacles, V13 trick set, Easy Demo, touch ownership and physics remain intact.

## V16 — Grind System (FROZEN RELEASE CANDIDATE)
- Adds real LOW RAIL grind contact with entry → locked slide → exit → landing flow.
- 50-50: pop onto the rail while using FRONT to level and lock onto the rail.
- Boardslide: near the rail, use a compact horizontal FRONT sweep while airborne to set the board sideways before contact.
- 50-50 and Boardslide score separately and feed the existing THE TABLE line score/streak system.
- Easy Demo remains ollie-only and still clears the rail rather than auto-grinding it.
- Preserves the complete V13 trick vocabulary, V14 course, V15 line/session scoring, multitouch ownership, mobile layout, pause/reset/lifecycle behavior, and Safari zoom guard.
- This V16 package is frozen for Work implementation; no further gameplay changes should be made before deployment verification.


## V16.1 — Physical iPhone tuning patch
- Lowers TABLE LEDGE (the second box) from 42 to 32 world units so the existing two-thumb full-load ollie has comfortable real-phone clearance without changing global pop physics.
- Fixes LOW RAIL vertical pass-through: descending airborne contact can no longer fall through the rail surface.
- Easy Demo now assists a valid popped rail contact into a 50-50 rail ride, preserving one-button input while making the rail behave physically instead of ghosting through it.
- Normal two-thumb 50-50 and boardslide gestures remain unchanged.
- Adds regression coverage for second-box clearance and Easy Demo rail riding.


## V16.2 physical iPhone rail fix

Physical iPhone retest showed the second TABLE LEDGE was already clearable with the original V16 geometry; the V16.1 ledge-height change was therefore reverted to 42 world units.

The remaining field issue was normal two-thumb rail contact: a correctly popped board could contact the LOW RAIL without entering the grind state if FRONT was released at the exact contact frame. V16.2 makes descending physical top contact with the LOW RAIL lock into a 50-50 when the board is popped, flat enough, and not mid-trick. Boardslide intent still takes precedence. Easy Demo rail assistance remains intact.

Validation: 67/67 automated tests pass, including a new regression for natural two-thumb rail landing with FRONT released at contact. Production static release check passes.
