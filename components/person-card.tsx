import { Text, View } from "react-native";
import React from "react";
import { Cast } from "@/types/movie-details";
import { ThemedImage } from "@/components/themed-image";
import { createMediaImageLink } from "@/utils/create-media-image-link";
import { POSTER_SIZE } from "@/utils/constants";

export function PersonCard({ name, character, profile_path }: Cast) {
  return (
    <View className="flex gap-2 w-32">
      <View className="rounded-lg overflow-hidden w-full">
        <ThemedImage
          style={{
            width: "100%",
            height: 155,
            borderRadius: 5,
          }}
          className={"w-full h-full"}
          contentFit={"cover"}
          source={
            profile_path ? createMediaImageLink(POSTER_SIZE, profile_path) : ""
          }
        />
        <View className={"flex"}>
          <Text
            className={"text-white font-inter-semibold mt-1"}
            numberOfLines={1}
          >
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
    </View>
  );
}
