import { createContext, useContext, useEffect, useState } from 'react';
import { loadPersistedState, savePersistedState } from './persistence.js';

export const ENERGY_MAX = 100;

/**
 * @typedef {Object} AppState
 * @property {number} energy_level   - 0..energy_max, depletes per breakdown/mission
 * @property {number} energy_max     - daily reset ceiling
 * @property {number} grove_count    - total completed missions, drives grove visual
 * @property {boolean} demo_seeded   - true for the pre-seeded "3 weeks" demo account
 * @property {import('./mission.js').Mission[]} current_missions - active breakdown, cleared on new input
 */

/** @type {AppState} */
export const initialAppState = {
  energy_level: ENERGY_MAX,
  energy_max: ENERGY_MAX,
  grove_count: 0,
  demo_seeded: false,
  current_missions: [],
};

/**
 * Hardcoded "3 weeks in" demo state — a grown grove with full energy, reachable
 * via ?demo=true. Never touches localStorage, so the demo moment never depends
 * on live data or timing (see engineering_spec.md Deployment Strategy).
 * @type {AppState}
 */
export const demoSeededState = {
  energy_level: ENERGY_MAX,
  energy_max: ENERGY_MAX,
  grove_count: 47,
  demo_seeded: true,
  current_missions: [],
};

export function isDemoRequested() {
  if (typeof window === 'undefined') return false;
  return new URLSearchParams(window.location.search).get('demo') === 'true';
}

const AppStateContext = createContext(null);

export function AppStateProvider({ children, initialState = initialAppState }) {
  const demoMode = isDemoRequested();

  const [appState, setAppState] = useState(() =>
    demoMode ? demoSeededState : { ...initialState, ...loadPersistedState() }
  );

  useEffect(() => {
    if (demoMode) return; // demo state is never persisted or overwritten
    savePersistedState({ energy_level: appState.energy_level, grove_count: appState.grove_count });
  }, [demoMode, appState.energy_level, appState.grove_count]);

  function updateAppState(partial) {
    setAppState((prev) => ({ ...prev, ...partial }));
  }

  return (
    <AppStateContext.Provider value={{ appState, setAppState, updateAppState }}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return ctx;
}
