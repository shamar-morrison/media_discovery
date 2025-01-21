import { Section } from "@/components/section";
import { ThemedText } from "@/components/themed-text";
import { View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { SecondaryMediaCard } from "@/components/secondary-media-card";
import { MediaType } from "@/types/multi-search";
import { useWatchlistStore } from "@/store/watchlist-store";
import { ThemedScrollView } from "@/components/themed-scroll-view";
import { TouchableOpacity } from "react-native";
import { WatchlistExportImportSheet } from "@/components/watchlist-export-import-sheet";
import { useRef, useCallback } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ScreenTitle } from "@/components/screen-title";

export function WatchlistsTab() {
  const movies = useWatchlistStore((state) => state.movies);
  const tvShows = useWatchlistStore((state) => state.tvShows);
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  return (
    <ThemedScrollView>
      <View className="flex-row justify-between items-center px-4 mb-4">
        <View className="flex-row items-center gap-2">
          <ScreenTitle>Profile</ScreenTitle>
          <TouchableOpacity onPress={handlePresentModalPress}>
            <Ionicons name="ellipsis-horizontal" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

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

      <WatchlistExportImportSheet ref={bottomSheetRef} />
    </ThemedScrollView>
  );
}
