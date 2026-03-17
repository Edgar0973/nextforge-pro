export const DEFAULT_TIME_ZONE = "America/New_York";

export function formatInNJ(
  input: string | number | Date,
  opts?: Intl.DateTimeFormatOptions
) {
  const d = input instanceof Date ? input : new Date(input);
  return new Intl.DateTimeFormat("en-US", {
    timeZone: DEFAULT_TIME_ZONE,
    dateStyle: "medium",
    timeStyle: "short",
    ...opts,
  }).format(d);
}