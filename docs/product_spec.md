# PocketPanda — Product Specification

## Product Requirements (must be true at submission)
1. User can type/paste a free-text description of an overwhelming problem with zero setup
2. System returns exactly 2–4 missions, never more, each with a short concrete action and panda dialogue
3. At least one mission per breakdown includes a drafted first step where applicable (e.g. a pre-written short email/message)
4. An energy bar is visible and decreases with each breakdown and completed mission
5. When energy is exhausted, the panda enters a distinct, in-character refusal state instead of generating more missions
6. Completed missions increment a persistent bamboo grove visual that is visibly different between a fresh session and a "3-weeks-in" session
7. A pre-seeded demo account/state exists showing a grown grove, for reliable live demo use
8. No user accounts, login, or backend persistence required for judging — local/session state is sufficient

## User Stories

**US-1:** As an overwhelmed student, I want to describe my problem in plain language so that I don't have to structure my own to-do list.
- *Acceptance criteria:* Free-text input accepts any length; system returns a breakdown within a reasonable wait (loading state must be visible if >2 seconds).

**US-2:** As a user, I want the panda to give me only a few small tasks so that the response itself doesn't feel overwhelming.
- *Acceptance criteria:* Response never exceeds 4 missions regardless of input length or complexity; first mission is always low-effort/low-friction.

**US-3:** As a user, I want the panda to push back if I ask for more than it's willing to give, so the product's promise ("does less, on purpose") feels real, not just marketing copy.
- *Acceptance criteria:* Once energy is exhausted (or user explicitly requests more tasks), system returns a distinct in-character refusal message instead of a new mission list.

**US-4:** As a returning user, I want to see evidence of my past progress so that I feel continuity without being shamed for gaps.
- *Acceptance criteria:* Grove visual reflects cumulative completed missions; no streak counter, no "you missed X days" messaging exists anywhere in the product.

**US-5:** As a judge evaluating this in 90 seconds, I want the product's core idea to be obvious without explanation so that I understand it without narration.
- *Acceptance criteria:* The energy bar and refusal state communicate the "limited, on purpose" concept visually, independent of any spoken explanation.

## Edge Cases to Handle
- Empty or extremely short input (e.g. "help") → panda should still return a gentle, generic small mission set rather than erroring
- User submits an already-tiny problem ("I need to reply to one text") → system should not artificially inflate to more missions; 1–2 is fine
- User immediately asks for more tasks before completing any → refusal logic should still trigger correctly based on energy state, not mission count alone
- Very long/rambling input → breakdown should still cap at 4 missions and not attempt to address every sentence literally
- Repeated identical input → acceptable to return a similar but not necessarily identical breakdown (no requirement for exact caching)

## Feature Priority

| Feature | Priority | Notes |
|---|---|---|
| Free-text input → 2–4 mission breakdown | P0 | Core loop; demo cannot happen without it |
| Panda voice/dialogue on every response | P0 | Differentiator; central to Creativity/UX scoring |
| Energy bar + refusal state | P0 | The designed wow moment; non-negotiable |
| Pre-seeded grown bamboo grove for demo | P0 | Needed to show persistence without waiting real days |
| Live-session grove increment on mission completion | P1 | Strengthens the story but refusal moment carries the demo without it |
| Drafted first-step content (e.g. drafted email) inside a mission | P1 | High perceived value, moderate effort |
| Visual polish (illustration, animation, transitions) | P2 | Do last; only after P0/P1 are stable |
| Any accounts/auth/backend persistence | Cut | Explicitly out of scope for submission |
