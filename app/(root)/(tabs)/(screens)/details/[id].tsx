import { Text, View } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { useGetMovieDetails } from "@/hooks/use-get-movie-details";
import { Loading } from "@/components/loading";
import { createMediaImageLink } from "@/utils/create-media-image-link";
import { ThemedImage } from "@/components/themed-image";
import { Error } from "@/components/error";
import { ThemedScrollView } from "@/components/themed-scroll-view";
import { MediaType } from "@/types/multi-search";
import MovieDetails from "@/components/movie-details";

export default function MediaDetails() {
  const { id, mediaType } = useLocalSearchParams<{
    id: string;
    mediaType: MediaType;
  }>();

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
      {mediaType === MediaType.Movie && <MovieDetails {...data} />}
    </ThemedScrollView>
  );
}
