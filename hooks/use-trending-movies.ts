import { useInfiniteQuery } from "@tanstack/react-query";
import { TrendingMoviesResponse } from "@/types/trending-movies";
import { axiosInstance } from "@/lib/api-client";
import { useFocusNotifyOnChangeProps } from "./use-focus-notify-on-change-props";

export const useTrendingMovies = () => {
  const notifyOnChangeProps = useFocusNotifyOnChangeProps();

  return useInfiniteQuery({
    queryKey: ["trending-movies"],
    queryFn: async ({ pageParam }) => {
      try {
        const res = await axiosInstance.get<TrendingMoviesResponse>(
          "/trending/movie/week",
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
      if (lastPage.page >= lastPage.total_pages) {
        return undefined;
      }
      return lastPage.page + 1;
    },
    notifyOnChangeProps,
  });
};
