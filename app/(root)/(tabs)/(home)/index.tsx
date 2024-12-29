import { Text, useWindowDimensions, View, Dimensions } from "react-native";
import { useDiscoverMovie } from "@/hooks/use-discover-movie";
import { Loading } from "@/components/loading";
import {
  HORIZONTAL_PADDING,
  MEDIA_CARD_PADDING,
  MEDIA_CARD_WIDTH,
} from "@/utils/constants";
import { FlashList } from "@shopify/flash-list";
import { MediaCard } from "@/components/media-card";
import { getNumColumns } from "@/utils/get-num-columns";
import { Error } from "@/components/error";
import { ThemedView } from "@/components/themed-view";
import { MediaType } from "@/types/multi-search";
import { RenderItemWrapper } from "@/components/render-item-wrapper";
import { itemWidth } from "@/utils/get-item-width";

const PADDING_SIZE = 4;

// Discover Screen (Home)
export default function Index() {
  const {
    data,
    isLoading,
    isError,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useDiscoverMovie();
  const { width: screenWidth } = useWindowDimensions();
  const numColumns = getNumColumns(
    screenWidth,
    MEDIA_CARD_WIDTH,
    MEDIA_CARD_PADDING,
  );

  if (isLoading) {
    return <Loading />;
  }

  if (isError || !data) {
    return <Error onRetry={refetch} />;
  }

  // Flatten all pages' results into a single array
  const movies = data.pages.flatMap((page) => page.results);

  return (
    <ThemedView>
      <Text
        className={"font-inter-semibold text-3xl text-accent-100 px-2 pb-4"}
      >
        Discover
      </Text>
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
        numColumns={numColumns}
        estimatedItemSize={100}
        onEndReached={() => {
          if (hasNextPage) {
            fetchNextPage();
          }
        }}
        contentContainerStyle={{
          padding: PADDING_SIZE, // Add padding around the entire list content
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
