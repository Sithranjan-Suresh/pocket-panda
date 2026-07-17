import PandaAvatar from './PandaAvatar.jsx';

export default function LoadingPanda() {
  return (
    <div className="loading-panda" role="status" aria-live="polite">
      <PandaAvatar state="thinking" className="loading-panda__avatar loading-panda__avatar--chewing" />
      <p className="loading-panda__text">Chewing on it...</p>
    </div>
  );
}
