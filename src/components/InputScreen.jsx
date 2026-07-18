import { useState } from 'react';
import PandaDialogueBubble from './PandaDialogueBubble.jsx';
import EnergyBar from './EnergyBar.jsx';

export default function InputScreen({
  onSubmit,
  disabled,
  onGoToGrove,
  pandaDialogue,
  energy,
  energyMax,
  energyJustReset,
  justRefused,
}) {
  const [text, setText] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSubmit(trimmed);
  }

  return (
    <form className="input-screen" onSubmit={handleSubmit}>
      <EnergyBar energy={energy} energyMax={energyMax} justReset={energyJustReset} />
      <h1 className="input-screen__prompt">What's sitting on your chest?</h1>
      {justRefused && (
        <p className="input-screen__refused-note">
          The panda's still low on energy from before — maybe just the smallest possible thing.
        </p>
      )}
      {pandaDialogue && <PandaDialogueBubble text={pandaDialogue} />}
      <textarea
        className="input-screen__textarea"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Tell the panda what's overwhelming you..."
        rows={5}
        disabled={disabled}
      />
      <button className="input-screen__submit" type="submit" disabled={disabled || !text.trim()}>
        Hand it to the panda
      </button>
      <button type="button" className="input-screen__grove-link" onClick={onGoToGrove}>
        View my grove
      </button>
    </form>
  );
}
