import { useFocusNotifyOnChangeProps } from "@/hooks/use-focus-notify-on-change-props";
import { axiosInstance } from "@/lib/api-client";
import { MultiSearchResponse } from "@/types/multi-search";
import { useQuery } from "@tanstack/react-query";

export const useMultiSearch = (query: string) => {
  const notifyOnChangeProps = useFocusNotifyOnChangeProps();

  return useQuery({
    queryKey: ["multi-search", query],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get<MultiSearchResponse>(
          `/search/multi?query=${query}`,
        );
        return res.data;
      } catch (error) {
        console.log(error);
      }
    },
    notifyOnChangeProps,
  });
};
