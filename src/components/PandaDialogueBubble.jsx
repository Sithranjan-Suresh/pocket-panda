export default function PandaDialogueBubble({ text }) {
  return (
    <div className="panda-dialogue">
      <div className="panda-dialogue__avatar" aria-hidden="true">🐼</div>
      <p className="panda-dialogue__text">{text}</p>
    </div>
  );
}
