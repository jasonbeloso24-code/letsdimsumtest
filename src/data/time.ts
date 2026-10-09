// "11 AM" -> "11:00", "9:30 PM" -> "21:30". Returns null for anything else (e.g. "Closed").
export function to24h(label: string): string | null {
  const m = /^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i.exec(label.trim());
  if (!m) return null;
  const h = Number(m[1]);
  if (h < 1 || h > 12) return null;
  const hour = (h % 12) + (m[3].toUpperCase() === 'PM' ? 12 : 0);
  return `${String(hour).padStart(2, '0')}:${m[2] ?? '00'}`;
}
