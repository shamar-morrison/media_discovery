import React, { useRef, useState } from "react";
import { ScreenTitle } from "@/components/screen-title";
import { View } from "react-native";
import { GenreFilter } from "@/components/genre-filter";
import { Loading } from "@/components/loading";
import { Error } from "@/components/error";
import { TV_GENRES } from "@/types/genres";
import { RenderItemWrapper } from "@/components/render-item-wrapper";
import { MediaCard } from "@/components/media-card";
import { MediaType } from "@/types/multi-search";
import { itemWidth } from "@/utils/get-item-width";
import { NUM_COLUMNS } from "@/utils/constants";
import { FlashList } from "@shopify/flash-list";
import { ThemedView } from "@/components/themed-view";
import { YearFilter } from "@/components/year-filter";
import { RatingFilter } from "@/components/rating-filter";
import { useDiscoverTvShows } from "@/hooks/use-discover-tv-shows";

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

  if (isLoading) {
    return <Loading />;
  }

  if (isError || !data) {
    return <Error onRetry={refetch} />;
  }

  const scrollList = () =>
    listRef.current?.scrollToOffset({ offset: 0, animated: true });

  // Flatten all pages' results into a single array
  const shows = data.pages.flatMap((page) => page.results);

  const handleGenreUpdate = (genreId: number | undefined) => {
    setGenreId(genreId);
    scrollList();
  };

  return (
    <View className={"flex-1"}>
      <View className={"p-4"}>
        <ScreenTitle className={"pb-0"}>TV Show Genres</ScreenTitle>
      </View>
      <View className="flex-row gap-4 justify-between px-4">
        <GenreFilter
          onChange={handleGenreUpdate}
          initialGenreId={genreId}
          type={MediaType.Tv}
        />
        <YearFilter
          onChange={(year) => {
            setYear(year);
            scrollList();
          }}
          initialYear={year}
        />
        <RatingFilter
          onChange={(rating) => {
            setRating(rating);
            scrollList();
          }}
          initialRating={rating}
        />
      </View>
      <ThemedView>
        <FlashList
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
          estimatedItemSize={100}
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
