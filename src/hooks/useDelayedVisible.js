import { useEffect, useState } from 'react';

// Shows a loading state only after `delayMs` of `active` being true, so a fast
// response never flashes a spinner (US-1 acceptance criteria: loading state
// must be visible if the wait exceeds ~2s, but stays invisible for quick ones).
export function useDelayedVisible(active, delayMs = 500) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!active) {
      setVisible(false);
      return;
    }
    const timer = setTimeout(() => setVisible(true), delayMs);
    return () => clearTimeout(timer);
  }, [active, delayMs]);

  return visible;
}
