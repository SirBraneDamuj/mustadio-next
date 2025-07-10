export type CachedFunction<T> = {
  get: () => Promise<T>;
  forceGet: () => Promise<T>;
};

export function cache<T>(
  getValue: () => Promise<T>,
  timeout: number
): CachedFunction<T> {
  let cachedValue: Promise<T> | null = null;
  let isLoading = false;
  let timestamp = new Date();

  const get = async (force: boolean = false) => {
    if (isLoading) {
      return await cachedValue;
    }
    if (
      force ||
      !cachedValue ||
      new Date().getTime() - timestamp.getTime() > timeout
    ) {
      isLoading = true;
      try {
        cachedValue = getValue();
        await cachedValue;
        timestamp = new Date();
      } catch (e) {
        cachedValue = null;
        throw e;
      } finally {
        isLoading = false;
      }
    }
    return cachedValue;
  };
  return {
    get: () => get(),
    forceGet: () => get(true),
  } as CachedFunction<T>;
}
