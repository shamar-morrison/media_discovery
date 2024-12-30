import React, { useEffect, useState } from "react";
import { Button } from "@/components/button";
import { ThemedText } from "@/components/themed-text";
import Ionicons from "@expo/vector-icons/Ionicons";
import { showToast } from "@/utils/toast";
import { MediaType } from "@/types/multi-search";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MOVIES_STORAGE_KEY } from "@/utils/constants";
import { FontAwesome } from "@expo/vector-icons";
import { AddToWatchlistProps } from "@/types/add-to-watchlist";

export function AddToWatchlistButton({
  posterPath,
  title,
  rating,
  id,
  release_date,
  mediaType,
}: AddToWatchlistProps) {
  const [icon, setIcon] = useState<"add" | "close">("add");
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    (async () => {
      try {
        const movies = await AsyncStorage.getItem(MOVIES_STORAGE_KEY);
        const moviesArray =
          movies !== null ? JSON.parse(movies) : ([] as AddToWatchlistProps[]);

        setIsInWatchlist(
          moviesArray.find((movie: AddToWatchlistProps) => movie.id === id),
        );
      } catch (error: any) {
        showToast("Error loading movie from watchlist: " + error.message);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (isInWatchlist) {
      setIcon("close");
    } else {
      setIcon("add");
    }
  }, [isInWatchlist]);

  const removeFromWatchlist = async (moviesArray: AddToWatchlistProps[]) => {
    setIsLoading(true);
    try {
      const updatedMoviesArray = moviesArray.filter(
        (movie: AddToWatchlistProps) => movie.id !== id,
      );
      await AsyncStorage.setItem(
        MOVIES_STORAGE_KEY,
        JSON.stringify(updatedMoviesArray),
      );
      showToast("Movie removed from watchlist");
      setIsInWatchlist(false);
    } catch (error: any) {
      showToast("Error removing movie from watchlist: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToWatchlist = async () => {
    setIsLoading(true);
    try {
      // check if the movie is already in the watchlist
      const movies = await AsyncStorage.getItem(MOVIES_STORAGE_KEY);
      const moviesArray =
        movies !== null ? JSON.parse(movies) : ([] as AddToWatchlistProps[]);

      if (moviesArray.find((movie: AddToWatchlistProps) => movie.id === id)) {
        // movie is already in the watchlist, remove it
        await removeFromWatchlist(moviesArray);
        return;
      }

      // add the movie to the watchlist
      const newMoviesArray = [
        ...(moviesArray.length > 0 ? moviesArray : []),
        {
          id,
          posterPath,
          title,
          rating,
          release_date,
          mediaType,
        },
      ];

      await AsyncStorage.setItem(
        MOVIES_STORAGE_KEY,
        JSON.stringify(newMoviesArray),
      );

      showToast("Movie added to watchlist");
      setIsInWatchlist(true);
    } catch (error: any) {
      showToast("Error adding movie to watchlist: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Button disabled>
        <FontAwesome
          name={"spinner"}
          size={20}
          color={"#fff"}
          className={" animate-spin"}
        />
      </Button>
    );
  }

  return (
    <Button onPress={handleAddToWatchlist}>
      <Ionicons name={icon} size={20} color={"#fff"} />
      <ThemedText>
        {icon === "add" ? "Add to Watchlist" : "Remove from Watchlist"}
      </ThemedText>
    </Button>
  );
}
