# SHRUNK V7 candidate patch

Built from the uploaded current workspace source.

Changes:
- Tabletop Racing: controls swapped to LEFT GAS/BOOST and RIGHT STEER; instructions and pad positions updated.
- Marble Run: stronger mobile steering, solid rotated-bar collision, pencil now bounces/deflects instead of ghosting, plus ruler and eraser bounce obstacles.
- Desk Shot + Marble Run: removed remaining SHRUNK "Arcade" wording in player-facing UI in favor of Tabletop World.
- Fingerboard: intentionally unchanged in this patch to preserve the physically verified rail/obstacle behavior.

Validation:
- Automated tests: 91/91 PASS
- Root release/build check: PASS
- Fingerboard release check: PASS
- Desk Shot release check: PASS
- Marble Run release check: PASS
- Tabletop Racing release check: PASS

Physical iPhone acceptance still required after deployment, especially Racing thumb ownership and Marble Run steering/collisions.
