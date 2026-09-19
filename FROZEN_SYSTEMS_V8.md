# SHRUNK V8 — FROZEN SYSTEMS MANIFEST

Status: **ACTIVE**

Rule: a frozen system is **FROZEN — DO NOT MODIFY WITHOUT EXPLICIT UNFREEZE**.
A frozen system may change only when a current regression proves the task breaks it, or the user explicitly authorizes an unfreeze. If a new feature appears to require a frozen change, stop and report why before editing it.

## Frozen product lineage
- Existing SHRUNK project/site lineage
- Existing production URL and public-access model
- SHRUNK Home → game routing
- Back to SHRUNK navigation

## Frozen Fingerboard systems
- Two-thumb FRONT / REAR control mapping
- Independent pointer ownership
- Cruise / rolling behavior
- Rear load + release ollie behavior
- Current trick-recognition gestures
- Current rail / grind collision behavior
- Existing proven obstacle physics

## Frozen Tabletop Racing systems
- LEFT thumb GAS
- LEFT slide-up BOOST
- RIGHT thumb STEER
- Existing race physics / camera / recovery
- Lap / checkpoint / scoring logic
- Pause / restart / Back to SHRUNK behavior

## Frozen Marble Run systems
- Core marble movement model
- Current steering model
- Current solid-object collision / bounce behavior
- Timer / checkpoint / finish / scoring loop
- Pause / restart / Back to SHRUNK behavior

## Frozen Desk Shot systems
- Drag-back / release shot gesture
- Five-shot round loop
- Existing rebound / target scoring behavior
- Pause / restart / Back to SHRUNK behavior

## Frozen shared contracts
- Existing passing regression tests are release contracts
- No accidental browser zoom during active play
- Touch-action rules already required by the games
- One Home participation-event schema `one-home.participation.v1`
- SHRUNK → One Home handoff schema `one-home.shrunk-handoff.v1`
- Anti-farming: completed Daily Challenges cannot repeatedly mint test coins
- Ticket Ready remains a test state only; SHRUNK does not issue a real One Home Ticket

## Explicitly NOT frozen yet
These are active V8 development surfaces:
- Mobile app-shell implementation until physical iPhone verification is complete
- Procedural Daily / Weekly Session generator tuning
- Weekly themes and Boss Challenges
- Challenge difficulty / variety
- Additional tabletop obstacles, courses and arrangements
- Celebration / progression presentation
- Personal-record presentation
- One Home authoritative `session_seed` integration
- Future Dood Coin / real Ticket economics

## Release discipline
Every V8 package must preserve frozen-path tests, pass the production release check, keep all four game routes loadable, and preserve Back to SHRUNK navigation.
