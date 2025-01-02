import React, { useCallback, useState } from "react";
import { Button } from "@/components/button";
import { ThemedText } from "@/components/themed-text";
import Ionicons from "@expo/vector-icons/Ionicons";
import { showToast } from "@/utils/toast";
import { FontAwesome } from "@expo/vector-icons";
import { AddToWatchlistProps } from "@/types/add-to-watchlist";
import { useWatchlistStore } from "@/store/watchlist-store";
import { useFocusEffect } from "@react-navigation/native";

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

  // Only select the specific functions we need from the store
  const isInWatchlist = useWatchlistStore((state) => state.isInMovieWatchlist);
  const addToWatchlist = useWatchlistStore(
    (state) => state.addToMovieWatchlist,
  );
  const removeFromWatchlist = useWatchlistStore(
    (state) => state.removeFromMovieWatchlist,
  );

  // Force a re-render when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      setForceUpdate((prev) => prev + 1);
    }, []),
  );

  const handleAddToWatchlist = async () => {
    setIsLoading(true);
    try {
      const isCurrentlyInWatchlist = isInWatchlist(id);

      if (isCurrentlyInWatchlist) {
        await removeFromWatchlist(id);
      } else {
        const movieData: AddToWatchlistProps = {
          id,
          poster_path,
          title,
          vote_average,
          release_date,
          mediaType,
        };
        await addToWatchlist(movieData);
      }
    } catch (error: any) {
      showToast("Error updating movieWatchlist: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const inWatchlist = isInWatchlist(id);
  const icon = inWatchlist ? "close" : "add";

  if (isLoading) {
    return (
      <Button disabled>
        <FontAwesome
          name={"spinner"}
          size={20}
          color={"#fff"}
          className="animate-spin"
        />
      </Button>
    );
  }

  return (
    <Button onPress={handleAddToWatchlist}>
      <Ionicons name={icon} size={20} color={"#fff"} />
      <ThemedText>
        {inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
      </ThemedText>
    </Button>
  );
}
