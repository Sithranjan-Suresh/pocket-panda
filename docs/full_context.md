# PocketPanda — Full Context

## Vision
**One sentence:** A low-energy panda companion that turns an overwhelming problem into the 2–4 things you can actually do today — and refuses to give you more.

**One paragraph:** PocketPanda exists for the moment someone freezes — staring at a syllabus, an inbox, a messy apartment — and closes the laptop instead of starting. Every existing productivity tool competes by giving people more: more tasks, more tracking, more dashboards. PocketPanda does the opposite, and it's not a gimmick — it's built into the character. Pandas are famously low-energy animals that conserve and rest. So the panda has a limited daily energy budget: it breaks your problem down, hands you a small number of tiny, doable missions, and then — visibly, in-character — refuses to give you more, sending you off to rest instead of spiraling into a bigger list. Progress shows up as a slowly growing bamboo grove, not a guilt-inducing streak counter.

## Problem
People in a state of overwhelm don't fail to act because they lack a task list — they fail because the size of the list itself is what's paralyzing them. Existing productivity and AI task-breakdown tools solve the wrong problem: they generate *more* structure (more subtasks, more categories, more tracked metrics), which for someone already frozen makes the mountain feel taller, not smaller. There's no widely-used tool whose core promise is deliberately doing *less* for you, on purpose, as an act of care.

## Target Users
**Who:** Students (primary) and anyone else hit by sudden overwhelm — a syllabus at 11pm, an unanswered pile of emails, a messy room, an avoided conversation.
**What they currently do:** Nothing (avoidance/freeze), or open a generic to-do app that dumps the full scope of the problem back at them as a long list, which reinforces the freeze.
**Why that's painful:** The tools meant to help amplify the exact feeling that caused the paralysis in the first place — bigness.

## User Journey (end-to-end)
1. Land on a single input: "What's sitting on your chest?"
2. Paste the overwhelming problem, no setup or account required to try it
3. Panda "thinks" (short bamboo-chewing loading animation) and returns 2–4 small, concrete missions with in-character dialogue, plus a visible energy bar that drops
4. User completes a mission (or asks for more — panda pushes back once energy is spent, in character)
5. Over repeated visits, a bamboo grove grows — one stalk per completed mission — as the only persistence/reward mechanic
6. No streak-breaking, no guilt messaging, ever

## Core Features (what exists at submission)
1. Single-input problem breakdown → 2–4 sized missions with drafted first steps where possible (e.g. a drafted email)
2. Panda voice: consistent, warm, dryly funny, in-character dialogue on every response
3. Visible daily energy bar that depletes with each breakdown/mission and triggers an in-character refusal state when exhausted
4. Bamboo grove: persistent visual record of completed missions across sessions (pre-seedable for demo purposes)

## Key Differentiators
- **The mascot is functional, not decorative** — panda's real-world trait (low energy, rests often) is the literal product mechanic, not flavor text
- **It refuses.** No competitor AI tool says no to a user asking for more — this is the single most memorable, demo-able moment in the product
- **No guilt mechanics** — deliberately the opposite of streak-based habit apps; missing a day costs nothing

## Technical Overview
- **Stack:** Single-page React frontend, one structured LLM call per breakdown (JSON output: missions array + panda dialogue text + energy cost)
- **State:** Client-side/local persistence for energy level and grove count — no auth, no backend database required for submission
- **Key technical bet:** Prompt engineering quality — mission sizing judgment (a 2-minute email vs. "study chapter 3") and consistent panda voice are the real engineering work here, not infrastructure

## Demo Flow
See demo script (Phase 4) — cold open on sleeping panda → live input → 3 missions returned → live "give me more" attempt → in-character refusal (the wow moment) → cut to pre-seeded grown bamboo grove → impact line close.

## Success Metrics
- **Technical:** Breakdown always returns 2–4 missions (never more), refusal state triggers reliably once energy is exhausted, zero crashes during a live demo run-through
- **Product:** A judge who has seen 40 other submissions remembers "the AI that said no" specifically
- **Judging alignment:** Strong scores across Build Quality (small reliable scope), Impact (named beneficiary), Creativity (refusal mechanic), UX (single-input simplicity), Clarity (one-sentence pitch, one clear demo moment)

## Future Expansion (for judges to imagine, not build)
1. Panda "moods" that shift the tone of its dialogue based on how consistently a user returns (never punitive — always gentle)
2. Shareable grove snapshots ("3 weeks with PocketPanda") as a soft viral/community loop
3. Optional integration with calendar/assignment sources so missions can be time-aware without the user manually describing the problem
