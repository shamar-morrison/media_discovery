import { useFocusNotifyOnChangeProps } from "@/hooks/use-focus-notify-on-change-props";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/api-client";
import { MovieDetailsResponse } from "@/types/movie-details";
import { MediaType } from "@/types/multi-search";
import { TvShowDetailsResponse } from "@/types/tv-show-details";

type QueryResult = {
  movie: MovieDetailsResponse;
  tv: TvShowDetailsResponse;
}[MediaType.Movie | MediaType.Tv];

export const useGetMediaDetails = (id: string, mediaType: MediaType) => {
  const notifyOnChangeProps = useFocusNotifyOnChangeProps();

  return useQuery<QueryResult>({
    notifyOnChangeProps,
    queryKey: ["media-details", id, mediaType],
    queryFn: () =>
      mediaType === MediaType.Movie
        ? getMovieDetails(id)
        : getTvShowDetails(id),
  });
};

async function getMovieDetails(id: string): Promise<MovieDetailsResponse> {
  try {
    const res = await axiosInstance.get<MovieDetailsResponse>(
      `/movie/${id}?append_to_response=videos,images,credits,similar`,
    );
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function getTvShowDetails(id: string): Promise<TvShowDetailsResponse> {
  try {
    const res = await axiosInstance.get<TvShowDetailsResponse>(
      `/tv/${id}?append_to_response=videos,images,credits,similar`,
    );
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
