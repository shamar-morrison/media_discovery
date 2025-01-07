import {
  StartedShows,
  useWatchedEpisodesStore,
} from "@/store/watched-episodes-store";
import { Pressable, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { Separator } from "@/components/separator";
import React from "react";
import { router } from "expo-router";

export function TvShowProgressCard({
  showId,
  showName,
  lastWatchedEpisode,
}: Required<StartedShows>) {
  const getNextEpisodeToWatch = useWatchedEpisodesStore(
    (state) => state.getNextEpisodeToWatch,
  );

  const nextEpisodeToWatch = getNextEpisodeToWatch(showId);
  return (
    <Pressable
      onPress={() => {
        router.push({
          pathname: "/season/[seasonNumber]",
          params: {
            seriesId: showId,
            seasonNumber: lastWatchedEpisode.seasonNumber,
            seriesName: showName,
          },
        });
      }}
    >
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
