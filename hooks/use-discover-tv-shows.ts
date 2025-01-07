import { useInfiniteQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/api-client";
import { useFocusNotifyOnChangeProps } from "@/hooks/use-focus-notify-on-change-props";
import { DiscoverTvShowResponse } from "@/types/discover-tv-show";

export function useDiscoverTvShows() {
  const notifyOnChangeProps = useFocusNotifyOnChangeProps();

  return useInfiniteQuery({
    queryKey: ["discover-tv"],
    queryFn: async ({ pageParam }) => {
      try {
        const res = await axiosInstance.get<DiscoverTvShowResponse>(
          "/discover/tv",
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
}
