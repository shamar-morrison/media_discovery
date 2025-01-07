import { View } from "react-native";
import React, { useCallback, useState } from "react";
import { useWatchedEpisodesStore } from "@/store/watched-episodes-store";
import { useFocusEffect } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import { TvShowProgressCard } from "@/components/tv-show-progress-card";

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

  return (
    <View className={"h-full"}>
      <FlashList
        estimatedItemSize={startedShows.length}
        ItemSeparatorComponent={() => <View className={"h-4 w-full"} />}
        data={startedShows}
        className={"mt-4"}
        canCancelContentTouches={false}
        renderItem={({ item }) => <TvShowProgressCard {...item} />}
      />
    </View>
  );
}
