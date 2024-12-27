import React from "react";
import { Image, ImageProps } from "expo-image";
import { blurhash } from "@/utils/blurhash";

interface ThemedImageProps extends ImageProps {}

export function ThemedImage(props: ThemedImageProps) {
  return <Image {...props} placeholder={{ blurhash }} transition={500} />;
}
