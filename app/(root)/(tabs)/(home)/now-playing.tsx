import React from "react";
import { useGetNowPlaying } from "@/hooks/use-get-now-playing";
import { Loading } from "@/components/loading";
import { Error } from "@/components/error";
import { RenderItemWrapper } from "@/components/render-item-wrapper";
import { MediaCard } from "@/components/media-card";
import { MediaType } from "@/types/multi-search";
import { itemWidth } from "@/utils/get-item-width";
import { NUM_COLUMNS } from "@/utils/constants";
import { ThemedView } from "@/components/themed-view";
import { FlashList } from "@shopify/flash-list";
import { ScreenTitle } from "@/components/screen-title";

export default function NowPlaying() {
  const { data, isLoading, isError, refetch } = useGetNowPlaying();

  if (isLoading) return <Loading />;

  if (isError || !data) return <Error onRetry={refetch} />;

  return (
    <ThemedView>
      <ScreenTitle>Now Playing in Theaters</ScreenTitle>
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
