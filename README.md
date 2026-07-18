# 🐼 PocketPanda

**A low-energy panda companion that turns an overwhelming problem into the 2–4 things you can actually do today — and refuses to give you more.**

Every productivity tool competes by giving you more: more tasks, more tracking, more dashboards. PocketPanda does the opposite, on purpose. Pandas conserve energy and rest — so the panda has a limited daily energy budget. It breaks your problem into a small number of tiny, doable missions, then visibly refuses to give you more once its energy runs out, sending you off to rest instead of spiraling into a bigger list.

Progress shows up as a slowly growing bamboo grove — not a guilt-inducing streak counter.

## Try it

Type whatever's overwhelming you into the input — a syllabus, a messy room, an inbox you're avoiding. The panda hands you 2–4 small missions (with a drafted email/message where useful), and its energy bar drops with every request. Ask for more once it's out, and it says no — in character.

Add `?demo=true` to the URL to see a "3 weeks in" grown bamboo grove without needing real history.

## What's actually implemented

- **Free-text problem → structured breakdown.** One LLM call (Groq, `llama-3.3-70b-versatile`) returns a hard-capped 2–4 missions via forced tool-calling — never free-text parsing, so a malformed response is structurally impossible, not just handled.
- **Server-side validation guardrail** that silently retries once if the model ever breaks its own rules (e.g. returns 5 missions), with unit tests covering the validator.
- **The refusal mechanic.** Energy is tracked client-side and sent with every request; when the cost would exceed what's left, the panda returns an in-character refusal instead of new missions — verified reliable across repeated live trials, not just designed to work.
- **Drafted first steps.** When a mission involves writing to someone (an email, a text, an apology), the model drafts a short ready-to-send message, copyable with one click.
- **Persistent bamboo grove.** Every completed mission grows the grove, stored in `localStorage` — with a hardcoded seeded state for demo reliability, independent of live data.
- **A hand-illustrated scroll intro** ("Follow the Panda") — GSAP + Lenis scroll-driven film built around four Higgsfield-generated storybook plates of the same panda character, leading the visitor through a bamboo forest into the real, working input screen. No `<video>` scrubbing (which stutters) — plates crossfade with Ken Burns motion, ambient mist, and wandering fireflies, all GPU-composited (verified flat ~17ms frame budget, no jank).
- **Graceful degradation everywhere:** network failures fall back to an in-character line instead of a raw error; `prefers-reduced-motion` gets a static poster instead of the scroll film; empty/short/rambling input all produce sensible breakdowns instead of errors.

## Tech stack

- **Frontend:** React 19 + Vite, plain CSS (no framework) — Fraunces + Nunito type pairing
- **LLM:** Groq (`llama-3.3-70b-versatile`) via structured tool-calling
- **Backend:** A single Vercel-style serverless function (`/api/breakdown`) so the API key never reaches the client; mirrored by a Vite dev-middleware for local development without needing `vercel dev`
- **Art:** Higgsfield (Nano Banana) for the scroll-film illustrations, chained from one reference image for character consistency
- **Motion:** GSAP + ScrollTrigger + Lenis for the scroll-driven film
- **State:** React Context + `localStorage`, no database, no auth — deliberately out of scope for this build

## Architecture

```
[React SPA]
   |
   |-- ScrollFilm (intro)         — GSAP-scrubbed painted plates, melts into ↓
   |-- InputScreen                — free-text problem
   |-- BreakdownScreen            — missions + energy bar + panda dialogue
   |-- RefusalState               — in-character push-back when energy is spent
   |-- GroveScreen                — persistent progress visual
   |
   v
[POST /api/breakdown]  — Vercel serverless function
   |
   v
[Groq structured tool-call]  — forced schema, silent-retry guardrail
   |
   v
[Client state: energy_level, grove_count]  — Context + localStorage
```

## Running locally

```bash
npm install
cp .env.example .env   # add your GROQ_API_KEY
npm run dev
```

## Project docs

- [`full_context.md`](./full_context.md) — vision, problem, target users, differentiators
- [`product_spec.md`](./product_spec.md) — requirements, user stories, edge cases, feature priority
- [`engineering_spec.md`](./engineering_spec.md) — architecture, data model, API design
