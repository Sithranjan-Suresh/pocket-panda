import EnergyBar from './EnergyBar.jsx';
import PandaAvatar from './PandaAvatar.jsx';
import PandaRead from './PandaRead.jsx';

export default function RefusalState({ pandaDialogue, pandaRead, energy, energyMax, onGoToGrove, onNewProblem }) {
  return (
    <div className="refusal-state">
      <PandaAvatar state="refusing" className="refusal-state__avatar" />
      <EnergyBar energy={energy} energyMax={energyMax} />
      <PandaRead read={pandaRead} />
      <p className="refusal-state__text">{pandaDialogue}</p>
      <div className="refusal-state__actions">
        <button type="button" onClick={onGoToGrove}>
          See my grove instead
        </button>
        <button type="button" onClick={onNewProblem}>
          Fine, I'll wait
        </button>
      </div>
    </div>
  );
}
