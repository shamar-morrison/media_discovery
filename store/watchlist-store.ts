import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AddToWatchlistProps } from "@/types/add-to-watchlist";
import { MOVIES_STORAGE_KEY, TV_SHOW_STORAGE_KEY } from "@/utils/constants";
import { showToast } from "@/utils/toast";
import { MediaType } from "@/types/multi-search";

interface Media extends AddToWatchlistProps {}

type WatchlistStore = {
  movies: Media[];
  tvShows: Media[];
  isLoading: boolean;
  initialize: () => Promise<void>;
  addToWatchlist: (media: Media, mediaType: MediaType) => Promise<void>;
  removeFromWatchlist: (mediaId: number, mediaType: MediaType) => Promise<void>;
  isInWatchlist: (mediaId: number, mediaType: MediaType) => boolean;
};

export const useWatchlistStore = create<WatchlistStore>((set, get) => ({
  movies: [],
  tvShows: [],
  isLoading: true,

  initialize: async () => {
    try {
      const [storedMovies, storedTvShows] = await Promise.all([
        AsyncStorage.getItem(MOVIES_STORAGE_KEY),
        AsyncStorage.getItem(TV_SHOW_STORAGE_KEY),
      ]);

      set({
        movies: storedMovies ? JSON.parse(storedMovies) : [],
        tvShows: storedTvShows ? JSON.parse(storedTvShows) : [],
        isLoading: false,
      });
    } catch (error) {
      console.error("Error loading watchlist:", error);
      showToast("Error loading watchlist");
      set({ isLoading: false });
    }
  },

  addToWatchlist: async (media: Media, mediaType: MediaType) => {
    try {
      const listKey = mediaType === "movie" ? "movies" : "tvShows";
      const newList = [...get()[listKey], media];

      await AsyncStorage.setItem(
        mediaType === MediaType.Movie
          ? MOVIES_STORAGE_KEY
          : TV_SHOW_STORAGE_KEY,
        JSON.stringify(newList),
      );

      set({ [listKey]: newList });
      showToast(
        `${mediaType === "movie" ? "Movie" : "TV Show"} added to watchlist`,
      );
    } catch (error) {
      showToast("Error adding to watchlist");
      console.error("Error adding to watchlist:", error);
    }
  },

  removeFromWatchlist: async (mediaId: number, mediaType: MediaType) => {
    try {
      const listKey = mediaType === "movie" ? "movies" : "tvShows";
      const newList = get()[listKey].filter((media) => media.id !== mediaId);

      await AsyncStorage.setItem(
        mediaType === MediaType.Movie
          ? MOVIES_STORAGE_KEY
          : TV_SHOW_STORAGE_KEY,
        JSON.stringify(newList),
      );

      set({ [listKey]: newList });
      showToast(
        `${mediaType === "movie" ? "Movie" : "TV Show"} removed from watchlist`,
      );
    } catch (error) {
      showToast("Error removing from watchlist");
      console.error("Error removing from watchlist:", error);
    }
  },

  isInWatchlist: (mediaId: number, mediaType: MediaType) => {
    const list = mediaType === "movie" ? get().movies : get().tvShows;
    return list.some((media) => media.id === mediaId);
  },
}));
