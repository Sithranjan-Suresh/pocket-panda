import EnergyBar from './EnergyBar.jsx';
import PandaDialogueBubble from './PandaDialogueBubble.jsx';

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
      {mission.drafted_content && (
        <div className="mission-card__draft">
          <p className="mission-card__draft-text">{mission.drafted_content}</p>
        </div>
      )}
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
      </div>
    </div>
  );
}
