import { useWatchedEpisodesStore } from "@/store/watched-episodes-store";
import { showToast } from "@/utils/toast";

export const markEpisodeAsWatched = async (
  showId: number,
  seasonNumber: number,
  episodeNumber: number,
  episodeId: number,
) => {
  const store = useWatchedEpisodesStore.getState();

  // Check if show exists in store
  if (!store.shows[showId]) {
    showToast("Show was not found, initialise it first");
    return;
  }

  await store.markEpisodeAsWatched(
    showId,
    seasonNumber,
    episodeNumber,
    episodeId,
  );
};
