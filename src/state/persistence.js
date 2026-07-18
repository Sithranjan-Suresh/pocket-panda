const STORAGE_KEY = 'pocketpanda_state_v1';

/**
 * Loads persisted energy_level / grove_count from localStorage, if present.
 * @returns {{energy_level?: number, grove_count?: number}}
 */
export function loadPersistedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return {
      energy_level: typeof parsed.energy_level === 'number' ? parsed.energy_level : undefined,
      grove_count: typeof parsed.grove_count === 'number' ? parsed.grove_count : undefined,
    };
  } catch {
    return {};
  }
}

/**
 * Persists energy_level / grove_count to localStorage.
 * @param {{energy_level: number, grove_count: number}} state
 */
export function savePersistedState({ energy_level, grove_count }) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ energy_level, grove_count }));
  } catch {
    // localStorage unavailable (e.g. private browsing) — persistence is best-effort only.
  }
}

/**
 * Whether this browser has been here before — used to skip the scroll-film
 * intro on repeat visits and land straight on the functional app.
 * @returns {boolean}
 */
export function hasPriorVisit() {
  try {
    return localStorage.getItem(STORAGE_KEY) !== null;
  } catch {
    return false;
  }
}
