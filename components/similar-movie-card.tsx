import { Text, View } from "react-native";
import React from "react";
import { ThemedImage } from "@/components/themed-image";
import { createMediaImageLink } from "@/utils/create-media-image-link";
import { POSTER_SIZE } from "@/utils/constants";
import { MediaType } from "@/types/multi-search";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ThemedText } from "@/components/themed-text";
import { Link } from "expo-router";
import { getYear } from "date-fns";
import { useAppropriateImage } from "@/utils/use-appropriate-image";

type SimilarMovieCardProps = {
  poster_path: string;
  title: string;
  vote_average: number;
  id: number;
  mediaType: MediaType;
  release_date: Date | undefined;
};

export function SimilarMovieCard({
  poster_path,
  title,
  vote_average,
  id,
  mediaType,
  release_date,
}: SimilarMovieCardProps) {
  return (
    <Link
      href={{
        pathname: "/[mediaId]",
        params: { mediaId: id, mediaType },
      }}
    >
      <View className={"flex gap-2 w-32"}>
        <View className={`rounded-lg overflow-hidden w-full`}>
          <ThemedImage
            style={{
              width: "100%",
              height: 155,
            }}
            className={"w-full h-full"}
            contentFit={"fill"}
            source={useAppropriateImage(poster_path)}
          />
        </View>
        <View className={"flex"}>
          <Text
            className={"text-white font-inter-semibold w-full"}
            numberOfLines={1}
          >
            {title}
          </Text>
          <View className="flex flex-row items-center">
            <ThemedText className={"text-sm opacity-50"}>
              {release_date ? getYear(release_date) : "N/A"}
            </ThemedText>
            <ThemedText className={"text-sm opacity-50"}> • </ThemedText>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 3 }}
            >
              <Ionicons name={"star"} size={12} color={"#ffd500"} />
              <ThemedText className={"text-sm"} style={{ color: "#ffd500" }}>
                {vote_average?.toFixed(1)}
              </ThemedText>
            </View>
          </View>
        </View>
      </View>
    </Link>
  );
}
