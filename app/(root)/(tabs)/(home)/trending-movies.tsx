import { View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useTrendingMovies } from "@/hooks/use-trending-movies";
import { MediaCard } from "@/components/media-card";
import { Loading } from "@/components/loading";
import { Error } from "@/components/error";
import { MediaType } from "@/types/multi-search";
import React from "react";
import { RenderItemWrapper } from "@/components/render-item-wrapper";
import { itemWidth } from "@/utils/get-item-width";
import { NUM_COLUMNS } from "@/utils/constants";
import { ThemedView } from "@/components/themed-view";

export default function TrendingMovies() {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    refetch,
    isFetchingNextPage,
  } = useTrendingMovies();

  if (isLoading) return <Loading />;
  if (isError) return <Error onRetry={refetch} />;

  const movies = data?.pages.flatMap((page) => page.results) ?? [];

  return (
    <ThemedView>
      <FlashList
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
  );
}
