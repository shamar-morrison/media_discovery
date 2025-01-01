import { View } from "react-native";
import React from "react";
import { TvShowDetailsResponse } from "@/types/tv-show-details";
import { ThemedText } from "@/components/themed-text";

export function TvShowDetails({
  name,
  overview,
  backdrop_path,
  poster_path,
  vote_average,
  first_air_date,
  genres,
  id,
}: TvShowDetailsResponse) {
  return (
    <View>
      <ThemedText>name: {name}</ThemedText>
      <ThemedText>overview: {overview}</ThemedText>
      <ThemedText>backdrop_path: {backdrop_path}</ThemedText>
      <ThemedText>poster_path: {poster_path}</ThemedText>
      <ThemedText>vote_average: {vote_average}</ThemedText>

      <ThemedText>id: {id}</ThemedText>
    </View>
  );
}
