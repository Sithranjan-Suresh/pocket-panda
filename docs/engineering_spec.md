# PocketPanda — Engineering Specification

**No code — design only.** Scope is intentionally minimal per product_spec.md priorities (P0/P1 only for submission).

## Overall Architecture

```
[React SPA]
   |
   |-- Input Screen (free-text problem)
   |-- Breakdown Screen (missions + energy bar + panda dialogue)
   |-- Refusal Screen state (in-character push-back)
   |-- Grove Screen (persistent progress visual)
   |
   v
[Single LLM API call per breakdown request]
   |
   v
[Structured JSON response: missions[], dialogue, energy_cost]
   |
   v
[Local/session state store: energy_level, grove_count, seeded_demo_flag]
```

No backend server or database is required. The frontend calls the LLM API directly (or via a minimal serverless function if API-key exposure is a concern) and keeps all state client-side for the submission.

## Data Model (client-side state, no DB required)

```
AppState {
  energy_level: number        // 0–100, depletes per breakdown/mission
  energy_max: number          // daily reset ceiling
  grove_count: number         // total completed missions, drives grove visual
  demo_seeded: boolean        // true for the pre-seeded "3 weeks" demo account
  current_missions: Mission[] // active breakdown, cleared on new input
}

Mission {
  id: string
  title: string
  action_text: string         // the concrete step
  drafted_content?: string    // optional pre-written email/message text
  completed: boolean
}
```

No user accounts or server-side persistence needed. If a "return next session" demo state is required beyond the pre-seeded account, use browser-local storage (session-scoped is acceptable — do not rely on it as a real product persistence layer, this is a hackathon submission, not production infra).

## API Design (LLM integration point)

**Single endpoint (or direct client-side call):** `POST /breakdown`

Request:
```json
{
  "problem_text": "string, user's free-text input",
  "current_energy": "number"
}
```

Response (structured JSON from the LLM call):
```json
{
  "missions": [
    { "title": "string", "action_text": "string", "drafted_content": "string|null" }
  ],
  "panda_dialogue": "string, in-character response text",
  "energy_cost": "number",
  "refusal": "boolean, true if energy_cost exceeds current_energy"
}
```

**System prompt requirements (the real engineering work):**
- Enforce hard cap: never return more than 4 missions regardless of input
- Enforce a consistent panda voice: warm, dryly funny, never corporate-wellness-chirpy, never guilt-inducing
- Enforce mission sizing logic: first mission should always be low-effort/near-zero-friction; later missions can be slightly larger but must remain "doable in a bad day," not "doable eventually"
- When `refusal` is true, return the in-character push-back line instead of a new mission list (e.g. energy-exhausted response), not an error or empty state

## Frontend Architecture

- **Component hierarchy:** `App` → `InputScreen` | `BreakdownScreen` | `RefusalState` | `GroveScreen`, with a small shared `EnergyBar` component and `PandaDialogueBubble` component reused across screens for visual/voice consistency
- **Routing:** Not required — this is a single linear flow within one page; use conditional rendering based on `AppState`, not a router, to minimize complexity and demo risk
- **State management:** Local component state or a single lightweight context provider is sufficient given the small state shape above; no external state library needed

## Backend Architecture
Minimal or none. If direct client-side LLM calls are undesirable (API key exposure), use a single thin serverless function that proxies the `/breakdown` request to the LLM API and returns the structured JSON — no additional business logic belongs server-side.

## External Integrations
- One LLM API for the structured breakdown call (JSON-mode/structured output if the provider supports it, to avoid parsing failures live during judging)
- No sponsor APIs required per Phase 1 analysis (ImpactForge has no named sponsor integrations)

## Deployment Strategy
- Static frontend deploy (e.g. Vercel/Netlify-equivalent) with the serverless function (if used) co-located
- Pre-seeded demo state should be a hardcoded/flagged path (`demo_seeded: true`) reachable via a dedicated URL or button, so the grown-grove demo moment never depends on live data or timing
- Verify the full demo script (Phase 4) end-to-end on the deployed build, not just localhost, before submission — deployment-only bugs are a common avoidable Build Quality loss
