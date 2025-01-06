import { View } from "react-native";
import { useCallback, useState } from "react";
import { useWatchedEpisodesStore } from "@/store/watched-episodes-store";
import { ThemedText } from "@/components/themed-text";
import { useFocusEffect } from "@react-navigation/native";

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
    <View>
      {startedShows.map((show) => {
        return (
          <View key={show.showId}>
            <ThemedText>{show.showName}</ThemedText>
          </View>
        );
      })}
    </View>
  );
}
