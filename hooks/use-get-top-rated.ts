import { useFocusNotifyOnChangeProps } from "@/hooks/use-focus-notify-on-change-props";
import { useInfiniteQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/api-client";
import { TopRated } from "@/types/top-rated";

export function useGetTopRated() {
  const notifyOnChangeProps = useFocusNotifyOnChangeProps();

  return useInfiniteQuery<TopRated>({
    queryKey: ["use-get-top-rated"],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      try {
        const response = await axiosInstance.get<TopRated>(`/movie/top_rated`, {
          params: {
            page: pageParam,
          },
        });
        return response.data;
      } catch (error) {
        console.error("Error fetching top rated:", error);
        throw error;
      }
    },
    getNextPageParam: (lastPage: TopRated) => {
      if (lastPage.page < lastPage.total_pages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    notifyOnChangeProps,
  });
}
