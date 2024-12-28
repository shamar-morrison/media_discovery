export function formatMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (hours === 0) {
    return `${remainingMinutes} mins`;
  }
  return `${String(hours).padStart(2, "0")} hrs ${String(
    remainingMinutes,
  ).padStart(2, "0")} mins`;
}
