const STATE_BADGE = {
  thinking: '🎋',
  refusing: '💤',
};

export default function PandaAvatar({ state = 'delivering', className = '' }) {
  return (
    <div className={`panda-avatar panda-avatar--${state} ${className}`} aria-hidden="true">
      <img className="panda-avatar__img" src="/film/panda-icon.webp" alt="" />
      {STATE_BADGE[state] && <span className="panda-avatar__badge">{STATE_BADGE[state]}</span>}
    </div>
  );
}
