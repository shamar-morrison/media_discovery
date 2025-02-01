import { AddToWatchlistProps } from "@/types/add-to-watchlist";
import { showToast } from "@/utils/toast";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type FavoritesStore = {
  favorites: AddToWatchlistProps[];
  addToFavorites: (media: AddToWatchlistProps) => Promise<void>;
  removeFromFavorites: (mediaId: number) => Promise<void>;
  isInFavorites: (mediaId: number) => boolean;
};

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],

      addToFavorites: async (media: AddToWatchlistProps) => {
        try {
          const currentFavorites = get().favorites;
          set({ favorites: [...currentFavorites, media] });
          showToast("Added to favorites");
        } catch (error) {
          showToast("Error adding to favorites");
          console.error("Error adding to favorites:", error);
        }
      },

      removeFromFavorites: async (mediaId: number) => {
        try {
          const currentFavorites = get().favorites;
          set({
            favorites: currentFavorites.filter((media) => media.id !== mediaId),
          });
          showToast("Removed from favorites");
        } catch (error) {
          showToast("Error removing from favorites");
          console.error("Error removing from favorites:", error);
        }
      },

      isInFavorites: (mediaId: number) => {
        const favorites = get().favorites;
        return favorites.some((media) => media.id === mediaId);
      },
    }),
    {
      name: "favorites-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
