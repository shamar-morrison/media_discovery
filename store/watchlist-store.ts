import { AddToWatchlistProps } from "@/types/add-to-watchlist";
import { MediaType } from "@/types/multi-search";
import { WATCHED_EPISODES_STORAGE_KEY } from "@/utils/constants";
import { showToast } from "@/utils/toast";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface Media extends AddToWatchlistProps {}

type WatchlistStore = {
  movies: Media[];
  tvShows: Media[];
  isLoading: boolean;
  initialize: () => Promise<void>;
  addToWatchlist: (media: Media, mediaType: MediaType) => void;
  removeFromWatchlist: (
    mediaId: number,
    mediaType: MediaType,
    deleteProgress?: boolean,
  ) => Promise<void>;
  isInWatchlist: (mediaId: number, mediaType: MediaType) => boolean;
  importFromCSV: (csvContent: string) => void;
};

export const useWatchlistStore = create<WatchlistStore>()(
  persist(
    (set, get) => ({
      movies: [],
      tvShows: [],
      isLoading: true,

      initialize: async () => {
        set({ isLoading: false });
      },

      addToWatchlist: (media: Media, mediaType: MediaType) => {
        try {
          const listKey = mediaType === "movie" ? "movies" : "tvShows";
          const currentList = get()[listKey];

          set({ [listKey]: [...currentList, media] });
          showToast(
            `${mediaType === "movie" ? "Movie" : "TV Show"} added to watchlist`,
          );
        } catch (error) {
          showToast("Error adding to watchlist");
          console.error("Error adding to watchlist:", error);
        }
      },

      removeFromWatchlist: async (
        mediaId: number,
        mediaType: MediaType,
        deleteProgress = false,
      ) => {
        try {
          const listKey = mediaType === "movie" ? "movies" : "tvShows";
          const currentList = get()[listKey];

          set({
            [listKey]: currentList.filter((media) => media.id !== mediaId),
          });

          // If it's a TV show and deleteProgress is true, remove the progress data
          if (mediaType === MediaType.Tv && deleteProgress) {
            try {
              const watchedEpisodesData = await AsyncStorage.getItem(
                WATCHED_EPISODES_STORAGE_KEY,
              );
              if (watchedEpisodesData) {
                const parsedData = JSON.parse(watchedEpisodesData);
                if (parsedData[mediaId]) {
                  delete parsedData[mediaId];
                  await AsyncStorage.setItem(
                    WATCHED_EPISODES_STORAGE_KEY,
                    JSON.stringify(parsedData),
                  );
                }
              }
            } catch (error) {
              console.error("Error deleting progress:", error);
              showToast("Error deleting progress");
            }
          }

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

      importFromCSV: (csvContent: string) => {
        try {
          const sections = csvContent.split("\n\n").filter(Boolean);
          const lists: Record<string, Media[]> = {
            movies: [],
            tvShows: [],
          };

          for (const section of sections) {
            const [listName, header, ...rows] = section
              .split("\n")
              .filter(Boolean);
            if (!lists[listName]) continue;

            const items = rows.map((row) => {
              const [id, title, poster_path, release_date, vote_average] = row
                .split(",")
                .map((val) =>
                  val.startsWith('"') && val.endsWith('"')
                    ? val.slice(1, -1)
                    : val,
                );

              return {
                id: parseInt(id),
                title,
                poster_path,
                release_date: release_date ? new Date(release_date) : undefined,
                vote_average: parseFloat(vote_average),
                mediaType:
                  listName === "movies" ? MediaType.Movie : MediaType.Tv,
              };
            });

            lists[listName] = items;
          }

          set({
            movies: lists.movies,
            tvShows: lists.tvShows,
          });

          showToast("Watchlists imported successfully");
        } catch (error) {
          console.error("Error importing watchlists:", error);
          showToast("Error importing watchlists");
        }
      },
    }),
    {
      name: "watchlist-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
