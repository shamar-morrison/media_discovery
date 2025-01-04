import { View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useGetSeasonInfo } from "@/hooks/use-get-season-info";
import { Loading } from "@/components/loading";
import { Error } from "@/components/error";
import { ThemedText } from "@/components/themed-text";

export function SeasonInfoScreen() {
  const { seasonNumber, seriesId, seriesName } = useLocalSearchParams<{
    seasonNumber: string;
    seriesId: string;
    seriesName: string;
  }>();

  const { data, isLoading, isError, refetch } = useGetSeasonInfo(
    +seriesId,
    +seasonNumber,
  );

  if (isLoading) {
    return <Loading />;
  }

  if (isError || !data) {
    return (
      <Error
        message={
          "There was an error fetching the season details. Please try again."
        }
        onRetry={refetch}
      />
    );
  }

  return (
    <View>
      <ThemedText>series id: {seriesId}</ThemedText>
      <ThemedText>season number: {seasonNumber}</ThemedText>
      <ThemedText>series name: {seriesName}</ThemedText>
      <ThemedText>{data.name}</ThemedText>
      <ThemedText>{data.overview || "No overview available"}</ThemedText>
    </View>
  );
}
