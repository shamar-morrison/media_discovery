import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AddToWatchlistProps } from "@/types/add-to-watchlist";
import { MOVIES_STORAGE_KEY } from "@/utils/constants";
import { showToast } from "@/utils/toast";

interface Media extends AddToWatchlistProps {}

type WatchlistStore = {
  watchlist: Media[];
  isLoading: boolean;
  initialize: () => Promise<void>;
  addToWatchlist: (media: Media) => Promise<void>;
  removeFromWatchlist: (mediaId: number) => Promise<void>;
  isInWatchlist: (mediaId: number) => boolean;
};

export const useWatchlistStore = create<WatchlistStore>((set, get) => ({
  watchlist: [],
  isLoading: true,

  initialize: async () => {
    try {
      const stored = await AsyncStorage.getItem(MOVIES_STORAGE_KEY);
      set({
        watchlist: stored ? JSON.parse(stored) : [],
        isLoading: false,
      });
    } catch (error) {
      console.error("Error loading watchlist:", error);
      showToast("Error loading watchlist");
      set({ isLoading: false });
    }
  },

  addToWatchlist: async (movie: Media) => {
    try {
      const newWatchlist = [...get().watchlist, movie];
      await AsyncStorage.setItem(
        MOVIES_STORAGE_KEY,
        JSON.stringify(newWatchlist),
      );
      set({ watchlist: newWatchlist });
      showToast("Movie added to watchlist");
    } catch (error) {
      showToast("Error adding to watchlist");
      console.error("Error adding to watchlist:", error);
    }
  },

  removeFromWatchlist: async (mediaId: number) => {
    try {
      const newWatchlist = get().watchlist.filter(
        (media) => media.id !== mediaId,
      );
      await AsyncStorage.setItem(
        MOVIES_STORAGE_KEY,
        JSON.stringify(newWatchlist),
      );
      set({ watchlist: newWatchlist });
      showToast("Movie removed from watchlist");
    } catch (error) {
      showToast("Error removing from watchlist");
      console.error("Error removing from watchlist:", error);
    }
  },

  isInWatchlist: (mediaId: number) => {
    return get().watchlist.some((media) => media.id === mediaId);
  },
}));
