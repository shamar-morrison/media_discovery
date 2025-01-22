import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/button";
import { ThemedText } from "@/components/themed-text";
import Ionicons from "@expo/vector-icons/Ionicons";
import { showToast } from "@/utils/toast";
import { AddToWatchlistProps } from "@/types/add-to-watchlist";
import { useWatchlistStore } from "@/store/watchlist-store";
import { useFocusEffect } from "@react-navigation/native";
import { ActivityIndicator } from "react-native";
import { MediaType } from "@/types/multi-search";
import {
  RemoveTvShowSheet,
  useRemoveTvShowSheet,
} from "@/components/remove-tv-show-sheet";
import { useSettingsStore } from "@/store/settings-store";
import { useWatchedEpisodesStore } from "@/store/watched-episodes-store";

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
  const { sheetRef, openSheet } = useRemoveTvShowSheet();

  // Only select the specific functions we need from the store
  const isInWatchlist = useWatchlistStore((state) => state.isInWatchlist);
  const addToWatchlist = useWatchlistStore((state) => state.addToWatchlist);
  const tvShowRemovalPreference = useSettingsStore(
    (state) => state.tvShowRemovalPreference,
  );

  useEffect(() => {
    useSettingsStore.getState().initialize();
  }, []);

  // Force a re-render when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      setForceUpdate((prev) => prev + 1);
    }, []),
  );

  const handleAddToWatchlist = async () => {
    try {
      const isCurrentlyInWatchlist = isInWatchlist(id, mediaType);

      if (isCurrentlyInWatchlist) {
        if (mediaType === MediaType.Tv) {
          // Check if we have a saved preference
          if (tvShowRemovalPreference) {
            setIsLoading(true);
            await useWatchlistStore
              .getState()
              .removeFromWatchlist(
                id,
                mediaType,
                tvShowRemovalPreference === "with_progress",
              );
            if (tvShowRemovalPreference === "with_progress") {
              await useWatchedEpisodesStore.getState().initialize();
            }
          } else {
            openSheet();
            return;
          }
        } else {
          setIsLoading(true);
          await useWatchlistStore.getState().removeFromWatchlist(id, mediaType);
        }
      } else {
        setIsLoading(true);
        const movieData: AddToWatchlistProps = {
          id,
          poster_path,
          title,
          vote_average,
          release_date,
          mediaType,
        };
        await addToWatchlist(movieData, mediaType);
      }
    } catch (error: any) {
      showToast("Error updating movieWatchlist: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveComplete = useCallback(() => {
    setForceUpdate((prev) => prev + 1);
  }, []);

  const inWatchlist = isInWatchlist(id, mediaType);
  const icon = inWatchlist ? "close" : "add";

  if (isLoading) {
    return (
      <Button disabled>
        <ActivityIndicator size={"small"} color={"#fff"} />
      </Button>
    );
  }

  return (
    <>
      <Button onPress={handleAddToWatchlist}>
        <Ionicons name={icon} size={20} color={"#fff"} />
        <ThemedText>
          {inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
        </ThemedText>
      </Button>
      {mediaType === MediaType.Tv && inWatchlist && (
        <RemoveTvShowSheet
          sheetRef={sheetRef}
          showId={id}
          showName={title}
          onRemoveComplete={handleRemoveComplete}
        />
      )}
    </>
  );
}
