import { useInfiniteQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/api-client";
import { DiscoverMovieResponse } from "@/types/discover-movie";
import { useFocusNotifyOnChangeProps } from "./use-focus-notify-on-change-props";

interface DiscoverMovieParams {
  genreId?: number;
  year?: number;
  rating?: number;
}

export const useDiscoverMovie = ({
  genreId,
  year,
  rating,
}: DiscoverMovieParams = {}) => {
  const notifyOnChangeProps = useFocusNotifyOnChangeProps();

  const queryParams = new URLSearchParams();

  if (genreId !== undefined) {
    queryParams.append("with_genres", genreId.toString());
  }

  if (year !== undefined) {
    queryParams.append("primary_release_year", year.toString());
  }

  if (rating !== undefined) {
    queryParams.append("vote_average.gte", rating.toString());
  }

  const url = `/discover/movie${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

  return useInfiniteQuery({
    queryKey: ["discover-movie", genreId, year, rating],
    queryFn: async ({ pageParam }) => {
      try {
        const res = await axiosInstance.get<DiscoverMovieResponse>(url, {
          params: {
            page: pageParam,
          },
        });
        return res.data;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      // TMDB uses page-based pagination
      // If we're at the last page, return undefined to indicate no more pages
      if (lastPage.page >= lastPage.total_pages) {
        return undefined;
      }
      // Otherwise return the next page number
      return lastPage.page + 1;
    },
    notifyOnChangeProps,
  });
};
