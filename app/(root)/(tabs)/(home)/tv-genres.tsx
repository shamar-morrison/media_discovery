import { Error } from "@/components/error";
import { FilterBar } from "@/components/filter-bar";
import { Loading } from "@/components/loading";
import { MediaCard } from "@/components/media-card";
import { RenderItemWrapper } from "@/components/render-item-wrapper";
import { ScreenTitle } from "@/components/screen-title";
import { ThemedView } from "@/components/themed-view";
import { useDiscoverTvShows } from "@/hooks/use-discover-tv-shows";
import { TV_GENRES } from "@/types/genres";
import { MediaType } from "@/types/multi-search";
import { NUM_COLUMNS } from "@/utils/constants";
import { itemWidth } from "@/utils/get-item-width";
import { FlashList } from "@shopify/flash-list";
import React, { useCallback, useRef, useState } from "react";
import { View } from "react-native";

export default function TvGenres() {
  const [genreId, setGenreId] = useState<number | undefined>(
    TV_GENRES.DRAMA.id,
  );
  const [year, setYear] = useState<number | undefined>(undefined);
  const [rating, setRating] = useState<number | undefined>(undefined);
  const listRef = useRef<FlashList<any>>(null);

  const {
    data,
    isLoading,
    isError,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useDiscoverTvShows({ genreId, year, rating });

  const scrollList = useCallback(
    () => listRef.current?.scrollToOffset({ offset: 0, animated: true }),
    [],
  );

  const handleGenreUpdate = useCallback(
    (newGenreId: number | undefined) => {
      setGenreId(newGenreId);
      scrollList();
    },
    [scrollList],
  );

  const handleYearUpdate = useCallback(
    (newYear: number | undefined) => {
      setYear(newYear);
      scrollList();
    },
    [scrollList],
  );

  const handleRatingUpdate = useCallback(
    (newRating: number | undefined) => {
      setRating(newRating);
      scrollList();
    },
    [scrollList],
  );

  const renderContent = () => {
    if (isError || !data) {
      return <Error onRetry={refetch} />;
    }

    // Flatten all pages' results into a single array
    const shows = data.pages.flatMap((page) => page.results);

    return (
      <FlashList
        ref={listRef}
        data={shows}
        renderItem={({ item, index }) => {
          return (
            <RenderItemWrapper index={index}>
              <MediaCard
                containerHeight={165}
                posterPath={item.poster_path}
                rating={item.vote_average}
                release_date={item.first_air_date}
                title={item.name}
                id={item.id}
                mediaType={MediaType.Tv}
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
    );
  };

  return (
    <View className={"flex-1"}>
      <View className={"p-4"}>
        <ScreenTitle className={"pb-0"}>TV Show Genres</ScreenTitle>
      </View>
      <FilterBar
        genreId={genreId}
        year={year}
        rating={rating}
        onGenreChange={handleGenreUpdate}
        onYearChange={handleYearUpdate}
        onRatingChange={handleRatingUpdate}
        mediaType={MediaType.Tv}
      />
      <ThemedView>
        {isLoading ? (
          <View className="flex-1 justify-center">
            <Loading />
          </View>
        ) : (
          renderContent()
        )}
      </ThemedView>
    </View>
  );
}
