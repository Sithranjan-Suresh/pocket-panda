/**
 * @typedef {Object} Mission
 * @property {string} id
 * @property {string} title
 * @property {string} action_text          - the concrete step
 * @property {string|null} [drafted_content] - optional pre-written email/message text
 * @property {boolean} completed
 */

/**
 * Builds a Mission from a raw LLM response entry, filling in local-only fields.
 * @param {{title: string, action_text: string, drafted_content?: string|null}} raw
 * @returns {Mission}
 */
export function createMission(raw) {
  return {
    id: crypto.randomUUID(),
    title: raw.title,
    action_text: raw.action_text,
    drafted_content: raw.drafted_content ?? null,
    completed: false,
  };
}
