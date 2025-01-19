import React, { useState } from "react";
import { ScreenTitle } from "@/components/screen-title";
import { Pressable, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import Ionicons from "@expo/vector-icons/Ionicons";
import { GenreFilter } from "@/components/genre-filter";
import { useDiscoverMovie } from "@/hooks/use-discover-movie";
import { Loading } from "@/components/loading";
import { Error } from "@/components/error";
import { MOVIE_GENRES } from "@/types/genres";
import { RenderItemWrapper } from "@/components/render-item-wrapper";
import { MediaCard } from "@/components/media-card";
import { MediaType } from "@/types/multi-search";
import { itemWidth } from "@/utils/get-item-width";
import { NUM_COLUMNS } from "@/utils/constants";
import { FlashList } from "@shopify/flash-list";
import { ThemedView } from "@/components/themed-view";

export default function MovieGenres() {
  const [genreId, setGenreId] = useState<number | undefined>(
    MOVIE_GENRES.ACTION.id,
  );
  const [initialScrollIndex, setInitialScrollIndex] = useState(0);

  const {
    data,
    isLoading,
    isError,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useDiscoverMovie(genreId);

  if (isLoading) {
    return <Loading />;
  }

  if (isError || !data) {
    return <Error onRetry={refetch} />;
  }

  // Flatten all pages' results into a single array
  const movies = data.pages.flatMap((page) => page.results);

  const handleGenreUpdate = (genreId: number | undefined) => {
    setGenreId(genreId);
    setInitialScrollIndex(0);
  };

  return (
    <View className={"flex-1"}>
      <View className={"p-4"}>
        <ScreenTitle className={"pb-0"}>Movie Genres</ScreenTitle>
      </View>
      <View className="flex-row gap-4 justify-between px-4">
        <GenreFilter onChange={handleGenreUpdate} />
        <Pressable
          className={
            "flex-1 flex-row items-center justify-between py-3 px-4 rounded-lg bg-black-100"
          }
        >
          <ThemedText>Year</ThemedText>
          <Ionicons name={"chevron-down"} size={12} color={"#fff"} />
        </Pressable>
        <Pressable
          className={
            "flex-1 flex-row items-center justify-between py-3 px-4 rounded-lg bg-black-100"
          }
        >
          <ThemedText>Rating</ThemedText>
          <Ionicons name={"chevron-down"} size={12} color={"#fff"} />
        </Pressable>
      </View>
      <ThemedView>
        <FlashList
          data={movies}
          initialScrollIndex={initialScrollIndex}
          renderItem={({ item, index }) => {
            return (
              <RenderItemWrapper index={index}>
                <MediaCard
                  containerHeight={165}
                  posterPath={item.poster_path}
                  rating={item.vote_average}
                  release_date={item.release_date}
                  title={item.title}
                  id={item.id}
                  mediaType={MediaType.Movie}
                  containerWidth={itemWidth}
                />
              </RenderItemWrapper>
            );
          }}
          numColumns={NUM_COLUMNS}
          estimatedItemSize={160}
          onEndReached={() => {
            if (hasNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() =>
            isFetchingNextPage ? (
              <View className="py-4">
                <Loading />
              </View>
            ) : null
          }
        />
      </ThemedView>
    </View>
  );
}
