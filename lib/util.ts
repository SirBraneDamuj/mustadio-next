export function parseIntOrThrow(
  value: string,
  errorMessage = "Invalid integer"
): number {
  const result = parseInt(value);
  if (isNaN(result)) {
    throw new Error(errorMessage);
  }
  return result;
}

export function toNumber(s: string | undefined | null): number {
  if (!s) {
    return 0;
  }
  return parseInt(s, 10);
}

export function groupBy<T, K extends string | number | symbol>(
  array: T[],
  keyFn: (item: T) => K
): Record<K, T[]> {
  return array.reduce(
    (result, item) => {
      const key = keyFn(item);
      if (!result[key]) {
        result[key] = [];
      }
      result[key].push(item);
      return result;
    },
    {} as Record<K, T[]>
  );
}
