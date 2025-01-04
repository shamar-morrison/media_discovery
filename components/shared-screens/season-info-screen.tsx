import { useLocalSearchParams } from "expo-router";
import { useGetSeasonInfo } from "@/hooks/use-get-season-info";
import { Loading } from "@/components/loading";
import { Error } from "@/components/error";
import { ThemedView } from "@/components/themed-view";
import { ScreenTitle } from "@/components/screen-title";
import { Text } from "react-native";

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
    <ThemedView className={"bg-black-100"}>
      <Text
        className={"font-inter-semibold opacity-50 text-white text-xl mb-2"}
      >
        {seriesName}
      </Text>
      <ScreenTitle>{data.name}</ScreenTitle>
    </ThemedView>
  );
}
