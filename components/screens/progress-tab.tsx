import { View } from "react-native";
import React, { useCallback, useState } from "react";
import { useWatchedEpisodesStore } from "@/store/watched-episodes-store";
import { useFocusEffect } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import { TvShowProgressCard } from "@/components/tv-show-progress-card";
import { ThemedText } from "@/components/themed-text";

export function ProgressTab() {
  const [_, setForceUpdate] = useState(0);

  const getStartedShows = useWatchedEpisodesStore(
    (state) => state.getStartedShows,
  );

  const startedShows = getStartedShows();

  useFocusEffect(
    useCallback(() => {
      setForceUpdate((count) => count + 1);
    }, []),
  );

  if (startedShows.length === 0) {
    return (
      <View className={"flex items-center justify-center h-full px-4"}>
        <ThemedText className={"font-inter-semibold text-lg text-center"}>
          You're not currently tracking anything.
        </ThemedText>
      </View>
    );
  }

  return (
    <View className={"h-full"}>
      <FlashList
        estimatedItemSize={200}
        ItemSeparatorComponent={() => <View className={"h-4 w-full"} />}
        data={startedShows}
        className={"mt-4"}
        canCancelContentTouches={false}
        renderItem={({ item }) => <TvShowProgressCard {...item} />}
      />
    </View>
  );
}
