import { Section } from "@/components/section";
import { ThemedText } from "@/components/themed-text";
import { View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { SecondaryMediaCard } from "@/components/secondary-media-card";
import { MediaType } from "@/types/multi-search";
import { useWatchlistStore } from "@/store/watchlist-store";
import { ThemedScrollView } from "@/components/themed-scroll-view";

export function WatchlistsTab() {
  const movies = useWatchlistStore((state) => state.movies);
  const tvShows = useWatchlistStore((state) => state.tvShows);

  return (
    <ThemedScrollView>
      <Section title={"Movies"} className={"bg-black-200"}>
        {movies.length === 0 && (
          <ThemedText className={"mt-5"}>No movies in watchlist</ThemedText>
        )}
        {movies.length > 0 && (
          <FlashList
            showsHorizontalScrollIndicator={false}
            estimatedItemSize={150}
            className={"mt-4"}
            data={movies}
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

      <Section title={"TV Shows"} className={"bg-black-200"}>
        {tvShows.length === 0 && (
          <ThemedText className={"mt-5"}>No TV shows in watchlist</ThemedText>
        )}
        {tvShows.length > 0 && (
          <FlashList
            showsHorizontalScrollIndicator={false}
            estimatedItemSize={150}
            className={"mt-4"}
            data={tvShows}
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
    </ThemedScrollView>
  );
}
