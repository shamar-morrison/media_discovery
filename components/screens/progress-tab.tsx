import { Pressable, View } from "react-native";
import React, { useCallback, useState } from "react";
import {
  StartedShows,
  useWatchedEpisodesStore,
} from "@/store/watched-episodes-store";
import { ThemedText } from "@/components/themed-text";
import { useFocusEffect } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import { Separator } from "@/components/separator";

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

function TvShowProgressCard({
  showId,
  showName,
  lastWatchedEpisode,
}: Required<StartedShows>) {
  const getNextEpisodeToWatch = useWatchedEpisodesStore(
    (state) => state.getNextEpisodeToWatch,
  );

  const nextEpisodeToWatch = getNextEpisodeToWatch(showId);
  return (
    <Pressable onPress={() => {}}>
      <View
        className={
          "flex gap-3 rounded-xl bg-black-100 p-7 w-[90%] mx-auto h-60"
        }
      >
        <ThemedText
          className={"font-inter-semibold opacity-30 text-2xl"}
          numberOfLines={1}
        >
          {showName}
        </ThemedText>
        <ThemedText className={"text-sm opacity-50 -mb-1"}>
          Last watched episode:
        </ThemedText>
        <View className="flex flex-row">
          <ThemedText className={"text-xl font-inter-semibold"}>
            Season {lastWatchedEpisode.seasonNumber} Episode{" "}
            {lastWatchedEpisode.episodeNumber || "Not found"}
          </ThemedText>
        </View>
        <Separator />
        {nextEpisodeToWatch === null && (
          <ThemedText className={"text-sm"}>
            You've finished this show 🎉
          </ThemedText>
        )}
        {nextEpisodeToWatch?.seasonNumber && (
          <>
            <ThemedText className={"text-sm opacity-30"}>Next up:</ThemedText>
            <ThemedText className={"opacity-50 font-inter-medium"}>
              Season {nextEpisodeToWatch.seasonNumber} Episode{" "}
              {nextEpisodeToWatch.episodeNumber}
            </ThemedText>
          </>
        )}
      </View>
    </Pressable>
  );
}
