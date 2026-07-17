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

const MODEL = 'llama-3.3-70b-versatile';

let client;
function getClient() {
  if (!client) {
    client = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return client;
}

async function requestBreakdown(problem_text, current_energy) {
  const response = await getClient().chat.completions.create({
    model: MODEL,
    max_tokens: 1024,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'user',
        content: `problem_text: ${problem_text}\ncurrent_energy: ${current_energy}`,
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
 * Calls the LLM to produce a structured panda breakdown, retrying once
 * (silently) if the response fails validation — e.g. too many missions or a
 * malformed shape. Throws only if every attempt fails.
 * @param {string} problem_text
 * @param {number} current_energy
 * @returns {Promise<{missions: Array, panda_dialogue: string, energy_cost: number, refusal: boolean}>}
 */
export async function callBreakdownLLM(problem_text, current_energy) {
  let lastError;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const result = await requestBreakdown(problem_text, current_energy);
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
