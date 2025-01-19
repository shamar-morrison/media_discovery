import React, { useRef, useState } from "react";
import { ScreenTitle } from "@/components/screen-title";
import { View } from "react-native";
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
import { YearFilter } from "@/components/year-filter";
import { RatingFilter } from "@/components/rating-filter";

export default function MovieGenres() {
  const [genreId, setGenreId] = useState<number | undefined>(
    MOVIE_GENRES.ACTION.id,
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
  } = useDiscoverMovie({ genreId, year, rating });

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
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  return (
    <View className={"flex-1"}>
      <View className={"p-4"}>
        <ScreenTitle className={"pb-0"}>Movie Genres</ScreenTitle>
      </View>
      <View className="flex-row gap-4 justify-between px-4">
        <GenreFilter onChange={handleGenreUpdate} initialGenreId={genreId} />
        <YearFilter
          onChange={(year) => {
            setYear(year);
            listRef.current?.scrollToOffset({ offset: 0, animated: true });
          }}
          initialYear={year}
        />
        <RatingFilter
          onChange={(rating) => {
            setRating(rating);
            listRef.current?.scrollToOffset({ offset: 0, animated: true });
          }}
          initialRating={rating}
        />
      </View>
      <ThemedView>
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
      </ThemedView>
    </View>
  );
}
