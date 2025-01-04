import { useQuery } from "@tanstack/react-query";
import { useFocusNotifyOnChangeProps } from "@/hooks/use-focus-notify-on-change-props";
import { axiosInstance } from "@/lib/api-client";
import { SeasonDetails } from "@/types/season-details";

export function useGetSeasonInfo(seriesId: number, seasonNumber: number) {
  const notifyOnChangeProps = useFocusNotifyOnChangeProps();

  return useQuery({
    queryKey: ["getSeasonInfo", seriesId, seasonNumber],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get<SeasonDetails>(
          `/tv/${seriesId}/season/${seasonNumber}`,
        );
        return response.data;
      } catch (error) {
        console.error("Error fetching season info:", error);
        return null;
      }
    },
    notifyOnChangeProps,
  });
}
