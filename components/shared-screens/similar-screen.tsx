import React from "react";
import { useLocalSearchParams } from "expo-router";
import { MediaType } from "@/types/multi-search";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";

export function SimilarScreen() {
  const { similarId, mediaType } = useLocalSearchParams<{
    similarId: string;
    mediaType: MediaType;
  }>();

  return (
    <ThemedView>
      <ThemedText>
        id: {similarId} mediaType: {mediaType}
      </ThemedText>
    </ThemedView>
  );
}
