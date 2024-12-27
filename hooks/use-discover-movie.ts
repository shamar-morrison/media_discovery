import { useInfiniteQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/api-client";
import { DiscoverMovieResponse } from "@/types/discover-movie";
import { useFocusNotifyOnChangeProps } from "./use-focus-notify-on-change-props";

export const useDiscoverMovie = () => {
  const notifyOnChangeProps = useFocusNotifyOnChangeProps();

  return useInfiniteQuery({
    queryKey: ["discover-movie"],
    queryFn: async ({ pageParam }) => {
      try {
        const res = await axiosInstance.get<DiscoverMovieResponse>(
          "/discover/movie",
          {
            params: {
              page: pageParam,
            },
          },
        );
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
