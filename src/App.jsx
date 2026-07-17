import { useState } from 'react';
import InputScreen from './components/InputScreen.jsx';
import BreakdownScreen from './components/BreakdownScreen.jsx';
import RefusalState from './components/RefusalState.jsx';
import GroveScreen from './components/GroveScreen.jsx';
import LoadingPanda from './components/LoadingPanda.jsx';
import { createMission } from './state/mission.js';
import { useAppState } from './state/AppStateContext.jsx';
import { useDelayedVisible } from './hooks/useDelayedVisible.js';
import './App.css';

export default function App() {
  const { appState, updateAppState } = useAppState();
  const [screen, setScreen] = useState('input'); // 'input' | 'breakdown' | 'refusal' | 'grove'
  const [returnScreen, setReturnScreen] = useState('input');
  const [pandaDialogue, setPandaDialogue] = useState('');
  const [loading, setLoading] = useState(false);
  const [problemText, setProblemText] = useState('');
  const showLoading = useDelayedVisible(loading);

  async function requestBreakdown(text) {
    setLoading(true);
    try {
      const res = await fetch('/api/breakdown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problem_text: text, current_energy: appState.energy_level }),
      });
      const data = await res.json();

      setPandaDialogue(data.panda_dialogue);
      if (data.refusal) {
        setScreen('refusal');
      } else {
        updateAppState({
          current_missions: data.missions.map(createMission),
          energy_level: Math.max(0, appState.energy_level - data.energy_cost),
        });
        setScreen('breakdown');
      }
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(text) {
    setProblemText(text);
    requestBreakdown(text);
  }

  function handleAskForMore() {
    requestBreakdown(problemText);
  }

  function handleNewProblem() {
    updateAppState({ current_missions: [] });
    setProblemText('');
    setScreen('input');
  }

  function handleToggleComplete(missionId) {
    const mission = appState.current_missions.find((m) => m.id === missionId);
    if (!mission) return;
    const nowCompleted = !mission.completed;

    updateAppState({
      current_missions: appState.current_missions.map((m) =>
        m.id === missionId ? { ...m, completed: nowCompleted } : m
      ),
      grove_count: Math.max(0, appState.grove_count + (nowCompleted ? 1 : -1)),
    });
  }

  function handleGoToGrove() {
    setReturnScreen(screen);
    setScreen('grove');
  }

  function handleBackFromGrove() {
    setScreen(returnScreen);
  }

  if (loading) {
    return showLoading ? <LoadingPanda /> : null;
  }

  let content;
  if (screen === 'grove') {
    content = <GroveScreen groveCount={appState.grove_count} onBack={handleBackFromGrove} />;
  } else if (screen === 'breakdown') {
    content = (
      <BreakdownScreen
        missions={appState.current_missions}
        pandaDialogue={pandaDialogue}
        energy={appState.energy_level}
        energyMax={appState.energy_max}
        onToggleComplete={handleToggleComplete}
        onAskForMore={handleAskForMore}
        onNewProblem={handleNewProblem}
        onGoToGrove={handleGoToGrove}
        askForMoreDisabled={appState.energy_level <= 0}
      />
    );
  } else if (screen === 'refusal') {
    content = (
      <RefusalState
        pandaDialogue={pandaDialogue}
        energy={appState.energy_level}
        energyMax={appState.energy_max}
        onGoToGrove={handleGoToGrove}
        onNewProblem={handleNewProblem}
      />
    );
  } else {
    content = <InputScreen onSubmit={handleSubmit} disabled={loading} onGoToGrove={handleGoToGrove} />;
  }

  return (
    <div className="screen-transition" key={screen}>
      {content}
    </div>
  );
}
