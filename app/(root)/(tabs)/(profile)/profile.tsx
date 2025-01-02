import React, { useState } from "react";
import { Section } from "@/components/section";
import { ScreenTitle } from "@/components/screen-title";
import { ThemedText } from "@/components/themed-text";
import { View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import { SimilarMediaCard } from "@/components/similar-media-card";
import { MediaType } from "@/types/multi-search";
import { AddToWatchlistProps } from "@/types/add-to-watchlist";
import { showToast } from "@/utils/toast";
import { useWatchlistStore } from "@/store/watchlist-store";

export default function Profile() {
  const [movies, setMovies] = useState<AddToWatchlistProps[]>([]);
  // const [tvShows, setTvShows] = useState<any[]>([]);

  const watchlist = useWatchlistStore((state) => state.watchlist);

  useFocusEffect(() => {
    (async () => {
      try {
        setMovies(watchlist);
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
            estimatedItemSize={watchlist.length + 5}
            className={"mt-4"}
            data={movies}
            canCancelContentTouches={false}
            horizontal={true}
            renderItem={({ item, index }) => {
              const isLastItem = index === movies.length - 1;

              return (
                <View className={`${!isLastItem ? "mr-3" : ""}`}>
                  <SimilarMediaCard
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
