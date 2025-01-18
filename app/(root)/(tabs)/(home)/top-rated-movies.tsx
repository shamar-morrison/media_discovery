import React from "react";
import { useGetTopRated } from "@/hooks/use-get-top-rated";
import { Loading } from "@/components/loading";
import { ThemedView } from "@/components/themed-view";
import { ScreenTitle } from "@/components/screen-title";
import { FlashList } from "@shopify/flash-list";
import { RenderItemWrapper } from "@/components/render-item-wrapper";
import { MediaCard } from "@/components/media-card";
import { MediaType } from "@/types/multi-search";
import { itemWidth } from "@/utils/get-item-width";
import { NUM_COLUMNS } from "@/utils/constants";
import { Error } from "@/components/error";

export default function TopRatedMovies() {
  const { data, isLoading, isError, refetch } = useGetTopRated();

  if (isLoading) return <Loading />;

  if (isError || !data) return <Error onRetry={refetch} />;

  return (
    <ThemedView>
      <ScreenTitle>Top Rated Movies</ScreenTitle>
      <FlashList
        data={data.results}
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
      />
    </ThemedView>
  );
}
