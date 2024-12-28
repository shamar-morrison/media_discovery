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
};

export function MediaCard({
  posterPath,
  title,
  rating,
  id,
  mediaType,
}: MediaCardProps) {
  return (
    <Link href={`/details/${id}?mediaType=${mediaType}`}>
      <View className={`w-[120px] px-2 rounded-xl`}>
        <ThemedImage
          style={{
            width: "100%",
            height: 150,
            borderRadius: 8,
          }}
          className={"rounded-xl"}
          contentFit={"fill"}
          source={createMediaImageLink(POSTER_SIZE, posterPath)}
        />
        <View className={"flex"}>
          <Text className={"text-white font-inter-semibold"} numberOfLines={1}>
            {title}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            <Ionicons name={"star"} size={12} color={"#ffd500"} />
            <ThemedText className={"text-sm text-[#ffd500]"}>
              {rating.toFixed(1)}
            </ThemedText>
          </View>
        </View>
      </View>
    </Link>
  );
}
