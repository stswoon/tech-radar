/**
 * Простой детерминированный «рандом» по строке,
 * чтобы точки всегда ставились одинаково при одном и том же id.
 */
export function hashStringToUnit(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  const result = hash / 0xffffffff;
  return result;
}
