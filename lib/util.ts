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

export function cardinalities<T extends string | number | symbol>(
  items: T[]
): Record<T, number> {
  return items.reduce(
    (acc, item) => {
      acc[item] = (acc[item] || 0) + 1;
      return acc;
    },
    {} as Record<T, number>
  );
}

export function pick<T extends object, K extends keyof T>(
  obj: T,
  ...keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }
  return result;
}
