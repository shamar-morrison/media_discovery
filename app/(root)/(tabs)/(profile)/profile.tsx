import React, { useState } from "react";
import { Section } from "@/components/section";
import { ScreenTitle } from "@/components/screen-title";
import { ThemedText } from "@/components/themed-text";
import { View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MOVIES_STORAGE_KEY } from "@/utils/constants";
import { useFocusEffect } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import { SimilarMovieCard } from "@/components/similar-movie-card";
import { MediaType } from "@/types/multi-search";
import { AddToWatchlistProps } from "@/types/add-to-watchlist";
import { showToast } from "@/utils/toast";

export default function Profile() {
  const [movies, setMovies] = useState<AddToWatchlistProps[]>([]);
  // const [tvShows, setTvShows] = useState<any[]>([]);

  useFocusEffect(() => {
    (async () => {
      try {
        const movies = await AsyncStorage.getItem(MOVIES_STORAGE_KEY);
        const moviesArray = movies !== null ? JSON.parse(movies) : [];
        setMovies(moviesArray);
      } catch (error: any) {
        showToast("Error loading movies from watchlist: " + error.message);
      }
    })();
  });

  return (
    <View>
      <ScreenTitle style={{ padding: 8 }}>Watchlist</ScreenTitle>
      <Section title={"Movies"}>
        {movies.length === 0 && (
          <ThemedText className={"mt-5"}>No movies in watchlist</ThemedText>
        )}
        {movies.length > 0 && (
          <FlashList
            showsHorizontalScrollIndicator={false}
            estimatedItemSize={100}
            className={"mt-4"}
            data={movies}
            canCancelContentTouches={false}
            horizontal={true}
            renderItem={({ item, index }) => {
              const isLastItem = index === movies.length - 1;

              return (
                <View className={`${!isLastItem ? "mr-3" : ""}`}>
                  <SimilarMovieCard
                    poster_path={item.poster_path}
                    vote_average={item.vote_average}
                    title={item.title}
                    id={item.id}
                    mediaType={MediaType.Movie}
                    release_date={item.release_date}
                  />
                </View>
              );
            }}
          />
        )}
      </Section>
    </View>
  );
}
