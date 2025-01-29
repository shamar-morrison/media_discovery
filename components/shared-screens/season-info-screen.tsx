import { Error } from "@/components/error";
import { Loading } from "@/components/loading";
import { ScreenTitle } from "@/components/screen-title";
import { SeasonInfoTabLayout } from "@/components/season-info-tabs/season-info-tab-layout";
import { ThemedText } from "@/components/themed-text";
import { useGetSeasonInfo } from "@/hooks/use-get-season-info";
import { useWatchedEpisodesStore } from "@/store/watched-episodes-store";
import { hitSlop } from "@/utils/hit-slop";
import Ionicons from "@expo/vector-icons/Ionicons";
import { format } from "date-fns";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

export function SeasonInfoScreen() {
  const { seasonNumber, seriesId, seriesName } = useLocalSearchParams<{
    seasonNumber: string;
    seriesId: string;
    seriesName: string;
  }>();

  const [isMarkingWatched, setIsMarkingWatched] = useState(false);
  const markSeasonAsWatched = useWatchedEpisodesStore(
    (state) => state.markSeasonAsWatched,
  );

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

  const handleMarkSeasonAsWatched = async () => {
    setIsMarkingWatched(true);
    try {
      await markSeasonAsWatched(
        +seriesId,
        +seasonNumber,
        data.episodes.map((episode) => episode.id),
      );
    } finally {
      setIsMarkingWatched(false);
    }
  };

  return (
    <>
      <View className={"bg-black-100 p-4"}>
        <View className="flex-row justify-between items-start">
          <View className="flex-1">
            <Text
              className={
                "font-inter-semibold opacity-50 text-white text-xl mb-2"
              }
            >
              {seriesName}
            </Text>
            <ScreenTitle>{data.name}</ScreenTitle>
            <ThemedText className={"text-sm opacity-50 -mt-3"}>
              Premiered on {format(data.air_date, "MMM. dd, yyyy")}
            </ThemedText>
          </View>
          {isMarkingWatched ? (
            <ActivityIndicator size="small" color="#fff" className="mt-2" />
          ) : (
            <Pressable
              hitSlop={hitSlop}
              onPress={handleMarkSeasonAsWatched}
              className="mt-2"
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={28}
                color="rgba(255,255,255,0.7)"
              />
            </Pressable>
          )}
        </View>
      </View>
      <SeasonInfoTabLayout episodes={data.episodes} overview={data.overview} />
    </>
  );
}
