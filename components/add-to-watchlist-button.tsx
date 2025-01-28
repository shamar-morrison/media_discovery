import { Button } from "@/components/button";
import { useSheetRef } from "@/components/nativewindui/Sheet";
import { ThemedText } from "@/components/themed-text";
import { useWatchlistStore } from "@/store/watchlist-store";
import { AddToWatchlistProps } from "@/types/add-to-watchlist";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { ActivityIndicator } from "react-native";
import { ListSelectionSheet } from "./list-selection-sheet";

export function AddToWatchlistButton({
  poster_path,
  title,
  vote_average,
  id,
  release_date,
  mediaType,
}: AddToWatchlistProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [_, setForceUpdate] = useState(0);
  const sheetRef = useSheetRef();

  // Only select the specific functions we need from the store
  const isInWatchlist = useWatchlistStore((state) => state.isInWatchlist);

  // Force a re-render when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      setForceUpdate((prev) => prev + 1);
    }, []),
  );

  const handlePress = () => {
    sheetRef.current?.present();
  };

  if (isLoading) {
    return (
      <Button disabled>
        <ActivityIndicator size={"small"} color={"#fff"} />
      </Button>
    );
  }

  return (
    <>
      <Button onPress={handlePress}>
        <Ionicons name="add" size={20} color={"#fff"} />
        <ThemedText>Save to List</ThemedText>
      </Button>
      <ListSelectionSheet
        sheetRef={sheetRef}
        mediaItem={{
          id,
          poster_path,
          title,
          vote_average,
          release_date,
          mediaType,
        }}
      />
    </>
  );
}
