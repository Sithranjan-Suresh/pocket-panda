import { useState } from 'react';
import EnergyBar from './EnergyBar.jsx';
import PandaDialogueBubble from './PandaDialogueBubble.jsx';

function DraftedContent({ text }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard API unavailable — the drafted text is still visible to copy manually
    }
  }

  return (
    <div className="mission-card__draft">
      <p className="mission-card__draft-text">{text}</p>
      <button type="button" className="mission-card__copy" onClick={handleCopy}>
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  );
}

function MissionCard({ mission, onToggleComplete }) {
  return (
    <li className={`mission-card${mission.completed ? ' mission-card--completed' : ''}`}>
      <label className="mission-card__header">
        <input
          type="checkbox"
          checked={mission.completed}
          onChange={() => onToggleComplete(mission.id)}
        />
        <span className="mission-card__title">{mission.title}</span>
      </label>
      <p className="mission-card__action">{mission.action_text}</p>
      {mission.drafted_content && <DraftedContent text={mission.drafted_content} />}
    </li>
  );
}

export default function BreakdownScreen({
  missions,
  pandaDialogue,
  energy,
  energyMax,
  onToggleComplete,
  onAskForMore,
  onNewProblem,
  onGoToGrove,
  askForMoreDisabled,
}) {
  return (
    <div className="breakdown-screen">
      <EnergyBar energy={energy} energyMax={energyMax} />
      <PandaDialogueBubble text={pandaDialogue} />
      <ul className="breakdown-screen__missions">
        {missions.map((mission) => (
          <MissionCard key={mission.id} mission={mission} onToggleComplete={onToggleComplete} />
        ))}
      </ul>
      <div className="breakdown-screen__actions">
        <button type="button" onClick={onAskForMore} disabled={askForMoreDisabled}>
          Got room for more?
        </button>
        <button type="button" onClick={onNewProblem}>
          Something else is on my chest
        </button>
        <button type="button" onClick={onGoToGrove}>
          View my grove
        </button>
      </div>
    </div>
  );
}
