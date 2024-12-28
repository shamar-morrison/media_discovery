import { Text, View } from "react-native";
import React from "react";
import { Cast } from "@/types/movie-details";
import { ThemedImage } from "@/components/themed-image";
import { createMediaImageLink } from "@/utils/create-media-image-link";
import { POSTER_SIZE } from "@/constants/tmdb";
import { blurhash } from "@/utils/blurhash";

export function PersonCard({ name, character, profile_path }: Cast) {
  const useAppropriateImage = () => {
    if (profile_path) {
      return createMediaImageLink(POSTER_SIZE, profile_path);
    }
    return blurhash;
  };

  return (
    <View className={`w-[130px] px-2 rounded-xl`}>
      <ThemedImage
        style={{
          width: "100%",
          height: 140,
          borderRadius: 8,
        }}
        className={"rounded-xl"}
        contentFit={"cover"}
        source={useAppropriateImage()}
      />
      <View className={"flex"}>
        <Text className={"text-white font-inter-semibold"} numberOfLines={1}>
          {name}
        </Text>
        <Text
          className={"text-white font-inter text-sm opacity-50"}
          numberOfLines={1}
        >
          {character}
        </Text>
      </View>
    </View>
  );
}
