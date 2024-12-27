type ImageSizes =
  | "w92"
  | "w154"
  | "w185"
  | "w342"
  | "w500"
  | "w780"
  | "w1280"
  | "original";

export function createMediaImageLink(size: ImageSizes, mediaPath: string) {
  return `${process.env.EXPO_PUBLIC_TMDB_IMAGE_URL}${size}${mediaPath}`;
}
