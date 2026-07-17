import { useState } from 'react';
import InputScreen from './components/InputScreen.jsx';
import BreakdownScreen from './components/BreakdownScreen.jsx';
import RefusalState from './components/RefusalState.jsx';
import LoadingPanda from './components/LoadingPanda.jsx';
import { createMission } from './state/mission.js';
import { useAppState } from './state/AppStateContext.jsx';
import { useDelayedVisible } from './hooks/useDelayedVisible.js';
import './App.css';

export default function App() {
  const { appState, updateAppState } = useAppState();
  const [screen, setScreen] = useState('input'); // 'input' | 'breakdown' | 'refusal'
  const [pandaDialogue, setPandaDialogue] = useState('');
  const [loading, setLoading] = useState(false);
  const showLoading = useDelayedVisible(loading);

  function handleSubmit(problemText) {
    setLoading(true);
    // Stub response to prove out screen routing — replaced by a real
    // /breakdown fetch call in the next task.
    setTimeout(() => {
      setLoading(false);
      setPandaDialogue("Okay. Two things. That's it for now.");
      updateAppState({
        current_missions: [
          createMission({
            title: 'Open the syllabus',
            action_text: "Just open the file. Don't read it yet.",
          }),
        ],
      });
      setScreen('breakdown');
    }, 300);
  }

  function handleNewProblem() {
    updateAppState({ current_missions: [] });
    setScreen('input');
  }

  if (loading) {
    return showLoading ? <LoadingPanda /> : null;
  }

  if (screen === 'breakdown') {
    return (
      <BreakdownScreen
        missions={appState.current_missions}
        pandaDialogue={pandaDialogue}
        energy={appState.energy_level}
        energyMax={appState.energy_max}
        onToggleComplete={() => {}}
        onAskForMore={() => {}}
        onNewProblem={handleNewProblem}
        askForMoreDisabled={false}
      />
    );
  }

  if (screen === 'refusal') {
    return (
      <RefusalState
        pandaDialogue={pandaDialogue}
        energy={appState.energy_level}
        energyMax={appState.energy_max}
        onGoToGrove={() => {}}
        onNewProblem={handleNewProblem}
      />
    );
  }

  return <InputScreen onSubmit={handleSubmit} disabled={loading} />;
}
