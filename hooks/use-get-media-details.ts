import { useFocusNotifyOnChangeProps } from "@/hooks/use-focus-notify-on-change-props";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/api-client";
import { MovieDetailsResponse } from "@/types/movie-details";
import { MediaType } from "@/types/multi-search";
import { TvShowDetailsResponse } from "@/types/tv-show-details";

type QueryResult<T extends MediaType> = T extends MediaType.Movie
  ? MovieDetailsResponse
  : TvShowDetailsResponse;

export const useGetMediaDetails = <T extends MediaType>(
  id: string,
  mediaType: T,
) => {
  const notifyOnChangeProps = useFocusNotifyOnChangeProps();

  return useQuery<QueryResult<T>>({
    notifyOnChangeProps,
    queryKey: ["media-details", id, mediaType],
    queryFn: () =>
      mediaType === MediaType.Movie
        ? (getMovieDetails(id) as Promise<QueryResult<T>>)
        : (getTvShowDetails(id) as Promise<QueryResult<T>>),
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
