import EnergyBar from './EnergyBar.jsx';

export default function RefusalState({ pandaDialogue, energy, energyMax, onGoToGrove, onNewProblem }) {
  return (
    <div className="refusal-state">
      <div className="refusal-state__avatar" aria-hidden="true">🐼💤</div>
      <EnergyBar energy={energy} energyMax={energyMax} />
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
