import {
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useDiscoverMovie } from "@/hooks/use-discover-movie";
import { Loading } from "@/components/loading";
import { MEDIA_CARD_PADDING, MEDIA_CARD_WIDTH } from "@/constants/tmdb";
import { FlashList } from "@shopify/flash-list";
import { MediaCard } from "@/components/media-card";
import { getNumColumns } from "@/utils/get-column-width";
import { ThemedText } from "@/components/themed-text";
import { Error } from "@/components/error";
import { ThemedView } from "@/components/themed-view";
import { MediaType } from "@/types/multi-search";

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
      <Text className={"font-rubik-bold text-3xl text-accent-100 px-2 pb-4"}>
        Discover
      </Text>
      <FlashList
        data={movies}
        renderItem={({ item }) => (
          <MediaCard
            posterPath={item.poster_path}
            rating={item.vote_average}
            title={item.title}
            id={item.id}
            mediaType={MediaType.Movie}
          />
        )}
        numColumns={numColumns}
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
