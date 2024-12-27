import { Text, View } from "react-native";
import React from "react";
import { POSTER_SIZE } from "@/constants/tmdb";
import { ThemedText } from "@/components/themed-text";
import { DiscoverMovieResult } from "@/types/discover-movie";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link } from "expo-router";
import { createMediaImageLink } from "@/utils/create-media-image-link";
import { ThemedImage } from "@/components/themed-image";

export function MediaCard({
  poster_path,
  title,
  vote_average,
  id,
}: DiscoverMovieResult) {
  return (
    <Link href={`/details/${id}`}>
      <View className={`w-[120px] px-2 rounded-xl`}>
        <ThemedImage
          style={{
            width: "100%",
            height: 150,
            borderRadius: 8,
          }}
          className={"rounded-xl"}
          contentFit={"fill"}
          source={createMediaImageLink(POSTER_SIZE, poster_path)}
        />
        <View className={"flex"}>
          <Text
            className={"text-white text-md font-rubik-bold"}
            numberOfLines={1}
          >
            {title}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            <Ionicons name={"star"} size={12} color={"#ffd500"} />
            <ThemedText className={"text-sm text-[#ffd500]"}>
              {vote_average.toFixed(1)}
            </ThemedText>
          </View>
        </View>
      </View>
    </Link>
  );
}
