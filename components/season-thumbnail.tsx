import { TouchableOpacity, View } from "react-native";
import { Season } from "@/types/tv-show-details";
import { ThemedText } from "@/components/themed-text";
import { format } from "date-fns";
import { ThemedImage } from "@/components/themed-image";
import { createMediaImageLink } from "@/utils/create-media-image-link";
import { showToast } from "@/utils/toast";

export function SeasonThumbnail({
  id,
  episode_count,
  name,
  poster_path,
  air_date,
}: Season) {
  return (
    <TouchableOpacity onPress={() => showToast(id.toString())}>
      <View className={"w-32"}>
        <View
          className={
            "overflow-hidden rounded-xl flex justify-center items-center mr-5 h-[155px] w-full"
          }
        >
          <ThemedImage
            source={createMediaImageLink("w1280", poster_path)}
            style={{ width: "100%", height: "100%" }}
            contentFit={"cover"}
          />
        </View>
        <ThemedText className={"text-sm opacity-50 mt-2"}>
          {air_date ? format(air_date, "MMM. dd, yyyy") : "N/A"}
        </ThemedText>
        <ThemedText className={"mt-1"} numberOfLines={1}>
          {name}
        </ThemedText>
        <ThemedText className={"text-sm opacity-50 mt-1"} numberOfLines={1}>
          {episode_count} Episodes
        </ThemedText>
      </View>
    </TouchableOpacity>
  );
}