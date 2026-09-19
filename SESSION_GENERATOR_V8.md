# SHRUNK V8 — PROCEDURAL SESSION GENERATOR

The generator is deterministic, bounded and One Home-ready.

## Current local behavior
- Generates 3 Daily Challenges from 3 different SHRUNK games.
- Uses deterministic date-based seeded randomness, so a player sees the same challenges for the full day.
- Uses weekday difficulty bands rather than uncontrolled random numbers.
- Pulls only from challenge templates backed by events the current games actually emit.
- Persists that day's generated definitions once play begins so challenges do not move mid-session.
- Generates a weekly theme and one Weekly Boss Challenge.
- WORLD TOUR remains the weekly cross-game participation requirement.
- Boss completion is recognition-only in this test economy and does not change Ticket Ready economics.

## One Home bridge
`buildSessionDefinition(date, sessionSeed)` accepts a future seed supplied by One Home. The same generator can therefore run locally today and later run from an authoritative One Home seed without changing game mechanics.

`getOneHomeHandoff()` exports the generator version, session definition, week state, records, progression summary and participation-event outbox.

## Economy remains test-only
- 3 test coins per Daily Challenge
- +3 test coins for all 3 Daily Challenges
- +4 test coins for WORLD TOUR
- Ticket Ready: 64 weekly coins + 5 Daily Sessions + WORLD TOUR
- Perfect Week: 88 weekly coins + all 7 Daily Sessions + WORLD TOUR
- Weekly Boss currently awards recognition, not additional coins

These values remain tuning parameters, not final One Home economics.
