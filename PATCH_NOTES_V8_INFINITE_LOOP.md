# SHRUNK V8 — THE INFINITE LOOP

This package extends the realistic V8 gameplay build with a local-first participation/progression layer designed to plug into One Home later.

## Included

- 3 rotating Daily Session challenges per day
- 1 Weekly Session: WORLD TOUR — finish one session in all four games
- SHRUNK Coins as test/progression points only
- Provisional 88-coin `ticket_ready` threshold
- Ticket readiness requires BOTH the coin threshold and Weekly Session completion
- Daily challenge rewards are one-time per day; repeats do not farm coins
- Daily Session completion bonus
- Weekly completion bonus
- Home dashboard showing Today, coins, weekly progress, and Ticket Ready state
- In-game coin/session HUD pill and reward toast
- Personal-record state hooks
- One Home-ready event model through `recordEvent(...)`

## Prototype economy numbers

These are intentionally configurable development values, not final economic promises:

- Each Daily Challenge: 3 SHRUNK Coins
- Complete all 3 Daily Challenges: +3 Coins
- Weekly WORLD TOUR completion: +4 Coins
- Provisional Ticket Ready target: 88 Coins + Weekly complete

No real ticket is minted, issued, transferred, burned, redeemed, or promised by this build. `ticketReady` is only a local test state for validating the Infinite Loop.

## Game event hooks

Fingerboard:
- landed trick
- completed grind
- cleared feature
- completed line / clean line

Desk Shot:
- target hit (with bank count)
- round complete (with score)

Marble Run:
- run complete (score/time/checkpoints)

Tabletop Racing:
- race complete (time/impacts/boost strips used)

## One Home handoff direction

Current browser-local state can later be replaced or mirrored by authenticated One Home/Passport calls without changing game mechanics. The game layer emits participation facts; One Home remains the authority for real Tickets, access, redemption, and future Dood Coin utility.

## Validation

- 98/98 automated tests PASS
- Master release check PASS
- Fingerboard release check PASS
- Desk Shot release check PASS
- Marble Run release check PASS
- Tabletop Racing release check PASS
