import { TouchableOpacity, View } from "react-native";
import React from "react";
import { VideoType } from "@/types/movie-details";
import { ThemedText } from "@/components/themed-text";
import Ionicons from "@expo/vector-icons/Ionicons";
import { openYoutube } from "@/utils/open-youtube";

interface VideoProps {
  videoKey: string;
  type: VideoType;
  name: string;
}

export function Video({ type, name, videoKey }: VideoProps) {
  return (
    <TouchableOpacity onPress={() => openYoutube(videoKey)}>
      <View className={"w-60 mr-5"}>
        <View
          className={
            "border-[0.5px] border-accent-100/20 rounded-xl flex justify-center items-center mr-5 h-40 w-full"
          }
        >
          <Ionicons name={"play"} size={30} color={"rgba(255,255,255,0.75)"} />
        </View>
        <ThemedText className={"text-sm opacity-50 mt-2"}>{type}</ThemedText>
        <ThemedText className={"mt-1"} numberOfLines={1}>
          {name}
        </ThemedText>
      </View>
    </TouchableOpacity>
  );
}
