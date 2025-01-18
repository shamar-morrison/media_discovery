import { useFocusNotifyOnChangeProps } from "@/hooks/use-focus-notify-on-change-props";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/api-client";
import { NowPlayingRes } from "@/types/now-playing";

export function useGetNowPlaying() {
  const notifyOnChangeProps = useFocusNotifyOnChangeProps();

  return useQuery({
    queryKey: ["useGetNowPlaying"],
    queryFn: async () => {
      try {
        const response =
          await axiosInstance.get<NowPlayingRes>(`/movie/now_playing`);
        return response.data;
      } catch (error) {
        console.error("Error fetching season info:", error);
        return null;
      }
    },
    notifyOnChangeProps,
  });
}
