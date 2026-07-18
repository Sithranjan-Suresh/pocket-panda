export default function EnergyBar({ energy, energyMax, justReset }) {
  const pct = Math.max(0, Math.min(100, (energy / energyMax) * 100));

  return (
    <div className="energy-bar" role="meter" aria-valuenow={energy} aria-valuemin={0} aria-valuemax={energyMax}>
      <div className="energy-bar__label">Panda energy</div>
      <div className="energy-bar__track">
        <div
          className={`energy-bar__fill${justReset ? ' energy-bar__fill--reset' : ''}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="energy-bar__value">{energy} / {energyMax}</div>
    </div>
  );
}
