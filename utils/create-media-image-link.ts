type ImageSizes =
  | "w92"
  | "w154"
  | "w185"
  | "w342"
  | "w500"
  | "w780"
  | "w1280"
  | "original";

const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/";

export function createMediaImageLink(size: ImageSizes, mediaPath: string) {
  if (!mediaPath) return "";
  return `${TMDB_IMAGE_BASE_URL}${size}${mediaPath}`;
}
