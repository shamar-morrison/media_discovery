import { View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useTrendingTV } from "@/hooks/use-trending-tv";
import { Loading } from "@/components/loading";
import { Error } from "@/components/error";
import { MediaCard } from "@/components/media-card";
import { MediaType } from "@/types/multi-search";
import { RenderItemWrapper } from "@/components/render-item-wrapper";
import { itemWidth } from "@/utils/get-item-width";
import { NUM_COLUMNS } from "@/utils/constants";
import React from "react";
import { ThemedView } from "@/components/themed-view";

export function TrendingTV() {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    refetch,
    isFetchingNextPage,
  } = useTrendingTV();

  if (isLoading) return <Loading />;
  if (isError) return <Error onRetry={refetch} />;

  const shows = data?.pages.flatMap((page) => page.results) ?? [];

  return (
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
  );
}
