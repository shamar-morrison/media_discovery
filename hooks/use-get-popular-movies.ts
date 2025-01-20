import { useFocusNotifyOnChangeProps } from "@/hooks/use-focus-notify-on-change-props";
import { useInfiniteQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/api-client";
import { PopularMoviesResponse } from "@/types/popular-movies";

export function useGetPopularMovies() {
  const notifyOnChangeProps = useFocusNotifyOnChangeProps();

  return useInfiniteQuery<PopularMoviesResponse>({
    queryKey: ["useGetPopularMovies"],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      try {
        const response = await axiosInstance.get<PopularMoviesResponse>(
          `/movie/popular`,
          {
            params: {
              page: pageParam,
            },
          },
        );
        return response.data;
      } catch (error) {
        console.error("Error fetching popular movies:", error);
        throw error;
      }
    },
    getNextPageParam: (lastPage: PopularMoviesResponse) => {
      if (lastPage.page < lastPage.total_pages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    notifyOnChangeProps,
  });
}
