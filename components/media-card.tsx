import { Text, View } from "react-native";
import React from "react";
import { POSTER_SIZE } from "@/constants/tmdb";
import { ThemedText } from "@/components/themed-text";
import { DiscoverMovieResult } from "@/types/discover-movie";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link } from "expo-router";
import { createMediaImageLink } from "@/utils/create-media-image-link";
import { ThemedImage } from "@/components/themed-image";
import { MediaType } from "@/types/multi-search";

type MediaCardProps = {
  title: string;
  rating: number;
  posterPath: string;
  id: number;
  mediaType: MediaType;
  containerWidth?: number;
  containerHeight?: number;
  maintainAspectRatio?: boolean;
};

export function MediaCard({
  posterPath,
  title,
  rating,
  id,
  mediaType,
  containerWidth = 140,
  containerHeight,
  maintainAspectRatio = true,
}: MediaCardProps) {
  const imageHeight = maintainAspectRatio
    ? (containerHeight ?? containerWidth * 1.5)
    : (containerHeight ?? containerWidth * 1.5);

  return (
    <Link href={`/details/${id}?mediaType=${mediaType}`}>
      <View
        style={{ width: containerWidth }}
        className={`rounded-xl overflow-hidden`}
      >
        <ThemedImage
          style={{
            width: "100%",
            height: imageHeight,
          }}
          className={"w-full h-full"}
          contentFit={"cover"}
          source={createMediaImageLink(POSTER_SIZE, posterPath)}
        />
      </View>
      <View className={"flex"}>
        <Text
          className={"text-white font-inter-semibold w-full"}
          numberOfLines={1}
        >
          {title}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
          <Ionicons name={"star"} size={12} color={"#ffd500"} />
          <ThemedText className={"text-sm text-[#ffd500]"}>
            {rating.toFixed(1)}
          </ThemedText>
        </View>
      </View>
    </Link>
  );
}
