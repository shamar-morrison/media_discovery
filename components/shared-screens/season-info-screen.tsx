import { useLocalSearchParams } from "expo-router";
import { useGetSeasonInfo } from "@/hooks/use-get-season-info";
import { Loading } from "@/components/loading";
import { Error } from "@/components/error";
import { ScreenTitle } from "@/components/screen-title";
import { Text, View } from "react-native";
import { SeasonInfoTabLayout } from "@/components/season-info-tabs/season-info-tab-layout";
import { ThemedText } from "@/components/themed-text";
import { format } from "date-fns";
import React from "react";

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
    <>
      <View className={"bg-black-100 p-4"}>
        <Text
          className={"font-inter-semibold opacity-50 text-white text-xl mb-2"}
        >
          {seriesName}
        </Text>
        <ScreenTitle>{data.name}</ScreenTitle>
        <ThemedText className={"text-sm opacity-50 -mt-3"}>
          Premiered on {format(data.air_date, "MMM. dd, yyyy")}
        </ThemedText>
      </View>
      <SeasonInfoTabLayout episodes={data.episodes} overview={data.overview} />
    </>
  );
}
