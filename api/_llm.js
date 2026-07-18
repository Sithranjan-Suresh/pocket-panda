import Groq from 'groq-sdk';
import { SYSTEM_PROMPT } from './_prompt.js';
import { isValidBreakdownResponse } from './_validate.js';

// Structured output via forced tool-calling: the LLM must call this function, so its
// arguments are guaranteed to match this JSON schema — no free-text parsing,
// no risk of a malformed response live during judging.
const BREAKDOWN_TOOL = {
  type: 'function',
  function: {
    name: 'return_breakdown',
    description: "Return the panda breakdown response for the user's problem.",
    parameters: {
      type: 'object',
      properties: {
        missions: {
          type: 'array',
          maxItems: 4,
          items: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              action_text: { type: 'string' },
              drafted_content: { type: ['string', 'null'] },
            },
            required: ['title', 'action_text'],
          },
        },
        panda_dialogue: { type: 'string' },
        energy_cost: { type: 'number' },
        refusal: { type: 'boolean' },
      },
      required: ['missions', 'panda_dialogue', 'energy_cost', 'refusal'],
    },
  },
};

// Step 1 of the pipeline: a lightweight planning pass. The model reads the
// raw problem before any mission-drafting instructions bias it, and commits
// to a mission count + energy cost with a one-line rationale. Step 2 then
// generates the actual missions conditioned on this plan, rather than
// deciding sizing and content in the same breath.
const PLAN_TOOL = {
  type: 'function',
  function: {
    name: 'return_plan',
    description: "Assess how overwhelmed the user sounds and plan the shape of the response before drafting it.",
    parameters: {
      type: 'object',
      properties: {
        overwhelm_level: { type: 'string', enum: ['tiny', 'mild', 'moderate', 'severe'] },
        rationale: { type: 'string', description: 'One short sentence: why this level, and what that implies for mission count/sizing.' },
        recommended_mission_count: { type: 'number', description: '1-4' },
        recommended_energy_cost: { type: 'number', description: 'Typically 10-40' },
      },
      required: ['overwhelm_level', 'rationale', 'recommended_mission_count', 'recommended_energy_cost'],
    },
  },
};

const PLAN_SYSTEM_PROMPT = `You are the planning step for PocketPanda, a low-energy panda companion that breaks
overwhelming problems into 2-4 tiny missions. Before any missions are drafted, read the user's
raw problem and current_energy, and commit to a plan: how overwhelmed do they sound (tiny/mild/moderate/severe),
how many missions that warrants (1-4 — small problems deserve 1-2, do not inflate), and what energy_cost
that should draw (typically 10-40, higher for more emotionally/practically demanding problems).
Be honest and calibrated — this plan directly controls what happens next, so do not default to the same
answer every time. Respond with the tool call only.`;

const MODEL = 'llama-3.3-70b-versatile';

let client;
function getClient() {
  if (!client) {
    client = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return client;
}

/**
 * Step 1: plan the shape of the response (severity read, mission count, energy
 * cost) before any mission content is drafted. Best-effort — returns null on
 * any failure so the pipeline can fall back to a single-call breakdown rather
 * than ever blocking on this step.
 * @returns {Promise<{overwhelm_level: string, rationale: string, recommended_mission_count: number, recommended_energy_cost: number} | null>}
 */
async function planBreakdown(problem_text, current_energy) {
  try {
    const response = await getClient().chat.completions.create({
      model: MODEL,
      max_tokens: 256,
      messages: [
        { role: 'system', content: PLAN_SYSTEM_PROMPT },
        { role: 'user', content: `problem_text: ${problem_text}\ncurrent_energy: ${current_energy}` },
      ],
      tools: [PLAN_TOOL],
      tool_choice: { type: 'function', function: { name: 'return_plan' } },
    });
    const toolCall = response.choices[0]?.message?.tool_calls?.[0];
    if (!toolCall) return null;
    return JSON.parse(toolCall.function.arguments);
  } catch {
    return null;
  }
}

/**
 * Step 2: draft the actual missions/dialogue, conditioned on the plan from
 * step 1 when available.
 */
async function requestBreakdown(problem_text, current_energy, plan) {
  const planContext = plan
    ? `\n\nPlanning pass already assessed this: overwhelm_level=${plan.overwhelm_level}, ` +
      `rationale="${plan.rationale}", recommended_mission_count=${plan.recommended_mission_count}, ` +
      `recommended_energy_cost=${plan.recommended_energy_cost}. Follow this plan unless it conflicts ` +
      `with current_energy (if recommended_energy_cost exceeds current_energy, refuse instead).`
    : '';

  const response = await getClient().chat.completions.create({
    model: MODEL,
    max_tokens: 1024,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'user',
        content: `problem_text: ${problem_text}\ncurrent_energy: ${current_energy}${planContext}`,
      },
    ],
    tools: [BREAKDOWN_TOOL],
    tool_choice: { type: 'function', function: { name: 'return_breakdown' } },
  });

  const toolCall = response.choices[0]?.message?.tool_calls?.[0];
  if (!toolCall) {
    throw new Error('LLM did not return a tool call');
  }
  return JSON.parse(toolCall.function.arguments);
}

const MAX_ATTEMPTS = 2;

/**
 * Two-step pipeline: plan the response shape, then draft it conditioned on
 * that plan — retrying the draft step once (silently) if it fails validation.
 * The planning step is best-effort; if it fails, the draft step proceeds
 * unconditioned rather than ever blocking the user-facing call.
 * @param {string} problem_text
 * @param {number} current_energy
 * @returns {Promise<{missions: Array, panda_dialogue: string, energy_cost: number, refusal: boolean}>}
 */
export async function callBreakdownLLM(problem_text, current_energy) {
  const plan = await planBreakdown(problem_text, current_energy);

  let lastError;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const result = await requestBreakdown(problem_text, current_energy, plan);
      if (isValidBreakdownResponse(result)) {
        return result;
      }
      lastError = new Error('LLM response failed validation');
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError;
}
