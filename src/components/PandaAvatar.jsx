const STATE_EMOJI = {
  thinking: '🐼🎋',
  delivering: '🐼',
  refusing: '🐼💤',
};

export default function PandaAvatar({ state = 'delivering', className = '' }) {
  return (
    <div className={`panda-avatar panda-avatar--${state} ${className}`} aria-hidden="true">
      {STATE_EMOJI[state] ?? STATE_EMOJI.delivering}
    </div>
  );
}
