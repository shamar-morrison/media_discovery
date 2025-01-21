/**
 * Groups elements from an iterable based on the return value of the callback function.
 * The callback function should return a string or symbol that will be used as a key in the resulting object.
 * This function works like `Object.groupBy` but this one works in RN.
 *
 * @param iterable - The input iterable to group
 * @param callbackFn - Function that returns a string or symbol key for each element
 * @returns An object with arrays of elements grouped by the callback return values
 */
export function groupBy<T, K extends string | symbol>(
  iterable: Iterable<T>,
  callbackFn: (element: T) => K,
): Record<K extends symbol ? string : K, T[]> {
  const result = {} as Record<K extends symbol ? string : K, T[]>;

  for (const element of iterable) {
    // Get the key from callback and coerce to string if needed
    const key = callbackFn(element).toString() as K extends symbol ? string : K;

    // Initialize array if key doesn't exist
    if (!(key in result)) {
      result[key] = [];
    }

    // Add element to appropriate group
    result[key].push(element);
  }

  return result;
}
