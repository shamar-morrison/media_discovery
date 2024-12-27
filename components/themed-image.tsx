import React from "react";
import { Image, ImageProps } from "expo-image";
import { blurhash } from "@/utils/blurhash";

export function ThemedImage({ placeholder, transition, ...props }: ImageProps) {
  return <Image placeholder={{ blurhash }} transition={500} {...props} />;
}
