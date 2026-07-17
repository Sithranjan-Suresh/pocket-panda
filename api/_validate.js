// Silent guardrail: even with forced tool-use, defend against a malformed or
// rule-breaking LLM response (e.g. >4 missions) before it ever reaches the client.

/**
 * @param {unknown} data
 * @returns {boolean}
 */
export function isValidBreakdownResponse(data) {
  if (!data || typeof data !== 'object') return false;
  if (!Array.isArray(data.missions)) return false;
  if (data.missions.length > 4) return false;
  if (typeof data.panda_dialogue !== 'string' || data.panda_dialogue.length === 0) return false;
  if (typeof data.energy_cost !== 'number') return false;
  if (typeof data.refusal !== 'boolean') return false;

  return data.missions.every(
    (m) =>
      m &&
      typeof m === 'object' &&
      typeof m.title === 'string' &&
      typeof m.action_text === 'string' &&
      (m.drafted_content === null || m.drafted_content === undefined || typeof m.drafted_content === 'string')
  );
}
