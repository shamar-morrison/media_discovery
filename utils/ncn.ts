import clsx, { type ClassValue } from "clsx";

/**
 * Combines the provided class values into a single string for use with NativeWind,
 * handling React Native's styling limitations and all style properties appropriately.
 *
 * @example
 * const styles = nativeClassNames(
 *   'border-b-2 border-white',
 *   'border-b-4 border-black'
 * );
 * // Result: 'border-b-4 border-black'
 *
 * @param inputs - The classes to combine
 * @returns A string of space-separated class names, with conflicts resolved
 */
export function nativeClassNames(...inputs: ClassValue[]): string {
  // First, combine all inputs using clsx
  const combinedClasses = clsx(inputs);

  // Split into individual classes
  const classes = combinedClasses.split(" ").filter(Boolean);

  // Create separate maps for different types of properties
  const prefixMap = new Map<string, string>();
  const textProps = {
    color: new Map<string, string>(), // text colors
    size: new Map<string, string>(), // text sizes
    align: new Map<string, string>(), // text alignment
    decoration: new Map<string, string>(), // text decoration
  };
  const fontMap = new Map<string, string>();
  const borderProps = {
    all: new Map<string, string>(), // all borders
    top: new Map<string, string>(), // top border
    right: new Map<string, string>(), // right border
    bottom: new Map<string, string>(), // bottom border
    left: new Map<string, string>(), // left border
    color: new Map<string, string>(), // border color
    style: new Map<string, string>(), // border style
  };

  // Text alignment values
  const alignments = ["left", "center", "right", "justify"];
  // Text sizes
  const sizes = ["xs", "sm", "base", "lg", "xl", "2xl", "3xl", "4xl", "5xl"];
  // Text decorations
  const decorations = ["underline", "line-through", "no-underline"];

  // Process each class
  classes.forEach((className) => {
    // Handle special cases
    if (["flex", "hidden", "absolute", "relative"].includes(className)) {
      prefixMap.set(className, className);
      return;
    }

    const parts = className.split("-");
    const prefix = parts[0];

    if (prefix === "text") {
      // Handle text alignment
      if (alignments.includes(parts[1])) {
        textProps.align.set("align", className);
      }
      // Handle text sizes
      else if (
        sizes.some(
          (size) =>
            className === `text-${size}` ||
            className.startsWith(`text-${size}/`),
        )
      ) {
        textProps.size.set("size", className);
      }
      // Handle text decorations
      else if (decorations.includes(parts[1])) {
        textProps.decoration.set("decoration", className);
      }
      // All other text-* classes are assumed to be colors
      else {
        textProps.color.set("color", className);
      }
    }
    // Handle font-related classes
    else if (prefix === "font") {
      fontMap.set("font", className);
    }
    // Handle border-related classes
    else if (prefix === "border") {
      if (parts.length === 1) {
        // Just 'border' class
        borderProps.all.set("width", className);
      } else if (parts[1] === "b") {
        // border-b-{size} or border-b
        if (parts.length === 2) {
          borderProps.bottom.set("width", className);
        } else {
          borderProps.bottom.set("width", className);
        }
      } else if (parts[1] === "t") {
        borderProps.top.set("width", className);
      } else if (parts[1] === "l") {
        borderProps.left.set("width", className);
      } else if (parts[1] === "r") {
        borderProps.right.set("width", className);
      } else if (
        parts[1] === "solid" ||
        parts[1] === "dashed" ||
        parts[1] === "dotted"
      ) {
        borderProps.style.set("style", className);
      } else {
        // Assume it's a border color
        borderProps.color.set("color", className);
      }
    }
    // Handle all other classes
    else {
      prefixMap.set(prefix, className);
    }
  });

  // Combine all maps
  return [
    ...Array.from(prefixMap.values()),
    ...Array.from(textProps.color.values()),
    ...Array.from(textProps.size.values()),
    ...Array.from(textProps.align.values()),
    ...Array.from(textProps.decoration.values()),
    ...Array.from(fontMap.values()),
    ...Array.from(borderProps.all.values()),
    ...Array.from(borderProps.top.values()),
    ...Array.from(borderProps.right.values()),
    ...Array.from(borderProps.bottom.values()),
    ...Array.from(borderProps.left.values()),
    ...Array.from(borderProps.color.values()),
    ...Array.from(borderProps.style.values()),
  ].join(" ");
}

/**
 * Type-safe alias for nativeClassNames
 */
export const ncn = nativeClassNames;
