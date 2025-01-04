import clsx, { type ClassValue } from "clsx";

/**
 * Combines the provided class values into a single string for use with NativeWind,
 * handling React Native's styling limitations.
 *
 * Key differences from web version:
 * - No CSS cascading, so later classes completely override earlier ones
 * - No complex CSS selectors or pseudo-classes
 * - Handles only direct class names, no nested structures
 *
 * @example
 * const isActive = true;
 * const styles = nativeClassNames(
 *   'bg-blue-500',
 *   isActive && 'bg-green-500',
 *   'p-4'
 * );
 * // Result: 'bg-green-500 p-4'
 *
 * @param inputs - The classes to combine
 * @returns A string of space-separated class names, with conflicts resolved
 */
function nativeClassNames(...inputs: ClassValue[]): string {
  // combine all inputs into a single string
  const combinedClasses = clsx(inputs);

  // Split into individual classes
  const classes = combinedClasses.split(" ").filter(Boolean);

  // Create a map to store the latest value for each prefix
  const prefixMap = new Map<string, string>();

  // Process each class
  classes.forEach((className: string) => {
    // Handle special cases like 'flex' or 'hidden'
    if (["flex", "hidden", "absolute", "relative"].includes(className)) {
      prefixMap.set(className, className);
      return;
    }

    // Extract prefix (e.g., 'bg' from 'bg-blue-500')
    const prefix = className.split("-")[0];

    // Store the latest value for each prefix
    prefixMap.set(prefix, className);
  });

  // Convert map values back to a space-separated string
  return Array.from(prefixMap.values()).join(" ");
}

/**
 * Type-safe alias for nativeClassNames
 */
export const ncn = nativeClassNames;
