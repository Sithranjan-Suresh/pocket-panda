export default function LoadingPanda() {
  return (
    <div className="loading-panda" role="status" aria-live="polite">
      <div className="loading-panda__avatar loading-panda__avatar--chewing" aria-hidden="true">🐼🎋</div>
      <p className="loading-panda__text">Chewing on it...</p>
    </div>
  );
}
