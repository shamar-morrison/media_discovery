import React from "react";
import { ThemedText } from "@/components/themed-text";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Button } from "@/components/button";
import { openYoutube } from "@/utils/open-youtube";
import { showToast } from "@/utils/toast";

export function PlayTrailerButton({
  videoId,
}: {
  videoId: string | undefined;
}) {
  const handlePlayTrailer = async (videoId: string | undefined) => {
    if (!videoId) {
      showToast("No trailer found");
      return;
    }
    try {
      await openYoutube(videoId);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Button variant={"outline"} onPress={() => handlePlayTrailer(videoId)}>
      <Ionicons name={"play"} size={20} color={"#fff"} />
      <ThemedText>Play Trailer</ThemedText>
    </Button>
  );
}
