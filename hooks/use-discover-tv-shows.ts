import { useInfiniteQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/api-client";
import { useFocusNotifyOnChangeProps } from "@/hooks/use-focus-notify-on-change-props";
import { DiscoverTvShowResponse } from "@/types/discover-tv-show";

interface DiscoverTvShowsParams {
  genreId?: number;
  year?: number;
  rating?: number;
}

export function useDiscoverTvShows({
  genreId,
  year,
  rating,
}: DiscoverTvShowsParams = {}) {
  const notifyOnChangeProps = useFocusNotifyOnChangeProps();

  const queryParams = new URLSearchParams();

  if (genreId !== undefined) {
    queryParams.append("with_genres", genreId.toString());
  }

  if (year !== undefined) {
    // For TV shows, we use 'first_air_date_year' instead of 'primary_release_year'
    queryParams.append("first_air_date_year", year.toString());
  }

  if (rating !== undefined) {
    queryParams.append("vote_average.gte", rating.toString());
  }

  const url = `/discover/tv${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

  return useInfiniteQuery({
    queryKey: ["discover-tv", genreId, year, rating],
    queryFn: async ({ pageParam }) => {
      try {
        const res = await axiosInstance.get<DiscoverTvShowResponse>(url, {
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
}
