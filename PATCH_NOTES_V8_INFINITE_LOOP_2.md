# SHRUNK V8 — THE INFINITE LOOP · EARN THE WEEK

This pass turns the first Infinite Loop prototype into a more realistic weekly qualification model while keeping all rewards local/test-only.

## Test qualification model

- 3 Daily Challenges rotate by weekday.
- Each challenge pays 3 test SHRUNK Coins once per day.
- Completing all 3 pays a +3 Daily Session bonus.
- A complete Daily Session counts as one qualifying day.
- Weekly WORLD TOUR still requires a completed session in all four games.
- WORLD TOUR pays +4 test Coins.
- TICKET READY now requires all three:
  - 64 Coins earned in the current week
  - 5 completed Daily Sessions in the current week
  - Weekly WORLD TOUR complete
- 88 Coins remains the PERFECT WEEK marker, not the minimum Ticket Ready threshold.
- Lifetime Coins are tracked separately from current-week Coins.
- A visible Daily Session streak is tracked.

These are development values only. No real Ticket or Dood Coin is issued, transferred, redeemed, burned, or promised.

## One Home plug-in contract

Every recorded game event now also creates an outbox envelope using:

- `schema: one-home.participation.v1`
- SHRUNK progression version
- event/game
- day/week
- timestamp
- payload
- test coins earned
- challenge completions

`getOneHomeHandoff()` produces a One Home-ready summary plus the queued event envelopes. The browser still stores everything locally; this is only the future integration contract.

## Why this model

The player cannot grind one easy action to become Ticket Ready. They must participate across multiple days, finish the cross-game Weekly Session, and earn enough weekly Coins. Missing two days does not destroy the week, while a 7-day / 88-Coin PERFECT WEEK remains a harder accomplishment.
