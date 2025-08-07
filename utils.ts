export function time(date: Date) {
  return date.toLocaleString("en-US", {
    // "8/6/2025, 10:02 PM"
    timeZone: "America/New_York",
    month: "numeric",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function timestamp(date: Date) {
  const unixTimestamp = Math.floor(date.getTime() / 1000);
  return `<t:${unixTimestamp}>`;
}
