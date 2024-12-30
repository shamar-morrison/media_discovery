import { createMediaImageLink } from "@/utils/create-media-image-link";
import { POSTER_SIZE } from "@/utils/constants";

export function useAppropriateImage(image_path: string | null) {
  return image_path ? createMediaImageLink(POSTER_SIZE, image_path) : "";
}
