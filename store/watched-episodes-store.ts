import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { showToast } from "@/utils/toast";
import { WATCHED_EPISODES_STORAGE_KEY } from "@/utils/constants";

type Episode = {
  id: number;
  seasonNumber: number;
  episodeNumber: number;
  watchedAt: string; // ISO date string
};

type Season = {
  seasonNumber: number;
  totalEpisodes: number;
};

interface ShowProgress {
  showId: number;
  watchedEpisodes: Episode[];
  seasons: Season[];
  lastWatchedEpisode?: {
    seasonNumber: number;
    episodeNumber: number;
  };
}

type WatchedEpisodesStore = {
  shows: Record<number, ShowProgress>;
  isLoading: boolean;
  initialize: () => Promise<void>;
  isEpisodeWatched: (
    showId: number,
    seasonNumber: number,
    episodeNumber: number,
  ) => Promise<boolean>;
  markEpisodeAsWatched: (
    showId: number,
    seasonNumber: number,
    episodeNumber: number,
    episodeId: number,
  ) => Promise<void>;
  markSeasonAsWatched: (
    showId: number,
    seasonNumber: number,
    episodeIds: number[],
  ) => Promise<void>;
  unmarkEpisodeAsWatched: (showId: number, episodeId: number) => Promise<void>;
  getWatchedEpisodes: (showId: number) => Episode[];
  getRemainingEpisodes: (showId: number, seasonNumber: number) => number;
  getTotalWatchedEpisodes: (showId: number) => number;
  getNextEpisodeToWatch: (showId: number) => {
    seasonNumber: number;
    episodeNumber: number;
  } | null;
  initializeShow: (showId: number, seasons: Season[]) => Promise<void>;
};

export const useWatchedEpisodesStore = create<WatchedEpisodesStore>(
  (set, get) => ({
    shows: {},
    isLoading: true,

    initialize: async () => {
      try {
        const stored = await AsyncStorage.getItem(WATCHED_EPISODES_STORAGE_KEY);
        set({
          shows: stored ? JSON.parse(stored) : {},
          isLoading: false,
        });
      } catch (error) {
        console.error("Error loading watched episodes:", error);
        showToast("Error loading watched episodes");
        set({ isLoading: false });
      }
    },

    initializeShow: async (showId: number, seasons: Season[]) => {
      const shows = get().shows;
      if (!shows[showId]) {
        const updatedShows = {
          ...shows,
          [showId]: {
            showId,
            watchedEpisodes: [],
            seasons,
          },
        };

        await AsyncStorage.setItem(
          WATCHED_EPISODES_STORAGE_KEY,
          JSON.stringify(updatedShows),
        );
        set({ shows: updatedShows });
        showToast("Show has been initialized");
      }
    },

    isEpisodeWatched: async (
      showId: number,
      seasonNumber: number,
      episodeNumber: number,
    ) => {
      try {
        const shows = get().shows;
        const show = shows[showId];
        if (!show) return false;
        const episode = show.watchedEpisodes.find(
          (e) =>
            e.seasonNumber === seasonNumber &&
            e.episodeNumber === episodeNumber,
        );
        return !!episode;
      } catch (error) {
        console.error("Error checking if episode is watched:", error);
        showToast("Error checking if episode is watched");
        return false;
      }
    },

    markEpisodeAsWatched: async (
      showId: number,
      seasonNumber: number,
      episodeNumber: number,
      episodeId: number,
    ) => {
      try {
        const shows = get().shows;
        const show = shows[showId];

        if (!show) {
          throw new Error("Show not initialized");
        }

        const newEpisode: Episode = {
          id: episodeId,
          seasonNumber,
          episodeNumber,
          watchedAt: new Date().toISOString(),
        };

        const updatedShow = {
          ...show,
          watchedEpisodes: [...show.watchedEpisodes, newEpisode],
          lastWatchedEpisode: {
            seasonNumber,
            episodeNumber,
          },
        };

        const updatedShows = {
          ...shows,
          [showId]: updatedShow,
        };

        await AsyncStorage.setItem(
          WATCHED_EPISODES_STORAGE_KEY,
          JSON.stringify(updatedShows),
        );

        set({ shows: updatedShows });
        showToast("Episode marked as watched");
      } catch (error) {
        console.error("Error marking episode as watched:", error);
        showToast("Error marking episode as watched");
      }
    },

    markSeasonAsWatched: async (
      showId: number,
      seasonNumber: number,
      episodeIds: number[],
    ) => {
      try {
        const shows = get().shows;
        const show = shows[showId];

        if (!show) {
          throw new Error("Show not initialized");
        }

        const season = show.seasons.find(
          (s) => s.seasonNumber === seasonNumber,
        );
        if (!season) {
          throw new Error("Season not found");
        }

        const newEpisodes: Episode[] = episodeIds.map((id, index) => ({
          id,
          seasonNumber,
          episodeNumber: index + 1,
          watchedAt: new Date().toISOString(),
        }));

        const updatedShow = {
          ...show,
          watchedEpisodes: [
            ...show.watchedEpisodes.filter(
              (e) => e.seasonNumber !== seasonNumber,
            ),
            ...newEpisodes,
          ],
          lastWatchedEpisode: {
            seasonNumber,
            episodeNumber: season.totalEpisodes,
          },
        };

        const updatedShows = {
          ...shows,
          [showId]: updatedShow,
        };

        await AsyncStorage.setItem(
          WATCHED_EPISODES_STORAGE_KEY,
          JSON.stringify(updatedShows),
        );

        set({ shows: updatedShows });
        showToast("Season marked as watched");
      } catch (error) {
        console.error("Error marking season as watched:", error);
        showToast("Error marking season as watched");
      }
    },

    unmarkEpisodeAsWatched: async (showId: number, episodeId: number) => {
      try {
        const shows = get().shows;
        const show = shows[showId];

        if (!show) {
          throw new Error("Show not initialized");
        }

        const updatedEpisodes = show.watchedEpisodes.filter(
          (episode) => episode.id !== episodeId,
        );

        // Update last watched episode to be the most recent one
        const lastWatched = [...updatedEpisodes].sort(
          (a, b) =>
            new Date(b.watchedAt).getTime() - new Date(a.watchedAt).getTime(),
        )[0];

        const updatedShow = {
          ...show,
          watchedEpisodes: updatedEpisodes,
          lastWatchedEpisode: lastWatched
            ? {
                seasonNumber: lastWatched.seasonNumber,
                episodeNumber: lastWatched.episodeNumber,
              }
            : undefined,
        };

        const updatedShows = {
          ...shows,
          [showId]: updatedShow,
        };

        await AsyncStorage.setItem(
          WATCHED_EPISODES_STORAGE_KEY,
          JSON.stringify(updatedShows),
        );

        set({ shows: updatedShows });
        showToast("Episode unmarked as watched");
      } catch (error) {
        console.error("Error unmarking episode as watched:", error);
        showToast("Error unmarking episode as watched");
      }
    },

    getWatchedEpisodes: (showId: number) => {
      const show = get().shows[showId];
      return show?.watchedEpisodes ?? [];
    },

    getRemainingEpisodes: (showId: number, seasonNumber: number) => {
      const show = get().shows[showId];
      if (!show) return 0;

      const season = show.seasons.find((s) => s.seasonNumber === seasonNumber);
      if (!season) return 0;

      const watchedInSeason = show.watchedEpisodes.filter(
        (e) => e.seasonNumber === seasonNumber,
      ).length;

      return season.totalEpisodes - watchedInSeason;
    },

    getTotalWatchedEpisodes: (showId: number) => {
      const show = get().shows[showId];
      return show?.watchedEpisodes.length ?? 0;
    },

    getNextEpisodeToWatch: (showId: number) => {
      const show = get().shows[showId];
      if (!show || !show.lastWatchedEpisode) return null;

      const { seasonNumber, episodeNumber } = show.lastWatchedEpisode;
      const currentSeason = show.seasons.find(
        (s) => s.seasonNumber === seasonNumber,
      );

      if (!currentSeason) return null;

      // If there are more episodes in the current season
      if (episodeNumber < currentSeason.totalEpisodes) {
        return {
          seasonNumber,
          episodeNumber: episodeNumber + 1,
        };
      }

      // Look for next season
      const nextSeason = show.seasons.find(
        (s) => s.seasonNumber === seasonNumber + 1,
      );
      if (nextSeason) {
        return {
          seasonNumber: nextSeason.seasonNumber,
          episodeNumber: 1,
        };
      }

      // No more episodes to watch
      return null;
    },
  }),
);
