import { SecondaryMediaCard } from "@/components/secondary-media-card";
import { Section } from "@/components/section";
import { ThemedScrollView } from "@/components/themed-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { useCustomListsStore } from "@/store/custom-lists-store";
import { useWatchlistStore } from "@/store/watchlist-store";
import { MediaType } from "@/types/multi-search";
import { FlashList } from "@shopify/flash-list";
import { View } from "react-native";

export function WatchlistsTab() {
  const movies = useWatchlistStore((state) => state.movies);
  const tvShows = useWatchlistStore((state) => state.tvShows);
  const customLists = useCustomListsStore((state) => state.lists);

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

      {/* Custom Lists */}
      {customLists.map((list) => (
        <Section key={list.id} title={list.name} className={"bg-black-200"}>
          {list.items.length === 0 && (
            <ThemedText className={"mt-5"}>No items in list</ThemedText>
          )}
          {list.items.length > 0 && (
            <FlashList
              showsHorizontalScrollIndicator={false}
              estimatedItemSize={150}
              className={"mt-4"}
              data={list.items}
              horizontal={true}
              renderItem={({ item, index }) => {
                const isLastItem = index === list.items.length - 1;

                return (
                  <View className={`${!isLastItem ? "mr-3" : ""}`}>
                    <SecondaryMediaCard
                      poster_path={item.poster_path}
                      vote_average={item.vote_average}
                      title={item.title}
                      id={item.id}
                      mediaType={item.mediaType}
                      release_date={item.release_date}
                    />
                  </View>
                );
              }}
            />
          )}
        </Section>
      ))}
    </ThemedScrollView>
  );
}
