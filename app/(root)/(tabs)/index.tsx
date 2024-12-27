import {
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Image,
  useWindowDimensions,
} from "react-native";
import { useDiscoverMovie } from "@/hooks/use-discover-movie";
import { Loading } from "@/components/loading";
import { POSTER_SIZE } from "@/constants/tmdb";
import { FlashList } from "@shopify/flash-list";
import { ThemedText } from "@/components/themed-text";
import { MediaCard } from "@/components/media-card";
import { getNumColumns } from "@/utils/get-column-width";

export default function Index() {
  const { data, isLoading, isError, refetch } = useDiscoverMovie();
  const { width } = useWindowDimensions();
  const numColumns = getNumColumns(width, 100, 10);

  if (isLoading) {
    return <Loading />;
  }

  if (isError || !data) {
    return (
      <View className="flex-1 flex items-center justify-center">
        <Text>There was an error. Please try again.</Text>
        <TouchableOpacity onPress={() => refetch()}>
          <Text>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className={"bg-black-200 h-full py-3"}>
      <Text className={"font-rubik-bold text-3xl text-accent-100 px-7 pb-4"}>
        Discover
      </Text>
      <FlashList
        data={data.results}
        renderItem={({ item }) => <MediaCard {...item} />}
        numColumns={numColumns}
        estimatedItemSize={100}
        fadingEdgeLength={50}
      />
    </View>
  );
}
