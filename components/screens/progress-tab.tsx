import { View } from "react-native";
import { useCallback, useState } from "react";
import {
  StartedShows,
  useWatchedEpisodesStore,
} from "@/store/watched-episodes-store";
import { ThemedText } from "@/components/themed-text";
import { useFocusEffect } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";

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
  totalWatchedEpisodes,
  lastWatchedEpisode,
  lastWatchedAt,
}: StartedShows) {
  const getNextEpisodeToWatch = useWatchedEpisodesStore(
    (state) => state.getNextEpisodeToWatch,
  );

  const nextEpisodeToWatch = getNextEpisodeToWatch(showId);
  return (
    <View
      className={"flex gap-3 rounded-xl bg-black-100 p-7 w-[90%] mx-auto h-60"}
    >
      <ThemedText className={"font-inter-semibold opacity-30 text-lg"}>
        {showName}
      </ThemedText>
      <View className="flex flex-row">
        <ThemedText>{nextEpisodeToWatch?.episodeNumber}</ThemedText>
        <ThemedText>{nextEpisodeToWatch?.episodeName}</ThemedText>
        {/*<ThemedText className={"text-2xl font-inter-semibold"}>*/}
        {/*  {lastWatchedEpisode?.seasonNumber}x*/}
        {/*  {lastWatchedEpisode?.episodeNumber || "Not found"}*/}
        {/*</ThemedText>*/}
      </View>
    </View>
  );
}
