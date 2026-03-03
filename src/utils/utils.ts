import type {RadarQuadrant} from "./types.ts";

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

export const quadrantsWithAnglesUtil = (quadrants: RadarQuadrant[]) => {
    const angleStep = (2 * Math.PI) / Math.max(quadrants.length, 1);
    return quadrants.map((q, index) => ({
        ...q,
        startAngle: index * angleStep,
        endAngle: (index + 1) * angleStep,
    }));
};

/**
 * Сравнивает два вещественных числа с заданной точностью.
 * @param a Первое число.
 * @param b Второе число.
 * @param precision Точность сравнения (количество знаков после запятой). По умолчанию 3.
 * @returns true, если числа равны с заданной точностью, иначе false.
 */
export const isApproximatelyEqual = (a: number, b: number, precision: number = 3): boolean => {
    const factor = Math.pow(10, precision);
    return Math.round(a * factor) === Math.round(b * factor);
};