import { Error } from "@/components/error";
import { FilterBar } from "@/components/filter-bar";
import { Loading } from "@/components/loading";
import { MediaCard } from "@/components/media-card";
import { RenderItemWrapper } from "@/components/render-item-wrapper";
import { ScreenTitle } from "@/components/screen-title";
import { ThemedView } from "@/components/themed-view";
import { useDiscoverMovie } from "@/hooks/use-discover-movie";
import { MOVIE_GENRES } from "@/types/genres";
import { MediaType } from "@/types/multi-search";
import { NUM_COLUMNS } from "@/utils/constants";
import { itemWidth } from "@/utils/get-item-width";
import { FlashList } from "@shopify/flash-list";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { View } from "react-native";

interface FilterState {
  genreId: number | undefined;
  year: number | undefined;
  rating: number | undefined;
}

export default function MovieGenres() {
  const [filters, setFilters] = useState<FilterState>({
    genreId: MOVIE_GENRES.ACTION.id,
    year: undefined,
    rating: undefined,
  });
  const listRef = useRef<FlashList<any>>(null);
  const scrollTimeout = useRef<NodeJS.Timeout>();

  const {
    data,
    isLoading,
    isError,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useDiscoverMovie(filters);

  const smoothScrollToTop = useCallback(() => {
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }
    scrollTimeout.current = setTimeout(() => {
      listRef.current?.scrollToOffset({ offset: 0, animated: true });
    }, 100);
  }, []);

  const handleFilterChange = useCallback(
    (key: keyof FilterState, value: number | undefined) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
      smoothScrollToTop();
    },
    [smoothScrollToTop],
  );

  const filterHandlers = useMemo(
    () => ({
      onGenreChange: (value: number | undefined) =>
        handleFilterChange("genreId", value),
      onYearChange: (value: number | undefined) =>
        handleFilterChange("year", value),
      onRatingChange: (value: number | undefined) =>
        handleFilterChange("rating", value),
    }),
    [handleFilterChange],
  );

  const renderContent = () => {
    if (isError || !data) {
      return <Error onRetry={refetch} />;
    }

    const movies = data.pages.flatMap((page) => page.results);

    return (
      <FlashList
        ref={listRef}
        data={movies}
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
    );
  };

  return (
    <View className={"flex-1"}>
      <View className={"p-4"}>
        <ScreenTitle className={"pb-0"}>Movie Genres</ScreenTitle>
      </View>
      <FilterBar
        genreId={filters.genreId}
        year={filters.year}
        rating={filters.rating}
        {...filterHandlers}
        mediaType={MediaType.Movie}
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
