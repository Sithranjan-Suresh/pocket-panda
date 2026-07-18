// Vercel serverless function: POST /api/breakdown
// Proxies the structured breakdown call to the LLM so the Groq API key
// never reaches the client bundle (see engineering_spec.md Backend Architecture).

import { callBreakdownLLM } from './_llm.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { problem_text, current_energy } = req.body ?? {};

  if (typeof problem_text !== 'string' || typeof current_energy !== 'number') {
    res.status(400).json({ error: 'problem_text (string) and current_energy (number) are required' });
    return;
  }

  try {
    const result = await callBreakdownLLM(problem_text, current_energy);
    res.status(200).json(result);
  } catch (err) {
    console.error('breakdown LLM call failed:', err);
    // Stay in character even on failure — never surface a raw error to the user.
    res.status(200).json({
      missions: [],
      panda_dialogue: "Hmm, my brain fogged up for a second there. Try that again?",
      energy_cost: 0,
      refusal: false,
    });
  }
}
