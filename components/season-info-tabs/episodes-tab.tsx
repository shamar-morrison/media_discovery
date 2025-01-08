import { ActivityIndicator, Pressable, View } from "react-native";
import { Episode } from "@/types/season-details";
import { ThemedText } from "@/components/themed-text";
import { FlashList } from "@shopify/flash-list";
import { useAppropriateImage } from "@/utils/use-appropriate-image";
import { ThemedImage } from "@/components/themed-image";
import { format } from "date-fns";
import Ionicons from "@expo/vector-icons/Ionicons";
import { hitSlop } from "@/utils/hit-slop";
import { useWatchedEpisodesStore } from "@/store/watched-episodes-store";
import { useEffect, useState } from "react";

type EpisodesTabProps = {
  episodes: Episode[];
};

export function EpisodesTab({ episodes }: EpisodesTabProps) {
  if (episodes.length === 0) {
    return (
      <View className={"flex-1 flex items-center justify-center"}>
        <ThemedText className={"text-center text-lg font-inter-semibold"}>
          No episodes found
        </ThemedText>
      </View>
    );
  }

  return (
    <View className="h-full flex-1">
      <FlashList
        estimatedItemSize={episodes.length}
        ItemSeparatorComponent={() => (
          <View
            className={"h-px w-full border-b-[0.5px] border-accent-100/10"}
          />
        )}
        data={episodes}
        renderItem={({ item }) => {
          return (
            <View className={"p-4"}>
              <EpisodeCard {...item} />
            </View>
          );
        }}
      />
    </View>
  );
}

function EpisodeCard({
  name,
  episode_number,
  runtime,
  season_number,
  still_path,
  air_date,
  show_id,
  id,
}: Episode) {
  const [isLoading, setIsLoading] = useState(false);
  const [hasEpisodeBeenWatched, setHasEpisodeBeenWatched] = useState(false);

  const isEpisodeWatched = useWatchedEpisodesStore(
    (state) => state.isEpisodeWatched,
  );
  const markEpisodeAsWatched = useWatchedEpisodesStore(
    (state) => state.markEpisodeAsWatched,
  );
  const unmarkEpisodeAsWatched = useWatchedEpisodesStore(
    (state) => state.unmarkEpisodeAsWatched,
  );

  const handleUnmarkAsWatched = async (showId: number, episodeId: number) => {
    setIsLoading(true);
    try {
      await unmarkEpisodeAsWatched(showId, episodeId);
      setHasEpisodeBeenWatched(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsWatched = async (
    showId: number,
    seasonNumber: number,
    episodeNumber: number,
    episodeId: number,
  ) => {
    setIsLoading(true);
    try {
      await markEpisodeAsWatched(
        showId,
        seasonNumber,
        episodeNumber,
        episodeId,
      );
      setHasEpisodeBeenWatched(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    (async () => {
      try {
        if (await isEpisodeWatched(show_id, season_number, episode_number)) {
          setHasEpisodeBeenWatched(true);
        }
      } catch (e: any) {
        console.log("Error getting if episode was watched");
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <View className={"flex gap-5 w-32 h-[62px] flex-row items-center my-3"}>
      <View className={`overflow-hidden w-full `}>
        <ThemedImage
          style={{
            width: "100%",
            height: 100,
          }}
          className={"w-full h-full"}
          contentFit={"contain"}
          source={useAppropriateImage(still_path)}
        />
      </View>
      <View className={"flex basis-[100%]"}>
        <ThemedText
          className={"text-white font-inter-semibold w-full"}
          numberOfLines={1}
        >
          S{season_number} E{episode_number} - {name}
        </ThemedText>
        <ThemedText className={"text-sm opacity-50"}>
          {format(air_date, "MMM. dd, yyyy")}
        </ThemedText>
        {runtime && (
          <ThemedText className={"text-sm opacity-50"}>
            {runtime} mins
          </ThemedText>
        )}
      </View>
      {isLoading ? (
        <ActivityIndicator size={"small"} color={"#fff"} />
      ) : (
        <Pressable
          className={"ml-4"}
          hitSlop={hitSlop}
          onPress={async () => {
            if (!hasEpisodeBeenWatched) {
              await handleMarkAsWatched(
                show_id,
                season_number,
                episode_number,
                id,
              );
            } else {
              await handleUnmarkAsWatched(show_id, id);
            }
          }}
        >
          <Ionicons
            name={
              hasEpisodeBeenWatched
                ? "checkmark-circle"
                : "checkmark-circle-outline"
            }
            size={25}
            color={hasEpisodeBeenWatched ? "#fff" : "rgba(255,255,255,0.22)"}
          />
        </Pressable>
      )}
    </View>
  );
}
