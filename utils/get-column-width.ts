/**
 * Generates the number of columns for the FlatList
 * based on the device width and the item width (movie card)
 *
 * @param width - device width
 * @param itemWidth - item width
 * @param padding - padding
 * @returns the number of columns
 */
export function getNumColumns(
  width: number,
  itemWidth: number,
  padding: number,
) {
  return Math.floor(width / (itemWidth + padding * 2));
}
