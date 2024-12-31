import { MediaType } from "@/types/multi-search";
import { axiosInstance } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import { useFocusNotifyOnChangeProps } from "@/hooks/use-focus-notify-on-change-props";
import { DiscoverMovieResponse } from "@/types/discover-movie";
import { DiscoverTvShowResponse } from "@/types/discover-tv-show";

type TMedia = {
  poster_path: string;
  id: number;
  title: string;
  vote_average: number;
  release_date: Date | undefined;
};

export function useGetSimilar<T extends MediaType>(id: string, mediaType: T) {
  const notifyOnChangeProps = useFocusNotifyOnChangeProps();

  return useQuery<TMedia[]>({
    notifyOnChangeProps,
    queryKey: ["similar", id, mediaType],
    queryFn: () =>
      mediaType === MediaType.Movie
        ? getSimilarMovies(id)
        : getSimilarTvShows(id),
  });
}

async function getSimilarMovies(id: string): Promise<TMedia[]> {
  try {
    const res = await axiosInstance.get<DiscoverMovieResponse>(
      `/movie/${id}/similar`,
    );
    return res.data.results.map((movie) => ({
      poster_path: movie.poster_path,
      id: movie.id,
      title: movie.title,
      vote_average: movie.vote_average,
      release_date: movie.release_date,
    }));
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function getSimilarTvShows(id: string): Promise<TMedia[]> {
  try {
    const res = await axiosInstance.get<DiscoverTvShowResponse>(
      `/tv/${id}/similar`,
    );
    return res.data.results.map((show) => ({
      poster_path: show.poster_path,
      id: show.id,
      title: show.name,
      vote_average: show.vote_average,
      release_date: show.first_air_date,
    }));
  } catch (error) {
    console.log(error);
    throw error;
  }
}
