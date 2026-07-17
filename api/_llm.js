import Anthropic from '@anthropic-ai/sdk';
import { SYSTEM_PROMPT } from './_prompt.js';

// Structured output via forced tool-use: the LLM must call this tool, so its
// arguments are guaranteed to match this JSON schema — no free-text parsing,
// no risk of a malformed response live during judging.
const BREAKDOWN_TOOL = {
  name: 'return_breakdown',
  description: 'Return the panda breakdown response for the user\'s problem.',
  input_schema: {
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
};

let client;
function getClient() {
  if (!client) {
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return client;
}

/**
 * Calls the LLM to produce a structured panda breakdown.
 * @param {string} problem_text
 * @param {number} current_energy
 * @returns {Promise<{missions: Array, panda_dialogue: string, energy_cost: number, refusal: boolean}>}
 */
export async function callBreakdownLLM(problem_text, current_energy) {
  const response = await getClient().messages.create({
    model: 'claude-sonnet-5',
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    tools: [BREAKDOWN_TOOL],
    tool_choice: { type: 'tool', name: 'return_breakdown' },
    messages: [
      {
        role: 'user',
        content: `problem_text: ${problem_text}\ncurrent_energy: ${current_energy}`,
      },
    ],
  });

  const toolUse = response.content.find((block) => block.type === 'tool_use');
  if (!toolUse) {
    throw new Error('LLM did not return a tool_use block');
  }
  return toolUse.input;
}
