export function timeSince(timestamp: number) {
  const now = Date.now();
  const elapsed = now - timestamp;

  const units = [
    { label: "y", milliseconds: 31557600000 },
    { label: "m", milliseconds: 2629800000 },
    { label: "w", milliseconds: 604800000 },
    { label: "d", milliseconds: 86400000 },
    { label: "h", milliseconds: 3600000 },
    { label: "m", milliseconds: 60000 },
    { label: "s", milliseconds: 1000 },
  ];

  for (const unit of units) {
    const interval = Math.floor(elapsed / unit.milliseconds);
    if (interval >= 1) {
      return `${interval}${unit.label}`;
    }
  }
  return "just now";
}

const timestamp = 1722020259607;

export function timeSinceExpanded(timestamp: number) {
  const now = Date.now();
  const elapsed = now - timestamp;

  const units = [
    { label: "year", milliseconds: 31557600000 },
    { label: "month", milliseconds: 2629800000 },
    { label: "week", milliseconds: 604800000 },
    { label: "day", milliseconds: 86400000 },
    { label: "hour", milliseconds: 3600000 },
    { label: "minute", milliseconds: 60000 },
    { label: "second", milliseconds: 1000 },
  ];

  for (const unit of units) {
    const interval = Math.floor(elapsed / unit.milliseconds);
    if (interval >= 1) {
      return `${interval} ${unit.label}`;
    }
  }
  return "just now";
}
