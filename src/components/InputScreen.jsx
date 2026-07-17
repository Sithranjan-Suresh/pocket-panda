import { useState } from 'react';

export default function InputScreen({ onSubmit, disabled, onGoToGrove }) {
  const [text, setText] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSubmit(trimmed);
  }

  return (
    <form className="input-screen" onSubmit={handleSubmit}>
      <h1 className="input-screen__prompt">What's sitting on your chest?</h1>
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
