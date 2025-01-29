import { ThemedText } from "@/components/themed-text";
import { TvShowProgressCard } from "@/components/tv-show-progress-card";
import { useWatchedEpisodesStore } from "@/store/watched-episodes-store";
import { useFocusEffect } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import React, { useCallback, useState } from "react";
import { View } from "react-native";

export function ProgressTab() {
  const [_, setForceUpdate] = useState(0);

  const getStartedShows = useWatchedEpisodesStore(
    (state) => state.getStartedShows,
  );

  const startedShows = getStartedShows();

  const handleRefresh = useCallback(() => {
    setForceUpdate((count) => count + 1);
  }, []);

  useFocusEffect(handleRefresh);

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
        renderItem={({ item }) => (
          <TvShowProgressCard {...item} onComplete={handleRefresh} />
        )}
      />
    </View>
  );
}
