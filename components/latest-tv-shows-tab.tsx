import { View } from "react-native";
import React from "react";
import { Loading } from "@/components/loading";
import { Error } from "@/components/error";
import { ThemedView } from "@/components/themed-view";
import { FlashList } from "@shopify/flash-list";
import { RenderItemWrapper } from "@/components/render-item-wrapper";
import { MediaCard } from "@/components/media-card";
import { MediaType } from "@/types/multi-search";
import { itemWidth } from "@/utils/get-item-width";
import { NUM_COLUMNS } from "@/utils/constants";
import { useDiscoverTvShows } from "@/hooks/use-discover-tv-shows";

export function LatestTvShowsTab() {
  const {
    data,
    isLoading,
    isError,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useDiscoverTvShows();

  if (isLoading) {
    return <Loading />;
  }

  if (isError || !data) {
    return <Error onRetry={refetch} />;
  }

  // Flatten all pages' results into a single array
  const shows = data.pages.flatMap((page) => page.results);

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
