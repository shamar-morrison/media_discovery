import { useInfiniteQuery } from "@tanstack/react-query";
import { TrendingTVResponse } from "@/types/trending-tv";
import { axiosInstance } from "@/lib/api-client";
import { useFocusNotifyOnChangeProps } from "./use-focus-notify-on-change-props";

export const useTrendingTV = () => {
  const notifyOnChangeProps = useFocusNotifyOnChangeProps();

  return useInfiniteQuery({
    queryKey: ["trending-tv"],
    queryFn: async ({ pageParam }) => {
      try {
        const res = await axiosInstance.get<TrendingTVResponse>(
          "/trending/tv/week",
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
