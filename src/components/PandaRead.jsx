const LEVEL_LABEL = {
  tiny: 'barely a blip',
  mild: 'a little much',
  moderate: 'genuinely a lot',
  severe: 'a lot, a lot',
};

export default function PandaRead({ read }) {
  if (!read) return null;
  const label = LEVEL_LABEL[read.level] ?? read.level;

  return (
    <p className="panda-read" title={read.rationale}>
      the panda's read: <strong>{label}</strong>
    </p>
  );
}
