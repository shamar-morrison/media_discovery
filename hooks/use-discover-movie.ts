import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/api-client";
import { DiscoverMovieResponse } from "@/types/discover-movie";
import { useFocusNotifyOnChangeProps } from "./use-focus-notify-on-change-props";

export const useDiscoverMovie = () => {
  const notifyOnChangeProps = useFocusNotifyOnChangeProps();

  return useQuery({
    queryKey: ["discover-movie"],
    queryFn: async () => {
      try {
        const res =
          await axiosInstance.get<DiscoverMovieResponse>("/discover/movie");
        return res.data;
      } catch (error) {
        console.log(error);
      }
    },
    notifyOnChangeProps,
  });
};
