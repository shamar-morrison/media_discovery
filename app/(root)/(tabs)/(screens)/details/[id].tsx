import { ScrollView, Text, View } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { useGetMovieDetails } from "@/hooks/use-get-movie-details";
import { Loading } from "@/components/loading";
import { createMediaImageLink } from "@/utils/create-media-image-link";
import { ThemedImage } from "@/components/themed-image";
import { Error } from "@/components/error";
import { ThemedScrollView } from "@/components/themed-scroll-view";

export default function MediaDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data, isLoading, isError, refetch } = useGetMovieDetails(id);

  if (isLoading) {
    return <Loading />;
  }

  if (isError || !data) {
    return (
      <Error
        message="Error loading media details. Please try again."
        onRetry={refetch}
      />
    );
  }

  return (
    <ThemedScrollView>
      <View className="bg-black h-[400px] w-screen absolute z-10 opacity-60" />
      <ThemedImage
        source={createMediaImageLink("w1280", data.backdrop_path)}
        style={{ width: "100%", height: 400 }}
        contentFit={"cover"}
        cachePolicy={"memory"}
      />

      <Text>{data.title}</Text>
      <Text>{id}</Text>
    </ThemedScrollView>
  );
}
