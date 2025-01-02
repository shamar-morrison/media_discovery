import React from "react";
import { Section } from "@/components/section";
import { ScreenTitle } from "@/components/screen-title";
import { ThemedText } from "@/components/themed-text";
import { ScrollView, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { SecondaryMediaCard } from "@/components/secondary-media-card";
import { MediaType } from "@/types/multi-search";
import { useWatchlistStore } from "@/store/watchlist-store";

export default function Profile() {
  const movies = useWatchlistStore((state) => state.movies);
  const tvShows = useWatchlistStore((state) => state.tvShows);

  return (
    <ScrollView>
      <ScreenTitle style={{ padding: 8 }}>Watchlist</ScreenTitle>

      <Section title={"Movies"}>
        {movies.length === 0 && (
          <ThemedText className={"mt-5"}>No movies in watchlist</ThemedText>
        )}
        {movies.length > 0 && (
          <FlashList
            showsHorizontalScrollIndicator={false}
            estimatedItemSize={movies.length}
            className={"mt-4"}
            data={movies}
            canCancelContentTouches={false}
            horizontal={true}
            renderItem={({ item, index }) => {
              const isLastItem = index === movies.length - 1;

              return (
                <View className={`${!isLastItem ? "mr-3" : ""}`}>
                  <SecondaryMediaCard
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

      <Section title={"TV Shows"}>
        {tvShows.length === 0 && (
          <ThemedText className={"mt-5"}>No TV shows in watchlist</ThemedText>
        )}
        {tvShows.length > 0 && (
          <FlashList
            showsHorizontalScrollIndicator={false}
            estimatedItemSize={movies.length}
            className={"mt-4"}
            data={tvShows}
            canCancelContentTouches={false}
            horizontal={true}
            renderItem={({ item, index }) => {
              const isLastItem = index === tvShows.length - 1;

              return (
                <View className={`${!isLastItem ? "mr-3" : ""}`}>
                  <SecondaryMediaCard
                    poster_path={item.poster_path}
                    vote_average={item.vote_average}
                    title={item.title}
                    id={item.id}
                    mediaType={MediaType.Tv}
                    release_date={item.release_date}
                  />
                </View>
              );
            }}
          />
        )}
      </Section>
    </ScrollView>
  );
}
