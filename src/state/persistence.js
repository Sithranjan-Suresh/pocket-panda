const STORAGE_KEY = 'pocketpanda_state_v1';

function todayKey() {
  return new Date().toDateString(); // e.g. "Fri Jul 18 2026" — local calendar day
}

/**
 * Loads persisted energy_level / grove_count / saved_day from localStorage, if present.
 * @returns {{energy_level?: number, grove_count?: number, saved_day?: string}}
 */
export function loadPersistedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return {
      energy_level: typeof parsed.energy_level === 'number' ? parsed.energy_level : undefined,
      grove_count: typeof parsed.grove_count === 'number' ? parsed.grove_count : undefined,
      saved_day: typeof parsed.saved_day === 'string' ? parsed.saved_day : undefined,
    };
  } catch {
    return {};
  }
}

/**
 * Persists energy_level / grove_count to localStorage, stamped with today's
 * calendar day so a future visit can tell whether a new day has begun.
 * @param {{energy_level: number, grove_count: number}} state
 */
export function savePersistedState({ energy_level, grove_count }) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ energy_level, grove_count, saved_day: todayKey() }));
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

/**
 * True if the persisted state was last saved on an earlier calendar day than
 * today (local time) — the panda's energy resets once per day, like the
 * product concept describes.
 * @param {{saved_day?: string}} loaded
 * @returns {boolean}
 */
export function isNewDay(loaded) {
  return typeof loaded.saved_day === 'string' && loaded.saved_day !== todayKey();
}
