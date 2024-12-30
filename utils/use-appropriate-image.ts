import { createMediaImageLink } from "@/utils/create-media-image-link";
import { POSTER_SIZE } from "@/utils/constants";

// uses the image or the blurhash placeholder if the image is not available.
// Should be used with `<ThemedImage />`
export function useAppropriateImage(image_path: string | null) {
  return image_path ? createMediaImageLink(POSTER_SIZE, image_path) : "";
}
