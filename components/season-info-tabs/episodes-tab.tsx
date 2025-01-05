import { View } from "react-native";
import { Episode } from "@/types/season-details";
import { ThemedText } from "@/components/themed-text";
import { FlashList } from "@shopify/flash-list";
import { useAppropriateImage } from "@/utils/use-appropriate-image";
import { ThemedImage } from "@/components/themed-image";
import { format } from "date-fns";
import Ionicons from "@expo/vector-icons/Ionicons";

export function EpisodesTab({ episodes }: { episodes: Episode[] }) {
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
}: Episode) {
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
        <ThemedText className={"text-sm opacity-50"}>{runtime} mins</ThemedText>
      </View>
      <View className={"ml-4"}>
        <Ionicons name={"checkmark-outline"} size={20} color={"#fff"} />
      </View>
    </View>
  );
}
