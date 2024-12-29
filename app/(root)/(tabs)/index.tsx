import { Text, useWindowDimensions, View, Dimensions } from "react-native";
import { useDiscoverMovie } from "@/hooks/use-discover-movie";
import { Loading } from "@/components/loading";
import { MEDIA_CARD_PADDING, MEDIA_CARD_WIDTH } from "@/constants/tmdb";
import { FlashList } from "@shopify/flash-list";
import { MediaCard } from "@/components/media-card";
import { getNumColumns } from "@/utils/get-column-width";
import { Error } from "@/components/error";
import { ThemedView } from "@/components/themed-view";
import { MediaType } from "@/types/multi-search";

const PADDING_SIZE = 4;

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
          const isFirstInRow = index % numColumns === 0;
          const isLastInRow = (index + 1) % numColumns === 0;
          const horizontalPadding = 8;

          // Calculate item width based on container width and padding
          const itemWidth =
            (Dimensions.get("window").width -
              horizontalPadding * (numColumns - 1)) /
            numColumns;

          return (
            <View
              style={{
                paddingTop: 8,
                paddingBottom: 8,
                paddingLeft: isFirstInRow ? 0 : horizontalPadding / 2,
                paddingRight: isLastInRow ? 0 : horizontalPadding / 2,
              }}
            >
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
            </View>
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
