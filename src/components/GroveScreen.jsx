export default function GroveScreen({ groveCount, onBack }) {
  return (
    <div className="grove-screen">
      <h1 className="grove-screen__title">Your bamboo grove</h1>
      <p className="grove-screen__count">{groveCount} missions completed</p>
      <div className="grove-screen__stalks" aria-label={`${groveCount} bamboo stalks`}>
        {Array.from({ length: groveCount }).map((_, i) => (
          <span key={i} className="grove-screen__stalk" aria-hidden="true">🎋</span>
        ))}
      </div>
      {groveCount === 0 && (
        <p className="grove-screen__empty">Nothing here yet. Complete a mission and it'll grow.</p>
      )}
      <button type="button" onClick={onBack}>
        Back
      </button>
    </div>
  );
}
