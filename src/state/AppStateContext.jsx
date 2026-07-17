import { createContext, useContext, useState } from 'react';

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

const AppStateContext = createContext(null);

export function AppStateProvider({ children, initialState = initialAppState }) {
  const [appState, setAppState] = useState(initialState);

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
