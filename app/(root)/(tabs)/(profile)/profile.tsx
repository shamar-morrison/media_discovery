import React, { useState } from "react";
import { Section } from "@/components/section";
import { ScreenTitle } from "@/components/screen-title";
import { ThemedText } from "@/components/themed-text";
import { View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MOVIES_STORAGE_KEY } from "@/utils/constants";
import { useFocusEffect } from "@react-navigation/native";

export default function Profile() {
  const [movies, setMovies] = useState<any[]>([]);
  // const [tvShows, setTvShows] = useState<any[]>([]);

  useFocusEffect(() => {
    (async () => {
      const movies = await AsyncStorage.getItem(MOVIES_STORAGE_KEY);
      const moviesArray = movies !== null ? JSON.parse(movies) : ([] as any[]);
      setMovies(moviesArray);
    })();
  });

  return (
    <View>
      <ScreenTitle style={{ padding: 8 }}>Watchlist</ScreenTitle>
      <Section title={"Movies"}>
        {movies.length === 0 && (
          <ThemedText className={"mt-5"}>No movies in watchlist</ThemedText>
        )}
        {movies.length > 0 &&
          movies.map((movie: any) => (
            <ThemedText key={movie.id}>{movie.title}</ThemedText>
          ))}
      </Section>
    </View>
  );
}
