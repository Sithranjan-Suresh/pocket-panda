import PandaAvatar from './PandaAvatar.jsx';

export default function PandaDialogueBubble({ text }) {
  return (
    <div className="panda-dialogue">
      <PandaAvatar state="delivering" className="panda-dialogue__avatar" />
      <p className="panda-dialogue__text">{text}</p>
    </div>
  );
}
