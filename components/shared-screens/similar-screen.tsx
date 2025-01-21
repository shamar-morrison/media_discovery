import { useLocalSearchParams } from "expo-router";
import { MediaType } from "@/types/multi-search";
import { ThemedView } from "@/components/themed-view";
import { ScreenTitle } from "@/components/screen-title";
import { useGetSimilar } from "@/hooks/use-get-similar";
import { Loading } from "@/components/loading";
import { Error } from "@/components/error";
import { RenderItemWrapper } from "@/components/render-item-wrapper";
import { MediaCard } from "@/components/media-card";
import { itemWidth } from "@/utils/get-item-width";
import { NUM_COLUMNS, PRIMARY_BLUE } from "@/utils/constants";
import { FlashList } from "@shopify/flash-list";

export function SimilarScreen() {
  const { similarId, mediaType, mediaTitle } = useLocalSearchParams<{
    similarId: string;
    mediaType: MediaType;
    mediaTitle: string;
  }>();

  const { data, isLoading, isError, refetch } = useGetSimilar(
    similarId,
    mediaType,
  );

  if (isLoading) {
    return <Loading />;
  }

  if (isError || !data) {
    return (
      <Error
        message="Error loading similar movies. Please try again."
        onRetry={refetch}
      />
    );
  }

  return (
    <ThemedView>
      <ScreenTitle>
        More like{" "}
        <ScreenTitle style={{ color: PRIMARY_BLUE }}>{mediaTitle}</ScreenTitle>
      </ScreenTitle>
      <FlashList
        data={data}
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
                mediaType={mediaType}
                containerWidth={itemWidth}
              />
            </RenderItemWrapper>
          );
        }}
        numColumns={NUM_COLUMNS}
        estimatedItemSize={100}
      />
    </ThemedView>
  );
}
