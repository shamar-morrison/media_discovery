import { useFocusNotifyOnChangeProps } from "@/hooks/use-focus-notify-on-change-props";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/api-client";
import { TopRated } from "@/types/top-rated";

export function useGetTopRated() {
  const notifyOnChangeProps = useFocusNotifyOnChangeProps();

  return useQuery({
    queryKey: ["use-get-top-rated"],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get<TopRated>(`/movie/top_rated`);
        return response.data;
      } catch (error) {
        console.error("Error fetching top rated:", error);
        return null;
      }
    },
    notifyOnChangeProps,
  });
}
