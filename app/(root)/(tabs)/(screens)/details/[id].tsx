import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { useGetMovieDetails } from "@/hooks/use-get-movie-details";
import { Loading } from "@/components/loading";
import { Image } from "expo-image";
import { createMediaImageLink } from "@/utils/create-media-image-link";
import { POSTER_SIZE } from "@/constants/tmdb";
import { blurhash } from "@/utils/blurhash";
import { ThemedImage } from "@/components/themed-image";

export default function MediaDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data, isLoading, isError } = useGetMovieDetails(id);

  if (isLoading) {
    return <Loading />;
  }

  if (isError || !data) {
    return <Text>Error</Text>;
  }

  return (
    <View>
      <View className="bg-black h-[400px] w-screen absolute z-10 opacity-50" />
      <ThemedImage
        source={createMediaImageLink("w1280", data.poster_path)}
        style={{ width: "100%", height: 400 }}
        contentFit={"cover"}
        cachePolicy={"none"}
      />

      <Text>{data.title}</Text>
      <Text>{id}</Text>
    </View>
  );
}
