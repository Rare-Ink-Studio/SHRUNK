# SHRUNK V9 Final — Desk Shot Portrait Recovery Guard

Work smoke testing found one portrait-first Desk Shot crash after the original V9 visual candidate passed 111/111 tests and build.

## Root cause
Portrait correctly blocks game sizing, but the animation loop could still call `draw()` while the canvas dimensions were the initial 1×1 placeholders. The tape-roll visual then attempted a negative-radius arc, throwing and ending the render loop before rotation to landscape.

## Fix
Both Desk Shot app copies now skip rendering while portrait/orientation-blocked or before valid dimensions exist.

No Desk Shot engine, input, shot physics, scoring, progression, or orientation state logic changed.

## Required Work smoke
Portrait entry → rotate to landscape → Start Round → return portrait → rotate landscape again. Confirm rendering recovers and the same session remains usable.
