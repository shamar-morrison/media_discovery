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

type LastWatchedEpisode = {
  seasonNumber: number;
  episodeNumber: number;
};

type Season = {
  seasonNumber: number;
  totalEpisodes: number;
};

interface ShowProgress {
  showId: number;
  showName: string;
  watchedEpisodes: Episode[];
  seasons: Season[];
  lastWatchedEpisode?: LastWatchedEpisode;
}

export interface StartedShows {
  showId: number;
  showName: string;
  lastWatchedEpisode?: LastWatchedEpisode;
  totalWatchedEpisodes: number;
  lastWatchedAt: string;
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
  getStartedShows: () => Required<StartedShows>[];
  getRemainingEpisodes: (showId: number, seasonNumber: number) => number;
  getTotalWatchedEpisodes: (showId: number) => number;
  getNextEpisodeToWatch: (showId: number) => {
    seasonNumber: number;
    episodeNumber: number;
  } | null;
  initializeShow: (
    showId: number,
    showName: string,
    seasons: Season[],
  ) => Promise<void>;
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

    initializeShow: async (
      showId: number,
      showName: string,
      seasons: Season[],
    ) => {
      const shows = get().shows;
      if (!shows[showId]) {
        const formattedSeasons = seasons.map((season) => ({
          seasonNumber: season.seasonNumber,
          totalEpisodes: season.totalEpisodes,
        }));

        const updatedShows = {
          ...shows,
          [showId]: {
            showId,
            showName,
            watchedEpisodes: [],
            seasons: formattedSeasons,
          },
        };

        await AsyncStorage.setItem(
          WATCHED_EPISODES_STORAGE_KEY,
          JSON.stringify(updatedShows),
        );
        set({ shows: updatedShows });
      }
    },

    getStartedShows: () => {
      const shows = get().shows;
      return Object.entries(shows)
        .filter(([_, show]) => show.watchedEpisodes.length > 0)
        .map(([showId, show]) => {
          // Since we filtered for shows with watched episodes,
          // we can safely get the most recent one
          const mostRecentEpisode = [...show.watchedEpisodes].sort(
            (a, b) =>
              new Date(b.watchedAt).getTime() - new Date(a.watchedAt).getTime(),
          )[0];

          return {
            showId: Number(showId),
            showName: show.showName,
            lastWatchedEpisode: {
              seasonNumber: mostRecentEpisode.seasonNumber,
              episodeNumber: mostRecentEpisode.episodeNumber,
            },
            totalWatchedEpisodes: show.watchedEpisodes.length,
            lastWatchedAt: mostRecentEpisode.watchedAt,
          };
        });
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

        // If this was the last watched episode, we should remove the show's progress entirely
        if (updatedEpisodes.length === 0) {
          const { [showId]: removedShow, ...remainingShows } = shows;

          await AsyncStorage.setItem(
            WATCHED_EPISODES_STORAGE_KEY,
            JSON.stringify(remainingShows),
          );

          set({ shows: remainingShows });
          showToast("Episode unmarked as watched");
          return;
        }

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

      const watchedEpisodes = show.watchedEpisodes;

      const isEpisodeWatched = (
        seasonNumber: number,
        episodeNumber: number,
      ) => {
        return watchedEpisodes.some(
          (e) =>
            e.seasonNumber === seasonNumber &&
            e.episodeNumber === episodeNumber,
        );
      };

      let currentSeason = show.seasons.find(
        (s) => s.seasonNumber === show.lastWatchedEpisode!.seasonNumber,
      );

      if (!currentSeason) return null;

      // Check remaining episodes in current season
      for (let epNum = 1; epNum <= currentSeason.totalEpisodes; epNum++) {
        if (!isEpisodeWatched(currentSeason.seasonNumber, epNum)) {
          return {
            seasonNumber: currentSeason.seasonNumber,
            episodeNumber: epNum,
          };
        }
      }

      // If no unwatched episodes in current season, check next seasons
      const remainingSeasons = show.seasons
        .filter((s) => s.seasonNumber > currentSeason!.seasonNumber)
        .sort((a, b) => a.seasonNumber - b.seasonNumber);

      for (const season of remainingSeasons) {
        for (let epNum = 1; epNum <= season.totalEpisodes; epNum++) {
          if (!isEpisodeWatched(season.seasonNumber, epNum)) {
            return {
              seasonNumber: season.seasonNumber,
              episodeNumber: epNum,
            };
          }
        }
      }

      // No unwatched episodes found
      return null;
    },
  }),
);
